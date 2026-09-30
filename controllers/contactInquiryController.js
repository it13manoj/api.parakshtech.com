const ContactInquiry = require("../models/ContactInquiry");
const ContactUs = require("../models/contact");

/**
 * Public: Submit contact inquiry
 */
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, contents, message } = req.body;

    const messageContent = contents || message || "";

    if (!name || !email || !messageContent) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Save to primary contact_inquiries table
    const inquiry = await ContactInquiry.create({
      name,
      email,
      phone: phone || null,
      subject: subject || "General Inquiry",
      contents: messageContent,
      status: "new",
    });

    // Also mirror to legacy contactus table for backward compatibility
    try {
      await ContactUs.create({
        name,
        email,
        contents: messageContent,
      });
    } catch (e) {
      // Ignore duplicate/legacy table warnings
    }

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Our engineering team will contact you shortly.",
      data: inquiry,
    });
  } catch (error) {
    console.error("submitInquiry error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all inquiries
 */
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("getAllInquiries error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update inquiry status ('new', 'in_progress', 'contacted', 'archived')
 */
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const inquiry = await ContactInquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    if (status) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry status updated",
      data: inquiry,
    });
  } catch (error) {
    console.error("updateInquiryStatus error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete inquiry
 */
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await ContactInquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    await inquiry.destroy();

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("deleteInquiry error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

