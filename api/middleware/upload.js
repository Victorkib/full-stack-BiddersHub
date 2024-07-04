// middleware/upload.js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage }).fields([
  { name: 'cr12', maxCount: 1 },
  { name: 'auctioneeringLicense', maxCount: 1 },
]);
