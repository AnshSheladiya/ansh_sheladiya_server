// pages/api/scrapeData.js

import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();
const scrapeWebsite = async () => {
    const url = 'https://www.hindifiles.com/2020/03/shreemad-bhagwat-geeta-hindi.html';
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const data = [];

        // Extract title and URL for each list item
        $('ul.catlist li b a').each((index, element) => {
            const title = $(element).text().trim();
            let url = $(element).attr('href');
            
            // Remove base URL from the scraped URL
            url = url.replace('https://www.hindifiles.com', '');
            
            data.push({ title, url });
        });

        // Return the list of titles and URLs
        return data;
    } catch (error) {
        throw new Error(`Error scraping website: ${error.message}`);
    }
};


const handler = async (req, res) => {
    await corsMiddleware(req, res);
    dbConnect();
    try {
        const scrapedData = await scrapeWebsite();
        res.status(200).json(scrapedData);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: true, message: error.message });
    }
};

export default handler;
