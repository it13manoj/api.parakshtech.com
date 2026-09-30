const SiteContent = require("../models/SiteContent");
const Home = require("../models/home/home");

/**
 * Public: Get content for a specific section or all sections
 */
exports.getSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    let content = await SiteContent.findOne({ where: { section, isActive: true } });

    // Fallback: check legacy home table if not yet migrated
    if (!content) {
      const legacy = await Home.findOne({ where: { pages: section } });
      if (legacy) {
        content = {
          section: legacy.pages,
          title: legacy.title,
          heading: legacy.heading,
          sub_heading: legacy.sub_heading,
          contents: legacy.contents,
          images: legacy.images,
          metadata: legacy.assets,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("getSectionContent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Public: Get all active sections
 */
exports.getAllSections = async (req, res) => {
  try {
    const sections = await SiteContent.findAll({ where: { isActive: true } });
    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    console.error("getAllSections error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update or create section content
 */
exports.saveSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    const body = { ...req.body };

    if (req.file) {
      body.images = req.file.filename;
    }

    let item = await SiteContent.findOne({ where: { section } });

    if (item) {
      await item.update(body);
    } else {
      body.section = section;
      item = await SiteContent.create(body);
    }

    res.status(200).json({
      success: true,
      message: "Section content saved successfully",
      data: item,
    });
  } catch (error) {
    console.error("saveSectionContent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

