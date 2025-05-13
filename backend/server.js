const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
import cors from "cors";

app.use(
  cors({
    origin: "https://sj-golf.vercel.app", // Replace with your Vercel frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const app = express();
app.use(express.json());
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

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
