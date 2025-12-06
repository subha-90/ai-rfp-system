import React, { useEffect, useState } from "react";
import api from "../api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    vendorName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const loadVendors = async () => {
    try {
      const res = await api.get("/vendors");
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to load vendors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleAddVendor = async () => {
    if (!form.vendorName || !form.contactEmail) {
      return alert("Vendor name and email are required");
    }

    try {
      await api.post("/vendors", form);
      setForm({ vendorName: "", contactEmail: "", contactPhone: "" });
      loadVendors();
    } catch (error) {
      console.error(error);
      alert("Failed to add vendor");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading vendors...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1 flex items-center gap-2">
          🏢 Vendor Management
        </h2>
        <p className="text-gray-600">
          Manage vendors participating in procurement
        </p>
      </div>

      {/* Add Vendor */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="font-semibold mb-4">Add Vendor</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Vendor Name"
            value={form.vendorName}
            onChange={(e) =>
              setForm({ ...form, vendorName: e.target.value })
            }
          />
          <input
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm({ ...form, contactEmail: e.target.value })
            }
          />
          <input
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={(e) =>
              setForm({ ...form, contactPhone: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddVendor}
          className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Add Vendor
        </button>
      </div>

      {/* Vendor List */}
      {vendors.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          No vendors added yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-white rounded-xl shadow"
            >
              <h4 className="font-semibold text-lg">{v.vendorName}</h4>
              <p className="text-gray-600 text-sm">{v.contactEmail}</p>
              {v.contactPhone && (
                <p className="text-gray-500 text-sm">{v.contactPhone}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
