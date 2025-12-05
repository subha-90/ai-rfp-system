import React, { useEffect, useState } from "react";
import api from "../api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    vendorName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const load = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/vendors", form);
      setForm({ vendorName: "", contactEmail: "", contactPhone: "" });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to create vendor");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Vendors</h2>

      {/* Form */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Vendor Name"
            value={form.vendorName}
            onChange={(e) =>
              setForm({ ...form, vendorName: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm({ ...form, contactEmail: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={form.contactPhone}
            onChange={(e) =>
              setForm({ ...form, contactPhone: e.target.value })
            }
          />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreate}
        >
          Add Vendor
        </button>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {vendors.map((v) => (
          <li
            key={v.id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{v.vendorName}</p>
              <p className="text-sm text-gray-500">{v.contactEmail}</p>
              <p className="text-sm text-gray-500">{v.contactPhone}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
