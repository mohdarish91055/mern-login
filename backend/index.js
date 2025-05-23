import express from "express";
import cors from "cors";
import connectDb from "./config/dbConnection.js";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-login-1-rh9p.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDb();

app.get("/", (req, resp) => {
  resp.send(`server in running`);
});

//image upload
app.use("/api", uploadRoutes);

//authentication and authorization
app.use("/api/auth", authRoutes);

//user
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
