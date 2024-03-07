// pages/api/rto/bank.js

import RTOGujarati from "@/models/RTOGujarati";
import { dbConnect } from "@/utils/dbConnect";
import axios from "axios";
import cheerio from "cheerio";

export default async (req, res) => {
  try {
    const allQuestions = [];
    const lang = req.query.lang;
    dbConnect();
    const questions = await RTOGujarati.find({}).exec();
    if (questions && questions.length > 10) {
      res.status(200).json(questions);
    }
    // Loop through pages 1 to 20
    for (let page = 1; page <= 20; page++) {
      // Fetch HTML content from the website
      const { data } = await axios.get(
        `https://licencetest.in/question-bank/category/${lang}/page/${page}/`
      );

      // Load HTML content into cheerio
      const $ = cheerio.load(data);

      // Iterate over each article element
      $("article").each((index, element) => {
        // Extract title
        const title = $(element).find(".entry-title").text().trim();

        // Extract options and filter out empty strings
        const options = [];
        $(element)
          .find(".entry-content p")
          .each((i, el) => {
            const optionText = $(el).text().trim();
            if (optionText) {
              options.push(optionText);
            }
          });

        // Extract the correct answer
        const correctAnswer = $(element)
          .find(".glyphicon-ok-circle")
          .parent()
          .text()
          .trim();

        // Extract image URL
        const imageURL = $(element).find(".entry-content p a").attr("href");

        // Create a new question object
        const question = new RTOGujarati({
          title,
          options,
          correctAnswer,
          imageURL,
        });

        // Push question details to the array
        allQuestions.push(question);
      });
    }
    // Store all questions into the database
    await RTOGujarati.insertMany(allQuestions);

    // Return success response
    res.status(200).json(allQuestions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
