import Tournament from "../models/tournament.js";
import User from "../models/user.js";

export const createTournament = async (req, res) => {
  const { name, teamsNumber, description } = req.body;
  const userId = req.user._id;

  try {
    let tournament = await Tournament.findOne({ name });

    if (!tournament) {
      // Create new tournament if it doesn't exist
      tournament = await Tournament.create({
        name,
        players: [userId],
        teamsNumber,
        description,
      });
    } else {
      return res.status(404).json({ error: "Tournament name already exists" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { tournamentId: tournament._id },
    });

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Failed to join/create tournament" });
  }
};

export const getTournament = async (req, res) => {
  const userId = req.user._id;
  const tournaments = await Tournament.find({ players: userId });
  res.status(200).json(tournaments);
};

export const joinTournament = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  let tournament = await Tournament.findOne({ name });
  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found" });
  }

  if (!tournament.players.includes(userId)) {
    tournament.players.push(userId);
    await tournament.save();
  }

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { tournamentId: tournament._id } } // 👈 Adds only if not already present
  );

  res.status(200).json(tournament);
};

export const getStandings = async (req, res) => {
  const userId = req.user._id;
  console.log("hello");
  try {
    const tournaments = await Tournament.find({ players: userId });
    res.status(200).json(tournaments);
  } catch (error) {
    res.error(401).json(error);
  }
};
