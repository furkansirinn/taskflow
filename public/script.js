
// Formu sayfadaki id'si üzerinden buluyoruz.
const requestForm = document.getElementById("request-form");

// Formdaki gönder butonunu buluyoruz.
const submitButton = requestForm.querySelector("button[type='submit']");

// Kullanıcıya başarı veya hata mesajı göstereceğimiz alan.
const formMessage = document.getElementById("form-message");

// Form gönderildiğinde çalışacak kodu tanımlıyoruz.
requestForm.addEventListener("submit", async (event) => {

    // Formun varsayılan davranışı olan sayfa yenilenmesini engelliyoruz.
    event.preventDefault();

    // Önceki mesajı temizliyoruz.
    formMessage.textContent = "";
    formMessage.className = "";
    formMessage.style.display = "none";

    // İstek gönderilirken kullanıcıya işlemin devam ettiğini gösteriyoruz.
    submitButton.disabled = true;
    submitButton.textContent = "Gönderiliyor...";

    // Formdaki kullanıcı bilgilerini alıyoruz.
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const service = document.getElementById("service").value;
    const description = document.getElementById("description").value;

    try {

        // Form verilerini backend'e gönderiyoruz.
        const response = await fetch("/api/requests", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                service: service,
                description: description
            })
        });

        // Backend'in gönderdiği JSON cevabını okuyoruz.
        const result = await response.json();

        // Backend hata döndürdüyse kullanıcıya hata mesajını gösteriyoruz.
        if (!response.ok) {
            formMessage.textContent = result.message;
            formMessage.className = "error";
            formMessage.style.display = "block";
            return;
}

        formMessage.textContent = result.message;
        formMessage.className = "success";
        formMessage.style.display = "block";

        requestForm.reset();

    } catch (error) {

        // Server'a hiç ulaşılamazsa kullanıcıya genel hata gösteriyoruz.
        formMessage.textContent =
            "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.";

        formMessage.className = "error";
        formMessage.style.display = "block";

        console.error("İstek hatası:", error);

    } finally {

        // İstek başarılı veya başarısız olsa da butonu tekrar aktif hale getiriyoruz.
        submitButton.disabled = false;
        submitButton.textContent = "Gönder";
    }
});

