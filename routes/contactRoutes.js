const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/contactInquiryController");

// Public
router.post("/contact", submitInquiry);

// Admin
router.get("/admin/contacts", authMiddleware, getAllInquiries);
router.patch("/admin/contacts/:id", authMiddleware, updateInquiryStatus);
router.delete("/admin/contacts/:id", authMiddleware, deleteInquiry);

module.exports = router;

