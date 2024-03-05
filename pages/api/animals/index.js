import puppeteer from 'puppeteer';
import cors from 'micro-cors';
import cheerio from 'cheerio';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
    await page.goto('https://a-z-animals.com/animals/');

    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();

    // Close the browser
    await browser.close();

    // Load HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Log the number of list items found
    console.log($('.list-item').length);

    // Initialize an array to store the animal details
    const animals = [];

    // Iterate over each list item containing the animal name and page link
    $('.list-item').each((index, element) => {
      // Extract the animal name
      const name = $(element).find('a').text().trim();
      // Extract the page link
      let pageLink = $(element).find('a').attr('href');
      let pageLinkName;
      // Check if the pageLink already contains the base URL
      if (!pageLink.startsWith('https://a-z-animals.com')) {
        // If not, prepend the base URL
        pageLink = `https://a-z-animals.com${pageLink}`;
      }
      const extractedName = pageLink.replace('https://a-z-animals.com/animals/', '');
      // Add the name and page link to the animals array
      animals.push({ name, extractedName });
    });

    // Send the JSON response containing the animal details
    res.status(200).json(animals);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
