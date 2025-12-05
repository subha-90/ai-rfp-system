import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function RfpList() {
  const [rfps, setRfps] = useState([]);

  const load = async () => {
    const res = await api.get("/rfps");
    setRfps(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📄 All RFPs
      </h1>

      {rfps.length === 0 && (
        <p className="text-gray-500 text-lg">No RFPs found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rfps.map((rfp) => (
          <Link
            key={rfp.id}
            to={`/rfp/${rfp.id}`}
            className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{rfp.title}</h2>
            <p className="text-gray-600 mt-1 line-clamp-2">
              {rfp.description}
            </p>

            <div className="mt-4">
              <span className="text-sm text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">
                {rfp.status}
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-3">
              Created: {new Date(rfp.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
