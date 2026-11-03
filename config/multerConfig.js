const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = (file.originalname || "file").replace(/[^a-zA-Z0-9.]/g, "-");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e5)}-${cleanName}`);
  },
});

// File filter to allow images, icons, and document attachments
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|gif|webp|svg|ico|pdf|bmp|tiff/;
  const ext = path.extname(file.originalname || "").toLowerCase().replace(".", "");
  const mime = (file.mimetype || "").toLowerCase();

  if (
    allowedExts.test(ext) ||
    allowedExts.test(mime) ||
    mime.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WEBP, GIF, SVG, ICO) and PDFs are allowed"));
  }
};

const baseUpload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB per file
    files: 50,                  // up to 50 files
  },
  fileFilter: fileFilter,
});

/**
 * Resilient upload middleware:
 * - Accepts any field name without throwing MulterError: Unexpected field
 * - Normalizes req.file for single-file handlers
 * - Normalizes req.files for multi-file handlers
 * - Gracefully returns clean JSON errors if multer fails
 */
const flexibleUpload = (req, res, next) => {
  baseUpload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}${err.field ? ` in field '${err.field}'` : ""}`,
          code: err.code,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.file =
        req.files.find((f) =>
          ["image", "images", "upload", "file", "avatar", "icon", "attachment"].includes(
            (f.fieldname || "").toLowerCase()
          )
        ) || req.files[0];
    }

    next();
  });
};

const upload = flexibleUpload;
upload.single = () => flexibleUpload;
upload.array = () => flexibleUpload;
upload.fields = () => flexibleUpload;
upload.any = () => flexibleUpload;
upload.none = baseUpload.none.bind(baseUpload);
upload.storage = storage;
upload.fileFilter = fileFilter;
upload.baseUpload = baseUpload;

module.exports = upload;
