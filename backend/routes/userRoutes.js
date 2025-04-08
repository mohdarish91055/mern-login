import express from "express";
import updateUser from "../controllers/userControllers.js";

const router = express.Router();

//update user information
router.put("/:id", updateUser);

export default router;
