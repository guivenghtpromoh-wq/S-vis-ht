const multer = require('multer');
const path = require('path');

// Depo tanporè sou disk ak non inik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtrage MIME-Type ak Ekstansyon
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tip fichiye sa a pa otorize! Sèlman JPG, PNG, WEBP ak PDF ki aksepte.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Limit Max 2MB pou evite saturasyon disk (DoS)
  }
});

module.exports = upload;
