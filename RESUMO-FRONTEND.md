# SEFAZ/SC 2026 — Resumo do Frontend

Plataforma de estudos PWA para o concurso **SEFAZ/SC 2026 — Auditor Estadual de Finanças Públicas (A01 e E05)**. Offline-first, sem dependências externas, 100% HTML/CSS/JS vanilla.

---

## 1. Visão Geral

| Item | Valor |
|---|---|
| Alvo | Concurso SEFAZ/SC 2026 · Banca FCC · Prova 22/11/2026 · Florianópolis/SC |
| Perfis | A01 (Administração/Engenharia) e E05 (Direito), dados independentes |
| Tipo | PWA offline (cache-first) instalável |
| Dependências | Zero (nenhuma lib externa) |
| Persistência | `localStorage` (dados de A01 e E05 separados) |

---

## 2. Estrutura de Arquivos

```
.
├── index.html          # Shell da aplicação (786 linhas)
├── manifest.json       # Metadados PWA (instalação)
├── sw.js               # Service Worker v4.1 (cache-first)
├── icon-*.png          # (na pasta icons/) ícones 192/512 instaláveis
├── css/
│   └── style.css       # Design system completo (~2878 linhas)
├── js/
│   ├── data.js         # Edital, matérias, questões FCC (só dados)
│   └── app.js          # Lógica da aplicação (~100 KB)
└── fonts/
    ├── public-sans-latin.woff2      # UI / corpo
    └── ibm-plex-mono-400/500/600.woff2  # números / rótulos
```

---

## 3. Design System (`css/style.css`)

- **Tipografia:** Public Sans (interface) + IBM Plex Mono (números, etiquetas uppercase), woff2 locais.
- **Temas (4, todos em modo claro com contraste AA):** `emerald` (padrão) / `indigo` / `navy` / `slate`, aplicados via atributo `data-theme` no `<html>` e trocados pelo seletor em Ajustes (`applyTheme`).
- **Paleta:** fundo claro `#f4f6fa`, superfícies brancas, accent esmeralda `#0a8f68`; flat (sem gradientes/glows), hairlines em vez de sombras fortes.
- **Tokens custom:** cores (`--text-*`, `--accent-*`, `--danger`), linhas (`--border*`, `--line-*`), barras/heatmap (`--bar-*`, `--hm0..4`) consumidos pelo runtime do `app.js`.
- **Tokens de contraste por tema:** `--on-accent` (texto sobre accent: escuro no emerald/slate, branco no indigo/navy) e `--accent-hover` — todos os botões primários ≥ 4.5:1.
- **Formas:** raio fixo 10px (painéis/botões/inputs), pílulas 999px, chevrons via CSS (`::after`).
- **Serviço de ícones:** sprite SVG oculto com 28 símbolos (`i-*`); helper `ic(name, size)` no JS.
- **Acessibilidade:** skip-link, `aria-label` em botões só-ícone e selects, `for`/`id` ligados nos campos, `role="command"` + teclado na zona de import, `:focus-visible` personalizado, `prefers-reduced-motion` que zera animações.
- **Animação (perf):** apenas keyframes de `opacity`/`transform`; `will-change` só nos elementos que animam; entradas de toast/modal/focus-overlay via keyframes dedicadas.

---

## 4. Arquitetura JS (`js/app.js`)

### Estado e Persistência
- `AppState` — estado global em memória (config, dados A01/E05, seletores).
- `loadProfilesData()` / `saveProfilesData()` — carga/salvamento em `localStorage`; dados separados por perfil.
- `getCurrentProfile()` — perfil ativo (A01/E05).
- `showToast(message, type)` — notificações não intrusivas na tela.
- `ic(name, size)` — renderiza `<svg><use href="#i-…"/></svg>` (ícones do sprite).
- `localDateKey(d)` — data local `YYYY-MM-DD` (todas as agregações usam horário local).

### Cabeçalho e Gamificação
- `initCountdown()` — contagem regressiva até a prova (22/11/2026).
- `calculateStreaks()` — sequência atual e recorde de dias de estudo.
- `renderGamificationBadges()` — conquistas por frequência/dedicação.

### Dashboard
- `renderDashboardMetrics()` — horas líquidas, % do edital, tópicos c/ teoria, questões, meta semanal, streak.
- `renderCronograma()` — cronograma recomendado contra a data limite do edital.
- `renderSubjectHours()` — horas por disciplina.
- `renderProgressChart()` — cobertura do edital por matéria.
- `renderWeeklyChart()` — horas dos últimos 7 dias (barras).
- `renderHeatmap()` — mapa de calor de consistência diária (5 níveis, `--hm0..4`).
- `renderDashboardTips()` — dicas táticas por cargo (controle de candidatos).

### Edital e Revisões
- `renderEditalVerticalizado()` — árvore disciplinas → tópicos, busca, filtros (alta incidência FCC, pendentes, concluídos, não iniciados, com anotação), expandir/colapsar, exportar PDF.
- `handleCheckLabelClick()` — marcar teoria/lida; `updateDiscMiniBar()` — barra de progresso da disciplina.
- **Revisão espaçada R1/R7/R30** — `renderRevisoes()` agenda revisões em +1/+7/+30 dias após marcar teoria.

### Quiz e Simulados
- `initQuiz()` / `renderQuizCard()` — flashcards ativos (anotações próprias + alta frequência FCC), taxa de retenção.
- `startSimulado()` / `renderSimuladoQuestions()` / `renderSimuladoBubbles()` — simulado real cronometrado com folha de respostas.
- `updateSimulatorCalculations()` — calculadora de **nota padronizada FCC**: `NP = [((Acertos − Média)/DP) × 10] + 50`, nota final `NP1×1 + NP2×2`, eliminado se < 150 pts.
- `renderNormalCurve()` — curvas de distribuição normal P1/P2 desenhadas em canvas/SVG.

### Cronômetro e Calendário
- Painel Pomodoro completo: Foco 25m / Pausa 5m / Pausa 15m / Livre.
- `setTimerMode()`, `startTimer()`, `pauseTimer()`, `resetTimer()`, `updateTimerDisplay()` — lógica do cronômetro (círculo de progresso SVG, circunferência 565.48).
- `completeTimerSession()` / `registerStudySession()` / `saveManualSession()` — sessões registradas alimentam gráficos e heatmap.
- `toggleFocusMode()` — overlay de foco total em tela cheia.
- `renderCalendar()` — calendário mensal com detalhes por dia.
- `renderStudyLogs()` — histórico recente de sessões.

### Legislação, Placar e Configuração
- `renderLegislacaoSC()` — normas estaduais exigidas por cargo, com link "Texto Oficial".
- `renderPlacar()` — comparativo de progresso A01 vs E05.
- Configurações: nomes e metas de A01/E05, tema, som do alarme, notificações, duração padrão do bloco de foco.
- `applyTheme(themeName)` — aplica tema + persiste.

### Backup e Sincronização (sem servidor)
- `exportWeeklyReport()` — relatório semanal em Markdown (`Baixar Relatório .md`).
- `generateSyncLink()` — link com os dados codificados (sync via URL).
- `showQrCode()` / `checkSyncUrl()` — transferência via QR Code / link (sem subir arquivos).
- `exportBackup()` / `importBackup()` — backup completo JSON + restauração via drop zone.
- Notificações do navegador (`initNotifications`, `requestNotificationPermission`, `sendNotification`) e PWA (`initPWA`, botão "Instalar App").

---

## 5. PWA & Offline (`sw.js`, `manifest.json`)

- **Cache v4.1** (`sefaz-sc-refined-4.1`): `./`, `index.html`, `css/style.css`, `js/data.js`, `js/app.js`, `manifest.json`, ícones 192/512, 4 fontes woff2.
- Estratégia **cache-first** com atualização em segundo plano; fallback para `index.html` quando offline em navegação.
- `install` → pré-cache + `skipWaiting`; `activate` → limpa caches antigos + `claim`.
- Manifest: display `standalone`, tema esmeralda, ícones maskable.

---

## 6. Contrato de Integridade

- **126 IDs obrigatórios** em `index.html`, verificado contra as referências do `app.js` (0 faltando, 0 duplicados).
- Hooks de classe mantidos estáticos (`nav-tab-btn`, `btn-action`, `metric-card`, `hm-dot`, etc.).
- Fontes, sprite de ícones, tokens `--hm*`/`--bar-*`/`--line-*` exigidos pelo runtime — todos presentes.