import React, { useEffect, useState } from "react";
import { getPendingCreators, getPendingCourses } from "../../api";
import { Loader2 } from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ creators: 0, courses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [creatorRes, courseRes] = await Promise.all([
          getPendingCreators(),
          getPendingCourses(),
        ]);
        setStats({
          creators: creatorRes.data?.length || 0,
          courses: courseRes.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Pending Creators
            </h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {stats.creators}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Pending Courses
            </h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {stats.courses}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
