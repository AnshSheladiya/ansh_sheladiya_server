// pages/api/giveSomeName.js
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
const corsMiddleware = cors();
export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  try {
    // Send the image data back to the client
    res.send();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "true", message: error.message });
  }
}

Crete a api for save my next project ideas like AppName ,Topic and date and priority 
so create a screen for create and show both in one screen also create a post and get api and give me mongoose model