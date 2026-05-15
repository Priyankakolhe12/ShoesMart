const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.Cloudinary_CLOUD_NAME ||
    process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.Cloudinary_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.Cloudinary_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName.toLowerCase(),
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

module.exports = { connectCloudinary };
