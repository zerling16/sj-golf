import express from "express";
const router = express.Router();
import {
  addWorkout,
  getAllWorkouts,
  getOneWorkout,
  deleteWorkout,
  editWorkout,
} from "../controllers/workoutController.js";
import requireAuth from "../middleware/requireAuth.js";

router.use(requireAuth);

router.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

router.get("/getAll", getAllWorkouts);

router.get("/:id", getOneWorkout);

router.post("/add", addWorkout);

router.delete("/:id", deleteWorkout);

router.patch("/:id", editWorkout);

export default router;
