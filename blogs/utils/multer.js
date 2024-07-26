const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});

const upload = multer({
    storage
    // limits: {
    //   fileSize: 5 * 1024 * 1024 
    // },
    // fileFilter: (req, file, cb) => {
    //   const allowedTypes = ['image/jpeg', 'image/png'];
    //   if (allowedTypes.includes(file.mimetype)) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error('Invalid file type'), false);
    //   }
    // }
  }).single('image');
  


  
module.exports = upload;
