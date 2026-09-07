# SEFAZ/SC 2026 — Plataforma de Estudos

Plataforma web de preparação para o concurso público da **Secretaria de Estado da Fazenda de Santa Catarina (SEFAZ/SC) — Edital FCC nº 01/2026**, focada nos cargos:

- **A01 — Auditor Estadual de Finanças Públicas (Administração e Engenharias)**
- **E05 — Auditor Estadual de Finanças Públicas (Direito)**

> 💰 **Remuneração:** R$ 25.337,61 | 📅 **Prova:** 22/11/2026 | 🏙️ **Local:** Florianópolis/SC

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 👤 **Perfis Independentes** | Dois estudantes com dados 100% isolados no mesmo dispositivo |
| 📑 **Edital Verticalizado** | Checklist completo de teoria → resumo → questões → revisão por tópico |
| 🧮 **Simulador FCC** | Cálculo da Nota Padronizada em tempo real (fórmula oficial do item 8.4) |
| ⏱️ **Pomodoro + Horas** | Cronômetro com modos 25/5/15/livre e registro manual de sessões |
| 🏛️ **Legislação SC** | Normas estaduais prioritárias filtradas por cargo |
| 💾 **Backup JSON** | Export/Import completo dos dados de ambos os perfis |
| 🔔 **Toast Notifications** | Notificações não-bloqueantes (sem `alert()`) |
| 📱 **PWA** | Instalável como app no celular e desktop |

---

## 🏗️ Estrutura de Arquivos

```
SEFAZ/
├── index.html           # Interface principal (SPA)
├── manifest.json        # PWA manifest (M8)
├── css/
│   └── style.css        # Design system dark mode completo
├── js/
│   ├── data.js          # Matriz de dados do edital (A01 e E05)
│   └── app.js           # Lógica da aplicação
├── icons/               # Ícones PWA (192x192 e 512x512)
├── .gitignore
└── README.md
```

---

## 🚀 Como Usar Localmente

**Opção 1 — Abrir direto no navegador:**
```
Abra o arquivo index.html no Chrome, Edge, Firefox ou Safari
```

**Opção 2 — Servidor local (recomendado para PWA):**
```bash
# Python 3
python -m http.server 3000

# Node.js
npx serve .
```

Acesse: `http://localhost:3000`

---

## 📚 Conteúdo do Edital Coberto

### Prova 1 — Conhecimentos Gerais (80Q, Peso 1) — Comum a A01 e E05
- Língua Portuguesa
- Matemática Financeira, Estatística e Raciocínio Lógico
- Noções de Direito Constitucional e Administrativo (A01) / Incluídos no Específico (E05)
- **Ciência de Dados, IA Generativa, LLMs e LGPD** ⭐
- Ética, Integridade e Prevenção ao Assédio
- Conhecimentos Regionais de Santa Catarina

### Prova 2 — Conhecimentos Específicos (100Q, Peso 2)

**A01 — Administração e Engenharias:**
Planejamento/Orçamento (PPA/LDO/LOA/MTO 2027) · LRF · Spending Review · Riscos e Governança · NBC TSP 34 · Administração Geral e Estratégica

**E05 — Direito:**
Constitucional Avançado · Administrativo + Regimento SEF/SC · Financeiro/Orçamentário (LC 898/2026 SC) · Previdenciário (RPPS/SC - LC 412/2008) · Civil · Penal (Lei 8.137/1990, Lei 13.869/2019)

---

## 🔧 Tecnologias

- **HTML5 + CSS3 + JavaScript ES2022** (vanilla, sem frameworks)
- **LocalStorage** para persistência offline
- **Web Audio API** para sons do Pomodoro
- **SVG** para anel animado do cronômetro
- **PWA Manifest** para instalação como app

---

## 📄 Licença

Uso pessoal para preparação ao concurso SEFAZ/SC 2026. Dados e conteúdos baseados no Edital de Abertura FCC nº 01/2026.
