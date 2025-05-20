import Tournament from "../models/tournament.js";
import User from "../models/user.js";
import Team from "../models/team.js";
import Post from "../models/post.js";

export const createTournament = async (req, res) => {
  const { name, description, numTeams, teamNames } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(teamNames) || teamNames.length !== numTeams) {
    return res
      .status(400)
      .json({ error: "Team names must match number of teams" });
  }

  const existing = await Tournament.findOne({ name });
  if (existing) {
    return res.status(400).json({ error: "Tournament already exists" });
  }

  const createdTeams = await Promise.all(
    teamNames.map((teamName) => Team.create({ teamName }))
  );

  const tournament = await Tournament.create({
    name,
    description,
    numTeams,
    teams: createdTeams.map((team) => team._id),
    players: [userId],
  });

  await User.findByIdAndUpdate(userId, {
    $addToSet: { tournamentId: tournament._id },
  });

  res.status(201).json(tournament);
};

export const getTournament = async (req, res) => {
  const userId = req.user._id;
  const tournaments = await Tournament.find({ players: userId }).populate({
    path: "teams",
    populate: { path: "players", select: "name email" },
  });
  res.status(200).json(tournaments);
};

export const joinTournament = async (req, res) => {
  const { name, teamId } = req.body;
  const userId = req.user._id;

  const tournament = await Tournament.findOne({ name }).populate("teams");
  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found" });
  }

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ error: "Team not found" });
  }

  if (!tournament.players.includes(userId)) {
    tournament.players.push(userId);
    await tournament.save();
  }

  if (!team.players.includes(userId)) {
    team.players.push(userId);
    await team.save();
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { tournamentIds: tournament._id },
  });

  res.status(200).json({ tournament, team });
};

export const findTournamentTeams = async (req, res) => {
  const { name } = req.params;

  try {
    const tournament = await Tournament.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    }).populate("teams");

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.status(200).json({
      _id: tournament._id,
      name: tournament.name,
      teams: tournament.teams,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournament teams" });
  }
};

export const getStandings = async (req, res) => {
  const userId = req.user._id;

  try {
    // Step 1: Get all tournaments the user is in
    const tournaments = await Tournament.find({ players: userId }).populate({
      path: "teams",
      model: "Team",
    });

    const results = [];

    // Step 2: For each tournament, gather post data and compute standings
    for (const tournament of tournaments) {
      const posts = await Post.find({ tournamentId: tournament._id });

      const standings = {};

      // Initialize standings for each team
      tournament.teams.forEach((team) => {
        standings[team._id] = {
          teamId: team._id,
          teamName: team.teamName,
          wins: 0,
          losses: 0,
        };
      });

      // Step 3: Count wins/losses from posts
      posts.forEach((post) => {
        const { teamOne, teamTwo, score1, score2 } = post;

        if (score1 < score2) {
          if (standings[teamOne]) {
            standings[teamOne].wins += 1;
          }
          if (standings[teamTwo]) {
            standings[teamTwo].losses += 1;
          }
        } else {
          if (standings[teamOne]) {
            standings[teamOne].losses += 1;
          }
          if (standings[teamTwo]) {
            standings[teamTwo].wins += 1;
          }
        }
      });

      results.push({
        tournamentId: tournament._id,
        tournamentName: tournament.name,
        standings: Object.values(standings), // convert from map to array
      });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate standings" });
  }
};
