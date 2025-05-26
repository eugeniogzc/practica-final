const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error al obtener usuarios
 */
exports.getUsuarios = async (req, res) => {
  const pool = req.app.get("sql");
  try {
    const result = await pool
      .request()
      .query("SELECT id, nombre FROM Eugenio");

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err.message);
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: err.message });
  }
};

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar nombre de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       500:
 *         description: Error al actualizar
 */
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

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       500:
 *         description: Error al eliminar
 */
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
