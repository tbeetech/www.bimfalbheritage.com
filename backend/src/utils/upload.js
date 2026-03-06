const multer = require('multer');
const sharp = require('sharp');

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image uploads are allowed'), false);
  }
};

// Use memory storage so uploaded files are kept as in-memory buffers.
// This avoids any dependency on the local filesystem, ensuring images
// can be stored in MongoDB and persist across server restarts.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Middleware: compress every uploaded image buffer using sharp (max 1200 px wide, 80% JPEG quality).
// All images are converted to JPEG for consistency and smaller file sizes.
const compressImages = async (req, _res, next) => {
  if (!Array.isArray(req.files) || req.files.length === 0) return next();
  try {
    await Promise.all(
      req.files.map(async (file) => {
        file.buffer = await sharp(file.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
        // Update mimetype to reflect JPEG conversion performed by sharp
        file.mimetype = 'image/jpeg';
      })
    );
  } catch (err) {
    console.error('[upload] Image compression failed:', err.message, '— files:', req.files.map((f) => f.originalname).join(', '));
    // Non-fatal — continue with the original buffers
  }
  return next();
};

// Convert a multer memory-storage file to a base64 data URL suitable for
// storing directly in MongoDB and rendering in <img src="…"> tags.
const bufferToDataUrl = (file) => {
  const mime = file.mimetype || 'image/jpeg';
  return `data:${mime};base64,${file.buffer.toString('base64')}`;
};

module.exports = upload;
module.exports.compressImages = compressImages;
module.exports.bufferToDataUrl = bufferToDataUrl;
