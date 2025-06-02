import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Chat } from "../models/chat.model.js";

const chatResult = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const localFilePath = `./public/temp/${req.file.filename}`
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  const base64ImageFile = fs.readFileSync(
    `${localFilePath}`, {
    encoding: "base64",
  });

  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: `${question}` },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
  });

  if(response.text) {
    try {
      const image = await uploadOnCloudinary(localFilePath);
      const newChat = await Chat.create({
        userId: req.user._id,
        chat: {
          question: question,
          answer: response.text,
          imageUrl: image.url, 
        }
      })
      console.log(newChat);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json(new ApiResponse(500, "Failed to upload image", "Image upload error"));
      
    }
  }
  console.log(response.text);
  return res.status(200).
  json( new ApiResponse(200, response.text, "Chat result fetched successfully"));
});

export { chatResult };