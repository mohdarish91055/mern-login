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
    origin: "http://localhost:5173",
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

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
