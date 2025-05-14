import mongoose from "mongoose";
const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
    },
    exercise: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
