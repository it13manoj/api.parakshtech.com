const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactUs");

// Create contact
router.post("/contact-us", contactController.createContact);

// Get all contacts
router.get("/contact-us", contactController.getAllContacts);

// Get single contact
router.get("/contact-us/:id", contactController.getContactById);

// Update active status
router.put("/contact-us/:id/status", contactController.updateContactStatus);

// Delete contact
router.delete("/contact-us/:id", contactController.deleteContact);

module.exports = router;