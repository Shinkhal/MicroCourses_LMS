// src/pages/LessonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, updateLessonProgress, fetchCourseById } from "../api";
import Navbar from "../components/Navbar";
import { Loader2, CheckCircle, PlayCircle, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const LessonPage = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // fetch current lesson
        const res = await getLessonById(lessonId);
        setLesson(res.data);

        // fetch all lessons in course for next button
        const courseRes = await fetchCourseById(courseId);
        setLessons(courseRes.data.lessons || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, courseId]);

  const handleComplete = async () => {
    setMarking(true);
    try {
      await updateLessonProgress(courseId, lessonId);
      setCompleted(true);
      toast.success("✅ Lesson marked as completed!");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to update progress";
      toast.error(message);
    } finally {
      setMarking(false);
    }
  };

  const goToNextLesson = () => {
    if (!lesson || lessons.length === 0) return;
    const currentIndex = lessons.findIndex((l) => l._id === lessonId);
    const nextLesson = lessons[currentIndex + 1];
    if (nextLesson) {
      navigate(`/courses/${courseId}/lessons/${nextLesson._id}`);
      window.scrollTo(0, 0);
    } else {
      toast.info("🎉 You’ve completed all lessons in this course!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  if (!lesson)
    return <div className="text-center text-red-500 mt-10">Lesson not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <PlayCircle className="mr-2 text-indigo-600" /> {lesson.title}
        </h1>

        {/* Video Section */}
        <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
          <iframe
            src={lesson.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            title={lesson.title}
            className="w-full h-96"
            allowFullScreen
          ></iframe>
        </div>

        {/* Completion Section */}
        <div className="mt-6 flex flex-wrap gap-3 justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Duration: {lesson.duration || "Not specified"}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              disabled={marking || completed}
              className={`px-6 py-2 rounded-xl font-semibold text-white shadow ${
                completed
                  ? "bg-green-600 cursor-default flex items-center gap-2"
                  : "bg-indigo-600 hover:bg-indigo-700 transition"
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-5 h-5" /> Completed
                </>
              ) : marking ? (
                "Marking..."
              ) : (
                "Mark as Complete"
              )}
            </button>

            {completed && (
              <button
                onClick={goToNextLesson}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition flex items-center gap-2"
              >
                Next Lesson <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-right">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 font-medium hover:underline"
          >
            ← Back to Course
          </button>
        </div>
      </div>
    </main>
  );
};

export default LessonPage;
