import React, { useEffect, useState } from "react";
import { getCreatorCourses } from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getCreatorCourses();
        setCourses(res.data.items || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Creator Dashboard
          </h1>
          <button
            onClick={() => navigate('/creator/create-course')}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform"
          >
            <Plus size={18} /> New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <BookOpen className="mx-auto w-12 h-12 text-indigo-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-300">
              You haven’t created any courses yet.
            </p>
            <button
              onClick={() => (window.location.href = "/create-course")}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                  {course.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      course.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : course.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {course.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold mb-2">Lessons:</h3>
                  {course.lessons && course.lessons.length > 0 ? (
                    <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc ml-5 space-y-1">
                      {course.lessons.map((lesson) => (
                        <li key={lesson._id}>
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      No lessons added yet.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() =>
                      (window.location.href = `/creator/courses/${course._id}`)
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    Manage
                  </button>

                  {course.published ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <XCircle className="text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CreatorDashboard;
