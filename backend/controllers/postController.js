import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.js";
import User from "../models/user.js";

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

export const addComment = async (req, res) => {
  const { text, postId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      user_id: userId,
      userName: user.name,
      userProfileImageUrl: user.profileImageUrl,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};
