const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const API_BASE = 'https://logam-mulia-api.iamutaki.workers.dev';

// ── Static files (HTML, CSS, JS dari folder public/) ──────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Proxy endpoint: GET /api/prices/:source ───────────────────────
app.get('/api/prices/:source', async (req, res) => {
    const { source } = req.params;
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `${API_BASE}/api/prices/${source}${query}`;

    try {
        const r = await fetch(targetUrl, {
            headers: { 'User-Agent': 'HargaRealtime-Server/1.0' },
            timeout: 10000
        });
        const data = await r.json();

        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        res.status(r.status).json(data);
    } catch (err) {
        console.error(`[proxy] ${source}:`, err.message);
        res.status(502).json({ success: false, error: err.message });
    }
});

// ── Proxy endpoint: GET /api/prices/:source/history ───────────────
app.get('/api/prices/:source/history', async (req, res) => {
    const { source } = req.params;
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `${API_BASE}/api/prices/${source}/history${query}`;

    try {
        const r = await fetch(targetUrl, {
            headers: { 'User-Agent': 'HargaRealtime-Server/1.0' },
            timeout: 10000
        });
        const data = await r.json();

        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
        res.status(r.status).json(data);
    } catch (err) {
        console.error(`[proxy-history] ${source}:`, err.message);
        res.status(502).json({ success: false, error: err.message });
    }
});

// ── Fallback: semua route lain → index.html ───────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
