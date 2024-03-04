// pages/api/image-proxy.js

import fetch from 'isomorphic-fetch';
import { Buffer } from 'buffer';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from "micro-cors";
const corsMiddleware = cors();
export default async function handler(req, res) {
    await corsMiddleware(req, res);

  try {
    const { url } = req.body;

    // Fetch the image from the provided URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Read the image data as a buffer
    const imageData = await response.arrayBuffer();
    const imageBuffer = Buffer.from(imageData);

    // Set the appropriate headers
    res.setHeader('Content-Type', response.headers.get('Content-Type'));
    res.setHeader('Content-Length', imageBuffer.length);

    // Send the image data back to the client
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
