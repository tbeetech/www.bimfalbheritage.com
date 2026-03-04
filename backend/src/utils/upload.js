const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { bucket, firebaseAvailable } = require('../config/firebase');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image uploads are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Middleware that uploads each file to Firebase Storage and attaches the
// public URL as `file.firebaseUrl`.  Falls back gracefully when the storage
// bucket env var is not set (e.g. local dev without Firebase).
const firebaseUploadMiddleware = async (req, _res, next) => {
  if (!Array.isArray(req.files) || req.files.length === 0) return next();

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!firebaseAvailable || !storageBucket) {
    // Firebase unavailable or no bucket configured – keep local disk file path
    return next();
  }

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const destination = `uploads/${file.filename}`;
        await bucket.upload(file.path, {
          destination,
          metadata: { contentType: file.mimetype },
        });
        const fileRef = bucket.file(destination);
        await fileRef.makePublic();
        file.firebaseUrl = `https://storage.googleapis.com/${storageBucket}/${destination}`;
        // Clean up local temp file
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete temp file:', file.path, err);
        });
      })
    );
  } catch (err) {
    // Log but don't crash – fall back to local URL
    console.error('Firebase Storage upload failed:', err.message);
  }

  return next();
};

module.exports = upload;
module.exports.firebaseUpload = firebaseUploadMiddleware;
