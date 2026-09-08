/**
 * Matriz Completa de Disciplinas e Conteúdos Programáticos
 * Concurso SEFAZ/SC 2026 - Auditor Estadual de Finanças Públicas
 * Extraído rigorosamente do Edital de Abertura FCC nº 01/2026
 */

const EDITAL_DATA = {
  info: {
    orgao: "Secretaria de Estado da Fazenda de Santa Catarina (SEFAZ/SC)",
    edital: "Edital nº 01/2026",
    banca: "Fundação Carlos Chagas (FCC)",
    cargoGeral: "Auditor Estadual de Finanças Públicas",
    remuneracao: "R$ 25.337,61",
    jornada: "40 horas semanais",
    dataProva: "2026-11-22T08:00:00-03:00",
    dataFimInscricao: "2026-10-05T23:59:00-03:00",
    dataPagamento: "2026-10-06T22:00:00-03:00",
    taxaInscricao: 200.0,
    localProva: "Florianópolis/SC"
  },

  cargos: {
    A01: {
      codigo: "A01",
      nome: "Administração e Engenharias",
      vagas: { total: 6, ampla: 5, pcd: 1 },
      requisito: "Diploma em Administração, Administração Pública ou Engenharias reconhecido pelo MEC + Registro no respectivo conselho profissional.",
      p1: {
        nome: "Conhecimentos Gerais (P1)",
        duracao: "4 horas (Manhã)",
        questoes: 80,
        peso: 1,
        disciplinas: [
          {
            id: "cg-lp",
            nome: "Língua Portuguesa",
            peso: 1,
            topicos: [
              "Redação Oficial",
              "Ortografia e acentuação gráfica",
              "Emprego do sinal indicativo de crase",
              "Compreensão e interpretação de textos de gêneros variados",
              "Relação do texto com seu contexto histórico",
              "Denotação e conotação",
              "Discurso direto, indireto e indireto livre",
              "Intertextualidade e figuras de linguagem",
              "Morfossintaxe: elementos estruturais e formação de palavras",
              "Sinonímia e antonímia",
              "Pontuação",
              "Pronomes: emprego, colocação e funções",
              "Concordância nominal e concordância verbal",
              "Flexão nominal e flexão verbal",
              "Vozes do verbo e correlação de tempos/modos verbais",
              "Regência nominal e regência verbal",
              "Coordenação e subordinação. Conectivos",
              "Redação: frases corretas/incorretas, reorganização e transformação de estruturas"
            ]
          },
          {
            id: "cg-mat-est-rlm",
            nome: "Matemática Fin., Estatística e RLM",
            peso: 1,
            topicos: [
              "Juros simples: montante, juros, taxa real, efetiva e equivalentes",
              "Juros compostos e capitais equivalentes",
              "Capitalização contínua",
              "Descontos: simples, composto, racional e comercial",
              "Sistemas de Amortização: Tabela Price (Francês), SAC e Sistema Misto",
              "Fluxo de caixa, Valor Atual Líquido (VPL) e Taxa Interna de Retorno (TIR)",
              "Estatística Descritiva: gráficos, tabelas, média, moda, mediana, quartis e variabilidade",
              "Análise Combinatória: arranjos, permutações e combinações com/sem repetição",
              "Probabilidade: espaço amostral, axiomas e distribuições discretas/contínuas (Binomial, Normal, Poisson, t-Student)",
              "Inferência Estatística: amostragem, estimativa pontual, intervalos de confiança",
              "Testes de hipóteses para médias e proporções",
              "Correlação e regressão linear simples",
              "Raciocínio Lógico: dedução de relações, proposições, quantificadores, validade de argumentos"
            ]
          },
          {
            id: "cg-dir-const",
            nome: "Noções de Direito Constitucional",
            peso: 1,
            topicos: [
              "Princípios fundamentais da CF/88",
              "Direitos e garantias fundamentais (art. 5º a 17 da CF/88)",
              "Organização político-administrativa do Estado: União, Estados, DF e Municípios",
              "Administração Pública: disposições gerais e servidores públicos",
              "Poder Executivo: atribuições do Presidente da República",
              "Poder Legislativo: estrutura, funcionamento e fiscalização contábil/financeira/orçamentária",
              "Finanças Públicas na CF/88",
              "Ordem Econômica e Financeira: princípios gerais da atividade econômica",
              "Ordem Social: Seguridade Social e Mínimos Constitucionais federais/estaduais",
              "Constituição do Estado de Santa Catarina (disposições gerais)"
            ]
          },
          {
            id: "cg-dir-adm",
            nome: "Noções de Direito Administrativo",
            peso: 1,
            topicos: [
              "Poderes da Administração Pública",
              "Responsabilidade Civil do Estado",
              "Controle da Administração Pública",
              "Lei Complementar nº 741/2019 (Estrutura organizacional do Estado de Santa Catarina)",
              "Lei nº 6.745/1985 (Estatuto dos Servidores Públicos Civis de Santa Catarina)",
              "Lei nº 12.527/2011 (Lei de Acesso à Informação - LAI)",
              "Lei nº 8.429/1992 e alterações da Lei nº 14.230/2021 (Lei de Improbidade Administrativa)",
              "Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos)"
            ]
          },
          {
            id: "cg-dados-ia",
            nome: "Ciência e Análise de Dados & IA",
            peso: 1,
            destaque: true,
            topicos: [
              "Conceitos fundamentais de Ciência e Análise de Dados no setor público e controle",
              "Dados estruturados, semiestruturados e não estruturados",
              "Coleta, qualidade, tratamento, análise e interpretação de dados",
              "Identificação de padrões, tendências, correlações e anomalias",
              "Business Intelligence (BI), analytics, data mining e web scraping",
              "Indicadores, métricas, relatórios gerenciais, dashboards e visualização de dados",
              "Ferramentas analíticas para extração, cruzamento e comunicação de informações",
              "Governo Digital, transformação digital, serviços públicos digitais e interoperabilidade",
              "Conceitos de IA, Aprendizado de Máquina (Machine Learning), IA Generativa e Modelos de Linguagem (LLMs)",
              "Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018): princípios, bases legais, direitos dos titulares e tratamento pelo Poder Público",
              "Compartilhamento, segurança da informação e incidentes com dados pessoais"
            ]
          },
          {
            id: "cg-etica",
            nome: "Ética, Integridade e Prevenção",
            peso: 1,
            topicos: [
              "Ética no setor público: princípios, deveres e vedações institucionais",
              "Programas de integridade e compliance na administração pública: gestão de riscos de fraude e corrupção",
              "Prevenção e combate ao assédio moral e sexual no ambiente de trabalho",
              "Combate a discriminações (gênero, raça, orientação sexual, idade e PcD)",
              "Lei Anticorrupção (Lei Federal nº 12.846/2013)"
            ]
          },
          {
            id: "cg-reg-sc",
            nome: "Conhecimentos Regionais de Santa Catarina",
            peso: 1,
            topicos: [
              "História do Estado de Santa Catarina",
              "Geografia física, humana e divisão regional de Santa Catarina",
              "Cultura e identidade catarinense",
              "Estrutura política e formação institucional de SC",
              "Economia de Santa Catarina: matriz produtiva, setores industriais, agronegócio e tecnologia"
            ]
          }
        ]
      },
      p2: {
        nome: "Conhecimentos Específicos (P2)",
        duracao: "5 horas (Tarde)",
        questoes: 100,
        peso: 2,
        disciplinas: [
          {
            id: "ce-a01-orc",
            nome: "Ciclo de Planejamento e Gestão Orçamentária",
            peso: 2,
            topicos: [
              "Processo de planejamento público: PPA, LDO e LOA",
              "Conceitos e funções econômicas do orçamento público",
              "Emendas Parlamentares: individuais, de bancada e impositivas",
              "Revisão de Gastos (Spending Review)",
              "Técnicas orçamentárias: orçamento-programa",
              "Execução orçamentária e financeira: créditos adicionais",
              "Receita e despesa pública: conceitos, estágios e renúncia de receita",
              "Reforma Tributária na Constituição Federal",
              "Manual Técnico de Orçamento MPO/SOF (MTO 2027)",
              "Manual de Contabilidade Aplicada ao Setor Público (MCASP)",
              "Portaria STN nº 710/2021 e Portaria Conjunta STN/SOF nº 163/2001"
            ]
          },
          {
            id: "ce-a01-lrf",
            nome: "Responsabilidade Fiscal (LRF)",
            peso: 2,
            topicos: [
              "Lei Complementar Federal nº 101/2000 e suas alterações",
              "Anexo de Metas Fiscais e Anexo de Riscos Fiscais",
              "Resultados Primário e Nominal",
              "Programação financeira, cronograma de desembolso e limitação de empenho",
              "Receita Corrente Líquida (RCL): cálculo e deduções",
              "Geração de despesa e Despesa Obrigatória de Caráter Continuado (DOCC)",
              "Despesa Total com Pessoal (DTP): apuração, limites prudenciais e recondução",
              "Transferências voluntárias e destinação de recursos ao setor privado",
              "Dívida e endividamento público. Operações de crédito, garantias e contragarantias",
              "Disponibilidade de caixa e Restos a Pagar",
              "Relatório Resumido da Execução Orçamentária (RREO) e Relatório de Gestão Fiscal (RGF)"
            ]
          },
          {
            id: "ce-a01-gov",
            nome: "Gestão de Riscos, Governança e Resultados",
            peso: 2,
            topicos: [
              "Gestão de Riscos Fiscais e Riscos Organizacionais",
              "Governança pública: liderança, estratégia e controle",
              "Gestão por resultados no setor público: indicadores (eficiência, eficácia, efetividade, economicidade)",
              "Desenho, monitoramento e avaliação de políticas públicas",
              "Gestão e monitoramento de processos e projetos públicos"
            ]
          },
          {
            id: "ce-a01-custos",
            nome: "Custos no Setor Público (NBC TSP 34)",
            peso: 2,
            topicos: [
              "NBC TSP 34 – Custos no Setor Público: conceitos, padrões e objetivos",
              "Objetos de custos e centros de responsabilidade",
              "Direcionadores de custos, custos diretos/indiretos, fixos/variáveis",
              "Métodos de custeio no setor público",
              "Sistema de Informação de Custos (SIC): implantação e governança",
              "Integração das informações orçamentárias, patrimoniais, financeiras e de custos",
              "Avaliação da eficiência de serviços públicos e apoio à tomada de decisão"
            ]
          },
          {
            id: "ce-a01-adm-geral",
            nome: "Administração Geral",
            peso: 2,
            topicos: [
              "Teorias da Administração e evolução das escolas administrativas",
              "Metáforas organizacionais e funções do administrador (PODC)",
              "Estrutura organizacional e tipos de organização",
              "Processo decisório e tipologia das decisões",
              "Organização Racional do Trabalho (ORT), eficiência e eficácia",
              "Centralização, descentralização e departamentalização",
              "Organizações formais e informais. Visão sistêmica",
              "Noções fundamentais de Gerenciamento de Projetos"
            ]
          },
          {
            id: "ce-a01-adm-estr",
            nome: "Administração Estratégica",
            peso: 2,
            topicos: [
              "Planejamento Estratégico: missão, visão e valores",
              "Diagnóstico de ambiente interno e externo",
              "Formulação, implementação e controle estratégico",
              "Ferramentas diagnósticas: Matriz SWOT, 5 Forças de Porter e Cadeia de Valor",
              "Indicadores de desempenho estratégico (OKRs, BSC)"
            ]
          }
        ]
      }
    },

    E05: {
      codigo: "E05",
      nome: "Direito",
      vagas: { total: 8, ampla: 7, pcd: 1 },
      requisito: "Diploma devidamente registrado em Direito reconhecido pelo MEC.",
      p1: {
        nome: "Conhecimentos Gerais (P1)",
        duracao: "4 horas (Manhã)",
        questoes: 80,
        peso: 1,
        disciplinas: [
          {
            id: "cg-e05-lp",
            nome: "Língua Portuguesa",
            peso: 1,
            topicos: [
              "Redação Oficial",
              "Ortografia e acentuação gráfica",
              "Emprego do sinal indicativo de crase",
              "Compreensão e interpretação de textos de gêneros variados",
              "Relação do texto com seu contexto histórico",
              "Denotação e conotação",
              "Discurso direto, indireto e indireto livre",
              "Intertextualidade e figuras de linguagem",
              "Morfossintaxe e processos de formação de palavras",
              "Sinonímia e antonímia. Pontuação",
              "Pronomes, concordância nominal e verbal",
              "Vozes do verbo e correlação verbal",
              "Regência nominal e regência verbal",
              "Coordenação, subordinação e conectivos",
              "Redação e reconstrução de sentenças"
            ]
          },
          {
            id: "cg-e05-mat-est-rlm",
            nome: "Matemática Fin., Estatística e RLM",
            peso: 1,
            topicos: [
              "Juros simples: montante, juros, taxas reais e equivalentes",
              "Juros compostos e capitais equivalentes",
              "Capitalização contínua e descontos simples e compostos",
              "Sistemas de amortização: Tabela Price, SAC e misto",
              "Fluxo de caixa, VPL e Taxa Interna de Retorno (TIR)",
              "Estatística Descritiva: médias, mediana, moda, quartis, dispersão",
              "Análise Combinatória: arranjos, permutações, combinações",
              "Probabilidade e distribuições: Bernoulli, Binomial, Normal, Poisson, t de Student",
              "Inferência Estatística, intervalos de confiança e testes de hipóteses",
              "Regressão linear simples e correlação",
              "Raciocínio Lógico formal, tabelas-verdade, argumentos lógicos válidos"
            ]
          },
          {
            id: "cg-e05-dados-ia",
            nome: "Ciência e Análise de Dados & IA",
            peso: 1,
            destaque: true,
            topicos: [
              "Fundamentos de Ciência e Análise de Dados na Administração Pública",
              "Dados estruturados, semiestruturados e não estruturados",
              "Tratamento, qualidade, correlação e detecção de anomalias",
              "Business Intelligence, analytics, mineração de dados e web scraping",
              "Dashboards gerenciais e visualização analítica",
              "Governo Digital, interoperabilidade e serviços públicos digitais",
              "Conceitos de IA, Machine Learning, IA Generativa e Modelos LLMs",
              "LGPD (Lei nº 13.709/2018): bases legais, direitos do titular, setor público",
              "Segurança e incidentes com dados pessoais"
            ]
          },
          {
            id: "cg-e05-etica",
            nome: "Ética, Integridade e Prevenção",
            peso: 1,
            topicos: [
              "Ética no setor público: princípios, deveres e proibições",
              "Programas de integridade e compliance: gestão de riscos de corrupção",
              "Combate e prevenção aos assédios moral e sexual no serviço público",
              "Políticas de combate a discriminações no ambiente laboral",
              "Lei Anticorrupção nº 12.846/2013"
            ]
          },
          {
            id: "cg-e05-reg-sc",
            nome: "Conhecimentos Regionais de Santa Catarina",
            peso: 1,
            topicos: [
              "História do Estado de Santa Catarina",
              "Geografia física, relevo, clima e demografia de Santa Catarina",
              "Cultura regional catarinense e imigração",
              "Organização política e marcos do Estado",
              "Economia de SC: polos industriais, agronegócio e tecnologia"
            ]
          }
        ]
      },
      p2: {
        nome: "Conhecimentos Específicos (P2)",
        duracao: "5 horas (Tarde)",
        questoes: 100,
        peso: 2,
        disciplinas: [
          {
            id: "ce-e05-const",
            nome: "Direito Constitucional",
            peso: 2,
            topicos: [
              "Constituição da República de 1988: princípios fundamentais",
              "Direitos e garantias fundamentais individuais e coletivos",
              "Organização do Estado e repartição de competências federativas",
              "Administração Pública e regime dos servidores públicos",
              "Poder Executivo e atribuições presidenciais",
              "Poder Legislativo: processo legislativo, fiscalização contábil/financeira",
              "Poder Judiciário: estrutura, competências e Funções Essenciais à Justiça",
              "Controle de Constitucionalidade difuso, concentrado e controle estadual",
              "Ordem Econômica e Financeira",
              "Ordem Social, Seguridade Social e Mínimos Constitucionais vinculados",
              "Constituição do Estado de Santa Catarina"
            ]
          },
          {
            id: "ce-e05-adm",
            nome: "Direito Administrativo & Normas de SC",
            peso: 2,
            topicos: [
              "Estado, Governo e Administração Pública: fontes e conceitos",
              "Atos administrativos: requisitos, atributos, extinção, anulação e revogação",
              "Agentes públicos: provimento, vacância, estabilidade, regime disciplinar",
              "Poderes administrativos e regime jurídico-administrativo",
              "Responsabilidade civil objetiva e subjetiva do Estado e ação de regresso",
              "Serviços públicos, concessões, permissões e PPPs (Lei nº 8.987/1995)",
              "Organização administrativa: direta, indireta e Terceiro Setor (OS, OSCIP)",
              "Controle interno, externo, judicial e Tribunais de Contas",
              "Lei de Improbidade Administrativa (Lei nº 8.429/1992 com alterações da Lei nº 14.230/2021)",
              "Lei Anticorrupção nº 12.846/2013",
              "Nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021)",
              "Bens públicos: regime jurídico, afetação e desafetação",
              "LAI (Lei nº 12.527/2011) e LGPD (Lei nº 13.709/2018)",
              "Legislação Estadual SC: LC nº 741/2019 (Estrutura do Executivo)",
              "Legislação Estadual SC: Lei nº 6.745/1985 (Estatuto do Servidor SC)",
              "Legislação Estadual SC: Decreto nº 2.094/2022 (Regimento Interno SEF/SC)"
            ]
          },
          {
            id: "ce-e05-fin",
            nome: "Direito Financeiro e Orçamentário",
            peso: 2,
            topicos: [
              "Finanças Públicas na CF/88: normas gerais e princípios orçamentários",
              "Processo legislativo orçamentário: PPA, LDO e LOA",
              "Emendas parlamentares impositivas individuais e de bancada",
              "Lei Federal nº 4.320/1964: receita e despesa pública, créditos adicionais",
              "Lei de Responsabilidade Fiscal (LC nº 101/2000): equilíbrio, limites de pessoal, restos a pagar",
              "Reforma Tributária na Constituição Federal",
              "Legislação Estadual SC: Lei Complementar nº 898/2026 (Emendas Parlamentares em SC)",
              "Legislação Estadual SC: Lei nº 7.541/1988 (Lei das Taxas de SC)",
              "Desvinculação de Receitas de Estados e Municípios (DREM)"
            ]
          },
          {
            id: "ce-e05-prev",
            nome: "Direito Previdenciário",
            peso: 2,
            topicos: [
              "Regime Geral de Previdência Social (RGPS) e regimes previdenciários",
              "Regimes Próprios de Previdência Social (RPPS) e Previdência Complementar (RPC)",
              "Contagem recíproca e compensação financeira entre regimes",
              "Reforma da Previdência (Emenda Constitucional nº 103/2019)",
              "Custeio do RPPS e equilíbrio financeiro e atuarial",
              "Certificado de Regularidade Previdenciária (CRP)",
              "Legislação Estadual SC: Lei Complementar nº 412/2008 (RPPS de Santa Catarina)"
            ]
          },
          {
            id: "ce-e05-civil",
            nome: "Direito Civil",
            peso: 2,
            topicos: [
              "LINDB: vigência, aplicação, interpretação e integração das leis",
              "Pessoas naturais: personalidade, capacidade e direitos da personalidade",
              "Pessoas jurídicas: associações e fundações",
              "Bens móveis, imóveis e públicos",
              "Fatos e negócios jurídicos: validade, defeitos e invalidade",
              "Prescrição e decadência",
              "Teoria geral das obrigações, adimplemento e mora",
              "Contratos: princípios, espécies e responsabilidade civil contratual e extracontratual",
              "Direito das coisas e formas de exploração (posse, usufruto, locação, arrendamento)"
            ]
          },
          {
            id: "ce-e05-penal",
            nome: "Direito Penal",
            peso: 2,
            topicos: [
              "Princípios penais: legalidade e anterioridade",
              "Crimes contra a Fé Pública: falsidade documental e títulos públicos",
              "Crimes contra a Administração Pública: praticados por funcionários e por particulares",
              "Crimes contra as Finanças Públicas (Código Penal)",
              "Lei nº 8.137/1990 (Crimes contra a Ordem Tributária, Econômica e Relações de Consumo)",
              "Lei nº 13.869/2019 (Crimes de Abuso de Autoridade)"
            ]
          }
        ]
      }
    }
  },

  legislacaoSC: [
    {
      sigla: "LC nº 741/2019",
      nome: "Estrutura Organizacional do Estado de SC",
      cargos: ["A01", "E05"],
      importancia: "Crítica",
      resumo: "Define os órgãos da administração direta e indireta do Poder Executivo catarinense e o papel central da SEF/SC.",
      url: "https://leisestaduais.com.br/sc/lei-complementar-n-741-2019-santa-catarina"
    },
    {
      sigla: "Lei nº 6.745/1985",
      nome: "Estatuto dos Servidores Públicos Civis de SC",
      cargos: ["A01", "E05"],
      importancia: "Crítica",
      resumo: "Regula deveres, direitos, licenças, regime disciplinar e processo administrativo dos servidores de SC.",
      url: "https://leisestaduais.com.br/sc/lei-n-6745-1985-santa-catarina"
    },
    {
      sigla: "Decreto nº 2.094/2022",
      nome: "Regimento Interno da SEF/SC",
      cargos: ["E05"],
      importancia: "Alta",
      resumo: "Regulamento interno definindo competências operacionais e estrutura dos sistemas financeiro e contábil da SEF/SC.",
      url: "https://www.sef.sc.gov.br/legislacao"
    },
    {
      sigla: "LC nº 898/2026",
      nome: "Execução de Emendas Parlamentares em SC",
      cargos: ["E05"],
      importancia: "Alta (Novidade)",
      resumo: "Norma catarinense de 2026 regulando o rito das emendas orçamentárias no âmbito estadual.",
      url: "https://alesc.sc.gov.br/legislacao"
    },
    {
      sigla: "LC nº 412/2008",
      nome: "Regime Próprio de Previdência de SC (RPPS/SC)",
      cargos: ["E05"],
      importancia: "Alta",
      resumo: "Regula o IPREV e o regime de previdência funcional dos servidores catarinenses.",
      url: "https://leisestaduais.com.br/sc/lei-complementar-n-412-2008-santa-catarina"
    },
    {
      sigla: "Lei nº 7.541/1988",
      nome: "Lei das Taxas do Estado de Santa Catarina",
      cargos: ["E05"],
      importancia: "Média",
      resumo: "Tabelas e hipóteses de incidência de taxas por atos de polícia e prestação de serviços estaduais.",
      url: "https://leisestaduais.com.br/sc/lei-n-7541-1988-santa-catarina"
    }
  ]
};

/* ============================================================
   CLASSIFICADOR DE INCIDÊNCIA FCC (4A.3)
============================================================ */
function getTopicFccFreq(topicName, discId = '') {
  if (!topicName) return 'media';
  const t = topicName.toLowerCase();
  
  // Alta incidência histórica na FCC
  const altaKeywords = [
    'crase', 'regência', 'concordância', 'pontuação', 'redação oficial',
    'controle de constitucionalidade', 'direitos e garantias fundamentais', 'repartição de competências',
    'licitações e contratos', 'lei nº 14.133', 'improbidade', 'agentes públicos', 'poderes administrativos',
    'lei de responsabilidade fiscal', 'lc nº 101', 'orçamento público', 'créditos adicionais',
    'restos a pagar', 'despesa pública', 'receita pública', 'mcasp', 'nbc tsp', 'balanço orçamentário',
    'plano de contas', 'variações patrimoniais', 'lei nº 6.745', 'lc nº 741', 'lc nº 412',
    'lei nº 8.137', 'crimes contra a ordem tributária', 'lgpd', 'business intelligence', 'banco de dados'
  ];

  // Baixa incidência (teorias secundárias ou exóticas)
  const baixaKeywords = [
    'contexto histórico', 'figuras de linguagem', 'sistemas de numeração', 'números complexos',
    'relações internacionais', 'evolução histórica da administração', 'código de ética de ontário'
  ];

  if (altaKeywords.some(k => t.includes(k))) return 'alta';
  if (baixaKeywords.some(k => t.includes(k))) return 'baixa';
  return 'media';
}

/* ============================================================
   BANCO DE QUESTÕES FCC — MOCK EXAM & QUIZ (4A.5 & 4C.1)
============================================================ */
const FCC_QUESTIONS = [
  {
    id: 1,
    cargo: "todos",
    disciplina: "Língua Portuguesa",
    enunciado: "De acordo com as normas de regência e crase da Língua Portuguesa padrão, assinale a alternativa correta:",
    opcoes: [
      "O auditor visava ao cumprimento rigoroso das metas fiscais estabelecidas na LRF.",
      "A autoridade fazendária preferiu adiar a inspeção do que emitir parecer incompleto.",
      "Informamos à todos os contribuintes que o prazo de adesão se encerra hoje.",
      "O servidor aspirava o cargo de auditor com determinação inabalável.",
      "Chegamos na repartição estadual exatamente às 8h da manhã."
    ],
    correta: 0,
    explicacao: "O verbo 'visar' no sentido de ter como objetivo/almejar é transitivo indireto e exige a preposição 'a' (visava ao cumprimento). 'Preferir' rege 'a' (preferiu X a Y, e não do que). Não há crase antes de pronome indefinido 'todos'. 'Aspirar' no sentido de desejar exige 'a'. 'Chegar' rege 'a' e não 'em'."
  },
  {
    id: 2,
    cargo: "todos",
    disciplina: "Direito Constitucional",
    enunciado: "No que concerne ao controle concentrado de constitucionalidade perante o Supremo Tribunal Federal, é correto afirmar:",
    opcoes: [
      "A declaração de inconstitucionalidade em controle concentrado produz efeitos erga omnes e ex nunc como regra geral absoluta.",
      "Governador de Estado possui legitimidade ativa universal, dispensada a demonstração de pertinência temática.",
      "A Mesa da Assembleia Legislativa de SC é legitimada especial, exigindo-se a demonstração de pertinência temática na propositura de ADI.",
      "Não se admite modulação temporal dos efeitos da decisão que declara a inconstitucionalidade por razões de segurança jurídica.",
      "A Ação Declaratória de Constitucionalidade (ADC) pode ter como objeto lei estadual ou municipal."
    ],
    correta: 2,
    explicacao: "Conforme jurisprudência pacífica do STF e art. 103 da CF/88, as Mesas das Assembleias Legislativas e os Governadores de Estado são legitimados especiais, exigindo pertinência temática. A regra de efeitos é ex tunc (com possibilidade de modulação por 2/3). ADC só cabe para lei federal."
  },
  {
    id: 3,
    cargo: "todos",
    disciplina: "Direito Administrativo",
    enunciado: "Sobre a Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos), assinale a afirmativa correta:",
    opcoes: [
      "A tomada de preços e o convite continuam sendo modalidades licitatórias aplicáveis subsidiariamente.",
      "O diálogo competitivo é modalidade de licitação aplicável para contratações que envolvam inovação tecnológica ou técnica complexa.",
      "A fase de habilitação sempre antecede a fase de julgamento das propostas, sem hipótese de inversão de fases.",
      "A dispensa de licitação em razão do valor não exige prévio procedimento de divulgação eletrônica.",
      "Os agentes de contratação respondem solidariamente por quaisquer falhas técnicas dos pareceres jurídicos emitidos."
    ],
    correta: 1,
    explicacao: "A Lei 14.133/2021 extinguiu convite e tomada de preços e introduziu o Diálogo Competitivo (art. 6º, XLII e art. 32). A regra geral na 14.133/2021 é o julgamento das propostas antes da habilitação (inversão é a regra)."
  },
  {
    id: 4,
    cargo: "todos",
    disciplina: "Legislação SC",
    enunciado: "Segundo a Lei Complementar Estadual nº 741/2019 de Santa Catarina, a Secretaria de Estado da Fazenda (SEF):",
    opcoes: [
      "É subordinada diretamente à Procuradoria-Geral do Estado nas decisões sobre o orçamento estadual.",
      "Constitui órgão de execução vinculada que atua exclusivamente na fiscalização de trânsito de mercadorias.",
      "É órgão central de planejamento financeiro, administração tributária, contabilidade pública e auditoria das finanças estaduais.",
      "Não possui competência para gerir a dívida pública fundada do Estado de Santa Catarina.",
      "Tem suas atribuições fixadas exclusivamente por portarias do Secretário, sem previsão em lei complementar."
    ],
    correta: 2,
    explicacao: "A LC 741/2019 estabelece a SEF como órgão central dos sistemas de administração financeira, contabilidade pública e administração tributária de Santa Catarina."
  },
  {
    id: 5,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "Nos termos da Lei de Responsabilidade Fiscal (Lei Complementar nº 101/2000), a despesa total com pessoal dos Estados não poderá exceder o seguinte percentual da Receita Corrente Líquida (RCL):",
    opcoes: [
      "50%, sendo 40.9% para o Poder Executivo.",
      "60%, repartidos entre os Poderes Executivo (49%), Judiciário (6%), Legislativo e TC (3%) e MP (2%).",
      "70%, sem limites específicos por Poder.",
      "45%, com margem de prudência de 5% adicional.",
      "55%, sendo vedada qualquer repartição entre os Poderes."
    ],
    correta: 1,
    explicacao: "Art. 19 e 20 da LRF: o limite global para Estados é 60% da RCL, repartido em: 49% Executivo, 6% Judiciário, 3% Legislativo (incluindo TCE) e 2% Ministério Público estadual."
  },
  {
    id: 6,
    cargo: "A01",
    disciplina: "Contabilidade Aplicada ao Setor Público",
    enunciado: "Na Demonstração das Variações Patrimoniais (DVP) elaborada de acordo com o MCASP e as NBC TSP, a arrecadação de tributos deve ser reconhecida como:",
    opcoes: [
      "Variação Patrimonial Diminutiva (VPD) extraorçamentária.",
      "Variação Patrimonial Aumentativa (VPA) pelo regime de competência.",
      "Variação puramente financeira registrada exclusivamente no Balanço Orçamentário.",
      "Receita de capital quando vinculada a investimentos governamentais.",
      "Acréscimo de passivo compensatório transitório."
    ],
    correta: 1,
    explicacao: "No enfoque patrimonial do MCASP/NBC TSP, as receitas tributárias são reconhecidas como VPA (Variação Patrimonial Aumentativa) no momento do fato gerador segundo o regime de competência."
  },
  {
    id: 7,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "Nos termos do Código Tributário Nacional (CTN), a suspensão da exigibilidade do crédito tributário ocorre nas hipóteses de:",
    opcoes: [
      "Compensação, transação e remissão.",
      "Depósito do seu montante integral, concessão de liminar em mandado de segurança e parcelamento.",
      "Prescrição e decadência reconhecidas de ofício pela administração fazendária.",
      "Pagamento antecipado e homologação do lançamento.",
      "Conversão de depósito em renda e consignação em pagamento julgada procedente."
    ],
    correta: 1,
    explicacao: "Art. 151 do CTN (mnemônico MODEPACOLA): moratória, depósito do montante integral, reclamações/recursos administrativos, concessão de medida liminar em MS, concessão de tutela de urgência e parcelamento."
  },
  {
    id: 8,
    cargo: "E05",
    disciplina: "Direito Penal Tributário",
    enunciado: "De acordo com a Súmula Vinculante nº 24 do STF, referente aos crimes contra a ordem tributária tipificados no art. 1º, incisos I a IV, da Lei nº 8.137/1990:",
    opcoes: [
      "A ação penal pode ter início antes do encerramento do processo administrativo-tributário se houver prova documental incontroversa.",
      "Não se tipifica crime material contra a ordem tributária antes do lançamento definitivo do tributo.",
      "O parcelamento posterior à sentença condenatória transitada em julgado extingue a punibilidade.",
      "O crime é de natureza formal, dispensando a efetiva supressão ou redução de tributo.",
      "O início da investigação policial depende de prévia autorização judicial motivada."
    ],
    correta: 1,
    explicacao: "Súmula Vinculante nº 24 do STF: 'Não se tipifica crime material contra a ordem tributária, previsto no art. 1º, incisos I a IV, da Lei nº 8.137/90, antes do lançamento definitivo do tributo'."
  },
  {
    id: 9,
    cargo: "todos",
    disciplina: "Tecnologia da Informação e Dados",
    enunciado: "Segundo a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), o tratamento de dados pessoais pelo Poder Público:",
    opcoes: [
      "Independe de qualquer base legal desde que justificado genericamente pelo interesse da administração pública.",
      "Deve atender a finalidade pública específica, na persecução do interesse público e com respaldo em competência legal ou regulamentar.",
      "Não está submetido aos princípios da finalidade, adequação e necessidade aplicáveis ao setor privado.",
      "Pode ser compartilhado irrestritamente entre órgãos públicos sem transparência com o titular.",
      "Está isento da fiscalização e de sanções pela Autoridade Nacional de Proteção de Dados (ANPD)."
    ],
    correta: 1,
    explicacao: "Art. 23 da LGPD: o tratamento por pessoas jurídicas de direito público deve atender à sua finalidade pública, na persecução do interesse público, com o objetivo de executar as competências legais ou cumprir as atribuições legais do serviço público."
  },
  {
    id: 10,
    cargo: "todos",
    disciplina: "Legislação SC",
    enunciado: "Conforme a Lei Estadual nº 6.745/1985 (Estatuto dos Servidores Públicos Civis de SC), a recondução é:",
    opcoes: [
      "O retorno do servidor aposentado à atividade por invalidez cessada.",
      "O reinvestimento do servidor estável no cargo anteriormente ocupado em decorrência de inabilitação em estágio probatório relativo a outro cargo.",
      "A transferência de um servidor de um quadro funcional para outro em virtude de extinção do órgão.",
      "A promoção por merecimento ao último padrão remuneratório da carreira estadual.",
      "A substituição temporária de chefia por ato exclusivo discricionário do Governador."
    ],
    correta: 1,
    explicacao: "Recondução é o retorno do servidor público estável ao cargo que ocupava anteriormente, em caso de inabilitação no estágio probatório de outro cargo ou reintegração do anterior ocupante."
  }
];
