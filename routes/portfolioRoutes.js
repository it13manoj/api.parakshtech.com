const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { authMiddleware } = require("../middleware/auth");
const {
  getAllPortfolio,
  getAdminPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  togglePortfolioStatus,
} = require("../controllers/portfolioController");

// Public
router.get("/portfolio", getAllPortfolio);
router.get("/portfolio/:id", getPortfolioById);

// Admin
router.get("/admin/portfolio", authMiddleware, getAdminPortfolio);
router.post(
  "/admin/portfolio",
  authMiddleware,
  upload.array("images", 50), // Accept up to 10 project images
  createPortfolio
);
router.put(
  "/admin/portfolio/:id",
  authMiddleware,
  upload.array("images", 50),
  updatePortfolio
);
router.delete("/admin/portfolio/:id", authMiddleware, deletePortfolio);
router.patch("/admin/portfolio/:id/toggle", authMiddleware, togglePortfolioStatus);

module.exports = router;

