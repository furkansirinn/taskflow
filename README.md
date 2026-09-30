# TaskFlow

TaskFlow, küçük ve orta ölçekli işletmelerde dağınık şekilde ilerleyen iş taleplerinin ve görevlerin daha düzenli yönetilmesine yardımcı olmak amacıyla geliştirilmiş örnek bir teknoloji hizmeti landing page uygulamasıdır.

Proje kapsamında kullanıcılar işletmeleri için ihtiyaç duydukları hizmeti seçerek bir talep oluşturabilir. Form verileri hem istemci hem de sunucu tarafında doğrulanır ve başarılı talepler kalıcı olarak veritabanına kaydedilir.

## Özellikler

* Responsive landing page
* Modern ve sade teknoloji odaklı arayüz
* Görev otomasyonu, raporlama ve stok takip hizmetleri
* Talep oluşturma formu
* İstemci tarafında form doğrulama
* Sunucu tarafında form doğrulama
* İzin verilen hizmetler için whitelist kontrolü
* Loading durumu
* Başarılı kayıt durumu
* Hata durumu
* Kalıcı veritabanı kaydı
* Mobil uyumlu tasarım
* Klavye ile kullanılabilir form alanları
* `aria-live` ile form sonuçlarının erişilebilir şekilde bildirilmesi

## Kullanılan Teknolojiler

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Veritabanı

* Turso
* libSQL

### Diğer

* Git
* GitHub
* Render

## Proje Yapısı

```text
taskflow/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── AI_LOG.md
```

## Veri Akışı

Form gönderildiğinde işlem aşağıdaki şekilde ilerler:

```text
Kullanıcı
   ↓
Frontend Form
   ↓
JavaScript
   ↓
POST /api/requests
   ↓
Sunucu tarafı validation
   ↓
Turso / libSQL
   ↓
Başarılı kayıt
   ↓
Frontend success mesajı
```

Veritabanına kayıt işlemi başarılı olmadığında kullanıcıya başarı mesajı gösterilmez. API hata durumunda uygun HTTP status kodunu ve hata mesajını döndürür.

## Form Alanları

Form aşağıdaki alanlardan oluşmaktadır:

* Ad Soyad
* E-posta
* Hizmet
* Açıklama

Hizmet seçenekleri:

* Görev Otomasyonu
* Raporlama ve Dashboard
* Stok Takip Otomasyonu
* Diğer

## Validation

Validation hem frontend hem backend tarafında uygulanmıştır.

Sunucu tarafında kontrol edilen başlıca durumlar:

* Eksik alanlar
* Geçersiz veri tipleri
* Geçersiz e-posta formatı
* Çok uzun e-posta
* Geçersiz isim formatı
* İsim uzunluğu
* Açıklama uzunluğu
* Geçersiz hizmet seçimi

Hizmet alanında yalnızca izin verilen değerler kabul edilmektedir.

İsim alanında yalnızca harf ve boşluk karakterlerine izin verilmektedir.

Açıklama alanı 10 ile 2000 karakter arasında sınırlandırılmıştır.

## API

### `POST /api/requests`

Yeni bir talep oluşturur.

Örnek request:

```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
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

Hatalı isteklerde API uygun HTTP status koduyla birlikte açıklayıcı bir hata mesajı döndürür.

## Veritabanı

Projenin ilk geliştirme aşamasında lokal SQLite kullanımı planlanmıştır. Uygulamanın Render üzerinde çalışması ve kayıtların kalıcı şekilde saklanması için daha sonra Turso/libSQL'e geçilmiştir.

Veritabanı bağlantısı ortam değişkenleri üzerinden sağlanmaktadır:

```env
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

Bu bilgiler kaynak koduna dahil edilmemiştir.

Uygulama başlatıldığında gerekli `requests` tablosu yoksa otomatik olarak oluşturulur.

Tabloda temel olarak aşağıdaki bilgiler tutulmaktadır:

* `id`
* `name`
* `email`
* `service`
* `description`
* `created_at`

## Kurulum

Projeyi lokal ortamda çalıştırmak için:

```bash
git clone https://github.com/furkansirinn/taskflow.git
cd taskflow
npm install
```

Ardından `.env` dosyası oluşturularak Turso bağlantı bilgileri eklenmelidir:

```env
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

Uygulamayı başlatmak için:

```bash
npm start
```

Uygulama varsayılan olarak:

```text
http://localhost:3000
```

adresinde çalışır.

## Deployment

Uygulama Render üzerinde Web Service olarak yayınlanmıştır.

Render yapılandırması:

* Build Command: `npm install`
* Start Command: `npm start`
* Branch: `main`
* Region: Frankfurt
* Database: Turso/libSQL

Production ortamında Turso bağlantı bilgileri Render Environment Variables üzerinden sağlanmaktadır.

## Testler

Geliştirme sırasında aşağıdaki senaryolar manuel olarak test edilmiştir:

| Senaryo                          | Beklenen Sonuç                       | Durum    |
| -------------------------------- | ------------------------------------ | -------- |
| Geçerli form gönderimi           | 201 ve veritabanına kayıt            | Başarılı |
| Geçersiz e-posta                 | 400                                  | Başarılı |
| Geçersiz hizmet                  | 400                                  | Başarılı |
| Eksik alan                       | 400                                  | Başarılı |
| Kısa isim                        | 400                                  | Başarılı |
| Yalnızca rakamlardan oluşan isim | 400                                  | Başarılı |
| Kısa açıklama                    | 400                                  | Başarılı |
| Uzun açıklama                    | 400                                  | Başarılı |
| Geçersiz veri tipi               | 400                                  | Başarılı |
| Veritabanı hatası                | 500                                  | Başarılı |
| Sunucu kapalıyken form gönderimi | Bağlantı hata mesajı                 | Başarılı |
| Loading durumu                   | Buton geçici olarak devre dışı       | Başarılı |
| Başarılı gönderim sonrası form   | Form temizlenir                      | Başarılı |
| Klavye ile form kullanımı        | Alanlar arasında gezinme ve gönderim | Başarılı |
| Mobil görünüm                    | Responsive layout                    | Başarılı |

Veritabanı hatası ayrıca kontrollü olarak oluşturulmuş ve API'nin `500` durum kodu döndürdüğü doğrulanmıştır. Test sonrasında bağlantı düzeltilerek başarılı kayıt işlemi tekrar kontrol edilmiştir.

## Güvenlik ve Veri Doğrulama

* Veritabanı bağlantı bilgileri `.env` üzerinden tutulmaktadır.
* `.env` dosyası Git'e dahil edilmemektedir.
* Kullanıcı girdileri doğrudan SQL sorgusuna birleştirilmemekte, parametreli sorgu kullanılmaktadır.
* Hizmet alanı whitelist üzerinden kontrol edilmektedir.
* Backend validation frontend'den bağımsız olarak çalışmaktadır.
* Başarılı kayıt gerçekleşmeden başarı mesajı gösterilmemektedir.

## AI Kullanımı

Projenin geliştirilmesi sırasında AI asistanından proje planlama, kod geliştirme, hata ayıklama, kullanıcı arayüzü geliştirme ve test senaryoları oluşturma aşamalarında yararlanılmıştır.

AI tarafından oluşturulan veya önerilen kodlar doğrudan kabul edilmemiş; uygulama çalıştırılarak manuel olarak test edilmiş ve ihtiyaçlara göre değiştirilmiştir.

Detaylı AI kullanım süreci `AI_LOG.md` dosyasında açıklanmıştır.

## Proje Amacı

Bu proje yalnızca görsel bir landing page oluşturmak yerine temel bir uçtan uca veri akışını göstermeyi amaçlamaktadır:

```text
Kullanıcı
→ Form
→ Frontend validation
→ API
→ Backend validation
→ Turso
→ Kalıcı kayıt
→ Başarı / hata sonucu
```

Bu nedenle frontend, backend, veritabanı, hata yönetimi, validation, responsive tasarım ve deployment süreçleri birlikte ele alınmıştır.
