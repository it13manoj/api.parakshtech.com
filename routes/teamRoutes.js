const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { authMiddleware } = require("../middleware/auth");
const {
  getAllTeam,
  getAdminTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  toggleTeamStatus,
} = require("../controllers/teamController");

// Public
router.get("/team", getAllTeam);

// Admin
router.get("/admin/team", authMiddleware, getAdminTeam);
router.post("/admin/team", authMiddleware, upload.single("image"), createTeam);
router.put("/admin/team/:id", authMiddleware, upload.single("image"), updateTeam);
router.delete("/admin/team/:id", authMiddleware, deleteTeam);
router.patch("/admin/team/:id/toggle", authMiddleware, toggleTeamStatus);

module.exports = router;

