import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentdb";

await connectDB(MONGO_URI);

const existing = await User.findOne({ username: "admin" });
if (existing) {
  console.log("Admin user already exists");
} else {
  const password = await bcrypt.hash("admin123", 10);
  await User.create({ username: "admin", password, role: "admin" });
  console.log("Created admin user -> username: admin, password: admin123");
}

await mongoose.disconnect();
