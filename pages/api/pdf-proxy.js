// pages/api/pdf-proxy.js

import fetch from 'isomorphic-fetch';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'micro-cors';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);

  try {
    const { url } = req.body;

    // Fetch the PDF from the provided URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/pdf');

    // Stream the PDF data back to the client
    response.body.pipe(res);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
