// pages/api/scrapeData.js
import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://www.calories.info/');
    const html = response.data;
    const $ = cheerio.load(html);
    
    const categories = [];

    $('.MuiListItem-root').each((index, element) => {
      const title = $(element).find('.MuiTypography-root').text().trim();
      const href = $(element).find('a').attr('href');
      categories.push({ title, href });
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
