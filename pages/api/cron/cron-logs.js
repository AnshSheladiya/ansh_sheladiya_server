// // api/cron-logs.js

// import CronLog from '@/models/CronLog';
// import { dbConnect } from '@/utils/dbConnect';

// import cors from "micro-cors";
// const corsMiddleware = cors();
// export default async function handler(req, res) {
//   await corsMiddleware(req, res);
//   // Ensure database connection
//   await dbConnect();

//   try {
//     // Fetch all menu items from the database
//     const cronlogs = await CronLog.find({}).sort({ timestamp: -1 }).limit(500);

//     // Send the categories list as a response
//     res.status(200).json({ success: true, cronlogs });
//   } catch (error) {
//     // Handle errors
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ success: false, error: 'Server Error' });
//   }
// }
