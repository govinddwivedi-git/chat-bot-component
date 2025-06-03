// src/middlewares/upload.js
import multer from "multer";
import path from "path";

// Use memory storage for serverless environments like Vercel
const storage = multer.memoryStorage();

// Alternative: Use disk storage for local development
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Use memory storage for production, disk storage for development
const selectedStorage = process.env.NODE_ENV === 'production' ? storage : diskStorage;

export const upload = multer({ 
  storage: selectedStorage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


