/**
 * Vercel Serverless Function: /api/proxy
 * Tujuan: Bypass CORS — browser request ke /api/proxy?url=...
 *         lalu server ini yang fetch ke Cloudflare Workers API.
 *
 * Deploy: taruh file ini di folder /api/ di project Vercel Anda.
 */
export default async function handler(req, res) {
    // Izinkan semua origin (karena ini website Anda sendiri)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Parameter ?url= wajib diisi' });
    }

    // Whitelist: hanya boleh fetch ke domain API yang diizinkan
    const allowed = 'https://logam-mulia-api.iamutaki.workers.dev';
    let targetUrl;
    try {
        targetUrl = decodeURIComponent(url);
    } catch {
        return res.status(400).json({ error: 'URL tidak valid' });
    }

    if (!targetUrl.startsWith(allowed)) {
        return res.status(403).json({ error: 'Domain tidak diizinkan' });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'HargaRealtime-Proxy/1.0' }
        });

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        return res.status(response.status).json(data);

    } catch (err) {
        console.error('Proxy error:', err);
        return res.status(502).json({ error: 'Gagal fetch dari API', detail: err.message });
    }
}
