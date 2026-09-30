const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  getAllJobs,
  getAdminJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
} = require("../controllers/jobController");

// Public
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);

// Admin
router.get("/admin/jobs", authMiddleware, getAdminJobs);
router.post("/admin/jobs", authMiddleware, createJob);
router.put("/admin/jobs/:id", authMiddleware, updateJob);
router.delete("/admin/jobs/:id", authMiddleware, deleteJob);
router.patch("/admin/jobs/:id/toggle", authMiddleware, toggleJobStatus);

module.exports = router;

