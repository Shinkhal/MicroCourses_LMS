import React, { useEffect, useState } from "react";
import { getUserProfile } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-medium">{error}</div>
    );

  if (!profile) return null;

  const handleAction = () => {
    if (profile.role === "admin") {
      navigate("/admin");
    } else if (profile.role === "creator") {
      navigate("/creator/dashboard");
    } else {
      navigate("/creator/apply");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex justify-center items-start py-12 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 dark:bg-indigo-700 p-6 flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-indigo-400 text-white flex items-center justify-center text-2xl font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-indigo-100">{profile.email}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Role: </span>
                <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                  {profile.role}
                </span>
              </div>
              {profile.role !== "admin" && (
                <div>
                  <span className="font-semibold">Creator Status: </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      profile.creatorStatus === "Approved"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {profile.creatorStatus}
                  </span>
                </div>
              )}
              <div>
                <span className="font-semibold">Account Created: </span>
                {new Date(profile.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <button
              onClick={handleAction}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-200"
            >
              {profile.role === "admin"
                ? "Go to Admin Dashboard"
                : profile.role === "creator"
                ? "Go to Creator Dashboard"
                : "Apply as Creator"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
