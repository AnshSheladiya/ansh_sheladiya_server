// pages/api/scrapeFoundrsData.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
const corsMiddleware = cors();
export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  try {
    const url = 'https://foundrs.com/';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Initialize an empty array to store questions
    const questions = [];

    // Iterate over each paragraph element within div with class "card-body bg-light"
    $('.card-body.bg-light p').each((index, element) => {
      const question = $(element).text().trim(); // Extract the text content of the paragraph
      questions.push(question); // Push the question into the array
    });

    // Send the questions array as JSON response
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}