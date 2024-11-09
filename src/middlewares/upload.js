// middleware/upload.js
import multer from 'multer';
import path from 'path';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Retain original file extension
  },
});

// Create the multer instance and configure it
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|xlsx|xls/; // Allow CSV and Excel files
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File type not allowed!'));
    }
  },
});

// Export the upload middleware
export { upload };
