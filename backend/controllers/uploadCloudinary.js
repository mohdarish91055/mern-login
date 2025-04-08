import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        message: "No file selected",
      });
    }

    //upload cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_images",
    });

    //delete the upload file locally
    fs.unlink(req.file.path, (err) => {
      if (err) console.error(" Error deleting file:", err);
    });

    return res.status(200).json({
      message: "File upload successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file after failure:", err);
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export default uploadImage;
