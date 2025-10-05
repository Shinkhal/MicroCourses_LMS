// src/pages/LessonPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, updateLessonProgress} from "../api";
import Navbar from "../components/Navbar";
import { Loader2, CheckCircle, PlayCircle } from "lucide-react";

const LessonPage = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await getLessonById(lessonId);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
  setMarking(true);
  try {
    await updateLessonProgress(courseId, lessonId);
    setCompleted(true);
    alert("Lesson marked as completed!");
  } catch (err) {
    console.error(err);

    // Extract error message
    let message = "Failed to update progress";
    if (err.response && err.response.data) {
      // Your API might return { error: "message" } or { message: "..." }
      if (err.response.data.error) message = err.response.data.error;
      else if (err.response.data.message) message = err.response.data.message;
      else message = JSON.stringify(err.response.data);
    }
    alert(message);
  } finally {
    setMarking(false);
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
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Duration: {lesson.duration || "Not specified"}
          </p>

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
