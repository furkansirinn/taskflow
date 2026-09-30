require("dotenv").config();

const express = require("express");
const { createClient } = require("@libsql/client");

const app = express();
const PORT = process.env.PORT || 3000;

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

app.use(express.static("public"));
app.use(express.json());

const allowedServices = [
    "Görev Otomasyonu",
    "Raporlama ve Dashboard",
    "Stok Takip Otomasyonu",
    "Diğer"
];

async function initializeDatabase() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            service TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Turso veritabanı hazır.");
}

app.post("/api/requests", async (req, res) => {

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

    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const service = req.body.service.trim();
    const description = req.body.description.trim();

    if (!name || !email || !service || !description) {
        return res.status(400).json({
            success: false,
            message: "Tüm alanlar doldurulmalıdır."
        });
    }

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

    if (email.length > 254) {
        return res.status(400).json({
            success: false,
            message: "E-posta adresi çok uzun."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Geçerli bir e-posta adresi girilmelidir."
        });
    }

    if (!allowedServices.includes(service)) {
        return res.status(400).json({
            success: false,
            message: "Geçerli bir hizmet seçilmelidir."
        });
    }

    try {
        const result = await db.execute({
            sql: `
                INSERT INTO requests (name, email, service, description)
                VALUES (?, ?, ?, ?)
            `,
            args: [
                name,
                email,
                service,
                description
            ]
        });

        console.log(
            "Veritabanına kayıt eklendi. ID:",
            result.lastInsertRowid
        );

        return res.status(201).json({
            success: true,
            message: "Talebiniz başarıyla kaydedildi."
        });

    } catch (error) {
        console.error("Veritabanı kayıt hatası:", error);

        return res.status(500).json({
            success: false,
            message: "Talep kaydedilirken bir hata oluştu."
        });
    }
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`TaskFlow server çalışıyor: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Veritabanı başlatma hatası:", error);
        process.exit(1);
    });