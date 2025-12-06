import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RfpCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleCreateRfp = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are required");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create RFP
      const res = await api.post("/rfps", form);
      const rfpId = res.data.id;

      // 2️⃣ Upload document (optional)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("rfpId", rfpId);

        await api.post("/documents/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setUploaded(true);
      }

      navigate(`/rfp/${rfpId}`);
    } catch (error) {
      console.error("Create RFP failed:", error);
      alert("Failed to create RFP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        ➕ Create RFP
      </h1>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter RFP title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            rows={4}
            placeholder="Describe procurement requirements"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            placeholder="e.g. AI, Cloud, Security"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 font-medium">
            Upload RFP Document (PDF / DOCX)
          </label>

          <label
            htmlFor="rfpFile"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <span className="text-3xl">📎</span>

            {!file ? (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF or DOCX only
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-indigo-700 font-medium">
                ✅ {file.name}
              </p>
            )}
          </label>

          <input
            id="rfpFile"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {uploaded && (
            <p className="text-sm text-green-600 mt-2">
              ✅ Document uploaded & processed
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          onClick={handleCreateRfp}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating RFP..." : "Create RFP"}
        </button>
      </div>
    </div>
  );
}
