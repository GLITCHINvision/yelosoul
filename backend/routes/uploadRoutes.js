// uploadRoutes.js
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Accept either 'image' or 'images'
router.post(
  "/",
  (req, res, next) => {
    const uploadMiddleware = upload.fields([
      { name: "image", maxCount: 10 },
      { name: "images", maxCount: 10 },
    ]);
    uploadMiddleware(req, res, function (err) {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  (req, res) => {
    const uploadedFiles = [];
    if (req.files["image"]) {
      req.files["image"].forEach((file) => uploadedFiles.push(`/uploads/${file.filename}`));
    }
    if (req.files["images"]) {
      req.files["images"].forEach((file) => uploadedFiles.push(`/uploads/${file.filename}`));
    }
    res.json({ success: true, files: uploadedFiles });
  }
);

export default router;
