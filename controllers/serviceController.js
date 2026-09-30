const Service = require("../models/Service");
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

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

/**
 * Public: Get all active services
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [["order", "ASC"], ["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("getAllServices error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all services
 */
exports.getAdminServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [["order", "ASC"], ["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("getAdminServices error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public: Get service by slug or ID
 */
exports.getServiceBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);

    const where = isNumeric
      ? { [Op.or]: [{ id: identifier }, { slug: identifier }] }
      : { slug: identifier };

    const service = await Service.findOne({ where });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("getServiceBySlug error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create service
 */
exports.createService = async (req, res) => {
  try {
    const body = { ...req.body };

    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

    if (req.file) {
      body.images = req.file.filename;
    }

    body.features = parseField(body.features, []);
    body.tech = parseField(body.tech, []);

    const service = await Service.create(body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("createService error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update service
 */
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const body = { ...req.body };

    if (req.file) {
      body.images = req.file.filename;
    }

    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }

    if (body.features) body.features = parseField(body.features, service.features);
    if (body.tech) body.tech = parseField(body.tech, service.tech);

    await service.update(body);

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("updateService error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete service
 */
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    await service.destroy();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("deleteService error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Toggle service active
 */
exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service status set to ${service.isActive ? "active" : "inactive"}`,
      data: service,
    });
  } catch (error) {
    console.error("toggleServiceStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

