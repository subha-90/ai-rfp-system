import { useState } from "react";
import api from "../api";

export default function RfpCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/rfps", form);
    window.location.href = "/";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">➕ Create RFP</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">

        <div>
          <label className="block text-gray-600 mb-1">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            className="w-full border p-3 rounded"
            rows={4}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <input
            type="text"
            name="category"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
        >
          Create RFP
        </button>

      </form>
    </div>
  );
}
