const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql"); // <- 👈 IMPORTANTE

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  const pool = req.app.get("sql");

  try {
    const result = await pool
      .request()
      .input("correo", correo)
      .query("SELECT * FROM Eugenio WHERE correo = @correo");

    const usuario = result.recordset[0];
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error("🔥 Error en login:", err);
    res.status(500).json({ mensaje: "Error en login", error: err.message });
  }
};

exports.getUsuarios = async (req, res) => {
  const pool = req.app.get("sql");
  try {
    console.log("Usuario autenticado:", req.user);
    const result = await pool
      .request()
      .query("SELECT id, nombre FROM Eugenio");

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err.message);
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: err.message });
  }
};

exports.crearUsuario = async (req, res) => {
  const { nombre, correo, password } = req.body;
  const pool = req.app.get("sql");

  try {
    const existe = await pool
      .request()
      .input("correo", correo)
      .query("SELECT * FROM Eugenio WHERE correo = @correo");

    if (existe.recordset.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("nombre", nombre)
      .input("correo", correo)
      .input("password", hashedPassword)
      .query("INSERT INTO Eugenio (nombre, correo, password) VALUES (@nombre, @correo, @password)");

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(500).json({ mensaje: "Error al crear usuario", error: err.message });
  }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const pool = req.app.get("sql");
  
    try {
      await pool.request()
        .input("id", id)
        .input("nombre", nombre)
        .query("UPDATE Eugenio SET nombre = @nombre WHERE id = @id");
  
      res.json({ mensaje: "Usuario actualizado" });
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err);
      res.status(500).json({ mensaje: "Error al actualizar", error: err.message });
    }
  };
  

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  const pool = req.app.get("sql");

  try {
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Eugenio WHERE id = @id");

    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    res.status(500).json({ mensaje: "Error al eliminar", error: err.message });
  }
};
