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
  },
  {
    id: 11,
    cargo: "todos",
    disciplina: "Língua Portuguesa",
    enunciado: "Assinale a alternativa em que a pontuação está plenamente de acordo com a norma-padrão da língua escrita:",
    opcoes: [
      "Os auditores fiscais que, concluíram a auditoria da folha de pagamento, emitiram o relatório ontem.",
      "A Secretaria de Estado da Fazenda, cumprindo o cronograma estabelecido na LRF, divulgou o relatório de gestão fiscal.",
      "O orçamento estadual foi aprovado pelos deputados, embora houvesse muitas divergências quanto às emendas.",
      "Não se deve esquecer de que, a transparência pública é preceito fundamental do Estado Democrático.",
      "Todos os servidores públicos de SC que participaram do certame, foram convocados."
    ],
    correta: 1,
    explicacao: "A oração reduzida de gerúndio intercalada ('cumprindo o cronograma estabelecido na LRF') está corretamente isolada por vírgulas entre o sujeito e o predicado. Na A, há vírgula separando sujeito e verbo. Na D, vírgula após conjunção integrante. Na E, oração adjetiva restritiva pontuada incorretamente."
  },
  {
    id: 12,
    cargo: "todos",
    disciplina: "Língua Portuguesa",
    enunciado: "Em relação à concordância verbal e nominal, assinale a opção correta segundo a norma culta:",
    opcoes: [
      "Houveram muitos incidentes durante a tramitação da lei orçamentária anual.",
      "Mais de um auditor discordaram dos critérios adotados na apuração do resultado primário.",
      "Trata-se de relatórios técnicos que devem ser anexados ao processo de prestação de contas.",
      "Fazem dez anos que o Estado de Santa Catarina não realizava concurso para o cargo.",
      "É proibido a entrada de pessoas não autorizadas na sala de controle fiscal."
    ],
    correta: 2,
    explicacao: "Na C, 'Trata-se de...' tem sujeito indeterminado com verbo na 3ª do singular (índice de indeterminação do sujeito). Na A, 'haver' no sentido de existir é impessoal (houve). Na B, 'mais de um' exige singular (discordou). Na D, 'fazer' indicando tempo é impessoal (faz dez anos). Na E, com artigo 'a entrada', deve concordar: 'é proibida a entrada'."
  },
  {
    id: 13,
    cargo: "todos",
    disciplina: "Direito Constitucional",
    enunciado: "A respeito dos direitos e garantias fundamentais e dos remédios constitucionais, assinale a afirmativa correta:",
    opcoes: [
      "O mandado de segurança coletivo pode ser impetrado por partido político sem representação no Congresso Nacional, desde que legalmente registrado há mais de um ano.",
      "O habeas data é a ação constitucional adequada para retificar dados do impetrante constantes de registros públicos, quando não se prefira fazê-lo por processo sigiloso.",
      "A criação de associações e a de cooperativas dependem de autorização prévia do Poder Executivo estadual.",
      "A casa é asilo inviolável do indivíduo, não sendo permitida a entrada durante a noite mesmo em caso de flagrante delito.",
      "A ação popular pode ser ajuizada por qualquer pessoa jurídica de direito privado sem fins lucrativos sediada no Estado."
    ],
    correta: 1,
    explicacao: "Art. 5º, LXXII, 'b', da CF/88: o Habeas Data destina-se para a retificação de dados, quando não se prefira fazê-lo por processo sigiloso, judicial ou administrativo. Partido para MS coletivo exige representação no Congresso. Ação popular é privativa de cidadão (pessoa física com título eleitoral ativo)."
  },
  {
    id: 14,
    cargo: "todos",
    disciplina: "Direito Constitucional",
    enunciado: "Conforme as regras de repartição de competências na CF/88, compete concorrentemente à União, aos Estados e ao Distrito Federal legislar sobre:",
    opcoes: [
      "Direito civil, comercial, penal, processual e eleitoral.",
      "Direito tributário, financeiro, penitenciário, econômico e urbanístico.",
      "Direito do trabalho, desapropriação e trânsito.",
      "Diretrizes e bases da educação nacional e comércio interestadual.",
      "Seguridade social, normas gerais de licitação e propaganda comercial."
    ],
    correta: 1,
    explicacao: "Art. 24, I, da CF/88: legislar sobre direito tributário, financeiro, penitenciário, econômico e urbanístico é competência legislativa concorrente da União, dos Estados e do DF. As demais alternativas contêm matérias privativas da União (art. 22)."
  },
  {
    id: 15,
    cargo: "todos",
    disciplina: "Direito Administrativo",
    enunciado: "Com as alterações promovidas pela Lei nº 14.230/2021 na Lei de Improbidade Administrativa (Lei nº 8.429/1992):",
    opcoes: [
      "Passou-se a admitir expressamente a configuração de ato de improbidade administrativa culposo em caso de dano ao erário.",
      "Exige-se a demonstração de dolo específico para a configuração de qualquer ato de improbidade administrativa tipificado na lei.",
      "O prazo prescricional para ajuizamento da ação passou a ser de 10 anos a contar da data do conhecimento do fato pela corregedoria.",
      "A perda da função pública atinge indistintamente qualquer vínculo que o agente mantenha com a Administração, sem restrições.",
      "Revogou-se integralmente o capítulo relativo aos atos que atentam contra os princípios da administração pública."
    ],
    correta: 1,
    explicacao: "A Lei 14.230/2021 revogou a modalidade culposa de improbidade (anterior art. 10) e passou a exigir dolo específico (vontade livre e consciente de alcançar o resultado ilícito) para todos os tipos (arts. 9º, 10 e 11). A prescrição é de 8 anos a contar da ocorrência do fato."
  },
  {
    id: 16,
    cargo: "todos",
    disciplina: "Direito Administrativo",
    enunciado: "No âmbito dos poderes da administração pública, o poder de polícia caracteriza-se por:",
    opcoes: [
      "Ser sempre indelegável a pessoas jurídicas de direito privado, ainda que integrantes da administração indireta.",
      "Possuir como atributos predominantes a discricionariedade, a autoexecutoriedade e a coercibilidade, observados os limites legais.",
      "Possibilitar a aplicação de sanções funcionais a servidores públicos estáveis por infração aos seus deveres de cargo.",
      "Inexistir na modalidade preventiva, operando exclusivamente de forma repressiva após a prática do ato infracional.",
      "Exigir prévia ordem judicial como requisito indispensável para a interdição cautelar de estabelecimentos comerciais."
    ],
    correta: 1,
    explicacao: "O poder de polícia estatal tem como atributos clássicos a discricionariedade (como regra), a autoexecutoriedade (a administração executa diretamente suas decisões) e a coercibilidade (imposição forçada). O STF fixou a tese de que é constitucional a delegação de atos de fiscalização e sanção a empresas estatais prestadoras de serviço público em regime não concorrencial."
  },
  {
    id: 17,
    cargo: "todos",
    disciplina: "Legislação SC",
    enunciado: "A Lei Complementar Estadual nº 412/2008 de Santa Catarina, que instituiu o Regime Próprio de Previdência dos Servidores do Estado (RPPS/SC), define como órgão gestor único:",
    opcoes: [
      "A Secretaria de Estado da Fazenda (SEF/SC).",
      "O Instituto de Previdência do Estado de Santa Catarina (IPREV).",
      "A Procuradoria-Geral do Estado (PGE/SC).",
      "A Diretoria de Gestão de Pessoas da Secretaria de Estado da Administração.",
      "O Tribunal de Contas do Estado de Santa Catarina (TCE/SC)."
    ],
    correta: 1,
    explicacao: "Conforme a LC 412/2008 de Santa Catarina, o IPREV (Instituto de Previdência do Estado de Santa Catarina) é a entidade autárquica gestora única do RPPS/SC, responsável pela concessão e manutenção dos benefícios previdenciários dos servidores estaduais."
  },
  {
    id: 18,
    cargo: "todos",
    disciplina: "Tecnologia da Informação e Dados",
    enunciado: "Em bancos de dados relacionais e modelagem multidimensional utilizada em Business Intelligence (BI):",
    opcoes: [
      "O esquema Star Schema (estrela) possui tabelas dimensões normalizadas na 3ª Forma Normal com múltiplos níveis de hierarquia.",
      "A tabela fato contém métricas numéricas quantitativas do negócio (fatos) e chaves estrangeiras que apontam para as tabelas dimensões.",
      "A instrução SQL 'GROUP BY' é executada antes da cláusula 'WHERE' na ordem lógica de processamento do SGBD.",
      "As chaves primárias compostas não são permitidas pelo modelo relacional tradicional de Codd.",
      "O modelo Snowflake (floco de neve) é caracterizado pela total desnormalização de todas as suas tabelas satélites."
    ],
    correta: 1,
    explicacao: "No modelo dimensional de Kimball (Data Warehouse/BI), a tabela fato armazena as medidas/métricas quantitativas e chaves estrangeiras que conectam às dimensões de contexto. O Star Schema desnormaliza as dimensões; o Snowflake normaliza as dimensões."
  },
  {
    id: 19,
    cargo: "todos",
    disciplina: "Tecnologia da Informação e Dados",
    enunciado: "No contexto de Inteligência Artificial e Modelos de Linguagem de Larga Escala (LLMs), o mecanismo de 'RAG' (Retrieval-Augmented Generation) tem como objetivo principal:",
    opcoes: [
      "Treinar o modelo fundacional a partir do zero utilizando exclusivamente dados proprietários em supercomputadores.",
      "Aumentar o contexto de entrada do modelo consultando uma base de conhecimento externa e vetorial antes de gerar a resposta.",
      "Comprimir os pesos da rede neural através de quantização de 16 bits para 4 bits sem perda de acurácia.",
      "Substituir o algoritmo de backpropagation em redes neurais profundas por árvores de decisão determinísticas.",
      "Garantir a total ausência de latência nas chamadas de API através de processamento local no navegador."
    ],
    correta: 1,
    explicacao: "O RAG (Retrieval-Augmented Generation) recupera documentos relevantes de uma base de conhecimento (ex: legislação, manuais) via busca semântica/vetorial e os insere no prompt da LLM para reduzir alucinações e fornecer respostas fundamentadas e atualizadas."
  },
  {
    id: 20,
    cargo: "todos",
    disciplina: "Matemática Financeira e Estatística",
    enunciado: "Um investimento de R$ 100.000,00 foi aplicado à taxa de juros compostos de 10% ao ano, durante 2 anos. O montante final acumulado ao término do período é de:",
    opcoes: [
      "R$ 120.000,00",
      "R$ 121.000,00",
      "R$ 122.100,00",
      "R$ 115.000,00",
      "R$ 133.100,00"
    ],
    correta: 1,
    explicacao: "Fórmula dos juros compostos: M = C * (1 + i)^t. M = 100.000 * (1 + 0,10)^2 = 100.000 * 1,21 = R$ 121.000,00. Os juros somam R$ 21.000,00."
  },
  {
    id: 21,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "De acordo com a Lei nº 4.320/1964 e a CF/88, os créditos adicionais destinados a despesas urgentes e imprevistas, em caso de guerra, comoção intestina ou calamidade pública, são denominados:",
    opcoes: [
      "Suplementares.",
      "Especiais.",
      "Extraordinários.",
      "Ordinários.",
      "Condicionais."
    ],
    correta: 2,
    explicacao: "Art. 41 da Lei 4.320/1964 e art. 167, § 3º da CF/88: créditos suplementares reforçam dotação orçamentária existente; especiais destinam-se a despesas sem dotação específica; extraordinários destinam-se a despesas urgentes e imprevistas (guerra, comoção interna ou calamidade pública), abertos por Medida Provisória ou Decreto."
  },
  {
    id: 22,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "Segundo a Lei de Responsabilidade Fiscal (LC 101/2000), o Relatório de Gestão Fiscal (RGF) deve ser emitido ao final de cada:",
    opcoes: [
      "Bimestre, por todos os Poderes e órgãos autônomos.",
      "Quadrimestre, pelos titulares dos Poderes e órgãos referidos no art. 20 da LRF.",
      "Mês, exclusivamente pelo Poder Executivo estadual.",
      "Semestre, apenas pelos Municípios com população superior a 500 mil habitantes.",
      "Exercício financeiro, coincidindo com o balanço geral do Estado."
    ],
    correta: 1,
    explicacao: "Art. 54 da LRF: o RGF (Relatório de Gestão Fiscal) é emitido ao final de cada quadrimestre pelos titulares de cada Poder e órgão (Executivo, Judiciário, Legislativo, MP e Defensoria). O RREO (Relatório Resumido da Execução Orçamentária) é que é bimestral."
  },
  {
    id: 23,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "O princípio orçamentário segundo o qual todas as receitas e todas as despesas públicas devem constar do orçamento em seus valores brutos, vedadas quaisquer deduções, é o princípio da:",
    opcoes: [
      "Universalidade.",
      "Totalidade.",
      "Exclusividade.",
      "Não afetação das receitas de impostos.",
      "Orçamento Bruto."
    ],
    correta: 4,
    explicacao: "Art. 6º da Lei 4.320/1964: 'Todas as receitas e despesas constarão da Lei de Orçamento pelos seus totais, vedadas quaisquer deduções'. Trata-se do Princípio do Orçamento Bruto. Já a Universalidade determina que todas as receitas e despesas devem estar na lei orçamentária."
  },
  {
    id: 24,
    cargo: "A01",
    disciplina: "Contabilidade Aplicada ao Setor Público",
    enunciado: "No Plano de Contas Aplicado ao Setor Público (PCASP), as classes 1, 2, 3 e 4 pertencem, respectivamente, aos seguintes subsistemas de informações:",
    opcoes: [
      "Orçamentário (1 e 2) e Controle (3 e 4).",
      "Patrimonial (1 - Ativo, 2 - Passivo, 3 - VPD, 4 - VPA).",
      "Controle (1 e 2) e Orçamentário (3 e 4).",
      "Financeiro (1 e 3) e Patrimonial (2 e 4).",
      "Compensado (1 e 2) e Extraorçamentário (3 e 4)."
    ],
    correta: 1,
    explicacao: "No PCASP: Classe 1 (Ativo), Classe 2 (Passivo e Patrimônio Líquido), Classe 3 (Variações Patrimoniais Diminutivas - VPD) e Classe 4 (Variações Patrimoniais Aumentativas - VPA) integram a natureza de informação PATRIMONIAL. As classes 5 e 6 são orçamentárias; 7 e 8 são de controle."
  },
  {
    id: 25,
    cargo: "A01",
    disciplina: "Contabilidade Aplicada ao Setor Público",
    enunciado: "Segundo a NBC TSP 34 e as normas do Conselho Federal de Contabilidade aplicadas ao setor público, a informação de custos na administração pública visa prioritariamente:",
    opcoes: [
      "Calcular o lucro tributável das entidades estatais dependentes.",
      "Subsidiar a tomada de decisões, a apuração da eficiência na alocação de recursos públicos e a prestação de contas (accountability).",
      "Determinar o montante da despesa de pessoal para fins de limitação da LRF.",
      "Ajustar as tabelas de vencimentos funcionais pelo índice oficial de inflação.",
      "Emitir notas de empenho ordinárias no encerramento do exercício financeiro."
    ],
    correta: 1,
    explicacao: "A NBC TSP 34 (Custos no Setor Público) estabelece que o sistema de informação de custos objetiva apoiar os gestores na tomada de decisão, possibilitar a avaliação de desempenho e eficiência dos programas públicos e dar transparência ao custo dos serviços entregues à sociedade."
  },
  {
    id: 26,
    cargo: "A01",
    disciplina: "Administração Geral e Pública",
    enunciado: "A abordagem da Nova Gestão Pública (New Public Management - NPM) caracteriza-se por defender:",
    opcoes: [
      "O reforço das estruturas burocráticas weberianas rígidas com foco exclusivo na conformidade formal dos processos.",
      "A orientação para resultados, foco no cidadão-usuário, descentralização administrativa e introdução de mecanismos contratuais e de incentivo.",
      "A centralização de todas as compras governamentais em ministérios centrais sem autonomia setorial.",
      "A eliminação definitiva de quaisquer formas de controle social ou transparência pública.",
      "A estatização integral de todos os setores de prestação de serviços não essenciais."
    ],
    correta: 1,
    explicacao: "A Administração Pública Gerencial / New Public Management (NPM) preconiza a transição do foco em processos e controles a priori para a gestão por resultados, avaliação de desempenho, contratualização e centralidade no cidadão."
  },
  {
    id: 27,
    cargo: "A01",
    disciplina: "Administração Geral e Pública",
    enunciado: "Na ferramenta Balanced Scorecard (BSC), desenvolvida por Kaplan e Norton, a estratégia organizacional é desdobrada nas seguintes quatro perspectivas:",
    opcoes: [
      "Operacional, Tática, Estratégica e Normativa.",
      "Financeira, Clientes, Processos Internos e Aprendizado/Crescimento.",
      "Custos, Preços, Mercados e Concorrentes.",
      "Planejamento, Organização, Direção e Controle.",
      "Ambiente Interno, Macroambiente, Stakeholders e Acionistas."
    ],
    correta: 1,
    explicacao: "O Balanced Scorecard (BSC) equilibra indicadores financeiros e não-financeiros através de 4 perspectivas clássicas: Financeira, Clientes (ou Sociedade, no setor público), Processos Internos e Aprendizado & Crescimento."
  },
  {
    id: 28,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "Conforme a Lei nº 4.320/1964, a despesa orçamentária percorre regularmente os seguintes três estágios de execução:",
    opcoes: [
      "Fixação, arrecadação e recolhimento.",
      "Empenho, liquidação e pagamento.",
      "Previsão, lançamento e arrecadação.",
      "Licitação, homologação e adjudicação.",
      "Contratação, medição e faturamento."
    ],
    correta: 1,
    explicacao: "Os estágios da despesa orçamentária são: Empenho (art. 58), Liquidação (art. 63) e Pagamento (art. 64) da Lei 4.320/1964. Já fixação, arrecadação e recolhimento referem-se à receita pública."
  },
  {
    id: 29,
    cargo: "A01",
    disciplina: "Contabilidade Aplicada ao Setor Público",
    enunciado: "No Balanço Orçamentário elaborado sob a égide do MCASP, o superávit orçamentário do exercício financeiro corresponde à diferença positiva entre:",
    opcoes: [
      "O Ativo Financeiro e o Passivo Financeiro no encerramento do exercício.",
      "As Receitas Orçamentárias Realizadas e as Despesas Orçamentárias Executadas (empenhadas/liquidadas).",
      "As Variações Patrimoniais Aumentativas e as Variações Patrimoniais Diminutivas.",
      "O saldo dos Restos a Pagar Processados e os Não Processados.",
      "A dívida fundada consolidada e a receita corrente líquida."
    ],
    correta: 1,
    explicacao: "O resultado orçamentário (superávit ou déficit) no Balanço Orçamentário decorre do confronto entre as receitas orçamentárias realizadas e as despesas orçamentárias executadas (empenhadas/liquidadas). Diferença entre ativo e passivo financeiro é o superávit financeiro do Balanço Patrimonial."
  },
  {
    id: 30,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "De acordo com o art. 42 da LRF, é vedado ao titular de Poder ou órgão, nos últimos dois quadrimestres do seu mandato:",
    opcoes: [
      "Realizar concurso público para provimento de cargos efetivos essenciais.",
      "Contrair obrigação de despesa que não possa ser cumprida integralmente dentro dele, ou que tenha parcelas a serem pagas no exercício seguinte sem que haja suficiente disponibilidade de caixa.",
      "Autorizar qualquer remanejamento orçamentário por meio de créditos suplementares.",
      "Promover licitações sob a modalidade pregão eletrônico.",
      "Pagar faturas de fornecedores com prazo de entrega superior a trinta dias."
    ],
    correta: 1,
    explicacao: "Art. 42 da LRF (regra de final de mandato): 'É vedado ao titular de Poder ou órgão referido no art. 20, nos últimos dois quadrimestres do seu mandato, contrair obrigação de despesa que não possa ser cumprida integralmente dentro dele, ou que tenha parcelas a serem pagas no exercício seguinte sem que haja suficiente disponibilidade de caixa'."
  },
  {
    id: 31,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "A respeito das limitações constitucionais ao poder de tributar, a imunidade tributária recíproca (art. 150, VI, 'a', da CF/88):",
    opcoes: [
      "Aplica-se indistintamente a tributos de qualquer espécie, abrangendo impostos, taxas e contribuições de melhoria.",
      "Veda à União, aos Estados, ao DF e aos Municípios instituir impostos sobre o patrimônio, renda ou serviços uns dos outros.",
      "Estende-se irrestritamente a empresas públicas que explorem atividade econômica em concorrência com o setor privado.",
      "Impede a cobrança de IPTU sobre imóveis de propriedade de autarquias públicas mesmo quando alugados a particulares para exploração comercial.",
      "Pode ser revogada por emenda constitucional aprovada por maioria absoluta nas duas casas do Congresso."
    ],
    correta: 1,
    explicacao: "A imunidade recíproca restringe-se aos IMPOSTOS (art. 150, VI, 'a') sobre patrimônio, renda e serviços dos entes federativos e suas autarquias/fundações vinculadas às finalidades essenciais. Não abrange taxas nem se estende a estatais que exploram atividade econômica concorrencial (art. 150, § 3º)."
  },
  {
    id: 32,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "Nos termos do Código Tributário Nacional (CTN), assinale a hipótese que acarreta a EXTINÇÃO do crédito tributário:",
    opcoes: [
      "A concessão de liminar em mandado de segurança.",
      "A moratória concedida em caráter geral.",
      "A compensação tributária realizada nos termos da lei.",
      "O parcelamento deferido pela autoridade fazendária.",
      "O recurso administrativo interposto tempestivamente pelo sujeito passivo."
    ],
    correta: 2,
    explicacao: "Art. 156, II, do CTN: a compensação é modalidade de EXTINÇÃO do crédito tributário. Liminar em MS, moratória, parcelamento e recursos administrativos são hipóteses de SUSPENSÃO da exigibilidade (art. 151 do CTN)."
  },
  {
    id: 33,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "Sobre o lançamento tributário e suas modalidades segundo o CTN, é correto afirmar que:",
    opcoes: [
      "No lançamento de ofício, o contribuinte antecipa o pagamento antes de qualquer exame prévio da autoridade administrativa.",
      "No lançamento por homologação, a legislação impõe ao devedor o dever de antecipar o pagamento sem prévio exame da autoridade fazendária.",
      "O lançamento é ato puramente discricionário da autoridade administrativa fiscal.",
      "O IPTU e o IPVA são exemplos típicos de tributos lançados exclusivamente por homologação.",
      "O lançamento efetuado não pode ser alterado sob nenhuma hipótese após a notificação do contribuinte."
    ],
    correta: 1,
    explicacao: "Art. 150 do CTN: lançamento por homologação (ou autolançamento) ocorre quanto aos tributos cuja legislação atribua ao sujeito passivo o dever de antecipar o pagamento sem prévio exame da autoridade. O lançamento é ato vinculado e obrigatório (art. 142)."
  },
  {
    id: 34,
    cargo: "E05",
    disciplina: "Direito Penal Tributário",
    enunciado: "Nos termos da Lei nº 8.137/1990, o pagamento integral dos tributos e acessórios devidos pelo contribuinte investigado por crime contra a ordem tributária:",
    opcoes: [
      "Apenas atenua a pena privativa de liberdade em um sexto a um terço.",
      "Extingue a punibilidade do crime, se efetuado antes ou mesmo após o recebimento da denúncia, conforme pacífico entendimento dos Tribunais Superiores.",
      "Depende de expressa concordância do Ministério Público para surtir efeitos penais benéficos.",
      "Não impede o prosseguimento da ação penal pelo crime de falsidade documental conexo.",
      "Converte a pena de reclusão em pena restritiva de direitos automaticamente."
    ],
    correta: 1,
    explicacao: "Conforme art. 9º da Lei 10.684/2003 e jurisprudência pacífica do STF e STJ, o pagamento integral do débito tributário extingue a punibilidade dos crimes contra a ordem tributária tipificados nos arts. 1º e 2º da Lei 8.137/90, a qualquer tempo, mesmo após o recebimento da denúncia ou trânsito em julgado."
  },
  {
    id: 35,
    cargo: "E05",
    disciplina: "Direito Constitucional",
    enunciado: "A respeito do controle de constitucionalidade exercido pelos Tribunais de Justiça dos Estados (art. 125, § 2º, da CF/88):",
    opcoes: [
      "Cabe ADI estadual perante o Tribunal de Justiça tendo por parâmetro norma da Constituição Federal de repetição não obrigatória.",
      "É cabível a propositura de Ação Direta de Inconstitucionalidade de lei municipal em face da Constituição Estadual.",
      "O Tribunal de Justiça pode julgar ADI estadual proposta exclusivamente pelo Governador do Estado.",
      "Não cabe recurso extraordinário ao STF contra decisão de Tribunal de Justiça proferida em ADI estadual.",
      "A declaração de inconstitucionalidade pelo TJ vincula automaticamente o Supremo Tribunal Federal."
    ],
    correta: 1,
    explicacao: "Art. 125, § 2º da CF/88: cabe aos Estados a instituição de representação de inconstitucionalidade de leis ou atos normativos estaduais ou municipais em face da Constituição Estadual perante o Tribunal de Justiça."
  },
  {
    id: 36,
    cargo: "E05",
    disciplina: "Direito Administrativo",
    enunciado: "Em tema de responsabilidade civil do Estado no ordenamento jurídico brasileiro (art. 37, § 6º, da CF/88):",
    opcoes: [
      "A responsabilidade objetiva do Estado baseia-se na teoria do risco integral em todas as situações de conduta comissiva ou omissiva.",
      "As pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes causarem a terceiros, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa.",
      "O particular lesado deve ajuizar a ação indenizatória diretamente e exclusivamente contra o servidor causador do dano.",
      "A culpa exclusiva da vítima não exclui e nem atenua a responsabilidade civil objetiva da Fazenda Pública.",
      "A responsabilidade do Estado por omissão genérica prescinde da demonstração de culpa do serviço (faute du service)."
    ],
    correta: 1,
    explicacao: "Art. 37, § 6º da CF/88 consagra a teoria do risco administrativo (responsabilidade objetiva do Estado, com direito de regresso contra o agente nos casos de dolo ou culpa). O STF fixou tese em repercussão geral (Tema 940) vedando a propositura da ação diretamente contra o servidor (dupla garantia)."
  },
  {
    id: 37,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "A decadência do direito de a Fazenda Pública constituir o crédito tributário relativamente a tributos sujeitos a lançamento por homologação, quando inocorrente dolo, fraude ou simulação e havendo pagamento antecipado parcial, rege-se:",
    opcoes: [
      "Pelo art. 173, I, do CTN (5 anos a contar do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado).",
      "Pelo art. 150, § 4º, do CTN (5 anos a contar da ocorrência do fato gerador).",
      "Pelo prazo prescricional do Código Civil de 10 anos.",
      "Por prazo decadencial de 3 anos contado da emissão da certidão de dívida ativa.",
      "Por regra de imprescritibilidade nos termos da jurisprudência do STF."
    ],
    correta: 1,
    explicacao: "Conforme jurisprudência pacífica do STJ (Súmula 555 e Tema Repetitivo 163): nos tributos sujeitos a lançamento por homologação, havendo pagamento antecipado (ainda que a menor), aplica-se a regra do art. 150, § 4º do CTN (5 anos da data do fato gerador). Não havendo qualquer pagamento, aplica-se o art. 173, I (primeiro dia do exercício seguinte)."
  },
  {
    id: 38,
    cargo: "E05",
    disciplina: "Legislação SC",
    enunciado: "A Lei Estadual nº 7.541/1988 de Santa Catarina, que dispõe sobre as taxas no Estado, estabelece que a taxa por atos de polícia e prestação de serviços públicos:",
    opcoes: [
      "Pode ter base de cálculo própria e idêntica à que tenha servido para a instituição de imposto estadual.",
      "Tem como fato gerador o exercício regular do poder de polícia ou a utilização, efetiva ou potencial, de serviço público específico e divisível prestado ao contribuinte ou posto à sua disposição.",
      "Pode ser cobrada pelo serviço de iluminação pública geral do município.",
      "É dispensada de previsão expressa das alíquotas em tabela anexa à lei.",
      "Incide livremente sobre o patrimônio e a renda das microempresas e empresas de pequeno porte."
    ],
    correta: 1,
    explicacao: "Art. 77 do CTN e Lei 7.541/1988 de SC reproduzem o comando constitucional do art. 145, II: taxas decorrem do exercício regular do poder de polícia ou da utilização de serviços públicos específicos e divisíveis. Taxa não pode ter base de cálculo idêntica à de imposto (art. 145, § 2º)."
  },
  {
    id: 39,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "Sobre a Certidão da Dívida Ativa (CDA) e a Execução Fiscal regida pela Lei nº 6.830/1980, assinale a opção correta:",
    opcoes: [
      "A dívida regularmente inscrita goza da presunção absoluta (jure et de jure) de certeza e liquidez, não admitindo prova em contrário.",
      "A presunção de certeza e liquidez da dívida ativa é relativa e pode ser ilidida por prova inequívoca a cargo do executado ou de terceiro que a aproveite.",
      "A penhora de dinheiro na execução fiscal deve ser realizada por oficial de justiça presencialmente, sendo vedado o bloqueio judicial eletrônico.",
      "O prazo para o executado embargar a execução fiscal é de 15 dias contados da juntada do mandado de citação.",
      "A nulidade da CDA não pode ser suprida pela Fazenda Pública em nenhuma hipótese."
    ],
    correta: 1,
    explicacao: "Art. 204 do CTN e art. 3º da Lei 6.830/1980 (LEF): a dívida regularmente inscrita goza de presunção de certeza e liquidez, tendo o efeito de prova pré-constituída. Essa presunção é relativa (juris tantum) e pode ser elidida por prova inequívoca a cargo do executado. O prazo de embargos na LEF é de 30 dias contados da garantia do juízo (art. 16)."
  },
  {
    id: 40,
    cargo: "E05",
    disciplina: "Direito Penal",
    enunciado: "No crime de concussão (art. 316 do Código Penal) e corrupção passiva (art. 317 do CP), o elemento diferenciador dos núcleos dos tipos é que na concussão o servidor:",
    opcoes: [
      "Solicita vantagem indevida, enquanto na corrupção ele a aceita de livre vontade.",
      "Exige, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida.",
      "Recebe propina paga por particular mediante violência física iminente.",
      "Promete praticar ato legal em troca de favorecimento pessoal.",
      "Apropria-se de dinheiro público de que tem a posse em razão do cargo."
    ],
    correta: 1,
    explicacao: "No art. 316 do Código Penal (Concussão), o verbo núcleo é EXIGIR vantagem indevida. No art. 317 (Corrupção Passiva), os verbos são SOLICITAR ou RECEBER vantagem indevida, ou ACEITAR promessa de tal vantagem. Apropriar-se é peculato (art. 312)."
  },
  {
    id: 41,
    cargo: "todos",
    disciplina: "Língua Portuguesa",
    enunciado: "Identifique a alternativa que apresenta oração na voz passiva analítica:",
    opcoes: [
      "Os auditores analisaram meticulosamente todos os livros fiscais da empresa autuada.",
      "Apensaram-se os documentos solicitados à ata final da reunião de julgamento.",
      "Os cálculos da nota padronizada foram homologados pela comissão organizadora do concurso.",
      "Trabalhou-se com afinco durante todo o período de fiscalização estadual.",
      "Muitos candidatos se queixaram do nível de exigência das provas da FCC."
    ],
    correta: 2,
    explicacao: "Na voz passiva analítica, temos o verbo auxiliar (ser/estar) conjugado + particípio do verbo principal: 'foram homologados' + agente da passiva 'pela comissão organizadora'. A opção B é voz passiva sintética (com pronome apassivador 'se')."
  },
  {
    id: 42,
    cargo: "todos",
    disciplina: "Direito Constitucional",
    enunciado: "Conforme o art. 37, inciso XVI, da CF/88, é vedada a acumulação remunerada de cargos públicos, exceto, quando houver compatibilidade de horários, a de:",
    opcoes: [
      "Três cargos de professor em regime parcial.",
      "Dois cargos de auditor fiscal da receita estadual.",
      "Dois cargos de professor; a de um cargo de professor com outro técnico ou científico; e a de dois cargos ou empregos privativos de profissionais de saúde, com profissões regulamentadas.",
      "Um cargo de procurador do Estado com o de secretário municipal executivo.",
      "Dois cargos administrativos em fundações públicas estaduais."
    ],
    correta: 2,
    explicacao: "Art. 37, XVI da CF/88: ressalvados os casos previstos, é vedada a acumulação remunerada de cargos, exceto, havendo compatibilidade de horários: a) dois cargos de professor; b) um de professor com outro técnico ou científico; c) dois cargos/empregos privativos de profissionais de saúde, com profissões regulamentadas."
  },
  {
    id: 43,
    cargo: "todos",
    disciplina: "Direito Administrativo",
    enunciado: "De acordo com a Lei nº 14.133/2021, o julgamento por 'menor preço' ou 'maior desconto' considerará o menor dispêndio para a Administração, e o critério de 'maior retorno econômico' é utilizado exclusivamente no contrato de:",
    opcoes: [
      "Fornecimento contínuo de materiais de consumo.",
      "Eficiência.",
      "Concessão patrocinada de rodovias estaduais.",
      "Empreitada integral por preço unitário.",
      "Locação sob medida (built to suit)."
    ],
    correta: 1,
    explicacao: "Art. 36 da Lei 14.133/2021: o critério de julgamento por maior retorno econômico é utilizado exclusivamente para a celebração de contrato de eficiência e considerará a maior economia para a Administração decorrente da execução do contrato."
  },
  {
    id: 44,
    cargo: "todos",
    disciplina: "Legislação SC",
    enunciado: "Segundo o Estatuto dos Servidores Públicos Civis de Santa Catarina (Lei Estadual nº 6.745/1985), o estágio probatório dos servidores nomeados para cargo de provimento efetivo tem a duração legal de:",
    opcoes: [
      "1 ano de efetivo exercício.",
      "2 anos de efetivo exercício.",
      "3 anos de efetivo exercício, em conformidade com a redação dada pelo art. 41 da Constituição Federal.",
      "5 anos ininterruptos.",
      "6 meses após a posse solene."
    ],
    correta: 2,
    explicacao: "Embora a lei estadual originária de 1985 previsse prazo menor, por força do art. 41 da CF/88 (com redação dada pela EC 19/1998) e jurisprudência pacífica do STF, o prazo do estágio probatório é de 3 anos de efetivo exercício para a aquisição da estabilidade."
  },
  {
    id: 45,
    cargo: "todos",
    disciplina: "Tecnologia da Informação e Dados",
    enunciado: "No contexto da LGPD (Lei nº 13.709/2018), a pessoa natural indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a ANPD é denominada:",
    opcoes: [
      "Auditor Externo de Segurança da Informação.",
      "Encarregado pelo Tratamento de Dados Pessoais (DPO - Data Protection Officer).",
      "Suboperador Autorizado de Tecnologia.",
      "Procurador Digital de Integridade Fazendária.",
      "Custodiante de Chaves Criptográficas."
    ],
    correta: 1,
    explicacao: "Art. 5º, VIII e art. 41 da LGPD: o Encarregado (Data Protection Officer - DPO) é a pessoa indicada pelo controlador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD)."
  },
  {
    id: 46,
    cargo: "A01",
    disciplina: "Administração Financeira e Orçamentária",
    enunciado: "A regra de ouro das finanças públicas, consagrada no art. 167, inciso III, da Constituição Federal, estabelece a vedação de:",
    opcoes: [
      "Realizar despesas com pessoal que superem a receita corrente líquida do bimestre anterior.",
      "Realizar operações de créditos que excedam o montante das despesas de capital, ressalvadas as autorizadas mediante créditos suplementares ou especiais com finalidade precisa, aprovados pelo Poder Legislativo por maioria absoluta.",
      "Vincular receitas de impostos estaduais à saúde e à educação.",
      "Emitir títulos da dívida pública estadual sem parecer prévio do Tribunal de Contas.",
      "Pagar juros e amortizações da dívida fundada com recursos ordinários do tesouro."
    ],
    correta: 1,
    explicacao: "A Regra de Ouro (art. 167, III da CF) veda a realização de operações de crédito (endividamento) em montante superior ao das despesas de capital (investimentos, inversões financeiras e amortização da dívida), salvo autorização expressa em créditos adicionais aprovados por maioria absoluta."
  },
  {
    id: 47,
    cargo: "A01",
    disciplina: "Contabilidade Aplicada ao Setor Público",
    enunciado: "No Balanço Financeiro da Lei nº 4.320/1964 e do MCASP, a inscrição de Restos a Pagar no encerramento do exercício é demonstrada como:",
    opcoes: [
      "Receita Extraorçamentária para compensar a despesa orçamentária empenhada.",
      "Despesa Orçamentária Corrente adicional.",
      "Dedução direta da receita patrimonial do exercício.",
      "Variação Patrimonial Diminutiva não orçamentária.",
      "Resultado Primário consolidado."
    ],
    correta: 0,
    explicacao: "No Balanço Financeiro, como a despesa foi empenhada e constou na coluna de desembolsos orçamentários, a contrapartida da inscrição dos Restos a Pagar figura como Receita Extraorçamentária para equilibrar o fluxo financeiro do balanço."
  },
  {
    id: 48,
    cargo: "E05",
    disciplina: "Direito Tributário",
    enunciado: "Segundo o Código Tributário Nacional, a responsabilidade de terceiros pelo crédito tributário (art. 134 e 135 do CTN):",
    opcoes: [
      "É sempre solidária e independente de qualquer atuação com excesso de poderes ou infração de lei.",
      "Atribui responsabilidade pessoal e exclusiva aos diretores, gerentes ou representantes de pessoas jurídicas de direito privado pelos créditos decorrentes de atos praticados com excesso de poderes ou infração de lei, contrato social ou estatutos.",
      "Exime os pais pelos tributos devidos por seus filhos menores.",
      "Não se aplica aos administradores de bens de terceiros sob nenhuma hipótese.",
      "Depende de prévia condenação criminal com trânsito em julgado para ser exigida na via tributária."
    ],
    correta: 1,
    explicacao: "Art. 135, III do CTN: são pessoalmente responsáveis pelos créditos correspondentes a obrigações tributárias resultantes de atos praticados com excesso de poderes ou infração de lei, contrato social ou estatutos os diretores, gerentes ou representantes de pessoas jurídicas de direito privado."
  },
  {
    id: 49,
    cargo: "E05",
    disciplina: "Direito Financeiro",
    enunciado: "A respeito do regime das Emendas Parlamentares Impositivas individuais ao projeto de lei orçamentária (art. 166 da CF/88 e legislação de SC):",
    opcoes: [
      "A execução das programações orçamentárias de emendas individuais é meramente facultativa pelo Poder Executivo.",
      "As emendas individuais são de execução orçamentária e financeira obrigatória, devendo metade do seu valor ser destinado a ações e serviços públicos de saúde.",
      "É vedado o cancelamento das programações de emendas em qualquer hipótese, mesmo com impedimento de ordem técnica insuperável.",
      "As emendas parlamentares independem de indicação prévia do beneficiário ou do objeto a ser financiado.",
      "Não estão sujeitas a limites percentuais em relação à receita corrente líquida estadual."
    ],
    correta: 1,
    explicacao: "Art. 166, §§ 9º e 11 da CF/88 (e modelo estadual de SC): as emendas individuais são impositivas (execução obrigatória), limitadas a percentual da RCL, sendo que metade do montante aprovado deve ser destinado a ações e serviços públicos de saúde (ASPS)."
  },
  {
    id: 50,
    cargo: "todos",
    disciplina: "Matemática Financeira e Raciocínio Lógico",
    enunciado: "Se a proposição composta 'Se o auditor concluiu o relatório, então o imposto foi cobrado' é FALSA, então é logicamente VERDADEIRO que:",
    opcoes: [
      "O auditor não concluiu o relatório e o imposto foi cobrado.",
      "O auditor concluiu o relatório e o imposto não foi cobrado.",
      "Tanto a conclusão do relatório quanto a cobrança do imposto ocorreram.",
      "Nem o auditor concluiu o relatório, nem o imposto foi cobrado.",
      "O imposto foi cobrado independentemente do relatório."
    ],
    correta: 1,
    explicacao: "Uma condicional 'P -> Q' só é FALSA em um único caso: quando o antecedente (P) é VERDADEIRO e o consequente (Q) é FALSO (caso 'Vera Fischer'). Logo, é verdadeiro que 'O auditor concluiu o relatório' (V) e 'O imposto NÃO foi cobrado' (~Q = V)."
  }
];
