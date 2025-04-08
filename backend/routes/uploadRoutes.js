import upload from "../middleware/multer.js";
import express from "express";
import { uploadImage } from "../controllers/uploadCloudinary.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;
