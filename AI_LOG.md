# AI_LOG

Bu projede AI asistanı geliştirme sürecinin planlama, kod geliştirme, hata ayıklama, arayüz tasarımı ve test senaryoları aşamalarında aktif olarak kullanılmıştır.

AI tarafından önerilen veya oluşturulan kodlar doğrudan kabul edilmemiş, proje çalıştırılarak ve farklı senaryolar denenerek doğrulanmıştır. Gereksiz görülen öneriler kapsam dışında bırakılmış veya değiştirilmiştir.

## Proje Planlama

İlk aşamada görev gereksinimleri parçalara ayrılarak aşağıdaki yapı oluşturuldu:

* HTML/CSS/JavaScript frontend
* Node.js + Express backend
* Form validation
* API üzerinden veri gönderimi
* Kalıcı veritabanı kaydı
* Responsive tasarım
* Hata ve başarı durumları
* README ve AI kullanım dokümantasyonu

Projenin amacı, yalnızca görsel bir landing page oluşturmak yerine çalışan bir form → API → veritabanı akışını göstermek olarak belirlendi.

## Frontend Geliştirme

AI yardımıyla landing page'in HTML ve CSS yapısı oluşturuldu.

Sayfada aşağıdaki bölümler geliştirildi:

* Header ve navigasyon
* Hero alanı
* Özellikler
* Nasıl Çalışır?
* Talep oluşturma formu

Arayüzün teknoloji şirketi hissi vermesi ancak gereğinden fazla karmaşık olmaması hedeflendi.

Hero alanında dashboard önizlemesi ve hafif görsel hareketler kullanıldı. Özellik kartlarına ikonlar ve hover efektleri eklendi.

Bununla birlikte önerilen her görsel özellik uygulanmadı. Gereksiz kapsam oluşturan veya sayfanın sadeliğini azaltabilecek bazı fikirler uygulanmadan bırakıldı.

## Form ve Frontend Durumları

Form gönderiminde aşağıdaki durumlar oluşturuldu:

* Normal gönderim
* Loading
* Başarılı kayıt
* Backend validation hatası
* Bağlantı hatası

Başarılı kayıt sonrasında form temizlenmektedir.

Hata oluştuğunda kullanıcıya hata mesajı gösterilmekte ve buton tekrar kullanılabilir hale getirilmektedir.

Form sonucu `aria-live="polite"` kullanılarak yardımcı teknolojilere de bildirilecek şekilde yapılandırıldı.

## Backend

Express üzerinde:

```text
POST /api/requests
```

endpoint'i oluşturuldu.

Backend tarafında frontend'den bağımsız validation uygulanmıştır.

Kontrol edilen başlıca alanlar:

* Veri tipleri
* Boş alanlar
* İsim formatı
* İsim uzunluğu
* E-posta formatı
* E-posta uzunluğu
* Hizmet seçimi
* Açıklama uzunluğu

Hizmet alanında whitelist kullanıldı. Böylece frontend'deki seçeneklerin dışında bir değer API'ye gönderildiğinde kabul edilmemektedir.

## Validation ile İlgili Öğrenilen Nokta

İlk validation yaklaşımında veri tiplerinin kontrol edilmesi yeterli sanılmıştı.

Ancak test sırasında formdan girilen:

```text
12345
```

değerinin JavaScript tarafından string olarak gönderildiği görüldü.

Bu nedenle yalnızca:

```javascript
typeof name === "string"
```

kontrolünün yeterli olmadığı belirlendi.

Bunun üzerine isim alanına ayrıca harf ve boşluk kontrolü eklendi:

```javascript
const namePattern = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;
```

Daha sonra aynı senaryo tekrar test edilerek yalnızca rakamlardan oluşan isimlerin backend tarafından reddedildiği doğrulandı.

## Veritabanı ve Turso'ya Geçiş

İlk geliştirme aşamasında lokal SQLite kullanımı planlandı.

Ancak uygulamanın Render üzerinde yayınlanması ve form kayıtlarının kalıcı olarak saklanması gerektiği için persistence yapısı yeniden değerlendirildi.

Bu nedenle SQLite yerine Turso/libSQL kullanılmasına karar verildi.

Turso bağlantısı ortam değişkenleri üzerinden yapılandırıldı:

```env
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

Veritabanı tablosu uygulama başlatılırken yoksa otomatik olarak oluşturulmaktadır.

Başarılı form gönderiminde kayıt Turso'ya yazılmakta ve ancak veritabanı işlemi başarılı olduğunda kullanıcıya başarı mesajı gösterilmektedir.

## SQL ve Veri Güvenliği

Kullanıcı girdileri SQL sorgusuna string birleştirme yöntemiyle eklenmedi.

Parametreli sorgu kullanıldı:

```javascript
INSERT INTO requests (name, email, service, description)
VALUES (?, ?, ?, ?)
```

Ayrıca veritabanı bağlantı bilgileri `.env` dosyasında tutuldu ve `.gitignore` içerisine eklendi.

## Hata Yönetimi ve Testler

Geliştirme sırasında aşağıdaki senaryolar manuel olarak test edildi:

* Geçerli form gönderimi
* Geçersiz e-posta
* Geçersiz hizmet
* Eksik alan
* Kısa isim
* Yalnızca rakamlardan oluşan isim
* Kısa açıklama
* Uzun açıklama
* Geçersiz veri tipi
* Veritabanı hatası
* Sunucu kapalıyken bağlantı hatası
* Loading durumu
* Başarılı kayıt sonrası formun temizlenmesi

Veritabanı hatasını test etmek için kontrollü olarak hatalı bir veritabanı işlemi oluşturuldu.

API'nin `500` durum kodunu döndürdüğü ve frontend'in uygun hata mesajını gösterdiği kontrol edildi.

Daha sonra hatalı durum kaldırılarak normal kayıt işlemi tekrar test edildi.

## Responsive ve Erişilebilirlik

Mobil görünüm tarayıcı üzerinden kontrol edildi.

Test sırasında özellikle küçük ekranlarda:

* Header elemanlarının sıkışması
* Navigasyonun taşması
* Özellik kartlarının yerleşimi
* "Nasıl Çalışır?" kartlarının yan yana kalması

kontrol edildi.

Gerekli CSS düzenlemeleri yapılarak mobil görünüm iyileştirildi.

Klavye ile form üzerinde gezinme de test edildi:

* Tab ile alanlar arasında geçiş
* Görünür focus durumu
* Select alanında klavye kullanımı
* Enter ile form gönderimi
* Loading ve başarı durumları

kontrol edildi.

## Tasarım Kararları

Landing page'in teknoloji şirketi hissi vermesi için açık arka plan, lacivert, mavi ve cyan tonları kullanıldı.

Görsel hareketler düşük seviyede tutuldu. Amaç dikkat dağıtan animasyonlar yerine modern ve profesyonel bir görünüm sağlamaktı.

Önerilen bazı ek özellikler kapsamı gereksiz büyüteceği için uygulanmadı.

Örneğin admin paneli fikri değerlendirildi ancak görev için gerekli olmadığı ve ek authentication/scope oluşturacağı için projeye dahil edilmedi.

Benzer şekilde formun daha karmaşık iki sütunlu bir tasarıma geçirilmesi de uygulanmadı. Mevcut sade yapı korunarak mobil kullanılabilirlik önceliklendirildi.

## Deployment

Uygulama Render üzerinde Web Service olarak yayınlandı.

Production ortamında Turso bağlantı bilgileri Render Environment Variables üzerinden sağlandı.

Deployment sonrasında canlı ortamda form gönderimi gerçekleştirildi ve başarılı kayıt akışı kontrol edildi.

## Sonuç

AI, proje boyunca geliştirme sürecini hızlandırmak ve alternatif çözümleri değerlendirmek amacıyla kullanıldı.

Bununla birlikte proje çıktısındaki kararlar yalnızca AI önerilerine göre belirlenmedi. Kodlar çalıştırılarak test edildi, hatalar gerçek çalışma sırasında tespit edildi ve bazı öneriler kapsam, güvenlik veya gereksinimlere uygunluk açısından değiştirilerek veya reddedilerek uygulandı.

Özellikle validation, veritabanı persistence yapısı, responsive tasarım ve hata yönetimi konularında yapılan değişiklikler manuel testlerle doğrulandı.
