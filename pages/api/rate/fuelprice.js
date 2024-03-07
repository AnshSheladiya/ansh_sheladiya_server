// pages/api/getLpgRates.js
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
const corsMiddleware = cors();

const scrapeLpgRates = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.mypetrolprice.com/6/12/LPG-Prices-in-Gujarat');
  const htmlContent = await page.content();
  await browser.close();

  const $ = cheerio.load(htmlContent);
  const lpgRates = [];

  $('.OuterDiv').each((index, element) => {
    const city = $(element).find('.HC b a').text().trim();
    const rate = $(element).find('.HC b').text().trim().replace(/[^\d.]/g, '');
    lpgRates.push({ city, rate });
  });

  return lpgRates;
};

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  try {
    const lpgRates = await scrapeLpgRates();
    res.status(200).json(lpgRates);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
