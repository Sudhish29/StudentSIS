import express from "express";
import Student from "../models/Student.js";
import { average, gradeFor } from "../utils/grading.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find();

  const subjectTotals = {};
  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  const performers = [];

  students.forEach((student) => {
    student.subjects.forEach((s) => {
      if (!subjectTotals[s.name]) subjectTotals[s.name] = { total: 0, count: 0 };
      subjectTotals[s.name].total += s.marks;
      subjectTotals[s.name].count += 1;
    });

    if (student.subjects.length === 0) return;

    const avg = average(student.subjects);
    gradeDistribution[gradeFor(avg)] += 1;

    performers.push({
      name: student.name,
      usn: student.usn,
      average: avg,
      grade: gradeFor(avg),
    });
  });

  const subjectAverages = Object.entries(subjectTotals).map(([name, { total, count }]) => ({
    subject: name,
    average: total / count,
  }));

  const topPerformers = [...performers]
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  res.json({
    totalStudents: students.length,
    subjectAverages,
    gradeDistribution,
    topPerformers,
  });
});

export default router;
