const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { authMiddleware } = require("../middleware/auth");
const {
  getAllServices,
  getAdminServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} = require("../controllers/serviceController");

// Public
router.get("/services", getAllServices);
router.get("/services/:identifier", getServiceBySlug);

// Admin
router.get("/admin/services", authMiddleware, getAdminServices);
router.post("/admin/services", authMiddleware, upload.single("image"), createService);
router.put("/admin/services/:id", authMiddleware, upload.single("image"), updateService);
router.delete("/admin/services/:id", authMiddleware, deleteService);
router.patch("/admin/services/:id/toggle", authMiddleware, toggleServiceStatus);

module.exports = router;

