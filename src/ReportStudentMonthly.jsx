// src/ReportStudentMonthly.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ReportStudentMonthly() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user-info"));

  const fetchReport = async () => {
    const res = await axios.get(
      `${API_BASE}/report/student/monthly?month=${month}&year=${year}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setData(res.data);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Student Monthly Report</h1>

      <div className="grid gap-3">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Year (e.g., 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Fetch Monthly Report
        </button>
      </div>

      {data && (
        <div className="mt-6">
          <h3 className="font-semibold">Report:</h3>
          {data.report.map((item) => (
            <div
              key={item.courseId}
              className="p-3 border rounded-md mt-2 bg-gray-50"
            >
              <div>Course ID: {item.courseId}</div>
              <div>Total Sessions: {item.totalSessions}</div>
              <div>Attended: {item.attended}</div>
              <div>Late: {item.lateCount}</div>
              <div>Percentage: {item.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
