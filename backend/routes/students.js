import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    const hashedPassword = await bcrypt.hash(student.dob, 10);
    await User.create({
      username: student.usn,
      password: hashedPassword,
      role: "student",
      student: student._id,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const update = { username: student.usn };
    if (req.body.dob) update.password = await bcrypt.hash(student.dob, 10);
    await User.updateOne({ student: student._id }, update);

    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  await User.deleteOne({ student: student._id });
  res.status(204).end();
});

export default router;
