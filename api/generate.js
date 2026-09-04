export const maxDuration = 60;

export default async function handler(req, res) {
  // Configura cabeçalhos para evitar qualquer bloqueio de CORS ou tipo de conteúdo
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave GEMINI_API_KEY ausente nas variáveis de ambiente do Vercel.' });
  }

  try {
    const promptText = req.body && req.body.prompt ? req.body.prompt : "Gere um roteiro de viagem.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.error && data.error.message ? data.error.message : JSON.stringify(data);
      return res.status(response.status).json({ error: `Erro da API Google: ${errorMsg}` });
    }
    
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: `Erro crítico no servidor: ${error.message}` });
  }
}
