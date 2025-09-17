const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("Cloudinary config:", {
  cloud_name: cloudinaryConfig.cloud_name ? "✓ Set" : "✗ Missing",
  api_key: cloudinaryConfig.api_key ? "✓ Set" : "✗ Missing", 
  api_secret: cloudinaryConfig.api_secret ? "✓ Set" : "✗ Missing"
});

cloudinary.config(cloudinaryConfig);

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'collab-board',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip', 'rar'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Resize images
  },
});

module.exports = { cloudinary, storage };
