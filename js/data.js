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
