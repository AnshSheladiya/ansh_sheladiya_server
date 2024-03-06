import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
  const lang = req.query.lang;
  try {
    // Initialize an array to store the details
    const details = [];

    // Loop through pages 1 to 20
    for (let page = 1; page <= 20; page++) {
      // Fetch HTML content from the website
      const { data } = await axios.get(`https://licencetest.in/question-bank/category/${lang}/page/${page}/`);

      // Load HTML content into cheerio
      const $ = cheerio.load(data);

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

        // Push the details to the array
        details.push({
          title,
          options,
          correctAnswer,
          imageURL,
          language: 'gujarati', // Assuming language is 'gujarati'
        });
      });
    }

    // Return the details as JSON response
    res.status(200).json(details);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
