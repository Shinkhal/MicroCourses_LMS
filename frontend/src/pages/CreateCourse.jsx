import React, { useState } from "react";
import { createCourse } from "../api";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Trash2 } from "lucide-react";

const CreateCourse = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [lessons, setLessons] = useState([
    { title: "", videoUrl: "", transcript: "", order: 1 },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, e) => {
    const newLessons = [...lessons];
    newLessons[index][e.target.name] = e.target.value;
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([
      ...lessons,
      { title: "", videoUrl: "", transcript: "", order: lessons.length + 1 },
    ]);
  };

  const removeLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons.map((l, i) => ({ ...l, order: i + 1 })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      toast.error("Please fill in the course title and description");
      return;
    }

    if (lessons.some((l) => !l.title || !l.videoUrl)) {
      toast.error("Each lesson must have a title and video URL");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      lessons,
    };

    setLoading(true);
    try {
      await createCourse(payload);
      toast.success("Course created successfully!");
      setForm({ title: "", description: "" });
      setLessons([{ title: "", videoUrl: "", transcript: "", order: 1 }]);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">
          Create New Course
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8"
        >
          {/* Course Info */}
          <div>
            <label className="block font-semibold mb-2">Course Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 h-28"
              placeholder="Write a short course description"
              required
            ></textarea>
          </div>

          {/* Lessons Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                Lessons
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Lesson
              </button>
            </div>

            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 rounded-xl p-5 mb-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    Lesson {index + 1}
                  </h3>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, e)}
                    className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600"
                    placeholder="Lesson title"
                    required
                  />

                  <input
                    type="text"
                    name="videoUrl"
                    value={lesson.videoUrl}
                    onChange={(e) => handleLessonChange(index, e)}
                    className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600"
                    placeholder="Video URL"
                    required
                  />

                  <textarea
                    name="transcript"
                    value={lesson.transcript}
                    onChange={(e) => handleLessonChange(index, e)}
                    className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-600 h-20"
                    placeholder="Lesson transcript (optional)"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreateCourse;
