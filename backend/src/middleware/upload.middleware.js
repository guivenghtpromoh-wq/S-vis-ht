const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Allowed extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];

  const ext = path.extname(file.originalname).toLowerCase();

  // Check MIME type and extension
  if (!allowedMimes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new Error('Tip fichiye sa a pa otorize! Sèlman JPG, PNG, WEBP, PDF, DOC ak DOCX ki aksepte.'));
  }

  // Additional MIME type validation to prevent spoofing
  const mimeToExt = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  if (!mimeToExt[file.mimetype]?.includes(ext)) {
    return cb(new Error('Tip fichiye ak ekstansyon pa matche.'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files per request
  }
});

module.exports = upload;
