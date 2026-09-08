/**
 * Módulo de Inteligência Artificial — Google Gemini (Flash Lite)
 * Concurso SEFAZ/SC 2026 — Auditor Estadual de Finanças Públicas
 * Integração Híbrida: Vercel Serverless Gateway (/api/gemini) com Fallback Direto Client-Side
 */

const SEFAZ_AI = {
  DEFAULT_MODEL: 'gemini-2.5-flash-lite',

  MODELS: [
    { id: 'gemini-2.5-flash-lite', nome: 'Gemini 2.5 Flash Lite (Mais Rápido & Econômico — Recomendado)' },
    { id: 'gemini-2.0-flash-lite', nome: 'Gemini 2.0 Flash Lite' },
    { id: 'gemini-2.5-flash',      nome: 'Gemini 2.5 Flash (Avançado)' },
    { id: 'gemini-1.5-flash',      nome: 'Gemini 1.5 Flash (Legado)' }
  ],

  SYSTEM_INSTRUCTIONS: {
    tutorFCC: `Você é um Auditor Estadual de Finanças Públicas e Professor renomado especialista na banca Fundação Carlos Chagas (FCC).
Seu objetivo é preparar candidatos de alto nível para o concurso SEFAZ/SC 2026.
Diretrizes fundamentais para suas respostas:
1. Rigor conceitual e fidelidade à letra da lei, súmulas vinculantes e jurisprudência pacificada do STF/STJ.
2. Evidencie sempre as 'pegadinhas' e sutilezas clássicas da FCC (como troca de palavras, prazos, competências privativas vs concorrentes, exceções a regras gerais).
3. Utilize linguagem clara, objetiva, técnica e didática.
4. Quando oportuno, forneça mnemônicos ou esquemas comparativos para fixação rápida.
5. Estruture com títulos, tópicos e formatação limpa e elegante.`,

    questionGeneratorFCC: `Você é um examinador sênior da banca Fundação Carlos Chagas (FCC).
Crie uma questão inédita de nível Auditor Fiscal para o concurso SEFAZ/SC 2026 sobre o tópico solicitado.
A questão DEVE seguir estritamente o formato padrão da FCC:
1. Um enunciado situacional ou conceitual bem elaborado e contextualizado.
2. Exatamente 5 alternativas identificadas pelas letras (A), (B), (C), (D) e (E).
3. Apenas uma alternativa correta.
4. Após as alternativas, inclua a seção "--- GABARITO E COMENTÁRIOS ---".
5. Indique claramente qual é o gabarito oficial e explique DETALHADAMENTE por que a alternativa correta está certa e o erro pontual de cada uma das outras 4 alternativas incorretas.`
  },

  /**
   * Obtém a chave do Gemini configurada pelo usuário
   */
  getApiKey() {
    if (typeof AppState !== 'undefined' && AppState.config?.geminiApiKey) {
      return AppState.config.geminiApiKey.trim();
    }
    return (localStorage.getItem('sefaz_gemini_key') || '').trim();
  },

  /**
   * Obtém o modelo preferido
   */
  getModel() {
    if (typeof AppState !== 'undefined' && AppState.config?.geminiModel) {
      return AppState.config.geminiModel;
    }
    return localStorage.getItem('sefaz_gemini_model') || this.DEFAULT_MODEL;
  },

  /**
   * Executa chamada ao Gemini com estratégia híbrida:
   * 1. Tenta /api/gemini (Vercel Serverless Function)
   * 2. Se falhar (404/rede), tenta chamada direta à API do Google com a chave local
   */
  async generate({ prompt, systemInstruction = '', model = null, temperature = 0.4 }) {
    const chosenModel = model || this.getModel();
    const apiKey = this.getApiKey();

    // 1. Tenta Gateway Serverless da Vercel
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-key'] = apiKey;
      }

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          systemInstruction,
          model: chosenModel,
          temperature
        })
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, text: json.text, source: 'vercel-gateway', model: chosenModel };
      }

      // Se a resposta foi 401 (sem chave no servidor nem no cliente)
      if (res.status === 401 && !apiKey) {
        return {
          success: false,
          needsApiKey: true,
          error: 'Nenhuma chave do Gemini configurada. Insira sua chave gratuita do Google AI Studio na aba Configurações para ativar a IA.'
        };
      }

      // Se retornou erro específico da API
      if (res.status !== 404) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Erro ${res.status} no gateway.`);
      }
    } catch (err) {
      // Se deu 404 (ex: rodando no GitHub Pages ou sem Vercel API), cai para o client-side direto
      if (!apiKey) {
        return {
          success: false,
          needsApiKey: true,
          error: 'Para usar a IA no GitHub Pages ou offline, insira sua chave gratuita da API Gemini na aba Configurações.'
        };
      }
    }

    // 2. Fallback Direto Client-Side (para GitHub Pages ou quando a Vercel API não responder)
    if (!apiKey) {
      return {
        success: false,
        needsApiKey: true,
        error: 'Chave de API do Gemini não encontrada.'
      };
    }

    try {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
          topP: 0.95
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await directRes.json();
      if (!directRes.ok) {
        throw new Error(data?.error?.message || `Erro ${directRes.status} na API do Google.`);
      }

      const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
      return { success: true, text, source: 'direct-client', model: chosenModel };
    } catch (directErr) {
      return {
        success: false,
        error: directErr.message || 'Erro ao conectar à API do Google Gemini.'
      };
    }
  },

  /**
   * Teste de Conexão Rápido
   */
  async testConnection(testKey = null, testModel = null) {
    const key = testKey || this.getApiKey();
    const model = testModel || this.getModel();

    return await this.generate({
      prompt: 'Olá! Responda em uma única frase curta confirmando que você está pronto para ajudar na aprovação no concurso SEFAZ/SC 2026.',
      model,
      temperature: 0.2
    });
  },

  /**
   * Explica um tópico focado na banca FCC
   */
  async explainTopic(topicName, discName = '') {
    const prompt = `Por favor, forneça uma explicação aprofundada e direcionada para a banca FCC sobre o seguinte tópico do edital:
Disciplina: ${discName}
Tópico: ${topicName}

Sua resposta deve conter:
1. **Conceito Fundamental**: O cerne da matéria com base na legislação aplicável.
2. **Como a FCC costuma cobrar**: O viés da banca, pegadinhas frequentes e termos recorrentes.
3. **Jurisprudência / Súmulas Relevantes**: Se houver entendimentos do STF, STJ ou CARF aplicáveis.
4. **Mnemônico ou Esquema Prático**: Para fixação definitiva na memória.`;

    return await this.generate({
      prompt,
      systemInstruction: this.SYSTEM_INSTRUCTIONS.tutorFCC,
      temperature: 0.35
    });
  },

  /**
   * Gera uma questão inédita estilo FCC
   */
  async generateQuestion(topicName, discName = '') {
    const prompt = `Crie uma questão inédita e desafiadora de múltipla escolha (A a E) no padrão FCC (estilo Auditor Fiscal SEFAZ/SC) para o seguinte conteúdo:
Disciplina: ${discName}
Tópico: ${topicName}`;

    return await this.generate({
      prompt,
      systemInstruction: this.SYSTEM_INSTRUCTIONS.questionGeneratorFCC,
      temperature: 0.45
    });
  }
};

// Torna o objeto acessível globalmente
if (typeof window !== 'undefined') {
  window.SEFAZ_AI = SEFAZ_AI;
}
