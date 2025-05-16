import express from "express";
const router = express.Router();

import {
  loginUser,
  signUpUser,
  updateUser,
  getUser,
} from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";

router.post("/login", loginUser);

router.post("/signup", signUpUser);

router.patch("/updateUser", requireAuth, updateUser);

router.get("/get", requireAuth, getUser);

export default router;
