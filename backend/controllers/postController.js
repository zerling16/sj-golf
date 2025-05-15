import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.js";

// Make sure dotenv is loaded before this file runs

export const newPost = async (req, res) => {
  const { teamOne, teamTwo, score, description, image } = req.body;
  const user_id = req.user._id;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: `golf-app/${user_id}`,
    });

    const post = await Post.create({
      user_id,
      teamOne,
      teamTwo,
      score,
      description,
      imageUrl: result.secure_url,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Post creation failed:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create match post", details: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
