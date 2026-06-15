import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getStudent } from "../api";
import { useAuth } from "../AuthContext";

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

const GRADE_STYLES = {
  A: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

function scoreBarColor(avg) {
  if (avg >= 90) return "bg-green-500";
  if (avg >= 75) return "bg-blue-500";
  if (avg >= 60) return "bg-amber-500";
  if (avg >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM7 12h4M7 15h2m4-7h6" />
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

function EmptyChartIcon() {
  return (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 3v18h18M7 16v-2m5 2V9m5 7v-5" />
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

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    getStudent(user.studentId)
      .then(setStudent)
      .catch((err) => setError(err.message));
  }, [user.studentId]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const avg = average(student.subjects);
  const grade = gradeFor(avg);
  const hasSubjects = student.subjects.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Student
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
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<UserIcon />} label="Name">
            <p className="truncate text-lg font-bold text-gray-900">{student.name}</p>
          </StatCard>

          <StatCard icon={<IdIcon />} label="USN">
            <p className="truncate text-lg font-bold text-gray-900">{student.usn}</p>
          </StatCard>

          <StatCard icon={<ChartIcon />} label="Average">
            <p className="text-lg font-bold text-gray-900">
              {hasSubjects ? avg.toFixed(2) : "—"}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full ${hasSubjects ? scoreBarColor(avg) : ""}`}
                style={{ width: `${hasSubjects ? Math.min(100, Math.max(0, avg)) : 0}%` }}
                role="progressbar"
                aria-valuenow={hasSubjects ? Math.round(avg) : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Average score"
              />
            </div>
          </StatCard>

          <StatCard icon={<AwardIcon />} label="Grade">
            {hasSubjects ? (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-lg font-bold ${GRADE_STYLES[grade]}`}>
                {grade}
              </span>
            ) : (
              <span className="text-lg font-bold text-gray-400">—</span>
            )}
          </StatCard>
        </section>

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Subject Performance
          </h2>

          {hasSubjects ? (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={student.subjects}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="marks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
              <EmptyChartIcon />
              <p className="text-sm font-medium">No marks recorded yet</p>
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Subjects
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-indigo-500 bg-gray-50 text-gray-600">
                  <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hasSubjects ? (
                  student.subjects.map((s, i) => (
                    <tr
                      key={s.name}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} transition hover:bg-indigo-50`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-700">{s.marks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-gray-400">
                      No subjects added yet
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
