import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://sj-golf.vercel.app",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
import workoutRoutes from "./routes/workout.js";
import userRoutes from "./routes/user.js";
import imageRoutes from "./routes/image.js";
import tournamentRoutes from "./routes/tournament.js";

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

app.use("/image", imageRoutes);

app.use("/tournament", tournamentRoutes);
