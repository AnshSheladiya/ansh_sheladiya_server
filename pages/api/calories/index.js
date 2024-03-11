// pages/api/scrape.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();

const scrapeWebsite = async (food) => {
    const url = `https://www.calories.info${food}`;
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const foodList = [];
      $('tr.MuiTableRow-root').each((index, element) => {
        const name = $(element).find('a').text().trim();
        const servingSize = $(element).find('td:nth-child(2)').text().trim();
        const caloriesPer100ml = $(element).find('td:nth-child(3)').text().trim();
        const caloriesPerGlass = $(element).find('td:nth-child(5)').text().trim();
        const foodItem = { name, servingSize, caloriesPer100ml, caloriesPerGlass };
        // Check if any field is empty, if not, add to the list
        if (Object.values(foodItem).some(value => value !== '')) {
          foodList.push(foodItem);
        }
      });
      return foodList;
    } catch (error) {
      throw new Error(`Error scraping website: ${error.message}`);
    }
  };
  
const handler = async (req, res) => {
  await corsMiddleware(req, res);
  dbConnect();
  try {
    const { food } = req.query;
    if (!food) {
      return res.status(400).json({ error: true, message: 'Food parameter is missing.' });
    }
    const scrapedData = await scrapeWebsite(food);
    res.status(200).json(scrapedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
};

export default handler;