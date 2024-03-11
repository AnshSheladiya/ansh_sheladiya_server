// pages/api/scrapeJEEPapers.js
import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    // Fetch the HTML content of the page
    const response = await axios.get('https://pdfstudymaterials.com/jee-main-books-free-download-in-gujarati-pdf/');
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Initialize an array to store the result
    const papers = [];

    // Iterate over each table row containing paper details
    $('figure.wp-block-table table tbody tr').each((index, element) => {
      const tds = $(element).find('td');
      if (tds.length === 2) {
        // Extract paper name and download link
        const paperName = $(tds[0]).text().trim();
        const downloadLink = $(tds[1]).find('a').attr('href');
        
        // Push paper details to the result array
        papers.push({
          title: paperName,
          link: downloadLink
        });
      }
    });

    // Send the JSON response
    res.status(200).json(papers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
