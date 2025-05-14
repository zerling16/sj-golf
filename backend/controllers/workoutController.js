import Workout from "../models/workout.js";
import mongoose from "mongoose";

export const addWorkout = async (req, res) => {
  const { day, exercise, sets, reps } = req.body;

  let emptyFields = [];

  if (!day) {
    emptyFields.push("day");
  }
  if (!exercise) {
    emptyFields.push("exercise");
  }
  if (!sets) {
    emptyFields.push("sets");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const workout = await Workout.create({
      day,
      exercise,
      sets,
      reps,
      user_id,
    });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOneWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Invalid ID");
  }

  const workout = await Workout.findById(id);
  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(404).json({ error: "No such workout" });
  }
};

export const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Invalid ID");
  }

  const workout = await Workout.findOneAndDelete({ _id: id });

  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(400).json({ error: "No such workout" });
  }
};

export const editWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Invalid ID");
  }

  const workout = await Workout.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(400).json({ error: "No such workout" });
  }
};
