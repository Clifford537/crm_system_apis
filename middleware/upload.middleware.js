const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../uploads/id-images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Accept 'passport', 'front', and 'back' fields
const upload = multer({ storage }).fields([
  { name: 'passport', maxCount: 1 },
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]);

module.exports = upload;
