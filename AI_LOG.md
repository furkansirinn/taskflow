# AI_LOG

Bu projede AI asistanı geliştirme sürecinin büyük bölümünde aktif olarak kullanılmıştır. AI; proje planlama, kod geliştirme, hata ayıklama ve test senaryolarının oluşturulmasında yardımcı olarak kullanılmıştır. Üretilen kodlar çalıştırılarak ve farklı senaryolar denenerek kontrol edilmiştir.

## Proje planlama

AI ile görev tanımı parçalara ayrıldı ve HTML/CSS/JavaScript frontend, Node.js + Express backend ve SQLite veritabanından oluşan yapı belirlendi.

## Backend

Express üzerinde `/api/requests` endpoint'i oluşturuldu. Form verilerinin sunucuda doğrulanması ve başarılı kayıtların SQLite veritabanına yazılması sağlandı.

## Validation

İlk validation kontrollerinden sonra sadece veri tipinin kontrol edilmesinin yeterli olmadığı test edildi. Örneğin formdan girilen `12345` değeri JavaScript tarafında string olarak geldiği için type kontrolünü geçebiliyordu. Bunun üzerine isim alanına ayrıca harf ve boşluk kontrolü eklendi ve tekrar test edildi.

Hizmet seçimi için izin verilen değerlerin whitelist üzerinden kontrol edilmesi ve uzunluk kontrolleri de eklendi.

## Hata yönetimi ve testler

Farklı hatalı senaryolar manuel olarak test edildi:

- Geçersiz e-posta
- Geçersiz hizmet
- Kısa isim
- Kısa ve uzun açıklama
- Geçersiz veri tipi
- Yalnızca rakamlardan oluşan isim
- Veritabanı hatası
- Sunucu kapalıyken bağlantı hatası

Veritabanı hatasını test etmek için kontrollü olarak hatalı parametre gönderildi ve API'nin 500 durum kodu döndürdüğü kontrol edildi. Daha sonra hatalı kod düzeltilerek başarılı kayıt tekrar test edildi.

## Frontend

Form gönderimi sırasında loading durumu, başarılı kayıt ve hata durumları oluşturuldu. Başarılı kayıt sonrasında formun temizlenmesi ve hata sonrasında butonun tekrar kullanılabilir hale gelmesi test edildi.

## Responsive ve erişilebilirlik

Klavye ile form üzerinde gezinme ve form gönderimi test edildi.

Mobil görünüm tarayıcı üzerinden kontrol edildi. iPhone SE boyutunda `Nasıl Çalışır?` bölümündeki kartların yan yana kaldığı ve header elemanlarının sıkıştığı fark edildi. CSS değiştirilerek kartların mobilde alt alta gelmesi ve header'ın iki satırlı yapıya geçmesi sağlandı.

## AI önerilerinde alınan kararlar

AI tarafından önerilen her özellik doğrudan uygulanmadı. Örneğin bir admin paneli fikri değerlendirildi ancak görev kapsamında gerekli olmadığı ve ek kapsam oluşturacağı düşünüldüğü için uygulanmadı.

Bu süreçte AI kod geliştirme ve problem çözmede aktif olarak kullanıldı; uygulamanın çalışması ve gereksinimleri karşılaması ise manuel testlerle doğrulandı.