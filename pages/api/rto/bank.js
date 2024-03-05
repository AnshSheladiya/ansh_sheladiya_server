import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from '@/utils/dbConnect'; // Assuming this is the correct path to your dbConnect function

export default async (req, res) => {
  dbConnect();
  try {
    // Loop through pages 1 to 20
    for (let page = 1; page <= 20; page++) {
      // Fetch HTML content from the website
      const { data } = await axios.get(`https://licencetest.in/question-bank/category/guj/page/${page}/`);

      // Load HTML content into cheerio
      const $ = cheerio.load(data);

      // Initialize an array to store the details
      const details = [];

      // Iterate over each article element
      $('article').each((index, element) => {
        // Extract title
        const title = $(element).find('.entry-title').text().trim();

        // Extract options
        const options = [];
        $(element).find('.entry-content p').each((i, el) => {
          options.push($(el).text().trim());
        });

        // Extract the correct answer
        const correctAnswer = $(element).find('.glyphicon-ok-circle').parent().text().trim();

        // Extract image URL
        const imageURL = $(element).find('.entry-content p a').attr('href');
    
      });
    }

    res.status(200).json({ message: 'Data saved to database successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
