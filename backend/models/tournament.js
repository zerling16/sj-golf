import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  numTeams: { type: Number },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Tournament", tournamentSchema);
