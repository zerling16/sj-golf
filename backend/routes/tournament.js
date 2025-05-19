import express from "express";
const router = express.Router();

import {
  joinTournament,
  getTournament,
  createTournament,
  getStandings,
} from "../controllers/tournamentController.js";
import requireAuth from "../middleware/requireAuth.js";

router.post("/join", requireAuth, joinTournament);

router.get("/get", requireAuth, getTournament);

router.post("/create", requireAuth, createTournament);

router.get("/standings", requireAuth, getStandings);

export default router;
