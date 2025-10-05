import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchCourses();
        // API returns { items: [...] }
        const publishedCourses = res.data.items.filter((course) => course.published);
        setCourses(publishedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 font-medium">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Explore Courses
      </h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No published courses available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={course.thumbnail || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {course.description || "No description provided."}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {course.category || "General"}
                  </span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>

                {/* Optional: show creator */}
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  By {course.creator?.name || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
