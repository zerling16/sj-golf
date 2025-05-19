import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  teamsNumer: { type: Number, default: 0 },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Tournament", tournamentSchema);
