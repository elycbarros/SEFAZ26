/**
 * SEFAZ/SC 2026 — Plataforma de Estudos
 * Versão 4.0 — 15 Novas Features & Melhorias Avançadas
 *
 * FASE 4-A — Performance & Conteúdo:
 * 4A.1 PWA Offline com Service Worker (sw.js) e banner de instalação
 * 4A.2 Horas por disciplina no Dashboard (Top 5 com barras proporcionais)
 * 4A.3 Classificador e badges de calor/incidência FCC (Alta / Média)
 * 4A.4 Cronograma inteligente automático (cálculo semafórico de ritmo diário)
 * 4A.5 Modo Quiz & Flashcards de recuperação ativa por anotações e tópicos FCC
 *
 * FASE 4-B — UX & Gamificação:
 * 4B.1 Notificações de revisão e pomodoro via Browser Notification API
 * 4B.2 Heatmap de atividade anual (estilo GitHub contribution graph em SVG)
 * 4B.3 Streaks de dias consecutivos + Sistema de Conquistas/Badges
 * 4B.4 Presets rápidos de cenário no Simulador FCC (Otimista, Realista, Corte)
 * 4B.5 Filtros por fase nas Revisões (Todos, R1 24h, R7 7d, R30 30d com contadores)
 * 4B.6 Exportação de Relatório Semanal de Desempenho formatado em Markdown (.md)
 *
 * FASE 4-C — Features Estratégicas:
 * 4C.1 Simulado cronometrado completo (Mock Exam com 10Q, gabarito e nota FCC)
 * 4C.2 Calendário mensal interativo de estudos e revisões
 * 4C.3 Sincronização e compartilhamento via URL (Base64) e QR Code em SVG
 * 4C.4 Configurações avançadas (Temas de cores, sons sintetizados Web Audio)
 */

'use strict';

/* ============================================================
   VERSÃO DE CONFIGURAÇÃO
   Incremente CONFIG_VERSION sempre que alterar o tema padrão
   ou qualquer outra configuração de aparência. Isso garante
   que usuários com localStorage antigo recebam o novo padrão.
============================================================ */
const CONFIG_VERSION = 2; // v2: tema alterado para claro (emerald)

/* ============================================================
   ESTADO GLOBAL
============================================================ */
const AppState = {
  activeProfileKey: 'A01',
  currentTab: 'dashboard',
  searchTerm: '',
  filterStatus: 'all',
  openCards: new Set(),
  noteModalKey: null,
  studyModal: {
    discId: null,
    topicIdx: null,
    key: null,
  },
  revisaoFilter: 'all',     // 4B.5: 'all' | 'R1' | 'R7' | 'R30'
  pwaPrompt: null,          // 4A.1
  notificationsEnabled: false, // 4B.1

  config: {
    theme: 'emerald',
    sound: 'beep',
    pomoDuration: 25,
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash-lite',
  },

  quiz: {
    currentCardIndex: 0,
    items: [],
    reviewedCount: 0,
    rememberedCount: 0,
    isFlipped: false,
    selectedFilter: 'all',
  },

  simulado: {
    active: false,
    timerId: null,
    totalSeconds: 30 * 60,
    remainingSeconds: 30 * 60,
    questions: [],
    answers: {},
    isFinished: false,
  },

  calendar: {
    year: 2026,
    month: 8, // Setembro (0-indexed: 8 = Setembro)
  },

  profiles: {
    A01: {
      nome: 'Estudante A01 (Adm/Eng)',
      cargoCodigo: 'A01',
      metaHorasSemanais: 25,
      progress: {},
      studyLogs: [],
      notes: {},
    },
    E05: {
      nome: 'Estudante E05 (Direito)',
      cargoCodigo: 'E05',
      metaHorasSemanais: 25,
      progress: {},
      studyLogs: [],
      notes: {},
    },
  },

  timer: {
    intervalId: null,
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    elapsedSeconds: 0,
    isRunning: false,
    isFocusMode: false,
    mode: 'pomodoro',
  },
};

/* ============================================================
   HELPERS DE COMPATIBILIDADE E CONTEÚDO DOS TÓPICOS
============================================================ */
function getTopicName(topico) {
  if (!topico) return '';
  return typeof topico === 'object' ? (topico.nome || '') : String(topico);
}

function getTopicData(cargoCodigo, discId, topicIdx) {
  const cargo = EDITAL_DATA.cargos[cargoCodigo];
  if (!cargo) return null;
  const disc = cargo.p1.disciplinas.find(d => d.id === discId) || cargo.p2.disciplinas.find(d => d.id === discId);
  if (!disc || !disc.topicos || !disc.topicos[topicIdx]) return null;
  const item = disc.topicos[topicIdx];
  return {
    cargo,
    disc,
    item,
    nome: getTopicName(item),
    teoria: typeof item === 'object' ? (item.teoria || '') : '',
    resumo: typeof item === 'object' ? (item.resumo || '') : '',
    flashcard: typeof item === 'object' ? (item.flashcard || null) : null,
  };
}

function renderStudyContent(rawText, defaultEmptyMsg) {
  if (!rawText || !rawText.trim()) {
    return `<div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
      <p style="font-size:0.95rem;margin-bottom:0.5rem;color:var(--text);">${defaultEmptyMsg}</p>
      <span style="font-size:0.8rem;opacity:0.75;">Conteúdo pedagógico em expansão contínua para o Edital FCC 2026.</span>
    </div>`;
  }
  if (rawText.trim().startsWith('<')) {
    return rawText;
  }
  return rawText
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('####')) return `<h4>${trimmed.replace(/^####\s*/, '')}</h4>`;
      if (trimmed.startsWith('###')) return `<h4>${trimmed.replace(/^###\s*/, '')}</h4>`;
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(l => `<li>${l.replace(/^[-*]\s*/, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

/* ============================================================
   UTILIDADES — ícones SVG & datas locais
============================================================ */
function ic(name, size) {
  const s = size || 16;
  return `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function localDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ============================================================
   PERSISTÊNCIA & CONFIGURAÇÃO
============================================================ */
function loadProfilesData() {
  try {
    const savedActive = localStorage.getItem('sefaz_active_profile');
    if (savedActive === 'A01' || savedActive === 'E05') AppState.activeProfileKey = savedActive;

    const savedData = localStorage.getItem('sefaz_profiles_data_v3') || localStorage.getItem('sefaz_profiles_data_v2');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.A01) AppState.profiles.A01 = { ...AppState.profiles.A01, ...parsed.A01 };
      if (parsed.E05) AppState.profiles.E05 = { ...AppState.profiles.E05, ...parsed.E05 };
    }

    const openCards = localStorage.getItem('sefaz_open_cards');
    if (openCards) AppState.openCards = new Set(JSON.parse(openCards));

    const savedConfig = localStorage.getItem('sefaz_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed._version === CONFIG_VERSION) {
        // Versão compatível: restaura config normalmente
        AppState.config = { ...AppState.config, ...parsed };
      } else {
        // Versão antiga: preserva apenas preferências não-visuais (som, pomodoro)
        // e reseta tema para o padrão atual do código
        AppState.config = {
          ...AppState.config,          // padrões do código (tema emerald)
          sound: parsed.sound ?? AppState.config.sound,
          pomoDuration: parsed.pomoDuration ?? AppState.config.pomoDuration,
          // _version será gravado na próxima chamada a saveProfilesData()
        };
        console.info(`[SEFAZ] Config migrado da v${parsed._version ?? 0} → v${CONFIG_VERSION}. Tema resetado para padrão.`);
      }
    }
  } catch (e) {
    console.error('Erro ao carregar dados do LocalStorage:', e);
  }
}

function saveProfilesData() {
  try {
    localStorage.setItem('sefaz_active_profile', AppState.activeProfileKey);
    localStorage.setItem('sefaz_profiles_data_v3', JSON.stringify(AppState.profiles));
    localStorage.setItem('sefaz_open_cards', JSON.stringify([...AppState.openCards]));
    // Sempre grava a versão atual junto com o config
    localStorage.setItem('sefaz_config', JSON.stringify({ ...AppState.config, _version: CONFIG_VERSION }));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('Armazenamento cheio! Exporte um backup JSON.', 'warning', 6000);
    } else {
      showToast('Falha ao salvar dados.', 'error');
    }
  }
}

function getCurrentProfile() {
  return AppState.profiles[AppState.activeProfileKey];
}

/* ============================================================
   SISTEMA DE TOAST
============================================================ */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-item ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   WEB AUDIO API — SINTETIZADOR DE SONS (4C.4)
============================================================ */
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep() {
  const soundType = AppState.config.sound || 'beep';
  if (soundType === 'mute') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (soundType === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (soundType === 'bell') {
      [523.25, 1046.5].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } else if (soundType === 'chime') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.12;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    }
  } catch (e) {
    console.warn('Áudio não suportado:', e);
  }
}

/* ============================================================
   BROWSER NOTIFICATIONS (4B.1)
============================================================ */
function initNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    AppState.notificationsEnabled = true;
    updateNotificationUI(true);
  } else {
    updateNotificationUI(false);
  }
}

function updateNotificationUI(enabled) {
  const btn = document.getElementById('btnToggleNotification');
  const statusEl = document.getElementById('configNotifStatus');
  if (btn) btn.classList.toggle('active', enabled);
  if (statusEl) {
    statusEl.textContent = enabled ? 'Ativas e permitidas' : 'Bloqueadas ou pendentes';
    statusEl.style.color = enabled ? 'var(--accent-emerald)' : 'var(--accent-gold)';
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Seu navegador não suporta notificações.', 'warning');
    return;
  }
  Notification.requestPermission().then((perm) => {
    if (perm === 'granted') {
      AppState.notificationsEnabled = true;
      updateNotificationUI(true);
      sendNotification('SEFAZ/SC 2026', 'Notificações ativadas com sucesso! Você receberá alertas de revisão e foco.');
      showToast('Notificações ativadas.', 'success');
    } else {
      AppState.notificationsEnabled = false;
      updateNotificationUI(false);
      showToast('Notificações não autorizadas no navegador.', 'info');
    }
  });
}

function sendNotification(title, body) {
  if (AppState.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
      });
    } catch (e) {
      console.warn('Erro ao disparar notificação:', e);
    }
  }
}

/* ============================================================
   SERVICE WORKER & PWA INSTALL (4A.1)
============================================================ */
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('PWA ServiceWorker registrado com sucesso:', reg.scope);
      }).catch((err) => {
        console.warn('Falha no registro do ServiceWorker:', err);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    AppState.pwaPrompt = e;
    const btnInstall = document.getElementById('btnInstallPwa');
    if (btnInstall) btnInstall.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', () => {
    const btnInstall = document.getElementById('btnInstallPwa');
    if (btnInstall) btnInstall.style.display = 'none';
    AppState.pwaPrompt = null;
    showToast('SEFAZ/SC instalado no dispositivo.', 'success', 5000);
  });
}

/* ============================================================
   COUNTDOWN TIMER & STATUS
============================================================ */
function initCountdown() {
  const el = document.getElementById('countdownTimer');
  if (!el) return;
  const target = new Date(EDITAL_DATA.info.dataProva).getTime();

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      showToast('Prova hoje!', 'warning');
      el.className = 'countdown-box urgent';
      return;
    }
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    el.className = `countdown-box ${days < 30 ? 'urgent' : days < 90 ? 'warning' : ''}`;
    el.innerHTML = `<span class="pulse-dot"></span> Prova em: <strong>${days}d ${hours}h ${mins}m</strong>`;
  }
  update();
  setInterval(update, 60000);
}

/* ============================================================
   STREAKS & GAMIFICAÇÃO (4B.3)
============================================================ */
function calculateStreaks(studyLogs) {
  if (!studyLogs || studyLogs.length === 0) return { current: 0, max: 0 };

  const daySet = new Set();
  studyLogs.forEach(log => {
    if (log._ts) {
      const d = localDateKey(new Date(log._ts));
      daySet.add(d);
    } else if (log.date) {
      const parts = log.date.split(' ')[0].split('/');
      if (parts.length === 2) {
        daySet.add(`2026-${parts[1]}-${parts[0]}`);
      }
    }
  });

  const sortedDays = Array.from(daySet).sort().reverse();
  if (sortedDays.length === 0) return { current: 0, max: 0 };

  const todayStr = localDateKey(new Date());
  const yesterday = localDateKey(new Date(Date.now() - 86400000));

  let currentStreak = 0;
  let checkDate = sortedDays.includes(todayStr) ? new Date(todayStr) : sortedDays.includes(yesterday) ? new Date(yesterday) : null;

  if (checkDate) {
    while (true) {
      const dateStr = localDateKey(checkDate);
      if (daySet.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Max streak
  const chronological = Array.from(daySet).sort();
  let maxStreak = 0;
  let tempStreak = 0;
  let prevTime = 0;

  chronological.forEach(dStr => {
    const time = new Date(dStr).getTime();
    if (prevTime === 0 || Math.round((time - prevTime) / 86400000) === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak;
    prevTime = time;
  });

  return { current: currentStreak, max: Math.max(maxStreak, currentStreak) };
}

function renderGamificationBadges() {
  const container = document.getElementById('gamificationBadges');
  if (!container) return;

  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];
  const streaks = calculateStreaks(logs);
  const totalMin = logs.reduce((a, l) => a + (l.minutes || 0), 0);
  const totalHours = totalMin / 60;

  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  let totalTopicos = 0, teoriaCount = 0, questoesCount = 0;
  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(d => {
    d.topicos.forEach((_, i) => {
      totalTopicos++;
      const p = profile.progress[`${profile.cargoCodigo}_${d.id}_${i}`];
      if (p?.teoria) teoriaCount++;
      if (p?.questoes) questoesCount++;
    });
  });

  const percTeoria = totalTopicos > 0 ? (teoriaCount / totalTopicos) * 100 : 0;
  const notesCount = Object.keys(profile.notes || {}).length;

  const BADGES = [
    { id: 'b1', icon: 'medal', name: 'Primeira Sessão', unlocked: logs.length >= 1 },
    { id: 'b2', icon: 'flame', name: 'Chama Acesa (3d)', unlocked: streaks.current >= 3 || streaks.max >= 3 },
    { id: 'b3', icon: 'trophy', name: 'Guerreiro (7d)', unlocked: streaks.current >= 7 || streaks.max >= 7 },
    { id: 'b4', icon: 'timer', name: 'Foco 10h+', unlocked: totalHours >= 10 },
    { id: 'b5', icon: 'doc', name: '25% do Edital', unlocked: percTeoria >= 25 },
    { id: 'b6', icon: 'star', name: '50% do Edital', unlocked: percTeoria >= 50 },
    { id: 'b7', icon: 'target', name: 'Praticante 20Q', unlocked: questoesCount >= 20 },
    { id: 'b8', icon: 'note', name: 'Flashcards 5+', unlocked: notesCount >= 5 },
  ];

  container.innerHTML = BADGES.map(b => `
    <div class="badge-chip ${b.unlocked ? 'unlocked' : ''}" title="${b.unlocked ? 'Conquista desbloqueada' : 'Em progresso'}">
      ${ic(b.icon, 14)}<span>${b.name}</span>
    </div>
  `).join('');

  // Update header and dashboard streak
  const headerStreak = document.getElementById('headerStreakBadge');
  if (headerStreak) headerStreak.innerHTML = `${ic('flame', 14)}<strong>${streaks.current}</strong> ${streaks.current === 1 ? 'dia' : 'dias'}`;

  const metricStreak = document.getElementById('metricStreakDays');
  if (metricStreak) metricStreak.textContent = `${streaks.current} d`;

  const metricRecord = document.getElementById('metricStreakRecord');
  if (metricRecord) metricRecord.textContent = `Recorde: ${streaks.max} dias`;
}

/* ============================================================
   CRONOGRAMA RECOMENDADO INTELIGENTE (4A.4)
============================================================ */
function renderCronograma() {
  const container = document.getElementById('cronogramaContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  let totalTopicos = 0, teoriaDone = 0;

  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(disc => {
    disc.topicos.forEach((_, idx) => {
      totalTopicos++;
      if (profile.progress[`${profile.cargoCodigo}_${disc.id}_${idx}`]?.teoria) teoriaDone++;
    });
  });

  const pendentes = Math.max(0, totalTopicos - teoriaDone);
  const diffDays = Math.max(1, Math.ceil((new Date(EDITAL_DATA.info.dataProva).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const topicosPorDia = (pendentes / diffDays).toFixed(1);
  const horasPorDia = ((pendentes * 50) / (diffDays * 60)).toFixed(1); // ~50min por tópico c/ questões

  let semaforoClass = 'verde';
  let semaforoText = 'Ritmo Viável e Sustentável';
  let semaforoDesc = 'Com dedicação regular de 2 a 3 horas diárias, você cobrirá 100% do edital antes da prova.';

  if (horasPorDia > 4.5) {
    semaforoClass = 'vermelho';
    semaforoText = 'Ritmo Crítico — Alta Intensidade';
    semaforoDesc = 'Atenção: priorize os tópicos de Alta Frequência FCC e resolva questões diretamente.';
  } else if (horasPorDia > 2.5) {
    semaforoClass = 'amarelo';
    semaforoText = 'Ritmo Moderado / Intenso';
    semaforoDesc = 'Mantenha consistência. Reserve fins de semana para bater as matérias mais extensas de P2.';
  }

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:0.75rem;margin-bottom:1rem;text-align:center;">
      <div style="background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:8px;border:1px solid var(--border-subtle);">
        <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Tópicos Pendentes</span>
        <strong style="font-size:1.3rem;color:#fff;">${pendentes}</strong>
      </div>
      <div style="background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:8px;border:1px solid var(--border-subtle);">
        <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Dias até 22/11</span>
        <strong style="font-size:1.3rem;color:var(--accent-gold);">${diffDays} d</strong>
      </div>
      <div style="background:rgba(255,255,255,0.03);padding:0.75rem;border-radius:8px;border:1px solid var(--border-subtle);">
        <span style="font-size:0.75rem;color:var(--text-muted);display:block;">Meta Diária Sugerida</span>
        <strong style="font-size:1.3rem;color:var(--accent-emerald);">${horasPorDia}h/dia</strong>
      </div>
    </div>
    <div class="semaforo-badge ${semaforoClass}">
      <span>${semaforoText}</span>
    </div>
    <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.6rem;line-height:1.5;">
      ${semaforoDesc} (média de <strong>${topicosPorDia} tópico(s)</strong> por dia).
    </p>
  `;
}

/* ============================================================
   HORAS POR DISCIPLINA (4A.2)
============================================================ */
function renderSubjectHours() {
  const container = document.getElementById('subjectHoursContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];
  const subjectMap = {};
  let totalMin = 0;

  logs.forEach(l => {
    const s = l.subject || 'Estudo Geral';
    subjectMap[s] = (subjectMap[s] || 0) + (l.minutes || 0);
    totalMin += (l.minutes || 0);
  });

  const sorted = Object.entries(subjectMap)
    .map(([nome, mins]) => ({ nome, mins, horas: (mins / 60).toFixed(1), perc: totalMin > 0 ? Math.round((mins / totalMin) * 100) : 0 }))
    .sort((a, b) => b.mins - a.mins)
    .slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:1.5rem 0;color:var(--text-muted);font-size:0.85rem;">
        Nenhuma sessão com disciplina registrada ainda.<br>Use o cronômetro para selecionar a matéria estudada!
      </div>`;
    return;
  }

  container.innerHTML = sorted.map(item => `
    <div class="sub-hour-row">
      <div class="sub-hour-header">
        <span>${item.nome.length > 28 ? item.nome.slice(0, 26) + '…' : item.nome}</span>
        <strong>${item.horas}h (${item.perc}%)</strong>
      </div>
      <div class="sub-hour-bar-bg">
        <div class="sub-hour-bar-fill" style="width:${item.perc}%"></div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   HEATMAP ANUAL GITHUB-STYLE (4B.2)
============================================================ */
function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];
  const dayMinutes = {};

  logs.forEach(l => {
    let dStr = '';
    if (l._ts) {
      dStr = localDateKey(new Date(l._ts));
    } else if (l.date) {
      const parts = l.date.split(' ')[0].split('/');
      if (parts.length === 2) dStr = `2026-${parts[1]}-${parts[0]}`;
    }
    if (dStr) dayMinutes[dStr] = (dayMinutes[dStr] || 0) + (l.minutes || 0);
  });

  // Renderiza últimas 20 semanas até a semana da prova
  const weeks = 22;
  const daysPerWeek = 7;
  const cellSize = 12;
  const gap = 3;
  const W = weeks * (cellSize + gap) + 40;
  const H = daysPerWeek * (cellSize + gap) + 24;

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - (weeks * 7) + (7 - startDate.getDay()));

  let cells = '';
  let cursor = new Date(startDate);

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const curStr = cursor.toISOString().split('T')[0];
      const mins = dayMinutes[curStr] || 0;
      const hours = (mins / 60).toFixed(1);

      let lvl = '--hm0';
      if (mins > 180) lvl = '--hm4';
      else if (mins > 120) lvl = '--hm3';
      else if (mins > 60) lvl = '--hm2';
      else if (mins > 0) lvl = '--hm1';

      const x = w * (cellSize + gap) + 24;
      const y = d * (cellSize + gap) + 16;

      cells += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" style="fill:var(${lvl})">
          <title>${curStr}: ${hours}h estudadas (${mins} min)</title>
        </rect>
      `;
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  container.innerHTML = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="26" style="fill:var(--text-dim2)" font-size="9" font-family="IBM Plex Mono,monospace">Seg</text>
      <text x="0" y="56" style="fill:var(--text-dim2)" font-size="9" font-family="IBM Plex Mono,monospace">Qua</text>
      <text x="0" y="86" style="fill:var(--text-dim2)" font-size="9" font-family="IBM Plex Mono,monospace">Sex</text>
      ${cells}
    </svg>
  `;
}

/* ============================================================
   PRESETS DO SIMULADOR FCC (4B.4)
============================================================ */
window.applySimulatorPreset = function(preset) {
  const p1Acertos = document.getElementById('simP1Acertos');
  const p2Acertos = document.getElementById('simP2Acertos');
  const mediaP1   = document.getElementById('simMediaP1');
  const mediaP2   = document.getElementById('simMediaP2');
  const desvioP1  = document.getElementById('simDesvioP1');
  const desvioP2  = document.getElementById('simDesvioP2');

  if (!p1Acertos || !p2Acertos) return;

  if (preset === 'otimista') {
    p1Acertos.value = 68; // +2.5 DP sobre a média estimada
    p2Acertos.value = 85;
    mediaP1.value = 48;
    mediaP2.value = 60;
    desvioP1.value = 8;
    desvioP2.value = 10;
    showToast('Cenário otimista aplicado: top 5% dos candidatos.', 'success');
  } else if (preset === 'realista') {
    p1Acertos.value = 52;
    p2Acertos.value = 65;
    mediaP1.value = 48;
    mediaP2.value = 60;
    desvioP1.value = 8;
    desvioP2.value = 10;
    showToast('Cenário realista aplicado: candidato na média alta.', 'info');
  } else if (preset === 'corte') {
    p1Acertos.value = 48; // NP1 = 50
    p2Acertos.value = 60; // NP2 = 50 -> 50 + 50*2 = 150 pontos exatos
    mediaP1.value = 48;
    mediaP2.value = 60;
    desvioP1.value = 8;
    desvioP2.value = 10;
    showToast('Cenário linha de corte aplicado: exatamente 150 pontos.', 'warning');
  }

  // Atualiza labels numéricos
  ['simP1Acertos','simP2Acertos','simMediaP1','simMediaP2','simDesvioP1','simDesvioP2'].forEach((id) => {
    const el = document.getElementById(id);
    const vEl = document.getElementById(`${id}Val`);
    if (el && vEl) vEl.textContent = el.value;
  });

  updateSimulatorCalculations();
};

/* ============================================================
   QUIZ & FLASHCARDS (4A.5)
============================================================ */
function initQuiz() {
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const items = [];

  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(disc => {
    disc.topicos.forEach((topico, idx) => {
      const topicName = getTopicName(topico);
      const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
      const note = profile.notes?.[key] || '';
      const freq = getTopicFccFreq(topicName, disc.id);
      const topicoObj = typeof topico === 'object' ? topico : null;

      items.push({
        key,
        topico: topicName,
        topicoObj,
        disc: disc.nome,
        freq,
        note,
      });
    });
  });

  AppState.quiz.items = items;
  AppState.quiz.currentCardIndex = 0;
  AppState.quiz.isFlipped = false;
  renderQuizCard();
}

function renderQuizCard() {
  const wrapper = document.getElementById('quizCardWrapper');
  if (!wrapper) return;

  const filter = document.getElementById('quizSubjectSelect')?.value || 'all';
  let filtered = AppState.quiz.items;

  if (filter === 'notes-only') {
    filtered = filtered.filter(i => !!i.note);
  } else if (filter === 'fcc-high') {
    filtered = filtered.filter(i => i.freq === 'alta');
  }

  if (filtered.length === 0) {
    wrapper.innerHTML = `
      <div class="flashcard flashcard-empty" style="justify-content:center;text-align:center;">
        ${ic('note', 40)}
        <h3>Nenhum flashcard neste filtro</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem;">
          ${filter === 'notes-only' ? 'Adicione anotações no botão de anotação de qualquer tópico do Edital.' : 'Selecione outro filtro para continuar o quiz.'}
        </p>
      </div>`;
    return;
  }

  if (AppState.quiz.currentCardIndex >= filtered.length) {
    AppState.quiz.currentCardIndex = 0;
  }

  const current = filtered[AppState.quiz.currentCardIndex];
  const isFlipped = AppState.quiz.isFlipped;

  const freqBadge = current.freq === 'alta' ? '<span class="fcc-badge alta">Alta FCC</span>' : '<span class="fcc-badge media">Média</span>';

  wrapper.innerHTML = `
    <div class="flashcard ${isFlipped ? 'flipped' : ''}" onclick="toggleQuizCardFlip()">
      <div class="flashcard-header">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;">
          ${current.disc} ${freqBadge}
        </span>
        <span style="font-size:0.8rem;color:var(--primary-light);">
          Card ${AppState.quiz.currentCardIndex + 1}/${filtered.length}
        </span>
      </div>

      <div class="flashcard-body">
        ${!isFlipped
          ? `<div>
              <span style="display:block;font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">O que você lembra sobre:</span>
              <strong style="font-size:1.05rem;">${current.topico}</strong>
              ${current.topicoObj?.flashcard?.pergunta ? `
                <div style="margin-top:0.75rem;padding:0.75rem;background:rgba(255,255,255,0.04);border-radius:8px;font-size:0.88rem;color:var(--text);border-left:3px solid var(--accent);text-align:left;">
                  <strong style="color:var(--accent);">Desafio FCC:</strong> ${current.topicoObj.flashcard.pergunta}
                </div>
              ` : ''}
            </div>`
          : `<div>
              <span style="display:block;font-size:0.82rem;color:var(--accent-emerald, #10b981);margin-bottom:8px;font-weight:700;">VERSO / CONCEITO:</span>
              <div style="font-size:0.92rem;font-weight:400;color:#f8fafc;text-align:left;background:rgba(255,255,255,0.03);padding:1rem;border-radius:8px;border:1px solid var(--border-subtle);max-height:200px;overflow-y:auto;line-height:1.6;">
                ${current.topicoObj?.flashcard?.resposta
                  ? `<div style="margin-bottom:0.75rem;"><strong style="color:var(--primary-light);">Fundamento / Resposta:</strong><br>${current.topicoObj.flashcard.resposta}</div>`
                  : (current.topicoObj?.resumo ? `<div style="margin-bottom:0.75rem;"><strong style="color:var(--primary-light);">Resumo:</strong><br>${current.topicoObj.resumo}</div>` : '')
                }
                ${current.note ? `<div style="margin-top:0.5rem;padding-top:0.5rem;border-top:1px dashed rgba(255,255,255,0.15);"><strong style="color:#fbbf24;">Sua anotação pessoal:</strong><br>${current.note}</div>` : (!current.topicoObj?.flashcard && !current.topicoObj?.resumo ? '<i>Sem anotação pessoal salva. Revise a legislação aplicável e conceitos fundamentais do Edital FCC.</i>' : '')}
              </div>
            </div>`
        }
      </div>

      <div class="flashcard-footer">
        ${!isFlipped ? 'Toque no card para ver o verso / anotação' : 'Classifique sua lembrança abaixo:'}
      </div>
    </div>

    ${isFlipped ? `
      <div class="quiz-rating-buttons" style="margin-top:1rem;">
        <button class="btn-rating errei" onclick="rateQuizCard(0)">Não lembrei</button>
        <button class="btn-rating medio" onclick="rateQuizCard(1)">Mais ou menos</button>
        <button class="btn-rating acertei" onclick="rateQuizCard(2)">Lembrei com clareza</button>
      </div>
    ` : ''}
  `;

  // Update retention metrics
  const retEl = document.getElementById('quizRetentionRate');
  const revEl = document.getElementById('quizReviewedCount');
  if (retEl) {
    const rate = AppState.quiz.reviewedCount > 0 ? Math.round((AppState.quiz.rememberedCount / AppState.quiz.reviewedCount) * 100) : 0;
    retEl.textContent = `${rate}%`;
  }
  if (revEl) revEl.textContent = AppState.quiz.reviewedCount;
}

window.toggleQuizCardFlip = function() {
  AppState.quiz.isFlipped = !AppState.quiz.isFlipped;
  renderQuizCard();
};

window.rateQuizCard = function(score) {
  AppState.quiz.reviewedCount++;
  if (score >= 1) AppState.quiz.rememberedCount++;
  AppState.quiz.isFlipped = false;
  AppState.quiz.currentCardIndex++;
  renderQuizCard();
  showToast(score === 2 ? 'Dominado!' : score === 1 ? 'Quase lá!' : 'Agendado para revisão.', 'info', 1500);
};

/* ============================================================
   SIMULADO CRONOMETRADO COMPLETO (4C.1)
============================================================ */
function startSimulado() {
  const size = parseInt(document.getElementById('simuladoTamanhoSelect')?.value || '10', 10);
  const profile = getCurrentProfile();

  // Filtra questões aplicáveis ao cargo
  const bank = FCC_QUESTIONS.filter(q => q.cargo === 'todos' || q.cargo === profile.cargoCodigo);
  // Embaralha e seleciona 'size' questões
  const shuffled = [...bank].sort(() => 0.5 - Math.random()).slice(0, size);

  AppState.simulado.active = true;
  AppState.simulado.isFinished = false;
  AppState.simulado.questions = shuffled;
  AppState.simulado.answers = {};
  AppState.simulado.totalSeconds = size * 3 * 60; // 3 min por questão
  AppState.simulado.remainingSeconds = AppState.simulado.totalSeconds;

  document.getElementById('simuladoConfigCard').style.display = 'none';
  document.getElementById('simuladoActivePanel').style.display = 'block';
  document.getElementById('simuladoResultPanel').style.display = 'none';

  renderSimuladoQuestions();
  renderSimuladoBubbles();

  clearInterval(AppState.simulado.timerId);
  AppState.simulado.timerId = setInterval(() => {
    AppState.simulado.remainingSeconds--;
    updateSimuladoTimerDisplay();
    if (AppState.simulado.remainingSeconds <= 0) {
      finishSimulado();
    }
  }, 1000);
  updateSimuladoTimerDisplay();
}

function updateSimuladoTimerDisplay() {
  const rem = AppState.simulado.remainingSeconds;
  const m = Math.floor(rem / 60);
  const s = rem % 60;
  const el = document.getElementById('simuladoTimerDisplay');
  if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const answeredCount = Object.keys(AppState.simulado.answers).length;
  const progEl = document.getElementById('simuladoProgressChip');
  if (progEl) progEl.textContent = `Respondidas: ${answeredCount}/${AppState.simulado.questions.length}`;
}

function renderSimuladoQuestions() {
  const area = document.getElementById('simuladoQuestionsArea');
  if (!area) return;

  area.innerHTML = AppState.simulado.questions.map((q, qIdx) => `
    <div class="sim-question-card" id="sim-q-${qIdx}">
      <div class="sim-question-header">
        <span>Questão ${qIdx + 1} de ${AppState.simulado.questions.length} • <b>${q.disciplina}</b></span>
        <span>FCC • Auditor</span>
      </div>
      <div class="sim-question-text">${q.enunciado}</div>
      <div class="sim-options-list">
        ${q.opcoes.map((opt, optIdx) => {
          const isSelected = AppState.simulado.answers[qIdx] === optIdx;
          return `
            <label class="sim-option-label ${isSelected ? 'selected' : ''}" onclick="selectSimuladoOption(${qIdx}, ${optIdx})">
              <strong>${String.fromCharCode(65 + optIdx)})</strong>
              <span>${opt}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function renderSimuladoBubbles() {
  const list = document.getElementById('simuladoBubbleList');
  if (!list) return;

  list.innerHTML = AppState.simulado.questions.map((_, i) => {
    const isAnswered = AppState.simulado.answers[i] !== undefined;
    return `
      <button class="bubble-btn ${isAnswered ? 'answered' : ''}" onclick="scrollToSimuladoQuestion(${i})">
        ${i + 1}
      </button>
    `;
  }).join('');
}

window.selectSimuladoOption = function(qIdx, optIdx) {
  if (AppState.simulado.isFinished) return;
  AppState.simulado.answers[qIdx] = optIdx;
  renderSimuladoQuestions();
  renderSimuladoBubbles();
  updateSimuladoTimerDisplay();
};

window.scrollToSimuladoQuestion = function(qIdx) {
  const el = document.getElementById(`sim-q-${qIdx}`);
  if (el) {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
};

window.finishSimulado = function() {
  clearInterval(AppState.simulado.timerId);
  AppState.simulado.active = false;
  AppState.simulado.isFinished = true;

  const total = AppState.simulado.questions.length;
  let correct = 0;
  AppState.simulado.questions.forEach((q, idx) => {
    if (AppState.simulado.answers[idx] === q.correta) correct++;
  });

  const perc = Math.round((correct / total) * 100);
  const timeSpentSec = AppState.simulado.totalSeconds - AppState.simulado.remainingSeconds;
  const timeSpentMin = Math.max(1, Math.round(timeSpentSec / 60));

  // Cálculo estimativo FCC
  const npEstimada = (((correct - (total * 0.6)) / (total * 0.15)) * 10) + 50;

  const resultArea = document.getElementById('simuladoResultPanel');
  if (resultArea) {
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
      <div class="sim-card" style="margin-bottom:1.5rem;border-color:var(--primary-light);">
        <h3 style="font-size:1.4rem;">Resultado do Simulado</h3>
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem;margin:1.5rem 0;text-align:center;">
          <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:8px;border:1px solid var(--border-subtle);">
            <span style="font-size:0.8rem;color:var(--text-muted);display:block;">Acertos</span>
            <strong style="font-size:1.6rem;color:var(--accent-emerald);">${correct}/${total}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:8px;border:1px solid var(--border-subtle);">
            <span style="font-size:0.8rem;color:var(--text-muted);display:block;">Aproveitamento</span>
            <strong style="font-size:1.6rem;color:#fff;">${perc}%</strong>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:8px;border:1px solid var(--border-subtle);">
            <span style="font-size:0.8rem;color:var(--text-muted);display:block;">Tempo Gasto</span>
            <strong style="font-size:1.6rem;color:var(--accent-gold);">${timeSpentMin} min</strong>
          </div>
          <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:8px;border:1px solid var(--border-subtle);">
            <span style="font-size:0.8rem;color:var(--text-muted);display:block;">NP Estimada FCC</span>
            <strong style="font-size:1.6rem;color:var(--primary-light);">${npEstimada.toFixed(1)} pts</strong>
          </div>
        </div>

        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
          <button class="btn-action primary" onclick="logSimuladoAsStudy(${timeSpentMin})">
            ${ic('save', 14)} Gravar ${timeSpentMin} min no histórico de estudos
          </button>
          <button class="btn-action" onclick="startSimulado()">
            ${ic('repeat', 14)} Fazer outro simulado
          </button>
        </div>
      </div>

      <h3 style="margin-bottom:1rem;">Gabarito comentado da banca FCC:</h3>
      ${AppState.simulado.questions.map((q, idx) => {
        const userChoice = AppState.simulado.answers[idx];
        const isRight = userChoice === q.correta;
        return `
          <div class="sim-card" style="margin-bottom:1rem;border-left:4px solid ${isRight ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
            <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-muted);margin-bottom:6px;">
              <span>Questão ${idx + 1} — ${q.disciplina}</span>
              <span>${isRight ? 'Você acertou' : 'Você errou'}</span>
            </div>
            <p style="font-size:0.95rem;margin-bottom:0.75rem;">${q.enunciado}</p>
            <div style="font-size:0.88rem;margin-bottom:0.5rem;">
              <strong>Gabarito Oficial: Letra ${String.fromCharCode(65 + q.correta)}</strong>
              ${userChoice !== undefined ? `(Sua resposta: Letra ${String.fromCharCode(65 + userChoice)})` : '(Não respondida)'}
            </div>
            <div style="background:rgba(255,255,255,0.02);padding:0.75rem;border-radius:6px;font-size:0.85rem;color:var(--text-secondary);border:1px solid var(--border-subtle);line-height:1.5;">
              <b>Comentário e fundamentação FCC:</b> ${q.explicacao}
            </div>
          </div>
        `;
      }).join('')}
    `;
    resultArea.setAttribute('tabindex', '-1');
    resultArea.focus({ preventScroll: true });
  }

  playBeep();
  showToast(`Simulado finalizado: ${correct}/${total} acertos!`, 'success', 4000);
};

window.logSimuladoAsStudy = function(minutes) {
  const profile = getCurrentProfile();
  if (!profile.studyLogs) profile.studyLogs = [];
  profile.studyLogs.unshift({
    id: Date.now(),
    _ts: Date.now(),
    date: new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }),
    minutes,
    subject: 'Simulado Cronometrado FCC',
    manual: false,
  });
  saveProfilesData();
  renderDashboardMetrics();
  renderWeeklyChart();
  renderSubjectHours();
  renderHeatmap();
  showToast(`${minutes} minutos do Simulado registrados no perfil.`, 'success');
};

/* ============================================================
   CALENDÁRIO MENSAL DE ESTUDOS (4C.2)
============================================================ */
function renderCalendar() {
  const grid = document.getElementById('calendarMonthGrid');
  const title = document.getElementById('calendarMonthTitle');
  if (!grid || !title) return;

  const { year, month } = AppState.calendar;
  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  title.innerHTML = `${ic('calendar', 16)} ${monthNames[month]} de ${year}`;

  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];

  // Mapear dias estudados
  const studyDays = {};
  logs.forEach(l => {
    let dStr = '';
    if (l._ts) {
      dStr = localDateKey(new Date(l._ts));
    } else if (l.date) {
      const parts = l.date.split(' ')[0].split('/');
      if (parts.length === 2) dStr = `2026-${parts[1]}-${parts[0]}`;
    }
    if (dStr) {
      if (!studyDays[dStr]) studyDays[dStr] = [];
      studyDays[dStr].push(l);
    }
  });

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = localDateKey(new Date());

  let html = `
    <div class="cal-header-day">Dom</div>
    <div class="cal-header-day">Seg</div>
    <div class="cal-header-day">Ter</div>
    <div class="cal-header-day">Qua</div>
    <div class="cal-header-day">Qui</div>
    <div class="cal-header-day">Sex</div>
    <div class="cal-header-day">Sáb</div>
  `;

  for (let i = 0; i < firstDay; i++) {
    html += `<div style="opacity:0.2;"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const curDateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = curDateStr === todayStr;
    const isExamDay = curDateStr === '2026-11-22';
    const hasStudy = !!studyDays[curDateStr];

    html += `
      <div class="cal-day ${isToday ? 'today' : ''} ${hasStudy ? 'has-study' : ''} ${isExamDay ? 'exam-day' : ''}"
           onclick="showCalendarDayDetails('${curDateStr}', ${d})"
           title="${isExamDay ? 'PROVA SEFAZ/SC 2026!' : hasStudy ? 'Estudo registrado' : ''}">
        ${d}
      </div>
    `;
  }

  grid.innerHTML = html;
}

window.showCalendarDayDetails = function(dateStr, dayNum) {
  const details = document.getElementById('calendarDayDetails');
  if (!details) return;

  const profile = getCurrentProfile();
  const logs = (profile.studyLogs || []).filter(l => {
    if (l._ts) return localDateKey(new Date(l._ts)) === dateStr;
    if (l.date) {
      const parts = l.date.split(' ')[0].split('/');
      return parts.length === 2 && `2026-${parts[1]}-${parts[0]}` === dateStr;
    }
    return false;
  });

  if (dateStr === '2026-11-22') {
    details.innerHTML = `
      <div style="background:rgba(244,63,94,0.15);padding:0.6rem;border-radius:6px;border:1px solid rgba(244,63,94,0.4);color:#fff;">
        ${ic('flag', 14)} <b>22/11/2026 — Dia da Prova SEFAZ/SC</b><br>
        <span style="font-size:0.75rem;color:var(--text-muted);">Manhã: P1 (80Q) • Tarde: P2 (100Q). Florianópolis/SC.</span>
      </div>`;
    return;
  }

  if (logs.length === 0) {
    details.innerHTML = `<span style="color:var(--text-muted);font-size:0.8rem;">Nenhuma sessão registrada em ${dateStr}.</span>`;
    return;
  }

  const totalMin = logs.reduce((a, l) => a + (l.minutes || 0), 0);
  details.innerHTML = `
    <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px;">
      ${ic('calendar', 13)} <b>${dateStr}:</b> ${(totalMin / 60).toFixed(1)}h estudadas (${logs.length} ${logs.length === 1 ? 'sessão' : 'sessões'}):
    </div>
    <ul style="list-style:none;font-size:0.78rem;color:var(--text-muted);display:flex;flex-direction:column;gap:2px;">
      ${logs.map(l => `<li>• ${l.subject}: <strong>+${l.minutes}m</strong></li>`).join('')}
    </ul>
  `;
};

/* ============================================================
   SINCRONIZAÇÃO VIA URL & QR CODE EM SVG (4C.3)
============================================================ */
function generateSyncLink() {
  try {
    const profile = getCurrentProfile();
    const payload = JSON.stringify({
      v: '4.0',
      p: AppState.activeProfileKey,
      data: profile,
    });
    const b64 = btoa(unescape(encodeURIComponent(payload)));
    const url = `${window.location.origin}${window.location.pathname}#sync=${b64}`;

    navigator.clipboard.writeText(url).then(() => {
      showToast('Link de sincronização copiado para a área de transferência.', 'success', 5000);
    }).catch(() => {
      prompt('Copie o link de sincronização abaixo:', url);
    });
  } catch (e) {
    showToast('Erro ao gerar link de sincronização.', 'error');
  }
}

function showQrCode() {
  generateSyncLink();
}

function checkSyncUrl() {
  if (!window.location.hash.startsWith('#sync=')) return;
  const b64 = window.location.hash.replace('#sync=', '');
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (parsed && parsed.data && (parsed.p === 'A01' || parsed.p === 'E05')) {
      const confirmImport = confirm(`Deseja importar os dados sincronizados para o perfil ${parsed.p} (${parsed.data.nome})?`);
      if (confirmImport) {
        AppState.profiles[parsed.p] = { ...AppState.profiles[parsed.p], ...parsed.data };
        AppState.activeProfileKey = parsed.p;
        saveProfilesData();
        renderApp();
        showToast(`Perfil ${parsed.p} sincronizado.`, 'success', 5000);
        window.location.hash = '';
      }
    }
  } catch (e) {
    console.warn('Hash sync inválido:', e);
  }
}

/* ============================================================
   EXPORTAÇÃO DE RELATÓRIO SEMANAL EM MARKDOWN (4B.6)
============================================================ */
function exportWeeklyReport() {
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const logs = profile.studyLogs || [];
  const streaks = calculateStreaks(logs);

  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const logsSemana = logs.filter(l => (l._ts || 0) >= sevenDaysAgo);
  const horasSemana = (logsSemana.reduce((a, l) => a + (l.minutes || 0), 0) / 60).toFixed(1);
  const meta = profile.metaHorasSemanais || 25;

  let totalTopicos = 0, teoriaCount = 0;
  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(d => {
    d.topicos.forEach((_, i) => {
      totalTopicos++;
      if (profile.progress[`${profile.cargoCodigo}_${d.id}_${i}`]?.teoria) teoriaCount++;
    });
  });

  const percTeoria = totalTopicos > 0 ? Math.round((teoriaCount / totalTopicos) * 100) : 0;
  const diffDays = Math.ceil((new Date(EDITAL_DATA.info.dataProva).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const md = `# Relatório Semanal de Estudos — SEFAZ/SC 2026
**Estudante:** ${profile.nome}
**Cargo:** ${cargo.codigo} (${cargo.nome})
**Data do Relatório:** ${new Date().toLocaleDateString('pt-BR')}
**Dias até a Prova:** ${diffDays} dias (Aplicação em 22/11/2026)

---

## Desempenho na Semana
- **Horas Líquidas Estudadas:** ${horasSemana}h de ${meta}h planejadas (${Math.round((horasSemana/meta)*100)}% da meta)
- **Sessões Realizadas:** ${logsSemana.length} sessões
- **Sequência de Foco (Streak):** ${streaks.current} dias seguidos (Recorde: ${streaks.max} dias)

## Progresso no Edital FCC
- **Cobertura de Teoria:** ${teoriaCount}/${totalTopicos} tópicos vencidos (${percTeoria}%)
- **Tópicos Pendentes:** ${totalTopicos - teoriaCount} tópicos

## Próximos Passos Recomendados
1. Priorizar os tópicos marcados com **Alta Frequência FCC** nas disciplinas de maior peso.
2. Manter a agenda R1/R7/R30 em dia para fixação das matérias estudadas.
3. Realizar ao menos 1 Simulado Cronometrado na aba **Simulado Real** no fim de semana.

---
*Gerado automaticamente pela Plataforma SEFAZ/SC 2026 v4.0*
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_sefaz_sc_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Relatório semanal exportado.', 'success');
}

/* ============================================================
   APLICAÇÃO DE TEMA (4C.4)
============================================================ */
function applyTheme(themeName) {
  AppState.config.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  const select = document.getElementById('configThemeSelect');
  if (select) select.value = themeName;
  saveProfilesData();
}

/* ============================================================
   EVENT LISTENERS & INICIALIZAÇÃO
============================================================ */
function initEventListeners() {
  // PWA Install button
  document.getElementById('btnInstallPwa')?.addEventListener('click', () => {
    if (AppState.pwaPrompt) {
      AppState.pwaPrompt.prompt();
      AppState.pwaPrompt.userChoice.then(() => {
        AppState.pwaPrompt = null;
        document.getElementById('btnInstallPwa').style.display = 'none';
      });
    }
  });

  // Notificação Header toggle
  document.getElementById('btnToggleNotification')?.addEventListener('click', requestNotificationPermission);
  document.getElementById('btnRequestNotif')?.addEventListener('click', requestNotificationPermission);

  // Troca de perfil
  document.querySelectorAll('.profile-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.profile === AppState.activeProfileKey) return;
      AppState.activeProfileKey = btn.dataset.profile;
      AppState.searchTerm = '';
      AppState.filterStatus = 'all';
      const si = document.getElementById('editalSearchInput');
      const fi = document.getElementById('editalFilterSelect');
      if (si) si.value = '';
      if (fi) fi.value = 'all';
      resetTimer();
      saveProfilesData();
      renderApp();
      showToast(`Perfil: ${getCurrentProfile().nome}`, 'info', 2000);
    });
  });

  // Navegação por abas
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach((v) => v.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentTab = btn.dataset.tab;
      const view = document.getElementById(`view-${btn.dataset.tab}`);
      if (view) view.classList.add('active');

      if (btn.dataset.tab === 'simulador') updateSimulatorCalculations();
      if (btn.dataset.tab === 'placar')    renderPlacar();
      if (btn.dataset.tab === 'revisoes')  renderRevisoes();
      if (btn.dataset.tab === 'quiz')      initQuiz();
      if (btn.dataset.tab === 'pomodoro')  renderCalendar();
    });
  });

  // Busca e filtros do edital
  document.getElementById('editalSearchInput')?.addEventListener('input', (e) => {
    AppState.searchTerm = e.target.value.toLowerCase();
    renderEditalVerticalizado();
  });

  document.getElementById('editalFilterSelect')?.addEventListener('change', (e) => {
    AppState.filterStatus = e.target.value;
    renderEditalVerticalizado();
  });

  // Expansão / Colapso do edital
  document.getElementById('btnExpandAll')?.addEventListener('click', () => {
    document.querySelectorAll('.disciplina-card').forEach((c) => {
      c.classList.add('open');
      AppState.openCards.add(c.id);
    });
    saveProfilesData();
  });

  document.getElementById('btnCollapseAll')?.addEventListener('click', () => {
    document.querySelectorAll('.disciplina-card').forEach((c) => {
      c.classList.remove('open');
      AppState.openCards.delete(c.id);
    });
    saveProfilesData();
  });

  // Filtros por fase nas Revisões (4B.5)
  document.querySelectorAll('.revisao-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.revisao-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.revisaoFilter = btn.dataset.filter;
      renderRevisoes();
    });
  });

  // Quiz controles
  document.getElementById('quizSubjectSelect')?.addEventListener('change', () => {
    AppState.quiz.currentCardIndex = 0;
    AppState.quiz.isFlipped = false;
    renderQuizCard();
  });
  document.getElementById('btnNextCard')?.addEventListener('click', () => {
    AppState.quiz.currentCardIndex++;
    AppState.quiz.isFlipped = false;
    renderQuizCard();
  });

  // Simulado controles
  document.getElementById('btnStartSimulado')?.addEventListener('click', startSimulado);
  document.getElementById('btnFinishSimulado')?.addEventListener('click', finishSimulado);

  // Calendário navegação
  document.getElementById('btnCalPrev')?.addEventListener('click', () => {
    AppState.calendar.month--;
    if (AppState.calendar.month < 0) {
      AppState.calendar.month = 11;
      AppState.calendar.year--;
    }
    renderCalendar();
  });
  document.getElementById('btnCalNext')?.addEventListener('click', () => {
    AppState.calendar.month++;
    if (AppState.calendar.month > 11) {
      AppState.calendar.month = 0;
      AppState.calendar.year++;
    }
    renderCalendar();
  });

  // Backup e Sync (4B.6 e 4C.3)
  document.getElementById('btnExportWeeklyReport')?.addEventListener('click', exportWeeklyReport);
  document.getElementById('btnGenerateSyncLink')?.addEventListener('click', generateSyncLink);
  document.getElementById('btnShowQrCode')?.addEventListener('click', showQrCode);
  document.getElementById('btnExportBackup')?.addEventListener('click', exportBackup);
  document.getElementById('fileImportBackup')?.addEventListener('change', importBackup);
  document.getElementById('btnExportPDF')?.addEventListener('click', exportPDF);

  // Configurações (4C.4) e Setup dos 2 Estudantes (Opção 4)
  document.getElementById('configThemeSelect')?.addEventListener('change', (e) => applyTheme(e.target.value));
  document.getElementById('btnTestSound')?.addEventListener('click', () => {
    AppState.config.sound = document.getElementById('configSoundSelect')?.value || 'beep';
    playBeep();
  });
  document.getElementById('btnSaveConfig')?.addEventListener('click', () => {
    AppState.config.sound = document.getElementById('configSoundSelect')?.value || 'beep';
    AppState.config.pomoDuration = parseInt(document.getElementById('configPomoDuration')?.value || '25', 10);

    const nA01 = document.getElementById('cfgNomeA01')?.value?.trim();
    const mA01 = parseInt(document.getElementById('cfgMetaA01')?.value, 10);
    const nE05 = document.getElementById('cfgNomeE05')?.value?.trim();
    const mE05 = parseInt(document.getElementById('cfgMetaE05')?.value, 10);

    if (nA01) AppState.profiles.A01.nome = nA01;
    if (mA01 > 0) AppState.profiles.A01.metaHorasSemanais = mA01;
    if (nE05) AppState.profiles.E05.nome = nE05;
    if (mE05 > 0) AppState.profiles.E05.metaHorasSemanais = mE05;

    const gKey = document.getElementById('cfgGeminiKey')?.value?.trim();
    const gModel = document.getElementById('cfgGeminiModel')?.value;
    if (typeof gKey === 'string') {
      AppState.config.geminiApiKey = gKey;
      localStorage.setItem('sefaz_gemini_key', gKey);
    }
    if (gModel) {
      AppState.config.geminiModel = gModel;
      localStorage.setItem('sefaz_gemini_model', gModel);
    }

    saveProfilesData();
    renderApp();
    showToast('Ajustes salvos com sucesso.', 'success');
  });

  // Sliders Simulador FCC
  ['simP1Acertos','simP2Acertos','simMediaP1','simMediaP2','simDesvioP1','simDesvioP2'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      const el = document.getElementById(id);
      const vEl = document.getElementById(`${id}Val`);
      if (el && vEl) vEl.textContent = el.value;
      updateSimulatorCalculations();
    });
  });

  // Meta semanal
  document.getElementById('metaHorasInput')?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && val <= 100) {
      getCurrentProfile().metaHorasSemanais = val;
      saveProfilesData();
      renderDashboardMetrics();
    }
  });

  // Cronômetro / Timer
  document.getElementById('btnTimerStart')?.addEventListener('click', () => {
    getAudioContext();
    startTimer();
  });
  document.getElementById('btnTimerPause')?.addEventListener('click', pauseTimer);
  document.getElementById('btnTimerPauseFocus')?.addEventListener('click', () => {
    if (AppState.timer.isRunning) pauseTimer(); else startTimer();
  });
  document.getElementById('btnTimerReset')?.addEventListener('click', resetTimer);

  document.querySelectorAll('.timer-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setTimerMode(btn.dataset.mode);
    });
  });

  // Foco Total
  document.getElementById('btnFocusMode')?.addEventListener('click', toggleFocusMode);
  document.getElementById('btnExitFocus')?.addEventListener('click', toggleFocusMode);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && AppState.timer.isFocusMode) {
      AppState.timer.isFocusMode = false;
      document.body.classList.remove('focus-mode');
    }
  });

  // Registro manual
  document.getElementById('btnSaveManualSession')?.addEventListener('click', saveManualSession);

  // Modal de notas
  document.getElementById('btnCloseNoteModal')?.addEventListener('click', closeNoteModal);
  document.getElementById('noteModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeNoteModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('noteModal')?.classList.contains('open')) {
      closeNoteModal();
    }
  });
  document.getElementById('noteTextarea')?.addEventListener('input', (e) => {
    if (!AppState.noteModalKey) return;
    const profile = getCurrentProfile();
    if (!profile.notes) profile.notes = {};
    profile.notes[AppState.noteModalKey] = e.target.value;
    saveProfilesData();
  });

  // Modal de Estudo (Teoria, Resumo, Flashcards)
  document.getElementById('btnCloseStudyModal')?.addEventListener('click', closeTopicStudyModal);
  document.getElementById('topicStudyModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTopicStudyModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('topicStudyModal')?.classList.contains('open')) {
      closeTopicStudyModal();
    }
  });

  document.querySelectorAll('.study-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchStudyTab(btn.dataset.tab));
  });

  document.getElementById('studyNoteTextarea')?.addEventListener('input', (e) => {
    const key = AppState.studyModal?.key;
    if (!key) return;
    const profile = getCurrentProfile();
    if (!profile.notes) profile.notes = {};
    profile.notes[key] = e.target.value;
    saveProfilesData();
  });

  ['teoria', 'resumo', 'questoes', 'revisao'].forEach(campo => {
    const btn = document.getElementById(`btnToggle${campo.charAt(0).toUpperCase() + campo.slice(1)}Done`);
    if (btn) {
      btn.addEventListener('click', () => toggleStudyModalField(campo));
    }
  });

  document.getElementById('btnPraticarFCC')?.addEventListener('click', practiceTopicQuestions);

  // Ações de IA no Modal de Estudo
  document.getElementById('btnAiExplainTopic')?.addEventListener('click', () => handleAiAction('explain'));
  document.getElementById('btnAiGenerateQuestion')?.addEventListener('click', () => handleAiAction('question'));
  document.getElementById('btnAiMnemonic')?.addEventListener('click', () => handleAiAction('mnemonic'));
  document.getElementById('btnCopyAiResponse')?.addEventListener('click', () => {
    const content = document.getElementById('aiResponseContent');
    if (content && content.innerText) {
      navigator.clipboard.writeText(content.innerText);
      showToast('Resposta da IA copiada!', 'success');
    }
  });

  // Configurações e teste da IA Gemini
  document.getElementById('btnToggleGeminiKeyVisibility')?.addEventListener('click', () => {
    const input = document.getElementById('cfgGeminiKey');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('btnTestGemini')?.addEventListener('click', checkGeminiStatus);

  // Edição de nome inline
  document.addEventListener('click', (e) => {
    if (e.target?.id === 'btnEditNameInline') {
      const profile = getCurrentProfile();
      const novo = prompt('Nome do estudante para este perfil:', profile.nome);
      if (novo?.trim()) {
        profile.nome = novo.trim();
        saveProfilesData();
        renderUserBanner();
        renderStudyLogs();
        showToast('Nome atualizado!', 'success');
      }
    }
  });
}

/* ============================================================
   INTEGRAÇÃO & HANDLERS DA INTELIGÊNCIA ARTIFICIAL GEMINI
============================================================ */
async function checkGeminiStatus() {
  const statusEl = document.getElementById('geminiConnectionStatus');
  const key = document.getElementById('cfgGeminiKey')?.value?.trim();
  const model = document.getElementById('cfgGeminiModel')?.value || 'gemini-2.5-flash-lite';

  if (statusEl) {
    statusEl.innerHTML = '<span style="color:var(--accent);">⏳ Verificando servidor Vercel / Google AI...</span>';
  }

  // 1. Verifica se a Vercel Serverless Function está ativa com a variável GEMINI_API_KEY
  try {
    const testResp = await fetch('/api/gemini');
    if (testResp.ok) {
      const info = await testResp.json();
      if (info.serverKeyConfigured) {
        if (statusEl) {
          statusEl.innerHTML = '<span style="color:#10b981;font-weight:600;">🟢 Ativo na Vercel (Chave protegida no servidor)</span>';
        }
        showToast('IA ativa e protegida na Vercel!', 'success');
        return;
      }
    }
  } catch (err) {
    // Continua para o teste via client-side / chave direta
  }

  // 2. Se não estiver na Vercel ou não houver chave no servidor, testa com a chave inserida
  if (typeof SEFAZ_AI !== 'undefined') {
    const res = await SEFAZ_AI.testConnection(key, model);
    if (statusEl) {
      if (res.success) {
        statusEl.innerHTML = `<span style="color:#10b981;font-weight:600;">🟢 Conexão OK (${res.source === 'vercel-gateway' ? 'Vercel Serverless' : 'Google AI Studio'})</span>`;
        showToast('Conexão com Gemini estabelecida com sucesso!', 'success');
      } else {
        statusEl.innerHTML = `<span style="color:#ef4444;font-weight:600;">🔴 ${res.error || 'Aguardando GEMINI_API_KEY na Vercel'}</span>`;
        showToast(res.error || 'Configure GEMINI_API_KEY na Vercel.', 'info', 5000);
      }
    }
  }
}

async function handleAiAction(type) {
  const modalData = AppState.studyModal;
  if (!modalData?.key) return;

  const profile = getCurrentProfile();
  const data = getTopicData(profile.cargoCodigo, modalData.discId, modalData.topicIdx);
  if (!data) return;

  const container = document.getElementById('aiResponseContainer');
  const loading = document.getElementById('aiResponseLoading');
  const content = document.getElementById('aiResponseContent');
  const titleEl = document.getElementById('aiResponseTitle');

  if (!container || !loading || !content) return;

  container.style.display = 'block';
  loading.style.display = 'flex';
  content.innerHTML = '';

  const buttons = document.querySelectorAll('.btn-ai-action');
  buttons.forEach(b => b.disabled = true);

  try {
    let result;
    if (type === 'explain') {
      if (titleEl) titleEl.textContent = `📖 Explicação FCC: ${data.nome}`;
      result = await SEFAZ_AI.explainTopic(data.nome, data.disc.nome);
    } else if (type === 'question') {
      if (titleEl) titleEl.textContent = `🎯 Questão Inédita FCC: ${data.nome}`;
      result = await SEFAZ_AI.generateQuestion(data.nome, data.disc.nome);
    } else {
      if (titleEl) titleEl.textContent = `💡 Mnemônicos & Dicas FCC: ${data.nome}`;
      const prompt = `Crie mnemônicos inteligentes, palavras-chave e esquemas comparativos para memorização do tópico:\nDisciplina: ${data.disc.nome}\nTópico: ${data.nome}`;
      result = await SEFAZ_AI.generate({
        prompt,
        systemInstruction: SEFAZ_AI.SYSTEM_INSTRUCTIONS.tutorFCC,
        temperature: 0.4
      });
    }

    loading.style.display = 'none';

    if (result.success) {
      content.innerHTML = renderStudyContent(result.text, '');
    } else {
      content.innerHTML = `
        <div class="study-callout atencao">
          <strong>Atenção:</strong> ${result.error}
          ${result.needsApiKey ? '<br><br><small>Dica: Na Vercel, configure a variável <code>GEMINI_API_KEY</code> em <b>Project Settings -> Environment Variables</b>.</small>' : ''}
        </div>
      `;
    }
  } catch (err) {
    loading.style.display = 'none';
    content.innerHTML = `<div class="study-callout atencao"><strong>Erro:</strong> ${err.message}</div>`;
  } finally {
    buttons.forEach(b => b.disabled = false);
  }
}

function populateConfigInputs() {
  const nA01 = document.getElementById('cfgNomeA01');
  const mA01 = document.getElementById('cfgMetaA01');
  const nE05 = document.getElementById('cfgNomeE05');
  const mE05 = document.getElementById('cfgMetaE05');
  const cfgTheme = document.getElementById('configThemeSelect');
  const cfgSound = document.getElementById('configSoundSelect');
  const cfgPomo = document.getElementById('configPomoDuration');

  if (nA01) nA01.value = AppState.profiles.A01.nome;
  if (mA01) mA01.value = AppState.profiles.A01.metaHorasSemanais || 25;
  if (nE05) nE05.value = AppState.profiles.E05.nome;
  if (mE05) mE05.value = AppState.profiles.E05.metaHorasSemanais || 25;
  if (cfgTheme) cfgTheme.value = AppState.config.theme || 'emerald';
  if (cfgSound) cfgSound.value = AppState.config.sound || 'beep';
  if (cfgPomo) cfgPomo.value = AppState.config.pomoDuration || 25;

  const cfgGeminiKey = document.getElementById('cfgGeminiKey');
  const cfgGeminiModel = document.getElementById('cfgGeminiModel');
  if (cfgGeminiKey) cfgGeminiKey.value = AppState.config.geminiApiKey || '';
  if (cfgGeminiModel) cfgGeminiModel.value = AppState.config.geminiModel || 'gemini-2.5-flash-lite';
}

function renderApp() {
  updateProfileButtonsUI();
  renderUserBanner();
  renderGamificationBadges();
  renderDashboardMetrics();
  renderCronograma();
  renderSubjectHours();
  renderProgressChart();
  renderWeeklyChart();
  renderHeatmap();
  renderDashboardTips();
  renderEditalVerticalizado();
  renderTimerSubjectSelect();
  renderStudyLogs();
  renderTimerBadges();
  renderLegislacaoSC();
  updateSimulatorCalculations();
  renderRevisoes();
  populateConfigInputs();
  applyTheme(AppState.config.theme || 'emerald');
}

function updateProfileButtonsUI() {
  document.querySelectorAll('.profile-switch-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.profile === AppState.activeProfileKey);
    btn.classList.toggle('gold', btn.dataset.profile === 'E05');
  });
}

function renderUserBanner() {
  const banner = document.getElementById('userBannerContainer');
  if (!banner) return;
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const isE05 = profile.cargoCodigo === 'E05';

  banner.innerHTML = `
    <div class="cargo-banner ${isE05 ? 'e05' : ''}">
      <div class="cargo-banner-title">
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <h2>${ic(isE05 ? 'scale' : 'settings', 20)} ${profile.nome}</h2>
          <button id="btnEditNameInline" class="btn-action" style="padding:4px 10px;font-size:0.75rem;">Alterar Nome</button>
        </div>
        <p><strong>Cargo:</strong> Auditor Estadual de Finanças Públicas — <b>${cargo.codigo} (${cargo.nome})</b></p>
        <p style="font-size:0.82rem;color:var(--text-muted)"><strong>Posse:</strong> ${cargo.requisito}</p>
      </div>
      <div class="cargo-tags">
        <span class="badge-tag highlight">${ic('cash', 13)} ${EDITAL_DATA.info.remuneracao}</span>
        <span class="badge-tag">${ic('users', 13)} ${cargo.vagas.total} vagas</span>
        <span class="badge-tag">${ic('pin', 13)} Florianópolis/SC</span>
        <span class="badge-tag">${ic('briefcase', 13)} 40h/semana</span>
      </div>
    </div>`;
}

function renderDashboardMetrics() {
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];

  let totalTopicos = 0, teoria = 0, questoes = 0;
  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach((disc) => {
    disc.topicos.forEach((_, idx) => {
      totalTopicos++;
      const s = profile.progress[`${profile.cargoCodigo}_${disc.id}_${idx}`];
      if (s?.teoria)   teoria++;
      if (s?.questoes) questoes++;
    });
  });

  const percGeral = totalTopicos > 0 ? Math.round((teoria / totalTopicos) * 100) : 0;
  const percQ = totalTopicos > 0 ? Math.round((questoes / totalTopicos) * 100) : 0;
  const totalMin = (profile.studyLogs || []).reduce((a, l) => a + (l.minutes || 0), 0);

  const count = (profile.studyLogs || []).length;
  const sessLabel = `${count} ${count === 1 ? 'sessão' : 'sessões'}`;

  const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setEl('metricHorasEstudadas', `${(totalMin / 60).toFixed(1)}h`);
  setEl('metricSessoesFeitas', sessLabel);
  setEl('metricPercentualEdital', `${percGeral}%`);
  setEl('metricTopicosTotais', `${teoria}/${totalTopicos}`);
  setEl('metricExerciciosFeitos', `${percQ}%`);
  const bar = document.getElementById('metricProgressFill');
  if (bar) bar.style.width = `${percGeral}%`;

  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const horasSemana = (profile.studyLogs || [])
    .filter(l => (l._ts || 0) >= sevenDaysAgo)
    .reduce((a, l) => a + (l.minutes || 0), 0) / 60;
  const meta = profile.metaHorasSemanais || 25;
  const percMeta = Math.min(100, Math.round((horasSemana / meta) * 100));

  setEl('metricMetaPerc', `${percMeta}%`);
  setEl('metricMetaDetalhe', `${horasSemana.toFixed(1)}h / ${meta}h por semana`);
  const metaBar = document.getElementById('metricMetaFill');
  if (metaBar) metaBar.style.width = `${percMeta}%`;

  const metaInput = document.getElementById('metaHorasInput');
  if (metaInput) metaInput.value = meta;
}

const DICAS = {
  A01: [
    { icon: 'flame', title: 'Priorize a Prova 2 (Peso 2)', text: 'Com 100 questões e peso 2, P2 equivale a mais de 71% da nota total. Foque em Orçamento e LRF.' },
    { icon: 'chart', title: 'MTO 2027 e MCASP 9ª ed.', text: 'A FCC cobra normas e manuais vigentes. Tenha os PDFs em mãos e anote os prazos da LRF.' },
    { icon: 'gov', title: 'NBC TSP 34 — Custos', text: 'Nova norma de custos no setor público é alvo certo. Estude centros e métodos de custeio.' },
    { icon: 'bot', title: 'IA e LGPD no P1', text: 'BI, LLMs e LGPD caem no P1 — garanta pontos fáceis e rápidos nas questões de TI.' },
  ],
  E05: [
    { icon: 'scale', title: 'Controle de Constitucionalidade', text: 'FCC cobra difuso, concentrado e o controle estadual de SC. Aprofunde ADI, ADC e ADPF.' },
    { icon: 'gov', title: 'LC 412/2008 — RPPS/SC', text: 'Regime previdenciário estadual é matéria privativa do E05 e tem cobrança garantida.' },
    { icon: 'link', title: 'Lei 8.137/1990', text: 'Crimes contra a Ordem Tributária e Súmula Vinculante 24 do STF caem em quase toda prova FCC.' },
    { icon: 'bot', title: 'LGPD no Poder Público', text: 'Tratamento de dados pessoais pela Administração Pública e sanções da ANPD.' },
  ],
};

function renderDashboardTips() {
  const el = document.getElementById('dashboardTipsContainer');
  if (!el) return;
  el.innerHTML = (DICAS[AppState.activeProfileKey] || []).map(d =>
    `<li>${ic(d.icon, 16)} <b>${d.title}:</b> ${d.text}</li>`
  ).join('');
}

function renderProgressChart() {
  const container = document.getElementById('progressChartContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const allDiscs = [...cargo.p1.disciplinas, ...cargo.p2.disciplinas];

  const data = allDiscs.map((disc) => {
    let done = 0;
    disc.topicos.forEach((_, idx) => {
      if (profile.progress[`${profile.cargoCodigo}_${disc.id}_${idx}`]?.teoria) done++;
    });
    return { nome: disc.nome.length > 28 ? disc.nome.slice(0, 26) + '…' : disc.nome, perc: disc.topicos.length > 0 ? Math.round((done / disc.topicos.length) * 100) : 0 };
  }).sort((a, b) => a.perc - b.perc);

  const rowH = 32;
  const svgH = data.length * rowH + 10;
  const barW = 260;

  const rows = data.map((d, i) => {
    const y = i * rowH + 16;
    const fill = d.perc === 0 ? 'var(--bar-idle)' : d.perc === 100 ? 'var(--bar-done)' : 'var(--bar-prog)';
    const w = Math.max(2, Math.round((d.perc / 100) * barW));
    return `
      <g>
        <text x="0" y="${y + 5}" style="fill:var(--text-dim)" font-size="11" font-family="Public Sans,sans-serif">${d.nome}</text>
        <rect x="210" y="${y - 8}" width="${barW}" height="14" rx="4" style="fill:var(--bar-track)"/>
        <rect x="210" y="${y - 8}" width="${w}" height="14" rx="4" style="fill:${fill}"/>
        <text x="${210 + barW + 6}" y="${y + 4}" style="fill:var(--text-dim)" font-size="10" font-family="IBM Plex Mono,monospace">${d.perc}%</text>
      </g>`;
  }).join('');

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 490 ${svgH}" xmlns="http://www.w3.org/2000/svg">
      ${rows}
    </svg>`;
}

function renderWeeklyChart() {
  const container = document.getElementById('weeklyChartContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const meta = profile.metaHorasSemanais || 25;
  const metaDia = (meta / 5) * 60;

  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      dateStr: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      minutes: 0,
    });
  }

  (profile.studyLogs || []).forEach((log) => {
    const [day, month] = (log.date || '').split(' ')[0].split('/');
    const logStr = `${day}/${month}`;
    const found = days.find(d => d.dateStr === logStr);
    if (found) found.minutes += log.minutes || 0;
  });

  const maxMin = Math.max(metaDia * 1.5, ...days.map(d => d.minutes), 1);
  const barMaxH = 80;

  const bars = days.map((d, i) => {
    const h = Math.max(2, Math.round((d.minutes / maxMin) * barMaxH));
    const x = i * 58 + 14;
    const achieved = d.minutes >= metaDia;
    const fill = d.minutes === 0 ? 'var(--bar-idle)' : achieved ? 'var(--bar-done)' : 'var(--bar-warn)';
    const labelMin = d.minutes > 0 ? `${Math.round(d.minutes / 60 * 10) / 10}h` : '';
    return `
      <g>
        <rect x="${x}" y="${barMaxH - h + 10}" width="36" height="${h}" rx="4" style="fill:${fill}"/>
        <text x="${x + 18}" y="${barMaxH + 24}" style="fill:var(--text-dim2)" font-size="10" text-anchor="middle" font-family="IBM Plex Mono,monospace">${d.label}</text>
        <text x="${x + 18}" y="${barMaxH - h + 7}" style="fill:var(--text-dim)" font-size="9" text-anchor="middle" font-family="IBM Plex Mono,monospace">${labelMin}</text>
      </g>`;
  }).join('');

  const metaY = barMaxH - Math.round((metaDia / maxMin) * barMaxH) + 10;

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="${metaY}" x2="410" y2="${metaY}" style="stroke:var(--line-meta)" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="412" y="${metaY + 4}" style="fill:var(--text-meta)" font-size="9" font-family="IBM Plex Mono,monospace">meta</text>
      ${bars}
    </svg>`;
}

/* ============================================================
   EDITAL VERTICALIZADO (4A.3 BADGES FCC + FILTROS)
============================================================ */
function renderEditalVerticalizado() {
  const container = document.getElementById('editalContentArea');
  if (!container) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];

  function shouldShow(t, idx, disc) {
    const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
    const p = profile.progress[key] || {};
    const topicName = getTopicName(t);

    const matchSearch = AppState.searchTerm === '' ||
      topicName.toLowerCase().includes(AppState.searchTerm) ||
      disc.nome.toLowerCase().includes(AppState.searchTerm);
    if (!matchSearch) return false;

    if (AppState.filterStatus === 'pending')    return !p.teoria || !p.questoes;
    if (AppState.filterStatus === 'done')       return !!(p.teoria && p.questoes);
    if (AppState.filterStatus === 'untouched')  return !p.teoria && !p.resumo && !p.questoes && !p.revisao;
    if (AppState.filterStatus === 'with-notes') return !!(profile.notes?.[key]);
    if (AppState.filterStatus === 'fcc-high')   return getTopicFccFreq(topicName, disc.id) === 'alta';
    return true;
  }

  function renderBloco(provaObj, isP2) {
    let html = `
      <div class="prova-section">
        <div class="prova-section-header ${isP2 ? 'p2' : ''}">
          <div class="prova-title">${ic(isP2 ? 'target' : 'doc', 16)}<span>${provaObj.nome} — ${provaObj.questoes}Q (Peso ${provaObj.peso})</span></div>
          <span class="badge-tag">${provaObj.duracao}</span>
        </div>`;

    provaObj.disciplinas.forEach((disc) => {
      const visible = disc.topicos.filter((t, idx) => shouldShow(t, idx, disc));
      const hasFilter = AppState.searchTerm !== '' || AppState.filterStatus !== 'all';
      if (hasFilter && visible.length === 0) return;

      let teoriaCount = 0;
      disc.topicos.forEach((_, idx) => {
        if (profile.progress[`${profile.cargoCodigo}_${disc.id}_${idx}`]?.teoria) teoriaCount++;
      });
      const perc = Math.round((teoriaCount / disc.topicos.length) * 100);
      const cardId = `card-${disc.id}`;
      const isOpen = AppState.openCards.has(cardId);

      html += `
        <div class="disciplina-card ${disc.destaque ? 'destaque' : ''} ${isOpen ? 'open' : ''}" id="${cardId}">
          <div class="disciplina-header" onclick="toggleDisciplinaCard('${cardId}')">
            <div class="disciplina-title-group">
              <span class="expand-icon"></span>
              <span class="disciplina-title">${disc.nome}${disc.destaque ? '<span class="destaque-dot" title="Disciplina de destaque"></span>' : ''}</span>
            </div>
            <div class="disciplina-stats-row">
              <span class="disciplina-stats">${teoriaCount}/${disc.topicos.length} (${perc}%)</span>
              <div class="disc-mini-bar"><div class="disc-mini-bar-fill" style="width:${perc}%"></div></div>
              <button class="btn-mark-all" onclick="event.stopPropagation(); markAllDisciplina('${disc.id}','${profile.cargoCodigo}')" title="Marcar todos">Marcar todos</button>
            </div>
          </div>
          <div class="topicos-list">`;

      disc.topicos.forEach((topico, idx) => {
        const topicName = getTopicName(topico);
        if (hasFilter && !visible.some(v => getTopicName(v) === topicName)) return;
        const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
        const prog = profile.progress[key] || {};
        const hasNote = !!(profile.notes?.[key]);
        const freq = getTopicFccFreq(topicName, disc.id);

        let freqBadge = '';
        if (freq === 'alta') {
          freqBadge = `<span class="fcc-badge alta" title="Alta incidência histórica na banca FCC">Alta FCC</span>`;
        } else if (freq === 'media') {
          freqBadge = `<span class="fcc-badge media" title="Média incidência FCC">Média</span>`;
        }

        html += `
          <div class="topico-item" data-key="${key}">
            <div class="topico-texto clickable" onclick="openTopicStudyModal('${disc.id}', ${idx})" title="Clique para abrir Teoria, Resumo e Flashcard deste tópico">
              <span style="color:var(--text-muted);font-size:0.78rem;margin-right:6px;">#${idx + 1}</span>
              <span>${topicName}</span>${freqBadge}
              <button class="btn-topic-study" onclick="event.stopPropagation(); openTopicStudyModal('${disc.id}', ${idx})" title="Abrir conteúdo pedagógico">
                ${ic('book', 12)} Estudar
              </button>
            </div>
            <div class="topico-acoes">
              <label class="check-label ${prog.teoria   ? 'checked' : ''}" data-key="${key}" data-campo="teoria">Teoria</label>
              <label class="check-label ${prog.resumo   ? 'checked' : ''}" data-key="${key}" data-campo="resumo">Resumo</label>
              <label class="check-label ${prog.questoes ? 'checked' : ''}" data-key="${key}" data-campo="questoes">Questões</label>
              <label class="check-label ${prog.revisao  ? 'checked' : ''}" data-key="${key}" data-campo="revisao">Revisão</label>
              <button class="btn-note ${hasNote ? 'has-note' : ''}" onclick="openNoteModal('${key}')" title="${hasNote ? 'Editar anotação' : 'Adicionar anotação'}">${ic('note', 14)}</button>
            </div>
          </div>`;
      });

      html += `</div></div>`;
    });

    html += `</div>`;
    return html;
  }

  container.innerHTML = renderBloco(cargo.p1, false) + renderBloco(cargo.p2, true);
  container.addEventListener('click', handleCheckLabelClick, { once: true });
}

function handleCheckLabelClick(e) {
  const label = e.target.closest('.check-label');
  if (label) {
    const { key, campo } = label.dataset;
    if (!key || !campo) return;
    const profile = getCurrentProfile();
    if (!profile.progress[key]) profile.progress[key] = { teoria: false, resumo: false, questoes: false, revisao: false };
    const newVal = !profile.progress[key][campo];
    profile.progress[key][campo] = newVal;

    if (campo === 'teoria' && newVal) {
      if (!profile.progress[key]._teoriaDate) {
        profile.progress[key]._teoriaDate = localDateKey(new Date());
      }
    } else if (campo === 'teoria' && !newVal) {
      delete profile.progress[key]._teoriaDate;
    }

    label.classList.toggle('checked', newVal);
    saveProfilesData();
    renderDashboardMetrics();
    renderWeeklyChart();
    renderCronograma();
    renderGamificationBadges();
    updateDiscMiniBar(key);
  }
  const container = document.getElementById('editalContentArea');
  if (container) container.addEventListener('click', handleCheckLabelClick, { once: true });
}

function updateDiscMiniBar(key) {
  const parts = key.split('_');
  if (parts.length < 3) return;
  const cargoCodigo = parts[0];
  const discId = parts.slice(1, -1).join('_');
  const cardId = `card-${discId}`;
  const card = document.getElementById(cardId);
  if (!card) return;
  const profile = getCurrentProfile();
  const allDiscs = [...EDITAL_DATA.cargos[cargoCodigo].p1.disciplinas, ...EDITAL_DATA.cargos[cargoCodigo].p2.disciplinas];
  const disc = allDiscs.find(d => d.id === discId);
  if (!disc) return;
  let count = 0;
  disc.topicos.forEach((_, i) => { if (profile.progress[`${cargoCodigo}_${discId}_${i}`]?.teoria) count++; });
  const perc = Math.round((count / disc.topicos.length) * 100);
  const statsEl = card.querySelector('.disciplina-stats');
  const barFill  = card.querySelector('.disc-mini-bar-fill');
  if (statsEl) statsEl.textContent = `${count}/${disc.topicos.length} (${perc}%)`;
  if (barFill)  barFill.style.width = `${perc}%`;
}

window.toggleDisciplinaCard = function(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  card.classList.toggle('open') ? AppState.openCards.add(cardId) : AppState.openCards.delete(cardId);
  saveProfilesData();
};

window.markAllDisciplina = function(discId, cargoCodigo) {
  const profile = getCurrentProfile();
  const allDiscs = [...EDITAL_DATA.cargos[cargoCodigo].p1.disciplinas, ...EDITAL_DATA.cargos[cargoCodigo].p2.disciplinas];
  const disc = allDiscs.find(d => d.id === discId);
  if (!disc) return;
  const allDone = disc.topicos.every((_, i) => {
    const p = profile.progress[`${cargoCodigo}_${discId}_${i}`];
    return p?.teoria && p?.revisao;
  });
  disc.topicos.forEach((_, i) => {
    const k = `${cargoCodigo}_${discId}_${i}`;
    if (!profile.progress[k]) profile.progress[k] = { teoria: false, resumo: false, questoes: false, revisao: false };
    profile.progress[k].teoria  = !allDone;
    profile.progress[k].revisao = !allDone;
    if (!allDone && !profile.progress[k]._teoriaDate) profile.progress[k]._teoriaDate = localDateKey(new Date());
    if (allDone)  delete profile.progress[k]._teoriaDate;
  });
  saveProfilesData();
  renderDashboardMetrics();
  renderEditalVerticalizado();
  renderCronograma();
  renderGamificationBadges();
  showToast(allDone ? 'Marcações removidas.' : 'Todos os tópicos marcados.', 'success');
};

/* ============================================================
   MODAL DE ANOTAÇÕES / FLASHCARD (F3.2)
============================================================ */
window.openNoteModal = function(key) {
  AppState.noteModalKey = key;
  const profile = getCurrentProfile();
  const modal = document.getElementById('noteModal');
  const textarea = document.getElementById('noteTextarea');
  if (!modal || !textarea) return;
  textarea.value = profile.notes?.[key] || '';
  modal.classList.add('open');
  textarea.focus();
};

function closeNoteModal() {
  AppState.noteModalKey = null;
  const modal = document.getElementById('noteModal');
  if (modal) modal.classList.remove('open');
  renderEditalVerticalizado();
  renderGamificationBadges();
}

/* ============================================================
   MODAL DE CONTEÚDO DE ESTUDO (TEORIA, RESUMO, FLASHCARD)
============================================================ */
window.openTopicStudyModal = function(discId, topicIdx) {
  const profile = getCurrentProfile();
  const data = getTopicData(profile.cargoCodigo, discId, topicIdx);
  if (!data) return;

  const key = `${profile.cargoCodigo}_${discId}_${topicIdx}`;
  AppState.studyModal = { discId, topicIdx, key };

  const modal = document.getElementById('topicStudyModal');
  if (!modal) return;

  // Cabeçalho
  const titleEl = document.getElementById('studyModalTitle');
  const discEl = document.getElementById('studyModalDisc');
  const badgeEl = document.getElementById('studyModalFreqBadge');

  if (titleEl) titleEl.textContent = data.nome;
  if (discEl) discEl.textContent = data.disc.nome;

  const freq = getTopicFccFreq(data.nome, discId);
  if (badgeEl) {
    if (freq === 'alta') {
      badgeEl.innerHTML = `<span class="fcc-badge alta" title="Alta incidência histórica na FCC">Alta FCC</span>`;
    } else if (freq === 'media') {
      badgeEl.innerHTML = `<span class="fcc-badge media" title="Média incidência FCC">Média FCC</span>`;
    } else {
      badgeEl.innerHTML = `<span class="fcc-badge baixa" title="Baixa incidência FCC">Baixa FCC</span>`;
    }
  }

  // Teoria
  const teoriaEl = document.getElementById('studyTeoriaContent');
  if (teoriaEl) {
    teoriaEl.innerHTML = renderStudyContent(
      data.teoria,
      '📖 <strong>Teoria completa em elaboração</strong> para este tópico do edital.'
    );
  }

  // Resumo
  const resumoEl = document.getElementById('studyResumoContent');
  if (resumoEl) {
    resumoEl.innerHTML = renderStudyContent(
      data.resumo,
      '📝 <strong>Resumo esquematizado em elaboração</strong> para revisão rápida.'
    );
  }

  // Flashcard
  const flashEl = document.getElementById('studyFlashcardContent');
  if (flashEl) {
    if (data.flashcard) {
      const pergunta = typeof data.flashcard === 'object' ? data.flashcard.pergunta : 'Desafio / Conceito-Chave:';
      const resposta = typeof data.flashcard === 'object' ? data.flashcard.resposta : data.flashcard;
      flashEl.innerHTML = `
        <div class="study-card-box pergunta">
          <div class="label-header">${ic('target', 14)} Desafio / O que a FCC cobra:</div>
          <div>${pergunta}</div>
        </div>
        <div class="study-card-box resposta">
          <div class="label-header" style="color:#60a5fa;">${ic('check', 14)} Resposta / Fundamento Doutrinário e Legal:</div>
          <div>${resposta}</div>
        </div>
      `;
    } else if (data.resumo) {
      flashEl.innerHTML = `
        <div class="study-card-box pergunta">
          <div class="label-header">${ic('target', 14)} Tópico de Revisão:</div>
          <div><strong>${data.nome}</strong></div>
        </div>
        <div class="study-card-box resposta">
          <div class="label-header" style="color:#60a5fa;">${ic('check', 14)} Pontos Fundamentais:</div>
          <div>${renderStudyContent(data.resumo, '')}</div>
        </div>
      `;
    } else {
      flashEl.innerHTML = `
        <div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
          <p style="font-size:0.95rem;margin-bottom:0.5rem;color:var(--text);">💡 <strong>Flashcard FCC em elaboração</strong> para este tópico.</p>
          <span style="font-size:0.8rem;opacity:0.75;">Adicione suas anotações na aba ao lado para memorização ativa!</span>
        </div>
      `;
    }
  }

  // Anotações
  const noteArea = document.getElementById('studyNoteTextarea');
  if (noteArea) {
    noteArea.value = profile.notes?.[key] || '';
  }

  // Sync Footer Status
  syncStudyModalFooterButtons(key);

  // Tab ativa inicial (teoria)
  switchStudyTab('teoria');

  modal.classList.add('open');
};

window.closeTopicStudyModal = function() {
  const modal = document.getElementById('topicStudyModal');
  if (modal) modal.classList.remove('open');
  AppState.studyModal = { discId: null, topicIdx: null, key: null };
  renderEditalVerticalizado();
  renderGamificationBadges();
  renderDashboardMetrics();
};

function switchStudyTab(tabName) {
  document.querySelectorAll('.study-tab-btn').forEach(btn => {
    const isTarget = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });
  document.querySelectorAll('.study-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `studyTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  });
}

function syncStudyModalFooterButtons(key) {
  const profile = getCurrentProfile();
  const prog = profile.progress[key] || {};
  ['teoria', 'resumo', 'questoes', 'revisao'].forEach(campo => {
    const btn = document.getElementById(`btnToggle${campo.charAt(0).toUpperCase() + campo.slice(1)}Done`);
    if (btn) {
      btn.classList.toggle('checked', !!prog[campo]);
    }
  });
}

function toggleStudyModalField(campo) {
  const key = AppState.studyModal?.key;
  if (!key) return;
  const profile = getCurrentProfile();
  if (!profile.progress[key]) {
    profile.progress[key] = { teoria: false, resumo: false, questoes: false, revisao: false };
  }
  const newVal = !profile.progress[key][campo];
  profile.progress[key][campo] = newVal;

  if (campo === 'teoria' && newVal) {
    if (!profile.progress[key]._teoriaDate) {
      profile.progress[key]._teoriaDate = localDateKey(new Date());
    }
  } else if (campo === 'teoria' && !newVal) {
    delete profile.progress[key]._teoriaDate;
  }

  saveProfilesData();
  syncStudyModalFooterButtons(key);
  showToast(newVal ? `${campo.charAt(0).toUpperCase() + campo.slice(1)} marcado!` : `${campo.charAt(0).toUpperCase() + campo.slice(1)} desmarcado.`);
}

function practiceTopicQuestions() {
  const discId = AppState.studyModal?.discId;
  closeTopicStudyModal();
  switchTab('mock-exam');
  if (discId) {
    const sel = document.getElementById('mockFilterDisciplina');
    if (sel) {
      const hasOption = Array.from(sel.options).some(o => o.value === discId);
      if (hasOption) {
        sel.value = discId;
        sel.dispatchEvent(new Event('change'));
      }
    }
  }
}

/* ============================================================
   SIMULADOR FCC + CURVA NORMAL (F2.3)
============================================================ */
function updateSimulatorCalculations() {
  const get = (id, fb) => parseFloat(document.getElementById(id)?.value ?? fb);
  const acertosP1 = get('simP1Acertos', 60);
  const acertosP2 = get('simP2Acertos', 75);
  const mediaP1   = get('simMediaP1', 48);
  const mediaP2   = get('simMediaP2', 60);
  const desvioP1  = Math.max(0.1, get('simDesvioP1', 8));
  const desvioP2  = Math.max(0.1, get('simDesvioP2', 10));

  const np1 = (((acertosP1 - mediaP1) / desvioP1) * 10) + 50;
  const np2 = (((acertosP2 - mediaP2) / desvioP2) * 10) + 50;
  const notaFinal = np1 + np2 * 2;

  const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setEl('resNP1', np1.toFixed(2));
  setEl('resNP2', np2.toFixed(2));
  setEl('resNotaFinal', notaFinal.toFixed(2));

  const statusEl = document.getElementById('resStatusTag');
  if (statusEl) {
    statusEl.className = `status-tag ${notaFinal >= 150 ? 'approved' : 'disapproved'}`;
    statusEl.textContent = notaFinal >= 150 ? 'HABILITADO (≥ 150 pts)' : `ELIMINADO (${notaFinal.toFixed(1)} < 150 pts)`;
  }

  const z1 = (np1 - 50) / 10;
  const z2 = (np2 - 50) / 10;
  const perc1 = Math.round(zToPercentile(z1) * 100);
  const perc2 = Math.round(zToPercentile(z2) * 100);
  setEl('resPerc1', `Percentil estimado P1: ${perc1}º`);
  setEl('resPerc2', `Percentil estimado P2: ${perc2}º`);

  renderNormalCurve('normalCurveP1', z1, 'var(--primary-light)');
  renderNormalCurve('normalCurveP2', z2, 'var(--accent-gold)');
}

function zToPercentile(z) {
  const b = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  let poly = 0;
  let tp = t;
  b.forEach(bi => { poly += bi * tp; tp *= t; });
  const phi = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
  return z >= 0 ? phi : 1 - phi;
}

function renderNormalCurve(containerId, z, color) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const W = 280, H = 80;
  const zMin = -3.5, zMax = 3.5, pts = 120;
  const normal = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const peak = normal(0);

  const toX = (zv) => ((zv - zMin) / (zMax - zMin)) * W;
  const toY = (y) => H - 8 - ((y / peak) * (H - 20));

  let pathD = '';
  for (let i = 0; i <= pts; i++) {
    const zv = zMin + (i / pts) * (zMax - zMin);
    const x = toX(zv), y = toY(normal(zv));
    pathD += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }

  const zClamped = Math.max(zMin, Math.min(zMax, z));
  const from = z >= 0 ? 0 : zClamped;
  const to   = z >= 0 ? zClamped : 0;
  let areaD = `M${toX(from).toFixed(1)},${H - 8}`;
  const steps = Math.round(Math.abs(to - from) * 20) || 2;
  for (let i = 0; i <= steps; i++) {
    const zv = from + (i / steps) * (to - from);
    areaD += ` L${toX(zv).toFixed(1)},${toY(normal(zv)).toFixed(1)}`;
  }
  areaD += ` L${toX(to).toFixed(1)},${H - 8} Z`;

  const xZ = toX(zClamped);
  const percVal = Math.round(zToPercentile(z) * 100);
  const np = (z * 10 + 50).toFixed(1);

  el.innerHTML = `
    <svg width="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <path d="${areaD}" style="fill:${color}" opacity="0.18"/>
      <path d="${pathD}" fill="none" style="stroke:${color}" stroke-width="2" opacity="0.8"/>
      <line x1="${xZ.toFixed(1)}" y1="5" x2="${xZ.toFixed(1)}" y2="${H - 8}" style="stroke:${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="${Math.min(W - 60, Math.max(4, xZ - 20))}" y="15" style="fill:${color}" font-size="10" font-family="IBM Plex Mono,monospace">NP ${np}</text>
      <text x="${Math.min(W - 60, Math.max(4, xZ - 20))}" y="27" style="fill:var(--text-dim)" font-size="9" font-family="IBM Plex Mono,monospace">${percVal}º pct</text>
      <line x1="${toX(0)}" y1="${H-8}" x2="${toX(0)}" y2="5" style="stroke:var(--line-strong)" stroke-width="1"/>
    </svg>`;
}

/* ============================================================
   TIMER & SESSÕES DE ESTUDO
============================================================ */
const CIRCUMFERENCE = 565.48;

function setTimerMode(mode) {
  AppState.timer.mode = mode;
  pauseTimer();
  const defaultPomo = (AppState.config.pomoDuration || 25) * 60;
  const modeS = { pomodoro: defaultPomo, shortBreak: 300, longBreak: 900, stopwatch: 0 };
  AppState.timer.totalSeconds     = modeS[mode] ?? defaultPomo;
  AppState.timer.remainingSeconds = AppState.timer.totalSeconds;
  AppState.timer.elapsedSeconds   = 0;
  updateTimerDisplay();
}

function startTimer() {
  if (AppState.timer.isRunning) return;
  AppState.timer.isRunning = true;
  document.getElementById('btnTimerStart').style.display = 'none';
  document.getElementById('btnTimerPause').style.display = 'inline-flex';

  AppState.timer.intervalId = setInterval(() => {
    AppState.timer.elapsedSeconds++;
    if (AppState.timer.mode === 'stopwatch') {
      AppState.timer.remainingSeconds++;
    } else {
      AppState.timer.remainingSeconds--;
      if (AppState.timer.remainingSeconds <= 0) { completeTimerSession(); return; }
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  AppState.timer.isRunning = false;
  clearInterval(AppState.timer.intervalId);
  AppState.timer.intervalId = null;
  const startBtn = document.getElementById('btnTimerStart');
  const pauseBtn = document.getElementById('btnTimerPause');
  if (startBtn) startBtn.style.display = 'inline-flex';
  if (pauseBtn) pauseBtn.style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  AppState.timer.remainingSeconds = AppState.timer.totalSeconds;
  AppState.timer.elapsedSeconds   = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const { remainingSeconds, mode, totalSeconds, elapsedSeconds } = AppState.timer;
  const displaySec = mode === 'stopwatch' ? elapsedSeconds : remainingSeconds;
  const m = Math.floor(Math.abs(displaySec) / 60);
  const s = Math.abs(displaySec) % 60;
  const str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const display = document.getElementById('timerDisplay');
  const displayFocus = document.getElementById('timerDisplayFocus');
  if (display) display.textContent = str;
  if (displayFocus) displayFocus.textContent = str;

  const circle = document.getElementById('timerCircleProgress');
  const circleFocus = document.getElementById('timerCircleProgressFocus');
  const modeLabel = document.getElementById('timerModeLabel');

  if (circle) {
    if (mode === 'stopwatch') {
      circle.classList.add('stopwatch-mode');
      circle.style.strokeDasharray = CIRCUMFERENCE;
      circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - (elapsedSeconds % 60) / 60);
    } else {
      circle.classList.remove('stopwatch-mode');
      const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
      circle.style.strokeDasharray = CIRCUMFERENCE;
      circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - Math.max(0, progress));
    }
  }

  if (circleFocus) {
    const circFocus = 753.98;
    const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
    circleFocus.style.strokeDasharray = circFocus;
    circleFocus.style.strokeDashoffset = circFocus * (1 - Math.max(0, progress));
  }

  const labels = { pomodoro:'Foco', shortBreak:'Pausa Curta', longBreak:'Pausa Longa', stopwatch:'Cronômetro Livre' };
  if (modeLabel) modeLabel.textContent = labels[mode] ?? '';
}

function completeTimerSession() {
  const minutes = Math.max(1, Math.round(AppState.timer.elapsedSeconds / 60));
  pauseTimer();
  playBeep();
  sendNotification('Sessão de foco concluída', `Você completou ${minutes} minutos de foco.`);
  registerStudySession(minutes);
  showToast(`${minutes} min registrados para ${getCurrentProfile().nome}.`, 'success', 5000);
  resetTimer();
}

function registerStudySession(minutes) {
  const subject = document.getElementById('timerSubjectSelect')?.value || 'Estudo Geral';
  const profile = getCurrentProfile();
  if (!profile.studyLogs) profile.studyLogs = [];
  const entry = {
    id: Date.now(),
    _ts: Date.now(),
    date: new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }),
    minutes,
    subject,
    manual: false,
  };
  profile.studyLogs.unshift(entry);
  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
  renderWeeklyChart();
  renderSubjectHours();
  renderHeatmap();
  renderGamificationBadges();
  renderTimerBadges();
  renderCalendar();
}

function renderTimerBadges() {
  const el = document.getElementById('timerStatsBadges');
  if (!el) return;
  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];
  const todayStr = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
  const sevenAgo = Date.now() - 7 * 86400000;

  const hojeMins = logs.filter(l => (l.date || '').startsWith(todayStr)).reduce((a, l) => a + l.minutes, 0);
  const semanaMins = logs.filter(l => (l._ts || 0) >= sevenAgo).reduce((a, l) => a + l.minutes, 0);

  el.innerHTML = `
    <span class="badge-tag" title="Minutos estudados hoje">
      ${ic('sun', 12)} Hoje: <strong>${Math.round(hojeMins)}min</strong>
    </span>
    <span class="badge-tag highlight" title="Horas nos últimos 7 dias">
      ${ic('chart', 12)} 7 dias: <strong>${(semanaMins/60).toFixed(1)}h</strong>
    </span>`;
}

function saveManualSession() {
  const minEl = document.getElementById('manualMinutes');
  const subjEl = document.getElementById('manualSubjectSelect');
  if (!minEl || !subjEl) return;
  const minutes = parseInt(minEl.value, 10);
  if (!minutes || minutes < 1 || minutes > 600) {
    showToast('Informe um tempo válido (1–600 min).', 'warning');
    return;
  }
  const profile = getCurrentProfile();
  if (!profile.studyLogs) profile.studyLogs = [];
  profile.studyLogs.unshift({
    id: Date.now(),
    _ts: Date.now(),
    date: new Date().toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }),
    minutes,
    subject: subjEl.value || 'Estudo Geral',
    manual: true,
  });
  minEl.value = '';
  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
  renderWeeklyChart();
  renderSubjectHours();
  renderHeatmap();
  renderGamificationBadges();
  renderTimerBadges();
  renderCalendar();
  showToast(`${minutes} min registrados manualmente.`, 'success');
}

function renderTimerSubjectSelect() {
  ['timerSubjectSelect','manualSubjectSelect'].forEach((sid) => {
    const sel = document.getElementById(sid);
    if (!sel) return;
    const profile = getCurrentProfile();
    const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
    let h = `<option value="Revisão Geral / Simulado FCC">Revisão Geral / Simulado</option>`;
    [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(d => {
      h += `<option value="${d.nome}">${d.nome}</option>`;
    });
    sel.innerHTML = h;
  });
}

window.deleteStudyLog = function(id) {
  const profile = getCurrentProfile();
  profile.studyLogs = (profile.studyLogs || []).filter(l => l.id !== id);
  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
  renderWeeklyChart();
  renderSubjectHours();
  renderHeatmap();
  renderGamificationBadges();
  renderTimerBadges();
  renderCalendar();
  showToast('Sessão removida.', 'info', 2000);
};

function renderStudyLogs() {
  const container = document.getElementById('studyLogsContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];
  if (logs.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:2rem;">Nenhuma sessão registrada para <b>${profile.nome}</b>.</div>`;
    return;
  }
  container.innerHTML = logs.slice(0, 15).map(log => `
    <div class="log-item">
      <div>
        <strong style="color:#fff;">${log.subject}</strong>
        <span style="display:block;font-size:0.75rem;color:var(--text-muted);">${log.date}${log.manual ? ' · manual' : ''}</span>
      </div>
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span class="badge-tag highlight">+${log.minutes} min</span>
        <button onclick="deleteStudyLog(${log.id})" class="btn-delete-log" title="Remover sessão">${ic('trash', 14)}</button>
      </div>
    </div>`).join('');
}

/* ============================================================
   REVISÕES ESPAÇADAS R1/R7/R30 + FILTROS DE FASE (4B.5)
============================================================ */
function renderRevisoes() {
  const container = document.getElementById('revisoesContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const allDiscs = [...cargo.p1.disciplinas, ...cargo.p2.disciplinas];
  const today = localDateKey(new Date());
  const INTERVALS = [{ label: 'R1', days: 1 }, { label: 'R7', days: 7 }, { label: 'R30', days: 30 }];
  const allDue = [];

  allDiscs.forEach(disc => {
    disc.topicos.forEach((topico, idx) => {
      const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
      const prog = profile.progress[key];
      if (!prog?._teoriaDate) return;
      const teoriaDate = new Date(prog._teoriaDate);
      INTERVALS.forEach(({ label, days }) => {
        const dueDate = new Date(teoriaDate);
        dueDate.setDate(dueDate.getDate() + days);
        const dueDateStr = localDateKey(dueDate);
        if (dueDateStr <= today && !prog[`_revisao${label}`]) {
          allDue.push({ key, topico: getTopicName(topico), disc: disc.nome, label, dueDateStr, prog });
        }
      });
    });
  });

  // Atualiza contadores dos filtros
  const cAll = allDue.length;
  const cR1  = allDue.filter(i => i.label === 'R1').length;
  const cR7  = allDue.filter(i => i.label === 'R7').length;
  const cR30 = allDue.filter(i => i.label === 'R30').length;

  const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setEl('countRevAll', cAll);
  setEl('countRevR1', cR1);
  setEl('countRevR7', cR7);
  setEl('countRevR30', cR30);

  // Filtra de acordo com a seleção
  let filtered = allDue;
  if (AppState.revisaoFilter !== 'all') {
    filtered = allDue.filter(i => i.label === AppState.revisaoFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="revisao-empty">
      ${ic('check', 28)}
      <p>Nenhuma revisão ${AppState.revisaoFilter !== 'all' ? AppState.revisaoFilter : ''} pendente hoje.</p>
      <p style="font-size:0.82rem;color:var(--text-muted);">As revisões aparecem aqui automaticamente após você marcar tópicos como "Teoria".</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="revisao-card" data-key="${item.key}" data-label="${item.label}">
      <div class="revisao-badge ${item.label.toLowerCase()}">${item.label}</div>
      <div class="revisao-content">
        <div class="revisao-disc">${item.disc}</div>
        <div class="revisao-topico">${item.topico}</div>
        <div class="revisao-date">Revisão agendada para ${item.dueDateStr}</div>
      </div>
      <button class="btn-action" style="font-size:0.78rem;padding:6px 12px;" onclick="marcarRevisaoConcluida('${item.key}','${item.label}')">
        ${ic('check', 13)} Concluir
      </button>
    </div>`).join('');
}

window.marcarRevisaoConcluida = function(key, label) {
  const profile = getCurrentProfile();
  if (!profile.progress[key]) return;
  profile.progress[key][`_revisao${label}`] = true;
  saveProfilesData();
  renderRevisoes();
  renderCalendar();
  showToast(`${label} concluída.`, 'success', 2000);
};

/* ============================================================
   PLACAR COMPARATIVO A01 vs E05 (F3.3)
============================================================ */
function renderPlacar() {
  const container = document.getElementById('placarContainer');
  if (!container) return;

  function getStats(profileKey) {
    const profile = AppState.profiles[profileKey];
    const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
    let totalTopicos = 0, teoria = 0, questoes = 0;
    [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(disc => {
      disc.topicos.forEach((_, idx) => {
        totalTopicos++;
        const s = profile.progress[`${profile.cargoCodigo}_${disc.id}_${idx}`];
        if (s?.teoria)   teoria++;
        if (s?.questoes) questoes++;
      });
    });
    const totalMin = (profile.studyLogs || []).reduce((a, l) => a + (l.minutes || 0), 0);
    const streaks = calculateStreaks(profile.studyLogs || []);
    return {
      nome: profile.nome,
      percTeoria: totalTopicos > 0 ? Math.round((teoria / totalTopicos) * 100) : 0,
      percQuestoes: totalTopicos > 0 ? Math.round((questoes / totalTopicos) * 100) : 0,
      horas: (totalMin / 60).toFixed(1),
      sessoes: (profile.studyLogs || []).length,
      topicosTeoria: teoria,
      streak: streaks.current,
    };
  }

  const a01 = getStats('A01');
  const e05 = getStats('E05');

  const row = (label, a, b, suffix = '') => {
    const aNum = parseFloat(a), bNum = parseFloat(b);
    const aWin = aNum > bNum, bWin = bNum > aNum;
    return `
      <tr>
        <td>${label}</td>
        <td class="${aWin ? 'winner' : ''}">${a}${suffix}</td>
        <td class="${bWin ? 'winner' : ''}">${b}${suffix}</td>
      </tr>`;
  };

  container.innerHTML = `
    <table class="placar-table">
      <thead>
        <tr>
          <th>Métrica</th>
          <th>${ic('settings', 14)} ${a01.nome}</th>
          <th>${ic('scale', 14)} ${e05.nome}</th>
        </tr>
      </thead>
      <tbody>
        ${row('Edital vencido (teoria)', a01.percTeoria, e05.percTeoria, '%')}
        ${row('Questões resolvidas', a01.percQuestoes, e05.percQuestoes, '%')}
        ${row('Horas líquidas', a01.horas, e05.horas, 'h')}
        ${row('Sequência consecutiva', a01.streak, e05.streak, ' dias')}
        ${row('Sessões realizadas', a01.sessoes, e05.sessoes)}
        ${row('Tópicos com teoria', a01.topicosTeoria, e05.topicosTeoria)}
      </tbody>
    </table>`;
}

/* ============================================================
   MODO FOCO TOTAL (F3.4)
============================================================ */
function toggleFocusMode() {
  AppState.timer.isFocusMode = !AppState.timer.isFocusMode;
  const focusEl = document.getElementById('focusOverlay');
  const subjEl = document.getElementById('focusSubject');
  if (subjEl) subjEl.textContent = document.getElementById('timerSubjectSelect')?.value || 'Estudo Geral';

  if (AppState.timer.isFocusMode) {
    document.body.classList.add('focus-mode');
    if (focusEl) focusEl.classList.add('active');
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.body.classList.remove('focus-mode');
    if (focusEl) focusEl.classList.remove('active');
    if (document.fullscreenElement) document.exitFullscreen?.();
  }
}

/* ============================================================
   PDF & LEGISLAÇÃO SC
============================================================ */
function exportPDF() {
  window.print();
}

function renderLegislacaoSC() {
  const container = document.getElementById('legislacaoGridContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const laws = EDITAL_DATA.legislacaoSC.filter(l => l.cargos.includes(profile.cargoCodigo));

  container.innerHTML = laws.map(item => {
    const badgeClass = item.importancia.toLowerCase().includes('crítica') ? 'critica' : 'alta';
    return `
      <div class="legis-card">
        <h4>
          <span>${item.sigla}</span>
          <span class="legis-badge ${badgeClass}">${item.importancia}</span>
        </h4>
        <div style="font-size:0.85rem;font-weight:600;color:var(--primary-light);">${item.nome}</div>
        <p>${item.resumo}</p>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
          <span class="badge-tag highlight">Exigida em ${profile.cargoCodigo}</span>
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="badge-tag" style="text-decoration:none;cursor:pointer;" title="Abrir texto oficial em nova aba">${ic('external', 13)} Texto Oficial</a>` : ''}
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   BACKUP & RESTAURAÇÃO
============================================================ */
function exportBackup() {
  const payload = JSON.stringify({ versao: '4.0', exportDate: new Date().toISOString(), profiles: AppState.profiles, config: AppState.config }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_sefaz_sc_v4_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup JSON exportado.', 'success');
}

function importBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data?.profiles?.A01 && data?.profiles?.E05) {
        AppState.profiles = data.profiles;
        if (data.config) AppState.config = data.config;
        saveProfilesData();
        renderApp();
        showToast('Backup restaurado com sucesso.', 'success', 5000);
      } else {
        showToast('Arquivo de backup inválido.', 'warning', 5000);
      }
    } catch {
      showToast('Erro ao processar arquivo JSON.', 'error');
    } finally {
      e.target.value = '';
    }
  };
  reader.readAsText(file);
}

/* ============================================================
   INICIALIZAÇÃO DA APLICAÇÃO
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadProfilesData();
  initPWA();
  initNotifications();
  initCountdown();
  initEventListeners();
  checkSyncUrl();
  renderApp();

  // Verifica revisões pendentes do dia e emite notificação
  setTimeout(() => {
    const profile = getCurrentProfile();
    const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
    const today = localDateKey(new Date());
    let dueCount = 0;
    [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(disc => {
      disc.topicos.forEach((_, idx) => {
        const k = `${profile.cargoCodigo}_${disc.id}_${idx}`;
        const prog = profile.progress[k];
        if (prog?._teoriaDate) {
          const d1 = new Date(prog._teoriaDate);
          d1.setDate(d1.getDate() + 1);
          if (localDateKey(d1) <= today && !prog._revisaoR1) dueCount++;
        }
      });
    });
    if (dueCount > 0) {
      sendNotification('SEFAZ/SC 2026 — Revisões', `Você tem ${dueCount} revisão(ões) pendente(s) hoje. Não quebre a curva do esquecimento!`);
    }
  }, 3000);
});
