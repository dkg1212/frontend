// src/ReportSemester.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ReportSemester() {
  const [semester, setSemester] = useState("");
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user-info"));

  const fetchReport = async () => {
    const res = await axios.get(
      `${API_BASE}/report/student/semester?semester=${semester}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setData(res.data.report);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Semester Report</h1>

      <div className="grid gap-3">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Semester No."
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Fetch Semester Report
        </button>
      </div>

      {data && (
        <div className="mt-6">
          {data.map((item) => (
            <div
              key={item.courseId}
              className="p-3 border rounded-md mt-2 bg-gray-50"
            >
              <div>Course ID: {item.courseId}</div>
              <div>Total Sessions: {item.totalSessions}</div>
              <div>Attended: {item.attended}</div>
              <div>Percentage: {item.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
