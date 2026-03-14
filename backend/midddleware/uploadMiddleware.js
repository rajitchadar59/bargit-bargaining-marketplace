const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'bargit/products/videos' : 'bargit/products/images',
      resource_type: isVideo ? 'video' : 'auto', 
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});


const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = upload;