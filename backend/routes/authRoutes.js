const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getUsuarios } = require("../controllers/authController");

router.get("/usuarios", authMiddleware, getUsuarios); // ✅ Aquí debe ir el middleware

module.exports = router;
