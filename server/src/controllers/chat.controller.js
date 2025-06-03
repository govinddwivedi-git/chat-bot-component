import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, uploadBase64ToCloudinary } from "../utils/cloudinary.js";
import { Chat } from "../models/chat.model.js";

const chatResult = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const config = {
    responseMimeType: 'text/plain',
  };
  
  let contents;
  let imageUrl = null;
  
  // Check if image file is provided
  if (req.file) {
    let base64ImageFile;
    
    // Handle different storage types
    if (req.file.buffer) {
      // Memory storage (production/Vercel)
      base64ImageFile = req.file.buffer.toString('base64');
      
      // Upload to Cloudinary using base64
      try {
        const image = await uploadBase64ToCloudinary(`data:${req.file.mimetype};base64,${base64ImageFile}`);
        if (image) {
          imageUrl = image.url;
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    } else if (req.file.path) {
      // Disk storage (local development)
      const localFilePath = req.file.path;
      base64ImageFile = fs.readFileSync(localFilePath, {
        encoding: "base64",
      });
      
      // Upload to Cloudinary using file path
      try {
        const image = await uploadOnCloudinary(localFilePath);
        if (image) {
          imageUrl = image.url;
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    } else {
      console.error("No file buffer or path found");
      return res.status(400).json(new ApiResponse(400, null, "Invalid file upload"));
    }

    contents = [
      {
        inlineData: {
          mimeType: req.file.mimetype || "image/jpeg",
          data: base64ImageFile,
        },
      },
      { text: `${question}` },
    ];
  } else {
    // Text-only message
    contents = [{ text: `${question}` }];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config,
      contents: contents,
    });

    if (response.text) {
      try {
        // Preserve the original formatting from the AI response
        const formattedResponse = response.text.trim();
        
        const newChat = await Chat.create({
          userId: req.user._id,
          chat: {
            question: question,
            answer: formattedResponse,
          },
          imageUrl: imageUrl, 
        });
        
        return res.status(200).json(new ApiResponse(200, {
          response: formattedResponse,
          chatId: newChat._id,
          imageUrl: imageUrl
        }, "Chat result fetched successfully"));
      } catch (error) {
        console.error("Error saving chat:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to save chat"));
      }
    } else {
      // Handle case where response.text is empty or undefined
      const fallbackResponse = "I apologize, but I couldn't generate a response. Please try again.";
      return res.status(200).json(new ApiResponse(200, { response: fallbackResponse }, "Chat completed with fallback response"));
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return res.status(500).json(new ApiResponse(500, null, "Failed to generate AI response"));
  }
});

const getChatHistory = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching chat history for user:', req.user._id);
    
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Found chats:', chats.length);
    if (chats.length > 0) {
      console.log('Sample chat structure:', {
        id: chats[0]._id,
        hasChat: !!chats[0].chat,
        hasQuestion: !!chats[0].chat?.question,
        hasAnswer: !!chats[0].chat?.answer,
        createdAt: chats[0].createdAt
      });
    }
    
    return res.status(200).json(new ApiResponse(200, chats, "Chat history fetched successfully"));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json(new ApiResponse(500, [], "Failed to fetch chat history"));
  }
});

export { chatResult, getChatHistory };