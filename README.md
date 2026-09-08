# SEFAZ/SC 2026 — Plataforma de Estudos (v4.0)

Plataforma web avançada e PWA offline para preparação ao concurso público da **Secretaria de Estado da Fazenda de Santa Catarina (SEFAZ/SC) — Edital FCC nº 01/2026**, focada nos cargos:

- **A01 — Auditor Estadual de Finanças Públicas (Administração e Engenharias)**
- **E05 — Auditor Estadual de Finanças Públicas (Direito)**

> 💰 **Remuneração:** R$ 25.337,61 | 📅 **Prova:** 22/11/2026 | 🏙️ **Local:** Florianópolis/SC | 📱 **PWA Offline Ready**

---

## ✨ Funcionalidades (v4.0)

| Módulo | Descrição |
|--------|-----------|
| 👤 **Perfis Independentes** | Dois estudantes (A01 e E05) com isolamento 100% dos dados, notas e progresso |
| 📊 **Dashboard & Métricas** | Horas líquidas, cobertura do edital, meta semanal editável e sequência de dias |
| 🔥 **Streaks & Gamificação** | Contador de dias seguidos (streaks) e badges/conquistas desbloqueáveis |
| 📅 **Cronograma Inteligente** | Cálculo semafórico automático (🟢 Viável / 🟡 Intenso / 🔴 Crítico) de ritmo diário |
| ⏱️ **Tempo por Disciplina** | Gráfico de barras com top 5 matérias mais estudadas e percentual de tempo |
| 📈 **Heatmap de Atividade** | Gráfico anual em SVG (estilo GitHub) mapeando a consistência de cada dia |
| 📑 **Edital Verticalizado** | Checklist de teoria, resumo, questões e revisão com badges 🔥 **Alta Incidência FCC** |
| 🔄 **Revisões R1/R7/R30** | Agenda espaçada automática com filtros por fase (Todos, R1 24h, R7 7d, R30 30d) |
| 🎮 **Quiz & Flashcards** | Treino de recuperação ativa com tópicos anotados e conceitos fundamentais FCC |
| 📝 **Simulado Real FCC** | Prova cronometrada com questões objetivas, cartão-resposta e gabarito comentado |
| 🧮 **Simulador FCC** | Nota Padronizada e Curva Normal (item 8.4) com **Presets de Cenário** rápidos |
| ⏱️ **Cronômetro & Foco Total** | Modos 25m, pausa 5m/15m e livre, fullscreen imersivo e registro manual |
| 📆 **Calendário Mensal** | Calendário interativo de estudos mapeando sessões e revisões dia a dia |
| 🏛️ **Legislação SC** | Normas estaduais (LC 741, Estatuto 6.745, RPPS 412, etc.) com links para texto oficial |
| 📊 **Placar Comparativo** | Duelo amigável A01 vs E05 destacando o melhor desempenho em cada métrica |
| 📑 **Relatório Semanal (.md)** | Exportação de relatório completo formatado em Markdown para acompanhamento |
| 🔗 **Sync via Link / QR Code** | Compartilhamento e backup instantâneo entre dispositivos sem servidor |
| ⚙️ **Ajustes & Personalização**| Seletor de temas (Dark Indigo, Dark Fazenda, Deep Navy, Cyber Slate) e sintetizador sonoro |
| 📱 **PWA Offline** | Service Worker completo (`sw.js`) permitindo estudar sem conexão com a internet |

---

## 🏗️ Estrutura de Arquivos

```
SEFAZ/
├── index.html           # Interface principal com 11 abas navegáveis (SPA)
├── manifest.json        # Manifesto PWA com suporte a instalação desktop/mobile
├── sw.js                # Service Worker para cache-first e funcionamento 100% offline
├── css/
│   └── style.css        # Design system premium com temas dark, badges e componentes
├── js/
│   ├── data.js          # Matriz do edital, classificador FCC e banco de questões
│   └── app.js           # Lógica da aplicação, áudio Web Audio API e sincronização
├── icons/               # Ícones PWA para telas de início
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 🚀 Como Executar Localmente

### Opção 1 — Servidor local (Recomendado para PWA):
```bash
# Python 3
python -m http.server 3000

# Node.js
npx serve .
```
Acesse: `http://localhost:3000`

### Opção 2 — Abrir direto no navegador:
Dê um duplo clique no arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

---

## 🔧 Tecnologias Utilizadas

- **HTML5 Semântico & Vanilla JavaScript ES2022** (sem dependências externas)
- **CSS3 Moderno** com Glassmorphism, CSS Custom Properties e temas dinâmicos
- **Service Worker API & Cache Storage** para execução PWA offline
- **Web Audio API** para síntese sonora nativa (Beep, Bell, Chime) sem arquivos externos
- **SVG Nativo** para curva normal, gráficos de barras, heatmap e matriz QR Code
- **Browser Notification API** para lembretes automáticos de revisão
- **LocalStorage API** para persistência e isolamento completo dos perfis

---

## 📄 Licença e Finalidade

Desenvolvido para preparação ao concurso público SEFAZ/SC 2026. Conteúdos e disciplinas estruturados com base no Edital de Abertura FCC nº 01/2026.
