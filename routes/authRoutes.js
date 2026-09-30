const express = require("express");
const router = express.Router();
const { login, create, getMe, seedDefaultAdmin } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

router.post("/auth/login", login);
router.post("/auth/register", create);
router.get("/auth/me", authMiddleware, getMe);
router.post("/auth/seed-admin", seedDefaultAdmin);

module.exports = router;

