const express = require("express");
const router = express.Router();
const { login, getUsuarios } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", login);
router.get("/usuarios", authMiddleware, getUsuarios);

module.exports = router;
