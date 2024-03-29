// pages/api/giveSomeName.js

import { dbConnect } from "@/utils/dbConnect";
import puppeteer from 'puppeteer';
import GujaratBoardExamPapers from '@/models/GujaratBoardExamPapers'; // Import the Mongoose model

export default async function handler(req, res) {
  try {
    // Connect to the database
    await dbConnect();

    // Check if there are existing documents in the database
    const existingDocuments = await GujaratBoardExamPapers.find();

    // If there are existing documents, return them directly
    if (existingDocuments.length > 1) {
      return res.status(200).json(existingDocuments);
    }

    // Launch a headless browser with Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.gsebeservice.com/Web/quePaper');

    // Extract the options from the select list
    const options = await page.evaluate(() => {
      const select = document.getElementById('purpose');
      return Array.from(select.options).map(option => option.value);
    });

    // Extract details for each standard
    const allDetails = [];
    for (const option of options) {
      // Select the option
      await page.select('#purpose', option);
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Extract details from the page
      const details = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('.form-group.quepaper a'));
        return links.map(link => ({
          text: link.textContent.trim(),
          link: link.href
        }));
      });

      allDetails.push({ standard: option, details });

      // Save data into the database
      await GujaratBoardExamPapers.create({ standard: option, details });
    }

    // Close the browser
    await browser.close();

    // Return JSON data of standard-wise details
    res.status(200).json(allDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
