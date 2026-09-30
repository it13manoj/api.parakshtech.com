const Job = require("../models/Job");
const { Op } = require("sequelize");

const parseField = (val, defaultVal = []) => {
  if (!val) return defaultVal;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
    return defaultVal;
  }
};

/**
 * Public: Get all active jobs
 */
exports.getAllJobs = async (req, res) => {
  try {
    const { department, type, search } = req.query;
    const where = { isActive: true };

    if (department && department !== "all") where.department = department;
    if (type && type !== "all") where.job_type = type;

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: q } },
        { location: { [Op.like]: q } },
        { description: { [Op.like]: q } },
      ];
    }

    const jobs = await Job.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all jobs
 */
exports.getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("getAdminJobs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public: Get job by ID
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job position not found" });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create job
 */
exports.createJob = async (req, res) => {
  try {
    const body = { ...req.body };
    body.requirements = parseField(body.requirements, []);
    body.responsibilities = parseField(body.responsibilities, []);
    body.skills = parseField(body.skills, []);

    const job = await Job.create(body);

    res.status(201).json({
      success: true,
      message: "Job position created successfully",
      data: job,
    });
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update job
 */
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const body = { ...req.body };
    if (body.requirements) body.requirements = parseField(body.requirements, job.requirements);
    if (body.responsibilities) body.responsibilities = parseField(body.responsibilities, job.responsibilities);
    if (body.skills) body.skills = parseField(body.skills, job.skills);

    await job.update(body);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("updateJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete job
 */
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await job.destroy();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("deleteJob error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Toggle job active
 */
exports.toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job status set to ${job.isActive ? "active" : "inactive"}`,
      data: job,
    });
  } catch (error) {
    console.error("toggleJobStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

