const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    console.error('Cloudinary config missing');
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;