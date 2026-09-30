const Team = require("../models/Team");

const parseField = (val, defaultVal = {}) => {
  if (!val) return defaultVal;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return defaultVal;
  }
};

/**
 * Public: Get all active team members
 */
exports.getAllTeam = async (req, res) => {
  try {
    const team = await Team.findAll({
      where: { isActive: true },
      order: [["order", "ASC"], ["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    console.error("getAllTeam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all team members
 */
exports.getAdminTeam = async (req, res) => {
  try {
    const team = await Team.findAll({
      order: [["order", "ASC"], ["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    console.error("getAdminTeam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create team member
 */
exports.createTeam = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.image = req.file.filename;
    }
    body.social = parseField(body.social, { linkedin: "", github: "", twitter: "" });

    const member = await Team.create(body);

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: member,
    });
  } catch (error) {
    console.error("createTeam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update team member
 */
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    const body = { ...req.body };
    if (req.file) {
      body.image = req.file.filename;
    }
    if (body.social) body.social = parseField(body.social, member.social);

    await member.update(body);

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("updateTeam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete team member
 */
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    await member.destroy();

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("deleteTeam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Toggle active
 */
exports.toggleTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByPk(id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    member.isActive = !member.isActive;
    await member.save();

    res.status(200).json({
      success: true,
      message: `Team member status set to ${member.isActive ? "active" : "inactive"}`,
      data: member,
    });
  } catch (error) {
    console.error("toggleTeamStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

