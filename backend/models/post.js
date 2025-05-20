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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  tournamentName: {
    type: String,
    required: true,
  },
  teamOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  teamOneName: {
    type: String,
    required: true,
  },
  score1: { type: Number, required: true },
  teamTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  teamTwoName: {
    type: String,
    required: true,
  },
  score2: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
