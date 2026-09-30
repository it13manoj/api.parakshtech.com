const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { authMiddleware } = require("../middleware/auth");
const {
  getSectionContent,
  getAllSections,
  saveSectionContent,
} = require("../controllers/siteContentController");

// Public
router.get("/content/sections", getAllSections);
router.get("/content/:section", getSectionContent);

// Admin
router.post(
  "/admin/content/:section",
  authMiddleware,
  upload.single("image"),
  saveSectionContent
);

module.exports = router;

