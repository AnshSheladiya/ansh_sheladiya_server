import puppeteer from 'puppeteer';
import cors from 'micro-cors';
import cheerio from 'cheerio';
import url from 'url';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);

  try {
    const { name } = req.query;

    // Validate the name query parameter
    if (!name) {
      return res.status(400).json({ error: true, message: 'Animal name is required in the query parameter.' });
    }

    // Construct the URL with the animal name
    const animalUrl = `https://a-z-animals.com/animals/${name}/`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
    await page.goto(animalUrl);

    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();

    // Close the browser
    await browser.close();

    // Load HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Extract scientific classification details
    const scientificClassification = {};
    $('.animal-facts dt').each((index, element) => {
      const key = $(element).text().trim();
      const value = $(element).next('dd').text().trim();
      scientificClassification[key] = value;
    });

    // Extract conservation status
    const conservationStatus = $('.list-unstyled li').text().trim();

    // Extract locations
    const locations = [];
    $('.col-lg-6 ul li').each((index, element) => {
      const location = $(element).text().trim();
      locations.push(location);
    });

    // Extract image URL
    let locationsImageUrl = $('.animal-location-map').attr('src');
    if (locationsImageUrl) {
      locationsImageUrl = url.resolve('https://a-z-animals.com', locationsImageUrl);
    }

    // Extract additional facts
    const additionalFacts = {};
    $('.col-lg-8 dl.row').each((index, element) => {
      $(element).find('dt').each((i, el) => {
        const key = $(el).text().trim();
        const value = $(el).next('dd').text().trim();
        additionalFacts[key] = value;
      });
    });

    // Extract physical characteristics
    const physicalCharacteristics = {};
    $('.col-lg-4 dl.row').each((index, element) => {
      $(element).find('dt').each((i, el) => {
        const key = $(el).text().trim();
        const value = $(el).next('dd').text().trim();
        physicalCharacteristics[key] = value.split(', ').map(item => item.trim());
      });
    });
    // Extract animal image URL from CSS
    const cssContent = $('style[type="text/css"]').text();
    const backgroundImageRegex = /background-image:url\(['"]?(.*?)['"]?\)/g;
    let animalImg = null;
    let match;
    while ((match = backgroundImageRegex.exec(cssContent)) !== null) {
      if (match[1].startsWith('http')) {
        animalImg = match[1];
        break;
      } else {
        animalImg = url.resolve('https://a-z-animals.com', match[1]);
      }
    }
    // Construct the response object
    const animalDetails = {
      scientificClassification,
      conservationStatus,
      locations,
      locationsImageUrl,
      additionalFacts,
      physicalCharacteristics,
      animalImg
    };

    // Send the JSON response containing the animal details
    res.status(200).json(animalDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}

