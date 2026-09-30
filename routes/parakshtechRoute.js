const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { homeHero, findhomeHero, deleteData, allbanner, findServices, uploadimage, jobsDetails } = require("../controllers/parakshTechController");
const { authMiddleware } = require("../middleware/auth");

// POST: Create Home Hero
router.post("/upload-image", upload.single("image"), uploadimage);
router.post("/home-hero", authMiddleware, upload.single("images"), homeHero);
router.get("/home-hero/:pages", findhomeHero);
router.get("/home/allbanner", allbanner);
router.get("/services/findServices", findServices);
router.post("/deleteRecords", deleteData);
router.get("/jobs/details/:id", jobsDetails);


module.exports = router;
