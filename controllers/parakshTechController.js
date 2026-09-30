const Home = require("../models/home/home.js");
const { Op, fn, col, where } = require("sequelize");
exports.homeHero = async (req, res) => {
    try {
        req.body.images = req?.file?.filename
        const homeData = await Home.create(req.body);

        res.status(201).json({
            success: true,
            message: "Home hero created successfully",
            data: homeData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.uploadimage = async (req, res) => {
    try {
        req.body.images = req?.file?.filename
        req.body.pages = "images"


        const homeData = await Home.create(req.body);

        // Return JSON format CKEditor expects
        const protocol = req.protocol; // http or https
        const host = req.get("host"); // domain or localhost:port
        const imageUrl = `${protocol}://${host}/api/v1/uploads/${req.file.filename}`;

        res.json({ url: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.findhomeHero = async (req, res) => {
    try {
        let { pages } = req.params;
        if (pages == "e commerce-solutions") {
            pages = "Ecommerce Solutions"
        }
        const homeData = await Home.findAll({
            where: {
                pages: pages
            }
        });
        res.status(201).json({
            success: true,
            message: "Home hero get successfully",
            data: homeData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.deleteData = async (req, res) => {
    try {
        const { id } = req.body;

        const deleted = await Home.destroy({
            where: { id: id }
        });

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Record deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


exports.allbanner = async (req, res) => {
    try {
        const homeData = await Home.findAll({
            where: where(
                fn("LOWER", col("pages")),
                {
                    [Op.in]: [
                        "abouthero",
                        "aboutus",
                        "servicesmain",
                        "servicessub",
                        "contact",
                        "career",
                    ],
                }
            ),
            logging: console.log,
        });

        res.status(200).json({
            success: true,
            data: homeData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


exports.findServices = async (req, res) => {
    // let ecommerce = "";

    try {
        const homeData = await Home.findAll({
            where: where(
                fn("LOWER", col("pages")),
                {
                    [Op.in]: [
                        "Web Development",
                        "Software Development",
                        "App Development",
                        "Web Designing",
                        "Digital Marketing",
                        "Ecommerce Solutions",
                        "e commerce-solutions",
                    ],
                }
            ),
            logging: console.log,
        });

        res.status(200).json({
            success: true,
            data: homeData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


exports.jobsDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const jobsData = await Home.findOne({
            where: { id: id, pages: "Jobs" }
        });
        res.status(200).json({
            success: true,
            data: jobsData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
