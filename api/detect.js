export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ROBOFLOW_API_KEY belum diatur di Environment Variables.' });

  try {
    const { image } = req.body || {};
    if (typeof image !== 'string' || !image.length) {
      return res.status(400).json({ error: 'Image base64 tidak ditemukan.' });
    }
    // Accept either a data URL or raw base64. Keep the payload compact for mobile.
    const base64 = image.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
    if (base64.length > 6_500_000) return res.status(413).json({ error: 'Frame terlalu besar. Turunkan resolusi kamera.' });

    const endpoint = 'https://serverless.roboflow.com/khoiruls-workspace-ra8mr/workflows/semilir';
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: {
          image: { type: 'base64', value: base64 }
        }
      })
    });

    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { raw }; }
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.message || data?.error || 'Roboflow inference gagal.', details: data });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error.' });
  }
}
