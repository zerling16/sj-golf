import mongoose from "mongoose";

const golfSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  imageUrl: { type: String }, // Store Cloudinary URL here
  createdAt: { type: Date, default: Date.now },
});

const Golf = mongoose.model("Golf", golfSchema);
export default Golf;
