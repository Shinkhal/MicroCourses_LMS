import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseById, enrollInCourse, getCourseProgress } from "../api";
import { PlayCircle, Award, Loader2, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressData, setProgressData] = useState({
    completedLessons: [],
    certificateIssued: false,
    certificateHash: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchCourseById(id);
        setCourse(res.data);

        try {
          const progressRes = await getCourseProgress(id);
          setEnrolled(true);
          setProgress(progressRes.data.progress);
          setProgressData({
            completedLessons: progressRes.data.completedLessons || [],
            certificateIssued: progressRes.data.certificateIssued || false,
            certificateHash: progressRes.data.certificateHash || null,
          });
        } catch {
          // User not enrolled yet
          setEnrolled(false);
          setProgress(0);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    setActionLoading(true);
    try {
      await enrollInCourse(id);
      const progressRes = await getCourseProgress(id);
      setEnrolled(true);
      setProgress(progressRes.data.progress);
      setProgressData({
        completedLessons: progressRes.data.completedLessons || [],
        certificateIssued: progressRes.data.certificateIssued || false,
        certificateHash: progressRes.data.certificateHash || null,
      });
      toast.success("Enrollment successful!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error?.message || "Enrollment failed");
    } finally {
      setActionLoading(false);
    }
  };

  const goToNextLesson = () => {
    if (!course?.lessons?.length) return;

    // Find the first lesson not completed
    const nextLesson = course.lessons.find(
      (lesson) =>
        !progressData.completedLessons?.includes(lesson._id)
    );

    if (!nextLesson) {
      // All lessons completed → go to certificate page
      navigate(`/certificate/${id}`);
      toast.info("You've completed all lessons! 🎉");
    } else {
      navigate(`/courses/${id}/lessons/${nextLesson._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 font-medium">{error}</div>
    );
  }

  if (!course) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <img
          src={course.thumbnail || "https://via.placeholder.com/800x300"}
          alt={course.title}
          className="w-full h-72 object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-800/70 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
          <p className="max-w-2xl text-gray-200">{course.description}</p>
        </div>
      </div>

      {/* Course Info */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category:{" "}
                <span className="text-indigo-600 font-medium">
                  {course.category || "General"}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Created by:{" "}
                <span className="font-medium">
                  {course.creator?.name || "Unknown"}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Lessons: {course.lessons?.length || 0}
              </p>
            </div>

            {/* Enrollment Buttons */}
            <div className="mt-4 md:mt-0">
              {!enrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {actionLoading ? "Enrolling..." : "Enroll Now"}
                </button>
              ) : progress < 100 ? (
                <button
                  onClick={goToNextLesson}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition"
                >
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/certificate/${id}`)}
                  className="px-6 py-2 flex items-center bg-yellow-500 text-white font-semibold rounded-xl shadow hover:bg-yellow-600 transition"
                >
                  <Award className="mr-2 w-5 h-5" /> View Certificate
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {enrolled && (
            <div className="mt-6">
              <div className="flex justify-between mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lessons Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <BookOpen className="mr-2 text-indigo-600" /> Lessons
        </h2>

        {(!course.lessons || course.lessons.length === 0) ? (
          <p className="text-gray-500 dark:text-gray-400">
            No lessons available for this course yet.
          </p>
        ) : (
          <div className="space-y-4">
            {course.lessons.map((lesson, idx) => (
              <div
                key={lesson._id || idx}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center shadow hover:shadow-lg transition-all cursor-pointer ${
                  progressData.completedLessons?.includes(lesson._id)
                    ? "opacity-60"
                    : ""
                }`}
                onClick={() =>
                  navigate(`/courses/${id}/lessons/${lesson._id}`)
                }
              >
                <div className="flex items-center space-x-3">
                  <PlayCircle className="text-indigo-600 w-6 h-6" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {idx + 1}. {lesson.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lesson.duration || "Video lesson"}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-indigo-600 font-medium hover:underline">
                  {progressData.completedLessons?.includes(lesson._id)
                    ? "Completed ✓"
                    : "Watch →"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CourseDetail;
