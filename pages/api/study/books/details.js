// pages/api/scrapeData.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
import Link from 'next/link';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  const { std } = req.query;

  try {
    const response = await axios.get(`http://gujaratboard.in/TextBooks/${std}`);
    const html = response.data;
    const $ = cheerio.load(html);

    const data = [];

    $('.panel-title a').each((index, element) => {
      const title = $(element).text().trim();
      const downloadLink = $(element).parent().parent().next().find('a').attr('href');
      const medium = $(element).closest('.panel-heading').attr('id').includes('gujMedDwnload') ? 'Gujarati' : 'English';
      const topics = [];

      // Extract topics and their download links
      $(element).closest('.panel').find('.row').each((i, rowElement) => {
        const topicTitle = $(rowElement).find('.col-sm-8').text().trim();
        const topicHref = $(rowElement).find('.col-sm-3 a').attr('href');
        topics.push({ title: topicTitle, href: topicHref });
      });

      data.push({ title, downloadLink, medium, topics });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
