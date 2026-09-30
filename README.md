# TaskFlow

TaskFlow, işletmelerde dağınık şekilde ilerleyen görev ve taleplerin daha düzenli bir iş akışına dönüştürülmesini amaçlayan örnek bir teknoloji hizmeti landing page uygulamasıdır.

## Özellikler

* Responsive landing page
* Hizmet tanıtımı
* Talep oluşturma formu
* İstemci tarafı form kontrolleri
* Sunucu tarafı veri doğrulama
* Geçerli hizmet seçeneklerinin whitelist ile kontrol edilmesi
* E-posta formatı kontrolü
* İsim ve açıklama uzunluk kontrolleri
* SQLite veritabanına kalıcı kayıt
* Form gönderiminde loading, başarı ve hata durumları
* Klavye ile kullanılabilir form alanları
* `aria-live` ile form sonucu bilgilendirmesi

## Kullanılan Teknolojiler

* HTML
* CSS
* JavaScript
* Node.js
* Express
* SQLite
* better-sqlite3

## Proje Yapısı

```text
taskflow/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── AI_LOG.md
```

## Çalışma Mantığı

Kullanıcı landing page üzerindeki talep formunu doldurur.

Frontend, form verilerini JavaScript ile `/api/requests` endpoint'ine `POST` isteği olarak gönderir.

Express sunucusu gelen verileri tekrar doğrular. Geçerli veriler SQLite veritabanındaki `requests` tablosuna kaydedilir.

Kayıt başarılı olduğunda sunucu HTTP `201` durum kodu ve başarı mesajı döndürür. Veritabanı işlemi başarısız olursa kullanıcıya başarı mesajı gösterilmez ve sunucu `500` hata kodu döndürür.

## Kurulum

Projeyi çalıştırmak için Node.js kurulu olmalıdır.

Bağımlılıkları yükleyin:

```bash
npm install
```

Uygulamayı başlatın:

```bash
npm start
```

Ardından tarayıcıdan:

```text
http://localhost:3000
```

adresini açın.

Uygulama ilk çalıştırıldığında proje klasöründe `taskflow.db` isimli SQLite veritabanı dosyası oluşturulur.

## API

### POST `/api/requests`

Yeni bir talep oluşturur.

Örnek istek:

```json
{
  "name": "Test Kullanıcısı",
  "email": "test@example.com",
  "service": "Görev Otomasyonu",
  "description": "İşletmemizdeki görevlerin daha düzenli takip edilmesini istiyoruz."
}
```

Başarılı kayıt:

```json
{
  "success": true,
  "message": "Talebiniz başarıyla kaydedildi."
}
```

Geçersiz veriler için API `400` durum kodu döndürür.

Veritabanı hatalarında `500` durum kodu döndürülür.

## Veri Doğrulama

Sunucu tarafında aşağıdaki kontroller uygulanır:

* Tüm alanların string olması
* Boş alan kontrolü
* İsim uzunluğu: 2–100 karakter
* İsimde yalnızca harf ve boşluk kullanılması
* E-posta formatı
* E-posta maksimum uzunluğu
* Açıklama uzunluğu: 10–2000 karakter
* Hizmet seçeneğinin izin verilen seçeneklerden biri olması

Veritabanına kayıt eklenirken prepared statement kullanılır.

## Testler

Geliştirme sırasında aşağıdaki senaryolar test edilmiştir:

* Geçerli form gönderimi
* Geçersiz e-posta
* Geçersiz hizmet seçimi
* Çok kısa isim
* Çok kısa açıklama
* Çok uzun açıklama
* Geçersiz veri tipi
* Yalnızca rakamlardan oluşan isim
* Veritabanı kayıt hatası
* Sunucu kapalıyken bağlantı hatası
* Loading durumunda buton davranışı
* Başarılı kayıt sonrası formun temizlenmesi
* Klavye ile form navigasyonu
* Mobil responsive görünüm

## Güvenlik ve Veri Akışı

Form verileri hem istemci hem sunucu tarafında kontrol edilir. Sunucu tarafındaki doğrulama, istemci kontrollerinden bağımsız olarak çalışır.

Veritabanı sorgusunda kullanıcı girdisini doğrudan SQL sorgusuna eklemek yerine prepared statement kullanılır.

İzin verilen hizmetler whitelist üzerinden kontrol edilir.

## Not

Bu proje teknik değerlendirme kapsamında hazırlanmış bir örnek uygulamadır.
