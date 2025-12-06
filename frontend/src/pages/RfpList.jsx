import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function RfpList() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRfps = async () => {
    try {
      const res = await api.get("/rfps");
      setRfps(res.data);
    } catch (error) {
      console.error("Failed to load RFPs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfps();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading RFPs...</p>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          📄 All RFPs
        </h1>
        <p className="text-gray-600">
          Create, review and manage procurement requests
        </p>
      </div>

      {/* Empty state */}
      {rfps.length === 0 && (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No RFPs created yet.
        </div>
      )}

      {/* RFP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rfps.map((rfp) => (
          <Link
            key={rfp.id}
            to={`/rfp/${rfp.id}`}
            className="p-5 rounded-xl bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {rfp.title}
            </h2>

            {rfp.description && (
              <p className="text-gray-600 mt-2 line-clamp-2">
                {rfp.description}
              </p>
            )}

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full capitalize">
                {rfp.status}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(rfp.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
