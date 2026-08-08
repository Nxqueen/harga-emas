export default function handler(req, res) {
    // Simulasi harga acuan yang sinkron dengan grafik global (misal: 4347.435)
    // Kamu bisa mengganti nilai ini atau menghubungkannya dengan API eksternal nantinya
    const xauUsd = 4347.435 + (Math.random() * 2 - 1); 
    const kursIdr = 17993.00;
    const troyToGram = 31.1034768;
    const spread = 85000;

    // Rumus konversi mutlak ke Rupiah
    const hargaPerGramUsd = xauUsd / troyToGram;
    const hargaDasarIdr = hargaPerGramUsd * kursIdr;

    const hargaBeli = Math.round(hargaDasarIdr + (spread / 2));
    const hargaJual = Math.round(hargaDasarIdr - (spread / 2));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: "success",
        timestamp: new Date().toLocaleTimeString('id-ID'),
        xau_usd: xauUsd.toFixed(3),
        kurs_idr: kursIdr,
        harga_beli: hargaBeli,
        harga_jual: hargaJual
    });
}
