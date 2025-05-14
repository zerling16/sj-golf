import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://sj-golf.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
import workoutRoutes from "./routes/workout.js";
import userRoutes from "./routes/user.js";

mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/workouts", workoutRoutes);

app.use("/user", userRoutes);
