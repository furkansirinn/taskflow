// Formu sayfadaki id'si üzerinden buluyoruz.
const requestForm = document.getElementById("request-form");

// Form gönderildiğinde çalışacak kodu tanımlıyoruz.
requestForm.addEventListener("submit", (event) => {

    // Formun varsayılan davranışı olan sayfa yenilenmesini engelliyoruz.
    event.preventDefault();

    console.log("Form gönderildi!");
});