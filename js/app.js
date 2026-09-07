/**
 * SEFAZ/SC 2026 — Plataforma de Estudos
 * Versão 3.0 — 15 Melhorias Frontend aplicadas
 *
 * FASE 1 — Microfixes:
 * F1.1 Pluralização sessão/sessões
 * F1.2 Excluir entradas do histórico
 * F1.3 Links para texto oficial das leis
 * F1.4 Countdown com urgência visual (<30d vermelho, <90d laranja)
 *
 * FASE 2 — Funcionalidades:
 * F2.1 Gráfico de progresso por disciplina (SVG nativo)
 * F2.2 Gráfico de horas por semana (bar chart SVG 7 dias)
 * F2.3 Curva Normal + percentil no Simulador FCC
 * F2.4 Filtro "Não iniciados" no Edital
 * F2.5 Badges diário/semanal no Cronômetro
 * F2.6 Card Meta Semanal no Dashboard
 *
 * FASE 3 — Features Estratégicas:
 * F3.1 Agenda de Revisão Espaçada R1/R7/R30
 * F3.2 Caderno de anotações por tópico (modal)
 * F3.3 Placar comparativo A01 vs E05
 * F3.4 Modo Foco Total (fullscreen)
 * F3.5 Exportar PDF do edital
 */

'use strict';

/* ============================================================
   ESTADO GLOBAL
============================================================ */
const AppState = {
  activeProfileKey: 'A01',
  currentTab: 'dashboard',
  searchTerm: '',
  filterStatus: 'all',
  openCards: new Set(),
  noteModalKey: null,     // F3.2

  profiles: {
    A01: {
      nome: 'Estudante A01 (Adm/Eng)',
      cargoCodigo: 'A01',
      metaHorasSemanais: 25,
      progress: {},
      studyLogs: [],
      notes: {},           // F3.2: { topicKey: 'texto' }
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
    isFocusMode: false,    // F3.4
    mode: 'pomodoro',
  },
};

/* ============================================================
   PERSISTÊNCIA
============================================================ */
function loadProfilesData() {
  try {
    const savedActive = localStorage.getItem('sefaz_active_profile');
    if (savedActive === 'A01' || savedActive === 'E05') AppState.activeProfileKey = savedActive;

    const savedData = localStorage.getItem('sefaz_profiles_data_v3');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.A01) AppState.profiles.A01 = { ...AppState.profiles.A01, ...parsed.A01 };
      if (parsed.E05) AppState.profiles.E05 = { ...AppState.profiles.E05, ...parsed.E05 };
    } else {
      // Migrar da v2
      const v2 = localStorage.getItem('sefaz_profiles_data_v2');
      if (v2) {
        const parsed = JSON.parse(v2);
        if (parsed.A01) AppState.profiles.A01 = { ...AppState.profiles.A01, ...parsed.A01 };
        if (parsed.E05) AppState.profiles.E05 = { ...AppState.profiles.E05, ...parsed.E05 };
      }
    }

    const openCards = localStorage.getItem('sefaz_open_cards');
    if (openCards) AppState.openCards = new Set(JSON.parse(openCards));
  } catch (e) {
    console.error('Erro ao carregar LocalStorage:', e);
  }
}

function saveProfilesData() {
  try {
    localStorage.setItem('sefaz_active_profile', AppState.activeProfileKey);
    localStorage.setItem('sefaz_profiles_data_v3', JSON.stringify(AppState.profiles));
    localStorage.setItem('sefaz_open_cards', JSON.stringify([...AppState.openCards]));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('⚠️ Armazenamento cheio! Exporte um backup e limpe dados antigos.', 'warning', 6000);
    } else {
      showToast('❌ Falha ao salvar dados. Verifique permissões do navegador.', 'error');
    }
  }
}

function getCurrentProfile() {
  return AppState.profiles[AppState.activeProfileKey];
}

/* ============================================================
   TOAST SYSTEM
============================================================ */
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ============================================================
   ÁUDIO (lazy)
============================================================ */
let _audioCtx = null;
function getAudioContext() {
  if (!_audioCtx) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) _audioCtx = new Ctx();
    } catch (e) { /* sem suporte */ }
  }
  if (_audioCtx?.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    [0, 0.3, 0.6].forEach((d) => {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime + d);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + d);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 0.25);
    });
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.0);
  } catch (e) { /* silencia */ }
}

/* ============================================================
   COUNTDOWN — F1.4 (urgência visual)
============================================================ */
function initCountdown() {
  const targetDate = new Date(EDITAL_DATA.info.dataProva).getTime();
  const el = document.getElementById('countdownTimer');

  function update() {
    const diff = targetDate - Date.now();
    if (!el) return;
    if (diff <= 0) { el.innerHTML = '🎯 <b>Dia da Prova!</b>'; return; }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    // F1.4: cores por urgência
    el.className = 'countdown-box' +
      (days < 30 ? ' urgent-red' : days < 90 ? ' urgent-amber' : '');

    el.innerHTML = `<span class="pulse-dot"></span> <strong>${days}d ${hours}h ${minutes}m</strong> para a prova`;
  }

  update();
  setInterval(update, 60000);
}

/* ============================================================
   EVENT LISTENERS
============================================================ */
function initEventListeners() {
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

  // Navegação abas
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach((v) => v.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentTab = btn.dataset.tab;
      const view = document.getElementById(`view-${btn.dataset.tab}`);
      if (view) view.classList.add('active');
      if (btn.dataset.tab === 'simulador') updateSimulatorCalculations();
      if (btn.dataset.tab === 'placar')    renderPlacar();      // F3.3
      if (btn.dataset.tab === 'revisoes')  renderRevisoes();    // F3.1
    });
  });

  // Busca/filtro edital
  document.getElementById('editalSearchInput')?.addEventListener('input', (e) => {
    AppState.searchTerm = e.target.value.toLowerCase();
    renderEditalVerticalizado();
  });

  document.getElementById('editalFilterSelect')?.addEventListener('change', (e) => {
    AppState.filterStatus = e.target.value;
    renderEditalVerticalizado();
  });

  // Bulk actions
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

  // Simulador sliders
  ['simP1Acertos','simP2Acertos','simMediaP1','simMediaP2','simDesvioP1','simDesvioP2'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      const el = document.getElementById(id);
      const vEl = document.getElementById(`${id}Val`);
      if (el && vEl) vEl.textContent = el.value;
      updateSimulatorCalculations();
    });
  });

  // Meta semanal — F2.6
  document.getElementById('metaHorasInput')?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && val <= 100) {
      getCurrentProfile().metaHorasSemanais = val;
      saveProfilesData();
      renderDashboardMetrics();
    }
  });

  // Timer
  document.getElementById('btnTimerStart')?.addEventListener('click', () => {
    getAudioContext();
    startTimer();
  });
  document.getElementById('btnTimerPause')?.addEventListener('click', pauseTimer);
  document.getElementById('btnTimerReset')?.addEventListener('click', resetTimer);

  document.querySelectorAll('.timer-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setTimerMode(btn.dataset.mode);
    });
  });

  // F3.4: Modo Foco Total
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

  // Backup
  document.getElementById('btnExportBackup')?.addEventListener('click', exportBackup);
  document.getElementById('fileImportBackup')?.addEventListener('change', importBackup);

  // F3.5: Exportar PDF
  document.getElementById('btnExportPDF')?.addEventListener('click', exportPDF);

  // F3.2: Modal de notas
  document.getElementById('btnCloseNoteModal')?.addEventListener('click', closeNoteModal);
  document.getElementById('noteTextarea')?.addEventListener('input', (e) => {
    if (!AppState.noteModalKey) return;
    const profile = getCurrentProfile();
    if (!profile.notes) profile.notes = {};
    profile.notes[AppState.noteModalKey] = e.target.value;
    saveProfilesData();
  });

  // Editar nome
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
   RENDER PRINCIPAL
============================================================ */
function renderApp() {
  updateProfileButtonsUI();
  renderUserBanner();
  renderDashboardMetrics();
  renderDashboardTips();
  renderProgressChart();         // F2.1
  renderWeeklyChart();           // F2.2
  renderEditalVerticalizado();
  renderTimerSubjectSelect();
  renderStudyLogs();
  renderTimerBadges();           // F2.5
  renderLegislacaoSC();
  updateSimulatorCalculations();
  renderRevisoes();              // F3.1
}

function updateProfileButtonsUI() {
  document.querySelectorAll('.profile-switch-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.profile === AppState.activeProfileKey);
    btn.classList.toggle('gold', btn.dataset.profile === 'E05');
  });
}

/* ============================================================
   BANNER
============================================================ */
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
          <h2>${isE05 ? '⚖️' : '⚙️'} ${profile.nome}</h2>
          <button id="btnEditNameInline" class="btn-action" style="padding:4px 10px;font-size:0.75rem;">✏️ Alterar Nome</button>
        </div>
        <p><strong>Cargo:</strong> Auditor Estadual de Finanças Públicas — <b>${cargo.codigo} (${cargo.nome})</b></p>
        <p style="font-size:0.82rem;color:var(--text-muted)"><strong>Posse:</strong> ${cargo.requisito}</p>
      </div>
      <div class="cargo-tags">
        <span class="badge-tag highlight">💰 ${EDITAL_DATA.info.remuneracao}</span>
        <span class="badge-tag">👥 ${cargo.vagas.total} vagas</span>
        <span class="badge-tag">📍 Florianópolis/SC</span>
        <span class="badge-tag">⏱️ 40h/semana</span>
      </div>
    </div>`;
}

/* ============================================================
   DASHBOARD — MÉTRICAS + F1.1 + F2.6
============================================================ */
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

  // F1.1 — pluralização
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

  // F2.6 — Meta semanal
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const horasSemana = (profile.studyLogs || [])
    .filter(l => new Date(l._ts || 0) >= sevenDaysAgo || true) // fallback: todos se não há _ts
    .reduce((a, l) => a + (l.minutes || 0), 0) / 60;
  const meta = profile.metaHorasSemanais || 25;
  const percMeta = Math.min(100, Math.round((horasSemana / meta) * 100));

  setEl('metricMetaPerc', `${percMeta}%`);
  setEl('metricMetaDetalhe', `${horasSemana.toFixed(1)}h / ${meta}h por semana`);
  const metaBar = document.getElementById('metricMetaFill');
  if (metaBar) metaBar.style.width = `${percMeta}%`;

  const metaInput = document.getElementById('metaHorasInput');
  if (metaInput) metaInput.value = meta;

  if (percMeta >= 100) showToast('🎯 Meta semanal atingida! Parabéns!', 'success', 4000);
}

/* ============================================================
   DICAS DINÂMICAS — F7
============================================================ */
const DICAS = {
  A01: [
    { icon: '🔥', title: 'Priorize a Prova 2', text: 'Com peso 2 e 100 questões, P2 equivale a >71% da nota final. Domine Orçamento e LRF.' },
    { icon: '📊', title: 'MTO 2027 e MCASP 9ª ed.', text: 'A FCC cobra os manuais vigentes. Tenha ambos em PDF e anote as mudanças recentes.' },
    { icon: '🏛️', title: 'NBC TSP 34 — Custos', text: 'Nova norma de custos é alvo certo. Objetos, centros e métodos de custeio.' },
    { icon: '🤖', title: 'IA e LGPD no P1', text: 'BI, LLMs, IA Generativa e LGPD caem no P1 — diferencial de fácil ponto.' },
  ],
  E05: [
    { icon: '⚖️', title: 'Controle de Constitucionalidade', text: 'FCC cobra difuso, concentrado e estadual de SC. Aprofunde ADI, ADC e ADPF.' },
    { icon: '🏛️', title: 'LC 412/2008 — RPPS/SC', text: 'Regime previdenciário estadual é exclusivo do E05 e cai anualmente na FCC.' },
    { icon: '⛓️', title: 'Lei 8.137/1990', text: 'Crimes contra a Ordem Tributária têm altíssima incidência FCC — decore os tipos.' },
    { icon: '🤖', title: 'LGPD e Dados no P1', text: 'Tratamento de dados pelo Poder Público, bases legais e incidentes de segurança.' },
  ],
};

function renderDashboardTips() {
  const el = document.getElementById('dashboardTipsContainer');
  if (!el) return;
  el.innerHTML = (DICAS[AppState.activeProfileKey] || []).map(d =>
    `<li>${d.icon} <b>${d.title}:</b> ${d.text}</li>`
  ).join('');
}

/* ============================================================
   F2.1 — GRÁFICO PROGRESSO POR DISCIPLINA (SVG)
============================================================ */
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
    return { nome: disc.nome.length > 30 ? disc.nome.slice(0, 28) + '…' : disc.nome, perc: disc.topicos.length > 0 ? Math.round((done / disc.topicos.length) * 100) : 0 };
  }).sort((a, b) => a.perc - b.perc);

  const rowH = 32;
  const svgH = data.length * rowH + 10;
  const barW = 260;

  let rows = data.map((d, i) => {
    const y = i * rowH + 16;
    const fill = d.perc === 0 ? 'rgba(255,255,255,0.08)' : d.perc === 100 ? '#10b981' : '#6366f1';
    const w = Math.max(2, Math.round((d.perc / 100) * barW));
    return `
      <g>
        <text x="0" y="${y + 5}" fill="#94a3b8" font-size="11" font-family="Inter,sans-serif">${d.nome}</text>
        <rect x="210" y="${y - 8}" width="${barW}" height="14" rx="4" fill="rgba(255,255,255,0.05)"/>
        <rect x="210" y="${y - 8}" width="${w}" height="14" rx="4" fill="${fill}" opacity="0.85"/>
        <text x="${210 + barW + 6}" y="${y + 4}" fill="#94a3b8" font-size="10" font-family="Inter,sans-serif">${d.perc}%</text>
      </g>`;
  }).join('');

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 490 ${svgH}" xmlns="http://www.w3.org/2000/svg">
      ${rows}
    </svg>`;
}

/* ============================================================
   F2.2 — GRÁFICO HORAS POR SEMANA (bar chart 7 dias)
============================================================ */
function renderWeeklyChart() {
  const container = document.getElementById('weeklyChartContainer');
  if (!container) return;

  const profile = getCurrentProfile();
  const meta = profile.metaHorasSemanais || 25;
  const metaDia = (meta / 5) * 60; // meta diária em minutos

  // Últimos 7 dias
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
    const fill = d.minutes === 0 ? 'rgba(255,255,255,0.06)' : achieved ? '#10b981' : '#f59e0b';
    const labelMin = d.minutes > 0 ? `${Math.round(d.minutes / 60 * 10) / 10}h` : '';
    return `
      <g>
        <rect x="${x}" y="${barMaxH - h + 10}" width="36" height="${h}" rx="4" fill="${fill}"/>
        <text x="${x + 18}" y="${barMaxH + 24}" fill="#64748b" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">${d.label}</text>
        <text x="${x + 18}" y="${barMaxH - h + 7}" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="Inter,sans-serif">${labelMin}</text>
      </g>`;
  }).join('');

  // Linha de meta diária
  const metaY = barMaxH - Math.round((metaDia / maxMin) * barMaxH) + 10;

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="${metaY}" x2="410" y2="${metaY}" stroke="rgba(245,158,11,0.35)" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="412" y="${metaY + 4}" fill="#f59e0b" font-size="9" font-family="Inter,sans-serif">meta</text>
      ${bars}
    </svg>`;
}

/* ============================================================
   EDITAL VERTICALIZADO — F2.4 (filtro não-iniciados) + F3.2 (notas)
============================================================ */
function renderEditalVerticalizado() {
  const container = document.getElementById('editalContentArea');
  if (!container) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];

  function shouldShow(t, idx, disc) {
    const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
    const p = profile.progress[key] || {};

    const matchSearch = AppState.searchTerm === '' ||
      t.toLowerCase().includes(AppState.searchTerm) ||
      disc.nome.toLowerCase().includes(AppState.searchTerm);
    if (!matchSearch) return false;

    if (AppState.filterStatus === 'pending')   return !p.teoria || !p.questoes;
    if (AppState.filterStatus === 'done')      return !!(p.teoria && p.questoes);
    if (AppState.filterStatus === 'untouched') return !p.teoria && !p.resumo && !p.questoes && !p.revisao;
    return true;
  }

  function renderBloco(provaObj, isP2) {
    let html = `
      <div class="prova-section">
        <div class="prova-section-header ${isP2 ? 'p2' : ''}">
          <div class="prova-title"><span>${isP2 ? '🔥' : '📘'}</span><span>${provaObj.nome} — ${provaObj.questoes}Q (Peso ${provaObj.peso})</span></div>
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
              <span class="expand-icon">▼</span>
              <span class="disciplina-title">${disc.nome}${disc.destaque ? ' ✨' : ''}</span>
            </div>
            <div class="disciplina-stats-row">
              <span class="disciplina-stats">${teoriaCount}/${disc.topicos.length} (${perc}%)</span>
              <div class="disc-mini-bar"><div class="disc-mini-bar-fill" style="width:${perc}%"></div></div>
              <button class="btn-mark-all" onclick="event.stopPropagation(); markAllDisciplina('${disc.id}','${profile.cargoCodigo}')" title="Marcar todos">✅ Todos</button>
            </div>
          </div>
          <div class="topicos-list">`;

      disc.topicos.forEach((topico, idx) => {
        if (hasFilter && !visible.includes(topico)) return;
        const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
        const prog = profile.progress[key] || {};
        const hasNote = !!(profile.notes?.[key]);

        html += `
          <div class="topico-item" data-key="${key}">
            <div class="topico-texto">
              <span style="color:var(--text-muted);font-size:0.78rem;margin-right:6px;">#${idx + 1}</span>${topico}
            </div>
            <div class="topico-acoes">
              <label class="check-label ${prog.teoria   ? 'checked' : ''}" data-key="${key}" data-campo="teoria">📖 Teoria</label>
              <label class="check-label ${prog.resumo   ? 'checked' : ''}" data-key="${key}" data-campo="resumo">✍️ Resumo</label>
              <label class="check-label ${prog.questoes ? 'checked' : ''}" data-key="${key}" data-campo="questoes">🎯 Questões</label>
              <label class="check-label ${prog.revisao  ? 'checked' : ''}" data-key="${key}" data-campo="revisao">🔄 Revisão</label>
              <button class="btn-note ${hasNote ? 'has-note' : ''}" onclick="openNoteModal('${key}')" title="${hasNote ? 'Editar anotação' : 'Adicionar anotação'}">📝</button>
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

    // F3.1: ao marcar teoria, registrar data para revisão espaçada
    if (campo === 'teoria' && newVal) {
      if (!profile.progress[key]._teoriaDate) {
        profile.progress[key]._teoriaDate = new Date().toISOString().split('T')[0];
      }
    } else if (campo === 'teoria' && !newVal) {
      delete profile.progress[key]._teoriaDate;
    }

    label.classList.toggle('checked', newVal);
    saveProfilesData();
    renderDashboardMetrics();
    renderWeeklyChart();
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
    if (!allDone && !profile.progress[k]._teoriaDate) profile.progress[k]._teoriaDate = new Date().toISOString().split('T')[0];
    if (allDone)  delete profile.progress[k]._teoriaDate;
  });
  saveProfilesData();
  renderDashboardMetrics();
  renderEditalVerticalizado();
  showToast(allDone ? '↩️ Marcações removidas.' : '✅ Todos os tópicos marcados!', 'success');
};

/* ============================================================
   F3.2 — MODAL DE ANOTAÇÕES POR TÓPICO
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
  renderEditalVerticalizado(); // atualiza o ícone de nota
}

/* ============================================================
   F2.3 — SIMULADOR FCC + CURVA NORMAL
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
    statusEl.textContent = notaFinal >= 150 ? '✅ HABILITADO (≥ 150 pts)' : `❌ ELIMINADO (${notaFinal.toFixed(1)} < 150 pts)`;
  }

  // F2.3: percentis (z-score approximation — Abramowitz & Stegun)
  const z1 = (np1 - 50) / 10;
  const z2 = (np2 - 50) / 10;
  const perc1 = Math.round(zToPercentile(z1) * 100);
  const perc2 = Math.round(zToPercentile(z2) * 100);
  setEl('resPerc1', `Percentil estimado P1: ${perc1}º`);
  setEl('resPerc2', `Percentil estimado P2: ${perc2}º`);

  renderNormalCurve('normalCurveP1', z1, 'var(--primary-light)');
  renderNormalCurve('normalCurveP2', z2, 'var(--accent-gold)');
}

// Approximação normal cumulativa (A&S 26.2.17)
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

  // Linha da curva
  let pathD = '';
  for (let i = 0; i <= pts; i++) {
    const zv = zMin + (i / pts) * (zMax - zMin);
    const x = toX(zv), y = toY(normal(zv));
    pathD += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }

  // Área sombreada (candidato vs média)
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
      <path d="${areaD}" fill="${color}" opacity="0.2"/>
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" opacity="0.7"/>
      <line x1="${xZ.toFixed(1)}" y1="5" x2="${xZ.toFixed(1)}" y2="${H - 8}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="${Math.min(W - 60, Math.max(4, xZ - 20))}" y="15" fill="${color}" font-size="10" font-family="Inter,sans-serif">NP ${np}</text>
      <text x="${Math.min(W - 60, Math.max(4, xZ - 20))}" y="27" fill="#94a3b8" font-size="9" font-family="Inter,sans-serif">${percVal}º pct</text>
      <line x1="${toX(0)}" y1="${H-8}" x2="${toX(0)}" y2="5" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </svg>`;
}

/* ============================================================
   TIMER
============================================================ */
const CIRCUMFERENCE = 565.48;

function setTimerMode(mode) {
  AppState.timer.mode = mode;
  pauseTimer();
  const modeS = { pomodoro: 1500, shortBreak: 300, longBreak: 900, stopwatch: 0 };
  AppState.timer.totalSeconds     = modeS[mode] ?? 1500;
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
  document.getElementById('btnTimerStart').style.display = 'inline-flex';
  document.getElementById('btnTimerPause').style.display = 'none';
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

  const display = document.getElementById('timerDisplay');
  if (display) display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  const circle = document.getElementById('timerCircleProgress');
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
  const labels = { pomodoro:'Foco', shortBreak:'Pausa Curta', longBreak:'Pausa Longa', stopwatch:'Cronômetro Livre' };
  if (modeLabel) modeLabel.textContent = labels[mode] ?? '';
}

function completeTimerSession() {
  const minutes = Math.max(1, Math.round(AppState.timer.elapsedSeconds / 60));
  pauseTimer();
  playBeep();
  registerStudySession(minutes);
  showToast(`🎉 ${minutes} min registrados para ${getCurrentProfile().nome}!`, 'success', 5000);
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
  renderTimerBadges();
}

/* ============================================================
   F2.5 — BADGES DIÁRIO/SEMANAL
============================================================ */
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
      🌅 Hoje: <strong>${Math.round(hojeMins)}min</strong>
    </span>
    <span class="badge-tag highlight" title="Horas nos últimos 7 dias">
      📅 7 dias: <strong>${(semanaMins/60).toFixed(1)}h</strong>
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
  renderTimerBadges();
  showToast(`✅ ${minutes} min registrados manualmente!`, 'success');
}

function renderTimerSubjectSelect() {
  ['timerSubjectSelect','manualSubjectSelect'].forEach((sid) => {
    const sel = document.getElementById(sid);
    if (!sel) return;
    const profile = getCurrentProfile();
    const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
    let h = `<option value="Revisão Geral / Simulado FCC">🎯 Revisão Geral</option>`;
    [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach(d => {
      h += `<option value="${d.nome}">${d.nome}</option>`;
    });
    sel.innerHTML = h;
  });
}

/* F1.2 — excluir sessão */
window.deleteStudyLog = function(id) {
  const profile = getCurrentProfile();
  profile.studyLogs = (profile.studyLogs || []).filter(l => l.id !== id);
  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
  renderWeeklyChart();
  renderTimerBadges();
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
        <button onclick="deleteStudyLog(${log.id})" class="btn-delete-log" title="Remover sessão">🗑️</button>
      </div>
    </div>`).join('');
}

/* ============================================================
   F3.1 — AGENDA DE REVISÃO ESPAÇADA R1/R7/R30
============================================================ */
function renderRevisoes() {
  const container = document.getElementById('revisoesContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  const allDiscs = [...cargo.p1.disciplinas, ...cargo.p2.disciplinas];
  const today = new Date().toISOString().split('T')[0];
  const INTERVALS = [{ label: 'R1', days: 1 }, { label: 'R7', days: 7 }, { label: 'R30', days: 30 }];
  const due = [];

  allDiscs.forEach(disc => {
    disc.topicos.forEach((topico, idx) => {
      const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
      const prog = profile.progress[key];
      if (!prog?._teoriaDate) return;
      const teoriaDate = new Date(prog._teoriaDate);
      INTERVALS.forEach(({ label, days }) => {
        const dueDate = new Date(teoriaDate);
        dueDate.setDate(dueDate.getDate() + days);
        const dueDateStr = dueDate.toISOString().split('T')[0];
        if (dueDateStr <= today && !prog[`_revisao${label}`]) {
          due.push({ key, topico, disc: disc.nome, label, dueDateStr, prog });
        }
      });
    });
  });

  if (due.length === 0) {
    container.innerHTML = `<div class="revisao-empty">
      <span style="font-size:2rem;">✨</span>
      <p>Nenhuma revisão pendente hoje.</p>
      <p style="font-size:0.82rem;color:var(--text-muted);">As revisões R1, R7 e R30 aparecerão aqui automaticamente quando você marcar tópicos como "Teoria".</p>
    </div>`;
    return;
  }

  container.innerHTML = due.map(item => `
    <div class="revisao-card" data-key="${item.key}" data-label="${item.label}">
      <div class="revisao-badge ${item.label.toLowerCase()}">${item.label}</div>
      <div class="revisao-content">
        <div class="revisao-disc">${item.disc}</div>
        <div class="revisao-topico">${item.topico}</div>
        <div class="revisao-date">Teoria em ${item.dueDateStr}</div>
      </div>
      <button class="btn-action" style="font-size:0.78rem;padding:5px 10px;" onclick="marcarRevisaoConcluida('${item.key}','${item.label}')">
        ✔ Concluir
      </button>
    </div>`).join('');
}

window.marcarRevisaoConcluida = function(key, label) {
  const profile = getCurrentProfile();
  if (!profile.progress[key]) return;
  profile.progress[key][`_revisao${label}`] = true;
  saveProfilesData();
  renderRevisoes();
  showToast(`${label} concluída! ✅`, 'success', 2000);
};

/* ============================================================
   F3.3 — PLACAR A01 vs E05
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
    return {
      nome: profile.nome,
      percTeoria: totalTopicos > 0 ? Math.round((teoria / totalTopicos) * 100) : 0,
      percQuestoes: totalTopicos > 0 ? Math.round((questoes / totalTopicos) * 100) : 0,
      horas: (totalMin / 60).toFixed(1),
      sessoes: (profile.studyLogs || []).length,
      topicosTotal: totalTopicos,
      topicosTeoria: teoria,
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
          <th>⚙️ ${a01.nome}</th>
          <th>⚖️ ${e05.nome}</th>
        </tr>
      </thead>
      <tbody>
        ${row('📚 Edital Vencido (Teoria)', a01.percTeoria, e05.percTeoria, '%')}
        ${row('🎯 Questões Resolvidas', a01.percQuestoes, e05.percQuestoes, '%')}
        ${row('⏱️ Horas Líquidas', a01.horas, e05.horas, 'h')}
        ${row('📋 Sessões Realizadas', a01.sessoes, e05.sessoes)}
        ${row('✅ Tópicos c/ Teoria', a01.topicosTeoria, e05.topicosTeoria)}
      </tbody>
    </table>`;
}

/* ============================================================
   F3.4 — MODO FOCO TOTAL
============================================================ */
function toggleFocusMode() {
  AppState.timer.isFocusMode = !AppState.timer.isFocusMode;
  const focusEl = document.getElementById('focusOverlay');
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
   F3.5 — EXPORTAR PDF (@media print)
============================================================ */
function exportPDF() {
  window.print();
}

/* ============================================================
   LEGISLAÇÃO SC — F1.3 (links)
============================================================ */
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
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="badge-tag" style="text-decoration:none;cursor:pointer;" title="Abrir texto oficial em nova aba">📄 Texto Oficial ↗</a>` : ''}
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   BACKUP
============================================================ */
function exportBackup() {
  const payload = JSON.stringify({ versao: '3.0', exportDate: new Date().toISOString(), profiles: AppState.profiles }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_sefaz_sc_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Backup exportado!', 'success');
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
        saveProfilesData();
        renderApp();
        showToast('✅ Backup restaurado com sucesso!', 'success', 5000);
      } else {
        showToast('⚠️ Arquivo de backup inválido.', 'warning', 5000);
      }
    } catch {
      showToast('❌ Erro ao ler o arquivo JSON.', 'error');
    } finally {
      e.target.value = '';
    }
  };
  reader.readAsText(file);
}

/* ============================================================
   INICIALIZAÇÃO
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadProfilesData();
  initCountdown();
  initEventListeners();
  renderApp();
});
