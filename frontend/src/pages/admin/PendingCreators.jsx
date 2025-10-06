import React, { useEffect, useState } from "react";
import { getPendingCreators, updateCreatorStatus } from "../../api";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";

const PendingCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreators = async () => {
    try {
      const res = await getPendingCreators();
      console.log("Fetched creators:", res.data);
      setCreators(res.data.items || []); // ✅ Use .items from backend response
    } catch (err) {
      toast.error("Failed to fetch creators");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await updateCreatorStatus(id, status);
      toast.success(`Creator ${status}`);
      fetchCreators();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Pending Creators
        </h1>

        {Array.isArray(creators) && creators.length > 0 ? (
          <div className="grid gap-4">
            {creators.map((creator) => (
              <div
                key={creator._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {creator.name}
                  </h3>
                  <p className="text-gray-500">{creator.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(creator._id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(creator._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No pending creators.
          </p>
        )}
      </div>
    </main>
  );
};

export default PendingCreators;
