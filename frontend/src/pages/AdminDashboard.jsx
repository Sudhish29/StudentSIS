import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
} from "../api";
import { useAuth } from "../AuthContext";

const emptyForm = {
  name: "",
  usn: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  subjects: [{ name: "", marks: "" }],
};

const GRADE_COLORS = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

const GRADE_STYLES = {
  A: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => String(CURRENT_YEAR - i));

function parseDob(dob) {
  if (!dob) return { dobYear: "", dobMonth: "", dobDay: "" };
  const [year, month, day] = dob.split("-");
  return { dobYear: year, dobMonth: month, dobDay: day };
}

function average(subjects) {
  if (!subjects.length) return 0;
  const total = subjects.reduce((sum, s) => sum + Number(s.marks), 0);
  return total / subjects.length;
}

function gradeFor(avg) {
  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  if (avg >= 40) return "D";
  return "F";
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "flex flex-col gap-1 text-sm font-medium text-gray-600";

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-2a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 3v18h18M7 16v-4m5 4V8m5 8v-6" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15a5 5 0 100-10 5 5 0 000 10zM8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
    </svg>
  );
}

function StatCard({ icon, label, children }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wide">{label}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  async function loadAll() {
    try {
      const [studentsData, statsData] = await Promise.all([
        getStudents(),
        getStats(),
      ]);
      setStudents(studentsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleSubjectChange(index, field, value) {
    const subjects = [...form.subjects];
    subjects[index] = { ...subjects[index], [field]: value };
    setForm({ ...form, subjects });
  }

  function addSubjectField() {
    setForm({ ...form, subjects: [...form.subjects, { name: "", marks: "" }] });
  }

  function removeSubjectField(index) {
    const subjects = form.subjects.filter((_, i) => i !== index);
    setForm({ ...form, subjects: subjects.length ? subjects : [{ name: "", marks: "" }] });
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      usn: student.usn,
      ...parseDob(student.dob),
      subjects: student.subjects.map((s) => ({ name: s.name, marks: String(s.marks) })),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      usn: form.usn,
      dob: `${form.dobYear}-${form.dobMonth}-${form.dobDay}`,
      subjects: form.subjects
        .filter((s) => s.name.trim() !== "" && s.marks !== "")
        .map((s) => ({ name: s.name, marks: Number(s.marks) })),
    };

    try {
      if (editingId) {
        await updateStudent(editingId, payload);
      } else {
        await createStudent(payload);
      }
      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStudent(id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const gradeData = stats
    ? Object.entries(stats.gradeDistribution).map(([grade, count]) => ({ grade, count }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Admin
            </span>
            <span className="text-sm text-gray-500">{user.username}</span>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {stats && (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={<UsersIcon />} label="Total Students">
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </StatCard>

              <div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-1 lg:col-span-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <AwardIcon />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Top Performers</h3>
                </div>
                {stats.topPerformers.length ? (
                  <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.topPerformers.map((p) => (
                      <li
                        key={p.usn}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="truncate text-gray-700">
                          {p.name} <span className="text-gray-400">({p.usn})</span>
                        </span>
                        <span className="ml-2 flex items-center gap-2 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{p.average.toFixed(2)}</span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${GRADE_STYLES[p.grade]}`}>
                            {p.grade}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">No data yet</p>
                )}
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <ChartIcon />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Subject Averages</h3>
                </div>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.subjectAverages}>
                      <XAxis dataKey="subject" stroke="#6b7280" fontSize={12} />
                      <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <ChartIcon />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Grade Distribution</h3>
                </div>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={gradeData}
                        dataKey="count"
                        nameKey="grade"
                        outerRadius={80}
                        label={(entry) => `${entry.grade}: ${entry.count}`}
                      >
                        {gradeData.map((entry) => (
                          <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            {editingId ? "Edit Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className={labelClass}>
                Name
                <input
                  type="text"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className={labelClass}>
                USN
                <input
                  type="text"
                  className={inputClass}
                  value={form.usn}
                  onChange={(e) => setForm({ ...form, usn: e.target.value })}
                  required
                />
              </label>
              <label className={labelClass}>
                Date of Birth
                <div className="flex gap-2">
                  <select
                    className={inputClass}
                    value={form.dobDay}
                    onChange={(e) => setForm({ ...form, dobDay: e.target.value })}
                    required
                  >
                    <option value="" disabled>Day</option>
                    {DAYS.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    className={inputClass}
                    value={form.dobMonth}
                    onChange={(e) => setForm({ ...form, dobMonth: e.target.value })}
                    required
                  >
                    <option value="" disabled>Month</option>
                    {MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                  <select
                    className={inputClass}
                    value={form.dobYear}
                    onChange={(e) => setForm({ ...form, dobYear: e.target.value })}
                    required
                  >
                    <option value="" disabled>Year</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Subjects</h3>
              <div className="flex flex-col gap-2">
                {form.subjects.map((s, i) => (
                  <div className="flex gap-2" key={i}>
                    <input
                      type="text"
                      placeholder="Subject name"
                      className={inputClass}
                      value={s.name}
                      onChange={(e) => handleSubjectChange(i, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      min="0"
                      max="100"
                      className={`${inputClass} max-w-[120px]`}
                      value={s.marks}
                      onChange={(e) => handleSubjectChange(i, "marks", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubjectField(i)}
                      className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSubjectField}
                className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                + Add Subject
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {editingId ? "Update" : "Add"} Student
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
            {!editingId && (
              <p className="text-sm text-gray-400">
                A login account is automatically created for new students &mdash;
                username is their USN and password is their date of birth
                (YYYY-MM-DD).
              </p>
            )}
          </form>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Students</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-indigo-500 bg-gray-50 text-gray-600">
                  <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">USN</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Date of Birth</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Subjects</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Average</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Grade</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.length ? (
                  students.map((student, i) => {
                    const hasSubjects = student.subjects.length > 0;
                    const avg = average(student.subjects);
                    const grade = gradeFor(avg);
                    return (
                      <tr
                        key={student._id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} transition hover:bg-indigo-50`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-gray-700">{student.usn}</td>
                        <td className="px-4 py-3 text-gray-700">{student.dob}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {hasSubjects
                            ? student.subjects.map((s) => `${s.name}: ${s.marks}`).join(", ")
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {hasSubjects ? avg.toFixed(2) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {hasSubjects ? (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${GRADE_STYLES[grade]}`}>
                              {grade}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(student)}
                              className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                      No students added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
