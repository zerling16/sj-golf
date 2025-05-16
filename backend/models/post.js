import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  userName: { type: String, required: true },
  userProfileImageUrl: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  teamOne: { type: String, required: true },
  teamTwo: { type: String, required: true },
  score: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
