import Golf from "../models/golf.js";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
  const { image, userId, description } = req.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: `golf-app/${userId}`,
    });

    const golf = await Golf.create({
      userId,
      description,
      imageUrl: result.secure_url,
    });
    res.status(200).json(golf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};
