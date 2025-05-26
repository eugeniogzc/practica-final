const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.login);
router.get("/usuarios", authMiddleware, authController.getUsuarios);
router.post("/usuarios", authMiddleware, authController.crearUsuario);
router.put("/usuarios/:id", authMiddleware, authController.updateUsuario);
router.delete("/usuarios/:id", authMiddleware, authController.deleteUsuario);


module.exports = router;
