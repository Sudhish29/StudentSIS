import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    usn: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    subjects: { type: [subjectSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
