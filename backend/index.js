const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(",") }));
app.use(express.json());

// Configuración de la base de datos
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Conexión a SQL Server y lanzamiento del servidor
sql.connect(config)
  .then(pool => {
    console.log("✅ Conectado a SQL Server");

    app.set("sql", pool);

    // Importar rutas
    const authRoutes = require("./routes/authRoutes");
    app.use("/api", authRoutes);

    // Iniciar servidor
    app.listen(3001, () => console.log("🚀 Backend corriendo en http://localhost:3001"));
  })
  .catch(err => console.error("❌ Error de conexión SQL:", err));
