import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username: { $regex: `^${escapeRegex(username)}$`, $options: "i" },
  });
  if (!user) return res.status(401).json({ error: "Invalid username or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid username or password" });

  res.json({
    username: user.username,
    role: user.role,
    studentId: user.student || null,
  });
});

export default router;
