export default async function handler(req, res) {
  console.log("📍 [PASSO 1] Backend acionado. Método:", req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ [ERRO CRÍTICO] GEMINI_API_KEY não encontrada nas variáveis do Vercel.");
    return res.status(500).json({ error: 'Chave não configurada no servidor' });
  }

  console.log(`📍 [PASSO 2] Chave encontrada. Tamanho: ${apiKey.length} caracteres.`);

  try {
    console.log("📍 [PASSO 3] Iniciando fetch para a API do Google (gemini-1.5-flash)...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    console.log("📍 [PASSO 4] Resposta recebida do Google. HTTP Status:", response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ [ERRO DO GOOGLE] Detalhes da falha:", JSON.stringify(data));
      return res.status(response.status).json({ error: data });
    }
    
    console.log("✅ [PASSO 5] Sucesso! JSON do roteiro gerado e pronto para envio.");
    res.status(200).json(data);
    
  } catch (error) {
    console.error("❌ [ERRO CATASTRÓFICO] Falha de infraestrutura no fetch:", error.message);
    res.status(500).json({ error: error.message });
  }
}
