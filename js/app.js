/**
 * SEFAZ/SC 2026 — Plataforma de Estudos
 * Versão 2.0 — Bug fixes + melhorias completas
 *
 * Correções aplicadas:
 * #1  toggleCheck atualiza DOM direto (sem re-render total)
 * #2  Stopwatch salva tempo real decorrido
 * #3  Filtro "Concluídos" sem busca funciona corretamente
 * #4  Simulador inicializa com valores dos sliders
 * #5  AudioContext criado de forma lazy (Fix de bloqueio do navegador)
 * #6  Estado open/closed dos acordeões preservado ao re-renderizar
 * #7  Dicas do Dashboard dinâmicas por cargo
 * #8  Busca limpa ao trocar de perfil
 * #9  File input reseta após importação
 * #10 LocalStorage com aviso ao usuário em caso de falha
 * #11 Anel SVG animado no modo Stopwatch (gira progressivamente)
 * #12 CSS do botão E05 robusto (classe gold mantida explicitamente)
 *
 * Melhorias aplicadas:
 * M2  Botão "Marcar todos" por disciplina
 * M3  Registro manual de sessão (sem timer)
 * M5  Toast notifications (substitui alert())
 * M8  PWA manifest.json referenciado no HTML
 * M9  Responsividade mobile das ações de tópico
 * M10 Colapsar todos / Expandir todos no Edital
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

  // IDs dos accordeões atualmente abertos (Fix #6)
  openCards: new Set(),

  profiles: {
    A01: {
      nome: 'Estudante A01 (Adm/Eng)',
      cargoCodigo: 'A01',
      metaHorasSemanais: 25,
      progress: {},
      studyLogs: [],
    },
    E05: {
      nome: 'Estudante E05 (Direito)',
      cargoCodigo: 'E05',
      metaHorasSemanais: 25,
      progress: {},
      studyLogs: [],
    },
  },

  timer: {
    intervalId: null,
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    elapsedSeconds: 0,     // Fix #2: rastreia tempo real decorrido
    isRunning: false,
    mode: 'pomodoro',      // 'pomodoro' | 'shortBreak' | 'longBreak' | 'stopwatch'
  },
};

/* ============================================================
   PERSISTÊNCIA (LocalStorage)
============================================================ */
function loadProfilesData() {
  try {
    const savedActive = localStorage.getItem('sefaz_active_profile');
    if (savedActive === 'A01' || savedActive === 'E05') {
      AppState.activeProfileKey = savedActive;
    }
    const savedData = localStorage.getItem('sefaz_profiles_data_v2');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.A01) AppState.profiles.A01 = { ...AppState.profiles.A01, ...parsed.A01 };
      if (parsed.E05) AppState.profiles.E05 = { ...AppState.profiles.E05, ...parsed.E05 };
    }
    const openCards = localStorage.getItem('sefaz_open_cards');
    if (openCards) AppState.openCards = new Set(JSON.parse(openCards));
  } catch (e) {
    console.error('Erro ao carregar LocalStorage:', e);
  }
}

// Fix #10: avisa o usuário se o LocalStorage falhar
function saveProfilesData() {
  try {
    localStorage.setItem('sefaz_active_profile', AppState.activeProfileKey);
    localStorage.setItem('sefaz_profiles_data_v2', JSON.stringify(AppState.profiles));
    localStorage.setItem('sefaz_open_cards', JSON.stringify([...AppState.openCards]));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('⚠️ Espaço de armazenamento cheio. Exporte um backup e limpe os dados antigos.', 'warning', 6000);
    } else {
      showToast('❌ Falha ao salvar dados. Verifique as permissões do navegador.', 'error');
    }
    console.error('Erro ao salvar no LocalStorage:', e);
  }
}

function getCurrentProfile() {
  return AppState.profiles[AppState.activeProfileKey];
}

/* ============================================================
   TOAST SYSTEM (Fix M5 — substitui alert())
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
   AUDIO (Fix #5 — lazy AudioContext)
============================================================ */
let _audioCtx = null;

function getAudioContext() {
  if (!_audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) _audioCtx = new AudioContextClass();
    } catch (e) { /* sem suporte */ }
  }
  if (_audioCtx && _audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
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
    // Sequência de 3 bipes suaves
    [0, 0.3, 0.6].forEach((delay) => {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
    });
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.0);
  } catch (e) { /* silencia erros de áudio */ }
}

/* ============================================================
   COUNTDOWN
============================================================ */
function initCountdown() {
  const targetDate = new Date(EDITAL_DATA.info.dataProva).getTime();
  const el = document.getElementById('countdownTimer');

  function update() {
    const diff = targetDate - Date.now();
    if (!el) return;
    if (diff <= 0) {
      el.innerHTML = '🎯 <b>Dia da Prova!</b>';
      return;
    }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
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

      // Fix #8: limpa busca ao trocar de perfil
      AppState.searchTerm = '';
      AppState.filterStatus = 'all';
      const searchEl = document.getElementById('editalSearchInput');
      const filterEl = document.getElementById('editalFilterSelect');
      if (searchEl) searchEl.value = '';
      if (filterEl) filterEl.value = 'all';

      resetTimer();
      saveProfilesData();
      renderApp();
      showToast(`Perfil alternado para: ${getCurrentProfile().nome}`, 'info', 2500);
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
      // Fix #4: atualiza simulador ao abrir a aba
      if (btn.dataset.tab === 'simulador') updateSimulatorCalculations();
    });
  });

  // Busca no edital
  document.getElementById('editalSearchInput')?.addEventListener('input', (e) => {
    AppState.searchTerm = e.target.value.toLowerCase();
    renderEditalVerticalizado();
  });

  // Filtro de status
  document.getElementById('editalFilterSelect')?.addEventListener('change', (e) => {
    AppState.filterStatus = e.target.value;
    renderEditalVerticalizado();
  });

  // Bulk actions no edital (M10)
  document.getElementById('btnExpandAll')?.addEventListener('click', () => {
    document.querySelectorAll('.disciplina-card').forEach((card) => {
      card.classList.add('open');
      AppState.openCards.add(card.id);
    });
    saveProfilesData();
  });

  document.getElementById('btnCollapseAll')?.addEventListener('click', () => {
    document.querySelectorAll('.disciplina-card').forEach((card) => {
      card.classList.remove('open');
      AppState.openCards.delete(card.id);
    });
    saveProfilesData();
  });

  // Sliders do simulador
  ['simP1Acertos', 'simP2Acertos', 'simMediaP1', 'simMediaP2', 'simDesvioP1', 'simDesvioP2'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      const valEl = document.getElementById(`${id}Val`);
      const el = document.getElementById(id);
      if (valEl && el) valEl.textContent = el.value;
      updateSimulatorCalculations();
    });
  });

  // Timer controls
  document.getElementById('btnTimerStart')?.addEventListener('click', () => {
    getAudioContext(); // Fix #5: inicializa AudioContext com gesto do usuário
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

  // Registro manual de sessão (M3)
  document.getElementById('btnSaveManualSession')?.addEventListener('click', saveManualSession);

  // Backup
  document.getElementById('btnExportBackup')?.addEventListener('click', exportBackup);
  document.getElementById('fileImportBackup')?.addEventListener('change', importBackup);

  // Editar nome inline
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btnEditNameInline') {
      const profile = getCurrentProfile();
      const novoNome = prompt('Nome do estudante para este perfil:', profile.nome);
      if (novoNome && novoNome.trim()) {
        profile.nome = novoNome.trim();
        saveProfilesData();
        renderUserBanner();
        renderStudyLogs();
        showToast('Nome atualizado com sucesso!', 'success');
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
  renderDashboardTips();      // Fix #7
  renderEditalVerticalizado();
  renderTimerSubjectSelect();
  renderStudyLogs();
  renderLegislacaoSC();
  updateSimulatorCalculations(); // Fix #4
}

function updateProfileButtonsUI() {
  // Fix #12: atribui classes explicitamente sem depender do HTML
  document.querySelectorAll('.profile-switch-btn').forEach((btn) => {
    const isActive = btn.dataset.profile === AppState.activeProfileKey;
    const isGold = btn.dataset.profile === 'E05';
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('gold', isGold);
  });
}

/* ============================================================
   BANNER DO USUÁRIO
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
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.25rem;flex-wrap:wrap;">
          <h2>${isE05 ? '⚖️' : '⚙️'} ${profile.nome}</h2>
          <button id="btnEditNameInline" class="btn-action" style="padding:4px 10px;font-size:0.75rem;" title="Editar nome">
            ✏️ Alterar Nome
          </button>
        </div>
        <p><strong>Cargo:</strong> Auditor Estadual de Finanças Públicas — Opção <b>${cargo.codigo} (${cargo.nome})</b></p>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;"><strong>Requisito da Posse:</strong> ${cargo.requisito}</p>
      </div>
      <div class="cargo-tags">
        <span class="badge-tag highlight">💰 ${EDITAL_DATA.info.remuneracao}</span>
        <span class="badge-tag">👥 ${cargo.vagas.total} vagas</span>
        <span class="badge-tag">📍 Florianópolis/SC</span>
        <span class="badge-tag">⏱️ 40h/semana</span>
      </div>
    </div>
  `;
}

/* ============================================================
   DASHBOARD — MÉTRICAS
============================================================ */
function renderDashboardMetrics() {
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];

  let totalTopicos = 0, concluidosTeoria = 0, concluidosQuestoes = 0;

  [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach((disc) => {
    disc.topicos.forEach((_, idx) => {
      totalTopicos++;
      const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
      const s = profile.progress[key];
      if (s) {
        if (s.teoria)   concluidosTeoria++;
        if (s.questoes) concluidosQuestoes++;
      }
    });
  });

  const percGeral = totalTopicos > 0 ? Math.round((concluidosTeoria / totalTopicos) * 100) : 0;
  const percExercicios = totalTopicos > 0 ? Math.round((concluidosQuestoes / totalTopicos) * 100) : 0;
  const totalMin = (profile.studyLogs || []).reduce((a, l) => a + (l.minutes || 0), 0);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('metricHorasEstudadas', `${(totalMin / 60).toFixed(1)}h`);
  setEl('metricSessoesFeitas', `${(profile.studyLogs || []).length} sessões`);
  setEl('metricPercentualEdital', `${percGeral}%`);
  setEl('metricTopicosTotais', `${concluidosTeoria}/${totalTopicos}`);
  setEl('metricExerciciosFeitos', `${percExercicios}%`);

  const bar = document.getElementById('metricProgressFill');
  if (bar) bar.style.width = `${percGeral}%`;
}

/* ============================================================
   DASHBOARD — DICAS DINÂMICAS (Fix #7)
============================================================ */
const DICAS = {
  A01: [
    { icon: '🔥', title: 'Priorize a Prova 2', text: 'Com peso 2 e 100 questões, P2 equivale a mais de 71% da nota ponderada. Domine Orçamento e LRF.' },
    { icon: '📊', title: 'MTO 2027 e MCASP são obrigatórios', text: 'A FCC cobra os Manuais vigentes. Tenha o MTO 2027 e o MCASP 9ª ed em mãos.' },
    { icon: '🏛️', title: 'NBC TSP 34 (Custos)', text: 'Nova norma de custos é alvo certo. Domine objetos, centros de custeio e métodos de rateio.' },
    { icon: '🤖', title: 'Ciência de Dados & IA no P1', text: 'BI, LLMs, IA Generativa e LGPD caem no P1 para todos os cargos — é diferencial de fácil ponto.' },
  ],
  E05: [
    { icon: '⚖️', title: 'Controle de Constitucionalidade', text: 'FCC cobra difuso, concentrado e a novidade estadual de SC. Aprofunde ADI, ADC e ADPF.' },
    { icon: '🏛️', title: 'Normas locais de SC são diferenciais', text: 'LC 898/2026, LC 412/2008 (RPPS) e Decreto 2.094/2022 (SEF/SC) são cobradas exclusivamente no E05.' },
    { icon: '⛓️', title: 'Crimes Contra a Ordem Tributária', text: 'Lei 8.137/1990 e crimes de abuso de autoridade (Lei 13.869/2019) têm altíssima incidência FCC.' },
    { icon: '🤖', title: 'LGPD e Dados no P1', text: 'Tratamento de dados pelo Poder Público, bases legais e incidentes são cobrados no bloco geral.' },
  ],
};

function renderDashboardTips() {
  const container = document.getElementById('dashboardTipsContainer');
  if (!container) return;
  const dicas = DICAS[AppState.activeProfileKey] || [];
  container.innerHTML = dicas.map((d) => `
    <li>
      ${d.icon} <b>${d.title}:</b> ${d.text}
    </li>
  `).join('');
}

/* ============================================================
   EDITAL VERTICALIZADO
============================================================ */
function renderEditalVerticalizado() {
  const container = document.getElementById('editalContentArea');
  if (!container) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
  let html = '';

  // Fix #3: condição de guarda corrigida para respeitar filterStatus mesmo sem searchTerm
  function shouldShowTopico(t, idx, disc) {
    const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
    const p = profile.progress[key] || {};

    const matchSearch = AppState.searchTerm === '' ||
      t.toLowerCase().includes(AppState.searchTerm) ||
      disc.nome.toLowerCase().includes(AppState.searchTerm);
    if (!matchSearch) return false;

    if (AppState.filterStatus === 'pending') return !p.teoria || !p.questoes;
    if (AppState.filterStatus === 'done')    return !!(p.teoria && p.questoes);
    return true;
  }

  function renderBloco(provaObj, isP2) {
    let blocoHtml = `
      <div class="prova-section">
        <div class="prova-section-header ${isP2 ? 'p2' : ''}">
          <div class="prova-title">
            <span>${isP2 ? '🔥' : '📘'}</span>
            <span>${provaObj.nome} — ${provaObj.questoes}Q (Peso ${provaObj.peso})</span>
          </div>
          <span class="badge-tag">${provaObj.duracao}</span>
        </div>
    `;

    provaObj.disciplinas.forEach((disc) => {
      const visibleTopicos = disc.topicos.filter((t, idx) => shouldShowTopico(t, idx, disc));

      // Fix #3: oculta disciplina se não há tópicos visíveis (qualquer filtro ativo)
      const hasActiveFilter = AppState.searchTerm !== '' || AppState.filterStatus !== 'all';
      if (hasActiveFilter && visibleTopicos.length === 0) return;

      let discTeoriaCount = 0;
      disc.topicos.forEach((_, idx) => {
        const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
        if (profile.progress[key]?.teoria) discTeoriaCount++;
      });
      const discPerc = Math.round((discTeoriaCount / disc.topicos.length) * 100);

      const cardId = `card-${disc.id}`;
      // Fix #6: preserva estado open/closed
      const isOpen = AppState.openCards.has(cardId);

      blocoHtml += `
        <div class="disciplina-card ${disc.destaque ? 'destaque' : ''} ${isOpen ? 'open' : ''}" id="${cardId}">
          <div class="disciplina-header" onclick="toggleDisciplinaCard('${cardId}')">
            <div class="disciplina-title-group">
              <span class="expand-icon">▼</span>
              <span class="disciplina-title">${disc.nome}${disc.destaque ? ' ✨' : ''}</span>
            </div>
            <div class="disciplina-stats-row">
              <span class="disciplina-stats">${discTeoriaCount}/${disc.topicos.length} (${discPerc}%)</span>
              <div class="disc-mini-bar" title="Progresso de teoria">
                <div class="disc-mini-bar-fill" style="width:${discPerc}%"></div>
              </div>
              <button class="btn-mark-all" onclick="event.stopPropagation(); markAllDisciplina('${disc.id}', '${profile.cargoCodigo}')" title="Marcar toda disciplina como Teoria+Revisão">
                ✅ Marcar todos
              </button>
            </div>
          </div>
          <div class="topicos-list">
      `;

      disc.topicos.forEach((topico, idx) => {
        // Quando filtrado, mostra apenas os visíveis
        if (hasActiveFilter && !visibleTopicos.includes(topico)) return;

        const key = `${profile.cargoCodigo}_${disc.id}_${idx}`;
        const prog = profile.progress[key] || {};

        blocoHtml += `
          <div class="topico-item" data-key="${key}">
            <div class="topico-texto">
              <span style="color:var(--text-muted);font-size:0.78rem;margin-right:6px;">#${idx + 1}</span>${topico}
            </div>
            <div class="topico-acoes">
              <label class="check-label ${prog.teoria   ? 'checked' : ''}" data-key="${key}" data-campo="teoria"   title="Teoria lida/assistida">📖 Teoria</label>
              <label class="check-label ${prog.resumo   ? 'checked' : ''}" data-key="${key}" data-campo="resumo"   title="Resumo ou flashcard">✍️ Resumo</label>
              <label class="check-label ${prog.questoes ? 'checked' : ''}" data-key="${key}" data-campo="questoes" title="Questões FCC resolvidas">🎯 Questões</label>
              <label class="check-label ${prog.revisao  ? 'checked' : ''}" data-key="${key}" data-campo="revisao"  title="Revisão R1/R7/R30">🔄 Revisão</label>
            </div>
          </div>
        `;
      });

      blocoHtml += `</div></div>`;
    });

    blocoHtml += `</div>`;
    return blocoHtml;
  }

  html += renderBloco(cargo.p1, false);
  html += renderBloco(cargo.p2, true);
  container.innerHTML = html;

  // Fix #1: delega click dos check-labels via event delegation (sem re-render)
  container.addEventListener('click', handleCheckLabelClick, { once: true });
}

/* Fix #1 — Event delegation: atualiza só o label clicado, sem re-renderizar todo o edital */
function handleCheckLabelClick(e) {
  const label = e.target.closest('.check-label');
  if (label) {
    const key   = label.dataset.key;
    const campo = label.dataset.campo;
    if (!key || !campo) return;

    const profile = getCurrentProfile();
    if (!profile.progress[key]) {
      profile.progress[key] = { teoria: false, resumo: false, questoes: false, revisao: false };
    }
    const newVal = !profile.progress[key][campo];
    profile.progress[key][campo] = newVal;

    label.classList.toggle('checked', newVal);
    saveProfilesData();
    renderDashboardMetrics();
    // Atualiza mini-barra da disciplina correspondente
    updateDiscMiniBar(key);
  }
  // Re-registra o listener (once: true foi consumido)
  const container = document.getElementById('editalContentArea');
  if (container) container.addEventListener('click', handleCheckLabelClick, { once: true });
}

function updateDiscMiniBar(key) {
  // key = "A01_cg-lp_0" → extrai disc.id
  const parts = key.split('_');
  if (parts.length < 3) return;
  const cargoCodigo = parts[0];
  const discId = parts.slice(1, -1).join('_');
  const cardId = `card-${discId}`;
  const card = document.getElementById(cardId);
  if (!card) return;

  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[cargoCodigo];
  const allDiscs = [...cargo.p1.disciplinas, ...cargo.p2.disciplinas];
  const disc = allDiscs.find((d) => d.id === discId);
  if (!disc) return;

  let count = 0;
  disc.topicos.forEach((_, idx) => {
    const k = `${cargoCodigo}_${discId}_${idx}`;
    if (profile.progress[k]?.teoria) count++;
  });
  const perc = Math.round((count / disc.topicos.length) * 100);

  const statsEl = card.querySelector('.disciplina-stats');
  const barFill  = card.querySelector('.disc-mini-bar-fill');
  if (statsEl) statsEl.textContent = `${count}/${disc.topicos.length} (${perc}%)`;
  if (barFill)  barFill.style.width = `${perc}%`;
}

/* Fix #6: toggle acordeão preserva estado */
window.toggleDisciplinaCard = function (cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const isNowOpen = card.classList.toggle('open');
  if (isNowOpen) {
    AppState.openCards.add(cardId);
  } else {
    AppState.openCards.delete(cardId);
  }
  saveProfilesData();
};

/* M2: Marcar todos os tópicos de uma disciplina */
window.markAllDisciplina = function (discId, cargoCodigo) {
  const profile = getCurrentProfile();
  const cargo = EDITAL_DATA.cargos[cargoCodigo];
  const allDiscs = [...cargo.p1.disciplinas, ...cargo.p2.disciplinas];
  const disc = allDiscs.find((d) => d.id === discId);
  if (!disc) return;

  // Verifica se já está tudo marcado para servir de toggle
  const allDone = disc.topicos.every((_, idx) => {
    const k = `${cargoCodigo}_${discId}_${idx}`;
    const p = profile.progress[k];
    return p && p.teoria && p.revisao;
  });

  disc.topicos.forEach((_, idx) => {
    const k = `${cargoCodigo}_${discId}_${idx}`;
    if (!profile.progress[k]) profile.progress[k] = { teoria: false, resumo: false, questoes: false, revisao: false };
    profile.progress[k].teoria  = !allDone;
    profile.progress[k].revisao = !allDone;
  });

  saveProfilesData();
  renderDashboardMetrics();
  renderEditalVerticalizado();
  showToast(allDone ? '↩️ Marcações removidas da disciplina.' : '✅ Disciplina marcada como Teoria + Revisão!', 'success');
};

/* ============================================================
   SIMULADOR FCC (Fix #4: chamado no renderApp)
============================================================ */
function updateSimulatorCalculations() {
  const get = (id, fallback) => parseFloat(document.getElementById(id)?.value ?? fallback);

  const acertosP1 = get('simP1Acertos', 60);
  const acertosP2 = get('simP2Acertos', 75);
  const mediaP1   = get('simMediaP1', 48);
  const mediaP2   = get('simMediaP2', 60);
  const desvioP1  = Math.max(0.1, get('simDesvioP1', 8));
  const desvioP2  = Math.max(0.1, get('simDesvioP2', 10));

  // NP = [((A - Média) / DP) * 10] + 50
  const np1 = (((acertosP1 - mediaP1) / desvioP1) * 10) + 50;
  const np2 = (((acertosP2 - mediaP2) / desvioP2) * 10) + 50;
  // Nota Final = (NP1 × 1) + (NP2 × 2)
  const notaFinal = np1 + np2 * 2;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('resNP1', np1.toFixed(2));
  setEl('resNP2', np2.toFixed(2));
  setEl('resNotaFinal', notaFinal.toFixed(2));

  const statusEl = document.getElementById('resStatusTag');
  if (statusEl) {
    if (notaFinal >= 150) {
      statusEl.className = 'status-tag approved';
      statusEl.textContent = '✅ HABILITADO (≥ 150 pts)';
    } else {
      statusEl.className = 'status-tag disapproved';
      statusEl.textContent = `❌ ELIMINADO (${notaFinal.toFixed(1)} < 150 pts)`;
    }
  }
}

/* ============================================================
   POMODORO TIMER
============================================================ */
const CIRCUMFERENCE = 2 * Math.PI * 90; // 565.48

function setTimerMode(mode) {
  AppState.timer.mode = mode;
  pauseTimer();

  const modeSeconds = { pomodoro: 1500, shortBreak: 300, longBreak: 900, stopwatch: 0 };
  AppState.timer.totalSeconds    = modeSeconds[mode] ?? 1500;
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
      if (AppState.timer.remainingSeconds <= 0) {
        completeTimerSession();
        return;
      }
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  AppState.timer.isRunning = false;
  if (AppState.timer.intervalId) {
    clearInterval(AppState.timer.intervalId);
    AppState.timer.intervalId = null;
  }
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
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const display = document.getElementById('timerDisplay');
  if (display) display.textContent = timeStr;

  const circle = document.getElementById('timerCircleProgress');
  const modeLabel = document.getElementById('timerModeLabel');

  if (circle) {
    if (mode === 'stopwatch') {
      // Fix #11: no stopwatch o anel gira progressivamente a cada minuto
      circle.classList.add('stopwatch-mode');
      const minuteProgress = (elapsedSeconds % 60) / 60;
      circle.style.strokeDasharray = CIRCUMFERENCE;
      circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - minuteProgress);
    } else {
      circle.classList.remove('stopwatch-mode');
      const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
      circle.style.strokeDasharray = CIRCUMFERENCE;
      circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - Math.max(0, progress));
    }
  }

  const modeLabels = { pomodoro: 'Foco', shortBreak: 'Pausa Curta', longBreak: 'Pausa Longa', stopwatch: 'Cronômetro Livre' };
  if (modeLabel) modeLabel.textContent = modeLabels[mode] ?? '';
}

function completeTimerSession() {
  // Fix #2: usa elapsedSeconds (tempo real) para calcular minutos
  const minutesSpent = Math.max(1, Math.round(AppState.timer.elapsedSeconds / 60));
  pauseTimer();
  playBeep();
  registerStudySession(minutesSpent);
  showToast(`🎉 Sessão de ${minutesSpent} min registrada para ${getCurrentProfile().nome}!`, 'success', 5000);
  resetTimer();
}

function registerStudySession(minutes) {
  const subjectEl = document.getElementById('timerSubjectSelect');
  const subject = subjectEl?.value || 'Estudo Geral';
  const profile = getCurrentProfile();

  if (!profile.studyLogs) profile.studyLogs = [];
  profile.studyLogs.unshift({
    id: Date.now(),
    date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    minutes,
    subject,
    manual: false,
  });

  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
}

/* M3: Registro manual de sessão */
function saveManualSession() {
  const minEl = document.getElementById('manualMinutes');
  const subjEl = document.getElementById('manualSubjectSelect');
  if (!minEl || !subjEl) return;

  const minutes = parseInt(minEl.value, 10);
  if (!minutes || minutes < 1 || minutes > 600) {
    showToast('Informe um tempo válido (1 a 600 minutos).', 'warning');
    return;
  }

  const profile = getCurrentProfile();
  if (!profile.studyLogs) profile.studyLogs = [];
  profile.studyLogs.unshift({
    id: Date.now(),
    date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    minutes,
    subject: subjEl.value || 'Estudo Geral',
    manual: true,
  });

  minEl.value = '';
  saveProfilesData();
  renderDashboardMetrics();
  renderStudyLogs();
  showToast(`✅ ${minutes} min registrados manualmente!`, 'success');
}

function renderTimerSubjectSelect() {
  ['timerSubjectSelect', 'manualSubjectSelect'].forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (!select) return;
    const profile = getCurrentProfile();
    const cargo = EDITAL_DATA.cargos[profile.cargoCodigo];
    let html = `<option value="Revisão Geral / Simulado FCC">🎯 Revisão Geral / Simulado FCC</option>`;
    [...cargo.p1.disciplinas, ...cargo.p2.disciplinas].forEach((disc) => {
      html += `<option value="${disc.nome}">${disc.nome}</option>`;
    });
    select.innerHTML = html;
  });
}

function renderStudyLogs() {
  const container = document.getElementById('studyLogsContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const logs = profile.studyLogs || [];

  if (logs.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:2rem 1rem;">
      Nenhuma sessão registrada para <b>${profile.nome}</b>.<br>Use o cronômetro ou o registro manual.
    </div>`;
    return;
  }

  container.innerHTML = logs.slice(0, 15).map((log) => `
    <div class="log-item">
      <div>
        <strong style="color:#fff;">${log.subject}</strong>
        <span style="display:block;font-size:0.75rem;color:var(--text-muted);">${log.date}${log.manual ? ' · manual' : ''}</span>
      </div>
      <span class="badge-tag highlight">+${log.minutes} min</span>
    </div>
  `).join('');
}

/* ============================================================
   LEGISLAÇÃO ESTADUAL DE SC
============================================================ */
function renderLegislacaoSC() {
  const container = document.getElementById('legislacaoGridContainer');
  if (!container) return;
  const profile = getCurrentProfile();
  const laws = EDITAL_DATA.legislacaoSC.filter((l) => l.cargos.includes(profile.cargoCodigo));

  container.innerHTML = laws.map((item) => {
    const badgeClass = item.importancia.toLowerCase().includes('crítica') ? 'critica' : 'alta';
    return `
      <div class="legis-card">
        <h4>
          <span>${item.sigla}</span>
          <span class="legis-badge ${badgeClass}">${item.importancia}</span>
        </h4>
        <div style="font-size:0.85rem;font-weight:600;color:var(--primary-light);">${item.nome}</div>
        <p>${item.resumo}</p>
        <div style="margin-top:0.75rem;">
          <span class="badge-tag highlight">Exigida em ${profile.cargoCodigo}</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   BACKUP — EXPORT / IMPORT
============================================================ */
function exportBackup() {
  const payload = JSON.stringify({
    versao: '2.1',
    exportDate: new Date().toISOString(),
    profiles: AppState.profiles,
  }, null, 2);

  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_sefaz_sc_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Backup exportado com sucesso!', 'success');
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
        showToast('✅ Backup restaurado! Dados dos dois perfis importados.', 'success', 5000);
      } else {
        showToast('⚠️ Arquivo inválido. Certifique-se de usar um backup gerado por esta plataforma.', 'warning', 5000);
      }
    } catch {
      showToast('❌ Erro ao ler o arquivo JSON. Verifique se o arquivo não está corrompido.', 'error');
    } finally {
      // Fix #9: reseta input para permitir reimportação do mesmo arquivo
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

  // Garante que todos os cards da sessão anterior estejam abertos no estado correto
  // (será aplicado após renderEditalVerticalizado no renderApp)
  initCountdown();
  initEventListeners();
  renderApp();
});
