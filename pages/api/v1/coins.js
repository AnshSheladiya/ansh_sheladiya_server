// pages/api/coins.js

import Coin from "@/models/Coin";
import { dbConnect } from "@/utils/dbConnect";


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const coins = await Coin.find({});
        res.status(200).json({ success: true, data: coins });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const coin = await Coin.create(req.body);
        res.status(201).json({ success: true, data: coin });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
