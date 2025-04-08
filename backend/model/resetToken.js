import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  token: {
    type: String,
    require: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    require: true,
  },
});

const resetToken = mongoose.model("resetToken", resetTokenSchema);

export default resetToken;
