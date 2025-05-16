import express from "express";
const router = express.Router();
import { uploadImage } from "../controllers/golfController.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  newPost,
  getPosts,
  addComment,
} from "../controllers/postController.js";

router.use(requireAuth);

router.post("/upload", uploadImage);

router.post("/newPost", newPost);

router.get("/getPosts", getPosts);

router.post("/addComment", addComment);

export default router;
