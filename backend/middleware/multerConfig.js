import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTERS_DIR = path.join(__dirname, '..', 'uploads', 'posters');
const PAPERWORK_DIR = path.join(__dirname, '..', 'uploads', 'paperwork');

// Ensure directories exist
[POSTERS_DIR, PAPERWORK_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === 'poster' ? POSTERS_DIR : PAPERWORK_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const processImage = async (req, res, next) => {
  if (!req.files?.['poster']?.[0]) return next();

  try {
    const file = req.files['poster'][0];
    const filename = `processed-${Date.now()}.jpg`;
    const outputPath = path.join(POSTERS_DIR, filename);

    console.log('Processing image:', {
      inputPath: file.path,
      outputPath,
      filename
    });

    await sharp(file.path)
      .resize(800, 600, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    req.files['poster'][0].filename = filename;
    req.files['poster'][0].path = `/uploads/posters/${filename}`;

    console.log('Processed image path:', req.files['poster'][0].path);
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

export const uploadFields = multerUpload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'paperwork', maxCount: 1 }
]);