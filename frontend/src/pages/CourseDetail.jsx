import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseById, enrollInCourse, getCourseProgress } from "../api"; // make sure getCourseProgress calls GET /api/progress/:courseId

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [certificateHash, setCertificateHash] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load course details and enrollment/progress status
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchCourseById(id);
        setCourse(res.data);

        // Fetch progress / enrollment status
        try {
          const progressRes = await getCourseProgress(id);
          setEnrolled(true);
          setProgress(progressRes.data.progress);
          setCertificateIssued(progressRes.data.certificateIssued);
          setCertificateHash(progressRes.data.certificateHash);
        } catch (err) {
          // If 404 (not enrolled), ignore
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

  // Handle enrollment
  const handleEnroll = async () => {
    setActionLoading(true);
    try {
      await enrollInCourse(id);
      const progressRes = await getCourseProgress(id);
      setEnrolled(true);
      setProgress(progressRes.data.progress);
      setCertificateIssued(progressRes.data.certificateIssued);
      setCertificateHash(progressRes.data.certificateHash);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error?.message || "Enrollment failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Navigate to first incomplete lesson
  const goToFirstLesson = () => {
    if (course?.lessons?.length > 0) {
      // Find first incomplete lesson
      const firstIncomplete = course.lessons.find(
        (lesson) => !lesson._id || !lesson.completed
      );
      const lessonId = firstIncomplete?._id || course.lessons[0]._id;
      navigate(`/lessons/${lessonId}`);
    }
  };

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

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-12">
      {/* Course Header */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        <img
          src={course.thumbnail || "https://via.placeholder.com/800x300"}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {course.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {course.category || "Uncategorized"}
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-200">
            {course.description}
          </p>

          {/* Status & Published */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  course.status === "approved"
                    ? "bg-green-200 text-green-700"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {course.status}
              </span>
            </p>
            <p className="mt-1">
              <strong>Published:</strong> {course.published ? "Yes" : "No"}
            </p>
            {enrolled && (
              <p className="mt-1">
                <strong>Progress:</strong> {progress}%
              </p>
            )}
          </div>

          {/* Enrollment / Certificate */}
          <div className="mt-6">
            {!enrolled ? (
              <button
                onClick={handleEnroll}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {actionLoading ? "Enrolling..." : "Enroll in Course"}
              </button>
            ) : progress < 100 ? (
              <button
                onClick={goToFirstLesson}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Go to Lessons
              </button>
            ) : (
              <div className="text-center mt-2 text-green-700 font-semibold">
                🎉 Course Completed! Your certificate is ready.{" "}
                <button
                  onClick={() => navigate(`/certificate/${id}`)}
                  className="ml-2 underline text-blue-600"
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Lessons
        </h2>

        {(!course.lessons || course.lessons.length === 0) ? (
          <p className="text-gray-500 dark:text-gray-400">
            No lessons available for this course yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {course.lessons.map((lesson, idx) => (
              <li
                key={lesson._id || idx}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
              >
                <span>
                  {idx + 1}. {lesson.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
