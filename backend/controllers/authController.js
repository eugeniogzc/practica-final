const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  const pool = req.app.get("sql");

  try {
    const result = await pool
      .request()
      .input("correo", correo)
      .query("SELECT * FROM Usuarios WHERE correo = @correo");

    const usuario = result.recordset[0];
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: "Error en login", error: err.message });
  }
};

exports.getUsuarios = async (req, res) => {
  const pool = req.app.get("sql");
  try {
    const result = await pool.request().query("SELECT id, nombre FROM Usuarios");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: err.message });
  }
};
