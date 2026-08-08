export default function handler(req, res) {
    // Simulasi harga fisik ANTAM 1 gram yang real-time
    const hargaBeliAntam = 2567021; 
    const hargaJualAntam = 2482466; 

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Mengembalikan data dengan format yang dibaca oleh script index.html milikmu
    res.status(200).json({
        success: true,
        data: [
            {
                weight: 1,
                materialType: "ANTAM",
                sellPrice: hargaBeliAntam,    // Harga beli konsumen
                buybackPrice: hargaJualAntam  // Harga buyback / jual balik
            }
        ]
    });
}
