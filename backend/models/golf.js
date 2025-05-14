import mongoose from "mongoose";

const golfSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  imageUrl: { type: String }, // Store Cloudinary URL here
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Golf", golfSchema);
