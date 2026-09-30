const Portfolio = require("../models/Portfolio");
const { Op } = require("sequelize");

// Helper to parse JSON or array fields from FormData
const parseField = (val, defaultVal = []) => {
  if (!val) return defaultVal;
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return defaultVal;
  }
};

/**
 * Public: Get all portfolio items
 * Query params: category, type ('multi' | 'single'), search, limit, offset
 */
exports.getAllPortfolio = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    const where = { isActive: true };

    if (category && category !== "all") {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: q } },
        { sub_heading: { [Op.like]: q } },
        { description: { [Op.like]: q } },
        { client: { [Op.like]: q } },
      ];
    }

    let items = await Portfolio.findAll({
      where,
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    // Optional filter by multi-image or single-image
    if (type === "multi") {
      items = items.filter((p) => Array.isArray(p.images) && p.images.length > 1);
    } else if (type === "single") {
      items = items.filter((p) => !Array.isArray(p.images) || p.images.length <= 1);
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("getAllPortfolio error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all portfolio items (including inactive)
 */
exports.getAdminPortfolio = async (req, res) => {
  try {
    const items = await Portfolio.findAll({
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("getAdminPortfolio error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public / Admin: Get single portfolio by ID
 */
exports.getPortfolioById = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("getPortfolioById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create new project
 * Supports: single file (req.file) or multiple files (req.files) or URL list in req.body.images
 */
exports.createPortfolio = async (req, res) => {
  try {
    const body = { ...req.body };

    // Process uploaded images
    let uploadedImages = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      uploadedImages = req.files.map((f) => f.filename);
    } else if (req.file) {
      uploadedImages = [req.file.filename];
    }

    // Merge with any text image URLs passed in body
    const bodyImages = parseField(body.images, []);
    const finalImages = [...uploadedImages, ...bodyImages];

    body.images = finalImages;
    body.tech = parseField(body.tech, ["React", "Node.js"]);
    body.features = parseField(body.features, []);

    const created = await Portfolio.create(body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: created,
    });
  } catch (error) {
    console.error("createPortfolio error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update portfolio
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Portfolio.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const body = { ...req.body };

    // Process newly uploaded files
    let uploadedImages = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      uploadedImages = req.files.map((f) => f.filename);
    } else if (req.file) {
      uploadedImages = [req.file.filename];
    }

    // Existing images to keep (if sent from frontend form)
    let keptImages = [];
    if (body.existingImages) {
      keptImages = parseField(body.existingImages, []);
    } else if (body.images) {
      keptImages = parseField(body.images, []);
    } else {
      keptImages = item.images || [];
    }

    // Combine
    body.images = [...keptImages, ...uploadedImages];

    if (body.tech) body.tech = parseField(body.tech, item.tech);
    if (body.features) body.features = parseField(body.features, item.features);

    await item.update(body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("updatePortfolio error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete portfolio
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Portfolio.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await item.destroy();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("deletePortfolio error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Toggle active state
 */
exports.togglePortfolioStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Portfolio.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    item.isActive = !item.isActive;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Project status set to ${item.isActive ? "active" : "inactive"}`,
      data: item,
    });
  } catch (error) {
    console.error("togglePortfolioStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

