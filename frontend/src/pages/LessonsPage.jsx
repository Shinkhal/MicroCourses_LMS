import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseById, getCourseProgress, updateLessonProgress } from "../api";

const LessonsPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetchCourseById(courseId);
        setCourse(res.data);

        const progressRes = await getCourseProgress(courseId);
        setProgress(progressRes.data.progress);
        setCompletedLessons(progressRes.data.completedLessons);
      } catch (err) {
        console.error(err);
        setError("Failed to load course or progress.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleCompleteLesson = async (lessonId) => {
    if (completedLessons.includes(lessonId)) return;

    setActionLoading(true);
    try {
      const res = await updateLessonProgress(courseId, lessonId);
      setProgress(res.data.progress);
      setCompletedLessons(res.data.completedLessons);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error?.message || "Failed to update progress");
    } finally {
      setActionLoading(false);
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
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {course.title} - Lessons
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Progress: {progress}%</p>

        {(!course.lessons || course.lessons.length === 0) ? (
          <p className="text-gray-500 dark:text-gray-400">
            No lessons available for this course yet.
          </p>
        ) : (
          <ul className="space-y-6">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson._id);
              return (
                <li
                  key={lesson._id}
                  className={`p-4 rounded-lg shadow transition ${
                    isCompleted
                      ? "bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:shadow-md"
                  }`}
                >
                  <h2 className="font-semibold mb-2">
                    {idx + 1}. {lesson.title}
                  </h2>

                  {/* Video Player */}
                  <div className="mb-2">
                    <video
                      src={lesson.videoUrl}
                      controls
                      className="w-full rounded-lg"
                    ></video>
                  </div>

                  {/* Mark Complete */}
                  {!isCompleted && (
                    <button
                      onClick={() => handleCompleteLesson(lesson._id)}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {actionLoading ? "Marking..." : "Mark Complete"}
                    </button>
                  )}
                  {isCompleted && <span className="font-semibold">✔ Completed</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;
