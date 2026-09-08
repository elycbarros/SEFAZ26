/**
 * Serverless Function para Vercel
 * Proxy Seguro para a API do Google Gemini (Flash Lite / Flash)
 * Rota: /api/gemini
 */

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check / status
  if (req.method === 'GET') {
    const hasEnvKey = !!process.env.GEMINI_API_KEY;
    return res.status(200).json({
      status: 'ok',
      service: 'SEFAZ/SC 2026 — Gemini AI Gateway',
      serverKeyConfigured: hasEnvKey,
      defaultModel: 'gemini-2.5-flash-lite'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const { prompt, systemInstruction, model: requestedModel, temperature } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Parâmetro "prompt" é obrigatório.' });
    }

    // Chave de API: prioriza a enviada pelo cliente no header; senão usa a variável de ambiente Vercel
    const clientKey = req.headers['x-gemini-key'];
    let apiKey = (clientKey || process.env.GEMINI_API_KEY || '').trim();
    apiKey = apiKey.replace(/^["']|["']$/g, '');

    if (!apiKey) {
      return res.status(401).json({
        error: 'Nenhuma chave de API do Gemini configurada.',
        code: 'MISSING_API_KEY',
        message: 'Configure a variável GEMINI_API_KEY na Vercel ou insira sua chave pessoal na aba Configurações da plataforma.'
      });
    }

    // Modelo padrão: Gemini Flash Lite
    const model = requestedModel || 'gemini-2.5-flash-lite';
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: typeof temperature === 'number' ? temperature : 0.4,
        maxOutputTokens: 2048,
        topP: 0.95
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const apiResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      const errorMsg = data?.error?.message || 'Erro ao comunicar com a API do Google Gemini.';
      return res.status(apiResponse.status).json({
        error: errorMsg,
        status: apiResponse.status,
        details: data?.error
      });
    }

    const candidate = data.candidates?.[0];
    const generatedText = candidate?.content?.parts?.map(p => p.text).join('') || '';

    return res.status(200).json({
      text: generatedText,
      model,
      usage: data.usageMetadata || null,
      finishReason: candidate?.finishReason || 'STOP'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Erro interno no gateway de IA: ' + err.message
    });
  }
};
