const ContactUs = require("../models/contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, contents } = req.body;

    if (!name || !email || !contents) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await ContactUs.create({
      name,
      email,
      contents,
    });

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get All Contact Messages
 */
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get Single Contact by ID
 */
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactUs.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update Active Status
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const contact = await ContactUs.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.isActive = isActive;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Delete Contact Message
 */
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactUs.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};