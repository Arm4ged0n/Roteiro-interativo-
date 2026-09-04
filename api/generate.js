export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 👇 COLOQUE A SUA CHAVE DO GOOGLE AI STUDIO ENTRE AS ASPAS ABAIXO 👇
  const apiKey = "COLE_A_SUA_CHAVE_AQUI";

  if (!apiKey || apiKey === "COLE_A_SUA_CHAVE_AQUI") {
    return res.status(500).json({ error: 'Esqueceu-se de colocar a chave no arquivo generate.js' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
