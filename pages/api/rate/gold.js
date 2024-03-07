// pages/api/scrapeSilverRate.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
import moment from "moment";
const corsMiddleware = cors();
export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  const metal=req.query.metal
  try {
    const url = `https://www.thehindubusinessline.com/${metal}-rate-today/Gujarat/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Initialize an empty object to store details
    const details = {};

    // Extract the title of the page
    const title = $('.company-title h1.title-head').text().trim();
    details.title = title;

    // Extract the metal type
    if (title.toLowerCase().includes('silver')) {
      details.metal = 'Silver';
    } else if (title.toLowerCase().includes('gold')) {
      details.metal = 'Gold';
    } else {
      details.metal = 'Unknown'; // If metal type not found in title
    }

    // Extract the date
    const dateMatch = $('.price-filter-category #filter-date').text().trim();
    if (dateMatch) {
      const dateString = dateMatch;
      details.date = moment(dateString, "MMMM DD, YYYY").format("YYYY-MM-DD");
    } else {
      details.date = null; // If date not found
    }

    // Extract the city
    const city = $('.price-filter-category #goldfiltercity option:selected').text().trim();
    details.city = city;

    // Extract the price
    const priceRaw = $('.price-filter-category.final-amount .price-amount').text().trim();
    const price = priceRaw.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    details.price = price;

    // Extract silver rate details from the table
    const silverRateDetails = [];
    $('.table-balance-sheet tbody tr').each((index, element) => {
      // Check if the row contains relevant data
      const gram = $(element).find('td').eq(0).text().trim();
      if (gram.includes('gram')) {
        const rateToday = $(element).find('td').eq(1).text().trim().replace(/[^\d.]/g, ''); // Remove non-numeric characters
        const rateYesterday = $(element).find('td').eq(2).text().trim().replace(/[^\d.]/g, ''); // Remove non-numeric characters
        const priceChange = $(element).find('td').eq(3).text().trim().replace(/[^\d.-]/g, ''); // Remove non-numeric characters and retain negative sign
        // Check if any of the fields are empty before adding to the array
        if (rateYesterday !== '' && priceChange !== '') {
          silverRateDetails.push({ gram, rateToday, rateYesterday, priceChange });
        }
      }
    });
    details.rateDetails = silverRateDetails;

    // Send the details object as JSON response
    res.status(200).json(details);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
