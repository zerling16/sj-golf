import express from "express";
const router = express.Router();

import {
  joinTournament,
  getTournament,
  createTournament,
  getStandings,
  findTournamentTeams,
  updateTeam,
} from "../controllers/tournamentController.js";
import requireAuth from "../middleware/requireAuth.js";

router.post("/join", requireAuth, joinTournament);

router.get("/get", requireAuth, getTournament);

router.post("/create", requireAuth, createTournament);

router.get("/standings", requireAuth, getStandings);

router.get("/find/:name", requireAuth, findTournamentTeams);

router.patch("/update/:id", requireAuth, updateTeam);

export default router;
