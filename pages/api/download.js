// pages/api/download.js
export default async function handler(req, res) {
  const { assetId } = req.query;

  if (!assetId || isNaN(assetId)) {
    return res.status(400).json({ error: 'ID asset non valido' });
  }

  try {
    const ROBLOX_COOKIE = process.env.ROBLOX_COOKIE; // Aggiungi al file .env

    const robloxResponse = await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': `https://www.roblox.com/library/${assetId}/`,
        'Origin': 'https://www.roblox.com',
        'Cookie': ROBLOX_COOKIE,
        'Accept': 'application/json, text/plain, */*',
        'Roblox-Browser-Asset-Request': 'true'
      },
      redirect: 'follow',
      credentials: 'include'
    });

    if (robloxResponse.status === 401) {
      throw new Error('Accesso negato - Asset potrebbe essere privato o richiedere autorizzazione');
    }

    if (!robloxResponse.ok) {
      throw new Error(`Errore ${robloxResponse.status}: ${await robloxResponse.text()}`);
    }

    const contentDisposition = robloxResponse.headers.get('content-disposition') || `attachment; filename="module_${assetId}.rbxm"`;
    
    res.setHeader('Content-Type', robloxResponse.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', contentDisposition);
    
    const buffer = Buffer.from(await robloxResponse.arrayBuffer());
    res.send(buffer);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error.message,
      solution: 'Verifica che: 1) L\'asset sia pubblico 2) Usa un cookie valido 3) Non superare i rate limits'
    });
  }
}