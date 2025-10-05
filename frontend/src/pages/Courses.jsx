import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../api";
import Navbar from "../components/Navbar";
import { Search, PlayCircle } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchCourses();
        const publishedCourses = res.data.items.filter((c) => c.published);
        setCourses(publishedCourses);
        setFilteredCourses(publishedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(value) ||
        c.category?.toLowerCase().includes(value)
    );
    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-20 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Explore Our Courses</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Learn new skills, upskill your career, and grow with expert-led video
          lessons.
        </p>
      </section>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg flex items-center space-x-3">
          <Search className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={handleSearch}
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No courses found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/400x200"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 transition">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {course.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full">
                      {course.category || "General"}
                    </span>

                    <Link
                      to={`/courses/${course._id}`}
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>

                  <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                    By <span className="font-medium">{course.creator?.name || "Unknown"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;
