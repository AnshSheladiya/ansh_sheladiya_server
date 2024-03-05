// pages/api/scrape-translation.js
import puppeteer from 'puppeteer';
import { dbConnect } from '@/utils/dbConnect';
import cors from 'micro-cors';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  try {
    const { word ,from,to} = req.query;

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');

    // Navigate to the website
    await page.goto(`https://stenoguru.com/translator/${from}-to-${to}-${to === 'english'?'translation':'translate'}`);

    // Add text in the input textarea
    await page.evaluate((word) => {
      document.getElementById('translatewhat').value = word;
    }, word);

    // Click the translate button
    await page.click('#qgt_translate_button');

    let translation = await page.evaluate(() => {
      return document.querySelector('#translateres').value;
    });

    // Wait for translation to complete
    while (translation === 'Translating') {
      // Check the value again after a short delay
    //   await new Promise(resolve => setTimeout(resolve, 10));
      translation = await page.evaluate(() => {
        return document.querySelector('#translateres').value;
      });
    }

    // Close the browser
    await browser.close();

    // Send the translation back to the client
    res.status(200).json({ translation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }

}
