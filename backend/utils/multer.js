import multer from "multer";

// Use memory storage so files stay as buffers (no temp files on disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file (Cloudinary free tier limit)
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and images only
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed. Only PDF and image files are accepted.`));
    }
  },
});

export default upload;
