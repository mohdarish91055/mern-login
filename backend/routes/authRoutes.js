import express from "express";
import multer from "multer";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/authControllers.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//register
router.post("/register", upload.single("image"), register);

//login
router.post("/login", login);

//forgot link send mail
router.post("/forgot-password", forgotPassword);

//reset password
router.post("/reset-password/:token", resetPassword);

//logout
router.post("/logout", logout);

export default router;
