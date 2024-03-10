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

Crete a api for scrape data from this site

site-

give me json data of details only list from this html of that page IN Nodejs

NextJS API code format

get data from this html
