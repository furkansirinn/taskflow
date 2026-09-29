const express = require("express");

const app = express();
const PORT = 3000;

// public klasöründeki CSS, JavaScript ve diğer frontend dosyalarının
// tarayıcı tarafından doğrudan erişilebilir olmasını sağlar.
app.use(express.static("public"));


// Express'in 3000 portunda çalışmasını sağlar
app.listen(PORT, () => {
  console.log(`TaskFlow server çalışıyor: http://localhost:${PORT}`);
});
