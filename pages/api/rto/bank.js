import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
  const lang = req.query.lang;
  const page = req.query.page || 1; // Default to page 1 if not provided

  try {
    // Fetch HTML content from the website for the specified page
    const { data } = await axios.get(`https://licencetest.in/question-bank/category/${lang}/page/${page}/`);

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

      // Push the details to the array
      details.push({
        title,
        options,
        correctAnswer,
        imageURL,
        language: lang, // Assign the language parameter
      });
    });

    // Return the details as JSON response
    res.status(200).json(details);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
