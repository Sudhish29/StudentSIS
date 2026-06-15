import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import studentsRouter from "./routes/students.js";
import authRouter from "./routes/auth.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentdb";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/students", studentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter);

try {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}
