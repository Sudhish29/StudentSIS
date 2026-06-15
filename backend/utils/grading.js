export function average(subjects) {
  if (!subjects.length) return 0;
  const total = subjects.reduce((sum, s) => sum + s.marks, 0);
  return total / subjects.length;
}

export function gradeFor(avg) {
  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  if (avg >= 40) return "D";
  return "F";
}
