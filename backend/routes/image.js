import express from "express";
import cloudinary from "../utils/cloudinary.js";
const router = express.Router();
import { uploadImage } from "../controllers/golfController.js";
import requireAuth from "../middleware/requireAuth.js";

router.use(requireAuth);

router.post("/upload", uploadImage);

export default router;
