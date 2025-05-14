import express from "express";
const router = express.Router();

import { loginUser, signUpUser } from "../controllers/userController.js";

router.post("/login", loginUser);

router.post("/signup", signUpUser);

export default router;
