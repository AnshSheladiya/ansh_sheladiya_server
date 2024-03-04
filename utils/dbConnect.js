// utils/db.js

import mongoose from "mongoose";

let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
console.log(process.env.MONGODB_URI)
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};