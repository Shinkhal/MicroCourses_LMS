import React, { useEffect, useState } from "react";
import { getUserProfile } from "../api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  },[]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-start p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Profile
        </h1>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold">Name: </span>
            {profile.name}
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            {profile.email}
          </div>
          <div>
            <span className="font-semibold">Role: </span>
            {profile.role}
          </div>
          <div>
            <span className="font-semibold">Creator Status: </span>
            {profile.creatorStatus}
          </div>
          <div>
            <span className="font-semibold">Account Created: </span>
            {new Date(profile.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
