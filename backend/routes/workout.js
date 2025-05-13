const express = require("express");
const router = express.Router();
const {
  addWorkout,
  getAllWorkouts,
  getOneWorkout,
  deleteWorkout,
  editWorkout,
} = require("../controllers/workoutController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

router.get("/getAll", getAllWorkouts);

router.get("/:id", getOneWorkout);

router.post("/add", addWorkout);

router.delete("/:id", deleteWorkout);

router.patch("/:id", editWorkout);

module.exports = router;
