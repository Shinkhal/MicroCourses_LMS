import React, { useEffect, useState } from "react";
import { getPendingCourses, updateCourseStatus } from "../../api";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
  try {
    const res = await getPendingCourses();
    console.log("Fetched courses:", res.data);
    setCourses(res.data.items || []); // ✅ Use .items array
  } catch (err) {
    toast.error("Failed to fetch courses");
  } finally {
    setLoading(false);
  }
};


  const handleUpdate = async (id, status) => {
    try {
      await updateCourseStatus(id, status);
      toast.success(`Course ${status}`);
      fetchCourses();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Pending Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No pending courses.
          </p>
        ) : (
          <div className="grid gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {course.title}
                  </h3>
                  <p className="text-gray-500">
                    By {course.creator?.name || "Unknown"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(course._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(course._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default PendingCourses;
