const bcrypt = require("bcrypt");

const password = "admin123"; // Cambia si quieres usar otra contraseña

bcrypt.hash(password, 10).then(hash => {
  console.log("Hash generado:", hash);
});
