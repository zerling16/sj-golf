import Golf from "../models/golf.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (req, res) => {
  const { image, description } = req.body;
  const userId = req.user._id;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("Received image upload request for user:", userId);

  if (!description) {
    console.log("Missing description");
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    console.log("Starting Cloudinary upload...");
    const result = await cloudinary.uploader.upload(image, {
      folder: `golf-app/${userId}`,
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    const golf = await Golf.create({
      user_id: userId,
      description,
      imageUrl: result.secure_url,
    });

    console.log("Golf document created:", golf);

    return res.status(200).json(golf);
  } catch (error) {
    console.error("Upload failed:", error.message);
    return res
      .status(400)
      .json({ error: "Upload failed", details: error.message });
  }
};
