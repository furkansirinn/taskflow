const express = require("express");

const Database = require("better-sqlite3");

const app = express();

const PORT = 3000;

// SQLite veritabanı dosyasını açıyoruz.
// Dosya yoksa better-sqlite3 otomatik olarak oluşturur.
const db = new Database("taskflow.db");

// Kullanıcı taleplerini saklayacağımız tabloyu oluşturuyoruz.
db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        service TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Yeni talepleri veritabanına eklemek için SQL sorgusunu hazırlıyoruz.
const insertRequest = db.prepare(`
    INSERT INTO requests (name, email, service, description)
    VALUES (?, ?, ?, ?)
`);

// public klasöründeki CSS, JavaScript ve diğer frontend dosyalarının
// tarayıcı tarafından doğrudan erişilebilir olmasını sağlar.
app.use(express.static("public"));

// Frontend'den gönderilen JSON verilerini okuyabilmemizi sağlar.
app.use(express.json());

// Kullanıcının seçebileceği geçerli hizmetleri tanımlıyoruz.
const allowedServices = [
    "Görev Otomasyonu",
    "Raporlama ve Dashboard",
    "Stok Takip Otomasyonu",
    "Diğer"
];

// Yeni talep oluşturmak için kullandığımız API endpoint'i.
app.post("/api/requests", (req, res) => {


    // Gelen verilerin gerçekten metin olup olmadığını kontrol ediyoruz.
// Böylece API'ye yanlış veri tipi gönderildiğinde kontrollü şekilde hata döndürüyoruz.
if (
    typeof req.body.name !== "string" ||
    typeof req.body.email !== "string" ||
    typeof req.body.service !== "string" ||
    typeof req.body.description !== "string"
) {
    return res.status(400).json({
        success: false,
        message: "Form verileri geçersiz."
    });
}

    // Frontend'den gönderilen verileri request body'den alıyoruz.
    // trim() başındaki ve sonundaki gereksiz boşlukları temizler.
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const service = req.body.service?.trim();
    const description = req.body.description?.trim();

    // İsim alanında en azından harf bulunmasını ve
// sadece harf, boşluk ve Türkçe karakterlerden oluşmasını kontrol ediyoruz.
const namePattern = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;

if (!namePattern.test(name)) {
    return res.status(400).json({
        success: false,
        message: "İsim sadece harf ve boşluk içermelidir."
    });
}

    if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
        success: false,
        message: "İsim 2 ile 100 karakter arasında olmalıdır."
    });
}

if (description.length < 10 || description.length > 2000) {
    return res.status(400).json({
        success: false,
        message: "Açıklama 10 ile 2000 karakter arasında olmalıdır."
    });
}

    // Backend tarafında temel veri kontrolü yapıyoruz.
    if (!name || !email || !service || !description) {
        return res.status(400).json({
            success: false,
            message: "Tüm alanlar doldurulmalıdır."
        });
    }

    if (email.length > 254) {
        return res.status(400).json({
            success: false,
            message: "E-posta adresi çok uzun."
        });
}
    // E-posta formatını temel seviyede kontrol ediyoruz.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Geçerli bir e-posta adresi girilmelidir."
        });
    }

    // Gönderilen hizmetin izin verilen seçeneklerden biri olup olmadığını kontrol ediyoruz.
    if (!allowedServices.includes(service)) {
        return res.status(400).json({
            success: false,
            message: "Geçerli bir hizmet seçilmelidir."
        });
    }

    try {

        // Doğrulanan form verilerini SQLite veritabanına kaydediyoruz.
        const result = insertRequest.run(
            name,
            email,
            service,
            description
        );

        console.log(
            "Veritabanına kayıt eklendi. ID:",
            result.lastInsertRowid
        );

        // Kayıt başarıyla oluşturulduysa kullanıcıya başarı cevabı dönüyoruz.
        return res.status(201).json({
            success: true,
            message: "Talebiniz başarıyla kaydedildi."
        });

    } catch (error) {

        // Veritabanına kayıt sırasında oluşan hatayı terminalde görüyoruz.
        console.error("Veritabanı kayıt hatası:", error);

        // Kullanıcıya teknik hata detaylarını göstermiyoruz.
        return res.status(500).json({
            success: false,
            message: "Talep kaydedilirken bir hata oluştu."
        });
    }
});

// Express'in 3000 portunda çalışmasını sağlar.
app.listen(PORT, () => {
    console.log(`TaskFlow server çalışıyor: http://localhost:${PORT}`);
});