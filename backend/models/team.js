import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamImageUrl: { type: String, default: "" }, // Cloudinary URL
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Team", teamSchema);
