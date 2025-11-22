// src/ReportStudentCourse.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ReportStudentCourse() {
  const [courseId, setCourseId] = useState("");
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user-info"));

  const fetchReport = async () => {
    const res = await axios.get(
      `${API_BASE}/report/student/course/${courseId}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setData(res.data);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Student Course-wise Report
      </h1>

      <div className="grid gap-3">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Course ObjectId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Fetch Course Report
        </button>
      </div>

      {data && data.totalSessions && (
        <div className="mt-6 p-3 border rounded-md bg-gray-50">
          <div>Total Sessions: {data.totalSessions}</div>
          <div>Attended: {data.attended}</div>
          <div>Late: {data.lateCount}</div>
          <div>Percentage: {data.percentage}%</div>
        </div>
      )}
    </div>
  );
}
