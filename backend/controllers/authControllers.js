import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "./emailController.js";
import transport from "../config/emailConfig.js";
import resetToken from "../model/resetToken.js";

dotenv.config();

//registeration
export const register = async (req, res) => {
  try {
    const { name, email, mobile, password, image } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      image: image,
    });

    await user.save();

    const emailMessage = `
    <h1>Welcome to Our App!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Best regards,<br/>Your App Team</p>`;

    await sendMail(email, "Registeraiton Successfully", emailMessage);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(401).json({
        message: "User doesn't exist",
      });
      return;
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    //send cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login Successfully",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
        mobile: existingUser.mobile,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//forgot password send mail
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "Invalid Email Id",
      });
    }

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    await resetToken.deleteMany({ userId: user._id });

    //store in db
    await resetToken.create({
      userId: user._id,
      token: token,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    const emailMessage = `<p>Click on this link to generate your new Password.<br/> <h5>${process.env.CLIENT_LINK}/reset-password/${token}</h5></p><br/><p>Note:Only valid for 10 min</p>.`;

    await sendMail(email, "Password Reset Request", emailMessage);
    return res.status(200).json({
      message: "Password reset link send successfully on your registered email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const storedToken = await resetToken.findOne({
      userId: user._id,
      token,
    });

    if (!storedToken || storedToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    //delete token from db
    await resetToken.deleteOne({ token });

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
