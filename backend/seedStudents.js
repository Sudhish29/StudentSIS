import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Student from "./models/Student.js";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentdb";

const sampleStudents = [
  {
    name: "Shivam Sharma",
    usn: "1MS23IS150",
    dob: "2004-07-26",
    subjects: [
      { name: "Math", marks: 92 },
      { name: "Physics", marks: 88 },
      { name: "Chemistry", marks: 95 },
      { name: "English", marks: 90 },
    ],
  },
  {
    name: "Ananya Rao",
    usn: "1MS23IS021",
    dob: "2003-11-04",
    subjects: [
      { name: "Math", marks: 80 },
      { name: "Physics", marks: 76 },
      { name: "Chemistry", marks: 82 },
      { name: "English", marks: 79 },
    ],
  },
  {
    name: "Rahul Verma",
    usn: "1MS23IS045",
    dob: "2004-02-15",
    subjects: [
      { name: "Math", marks: 65 },
      { name: "Physics", marks: 70 },
      { name: "Chemistry", marks: 60 },
      { name: "English", marks: 68 },
    ],
  },
  {
    name: "Priya Nair",
    usn: "1MS23IS078",
    dob: "2004-09-30",
    subjects: [
      { name: "Math", marks: 55 },
      { name: "Physics", marks: 48 },
      { name: "Chemistry", marks: 50 },
      { name: "English", marks: 52 },
    ],
  },
  {
    name: "Karan Mehta",
    usn: "1MS23IS102",
    dob: "2003-05-12",
    subjects: [
      { name: "Math", marks: 35 },
      { name: "Physics", marks: 40 },
      { name: "Chemistry", marks: 30 },
      { name: "English", marks: 38 },
    ],
  },
  {
    name: "Meera Iyer",
    usn: "1MS23IS134",
    dob: "2004-12-01",
    subjects: [
      { name: "Math", marks: 88 },
      { name: "Physics", marks: 91 },
      { name: "Chemistry", marks: 85 },
      { name: "English", marks: 93 },
    ],
  },
];

await connectDB(MONGO_URI);

for (const data of sampleStudents) {
  const existing = await Student.findOne({ usn: data.usn });
  if (existing) {
    console.log(`Skipping ${data.usn} (already exists)`);
    continue;
  }

  const student = await Student.create(data);
  const hashedPassword = await bcrypt.hash(student.dob, 10);
  await User.create({
    username: student.usn,
    password: hashedPassword,
    role: "student",
    student: student._id,
  });

  console.log(`Created ${student.name} (${student.usn})`);
}

await mongoose.disconnect();
