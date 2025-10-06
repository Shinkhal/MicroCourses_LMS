import React, { useEffect, useState } from "react";
import { applyAsCreator, getUserProfile } from "../api";
import Navbar from "../components/Navbar";
import { Loader2, UserPlus, CheckCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyCreator = () => {
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
        setIsCreator(res.data?.role === "creator");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyAsCreator();
      toast.success("🎉 Application submitted successfully!");
      setIsCreator(true);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to apply.";
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">
          Apply to Become a Creator 🎓
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10">
          Share your knowledge with the world! As a creator, you can build and
          publish your own courses on the MicroCourses platform. Fill out the
          application below to get started.
        </p>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
          {isCreator ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                You're already a creator!
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                You can now access your Creator Dashboard to manage your
                courses.
              </p>
            </div>
          ) : (
            <div>
              <UserPlus className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-3">
                Ready to inspire learners?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Once approved, you’ll be able to create and submit new courses
                for review.
              </p>

              <button
                onClick={handleApply}
                disabled={applying}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition-transform disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Apply as Creator"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApplyCreator;
