import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function RfpDetail() {
  const { id } = useParams();

  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load RFP & Vendors
  useEffect(() => {
    loadRfp();
    loadVendors();
  }, [id]);

  const loadRfp = async () => {
    const res = await api.get(`/rfps/${id}`);
    setRfp(res.data);
    setProposals(res.data.proposals || []);
  };

  const loadVendors = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  const toggleVendor = (vendorId) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId)
        ? prev.filter((v) => v !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRfp = async () => {
    if (!selectedVendorIds.length) {
      alert("Please select at least one vendor");
      return;
    }

    try {
      setLoading(true);

      await api.post("/proposals/send", {
        rfpId: Number(id),
        vendorIds: selectedVendorIds,
      });

      alert("✅ RFP sent to selected vendors");
    } catch (error) {
      console.error(error);
      alert("Failed to send RFP");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/rfps/${id}/evaluate`);
      setProposals(res.data);
    } catch (error) {
      console.error(error);
      alert("AI evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!rfp) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{rfp.title}</h1>
        <p className="text-gray-600 mt-1">{rfp.description}</p>
      </div>

      {/* Structured RFP */}
      {rfp.structuredJson && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-3">📄 Structured RFP</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(rfp.structuredJson, null, 2)}
          </pre>
        </div>
      )}

      {/* Send RFP */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">
          📤 Send RFP to Vendors
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          {vendors.map((v) => (
            <label
              key={v.id}
              className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-indigo-50"
            >
              <input
                type="checkbox"
                checked={selectedVendorIds.includes(v.id)}
                onChange={() => toggleVendor(v.id)}
              />
              <div>
                <p className="font-medium">{v.vendorName}</p>
                <p className="text-sm text-gray-500">
                  {v.contactEmail}
                </p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleSendRfp}
          disabled={loading}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          Send RFP
        </button>
      </div>

      {/* Proposals */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📊 Vendor Proposals</h2>

          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            Run AI Evaluation
          </button>
        </div>

        {proposals.length === 0 ? (
          <p className="text-gray-500">No proposals yet.</p>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Vendor</th>
                <th className="p-2">Price</th>
                <th className="p-2">Delivery</th>
                <th className="p-2">Score</th>
                <th className="p-2">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => {
                const parsed = p.parsedJson || {};
                return (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.vendor?.vendorName}</td>
                    <td className="p-2">
                      {parsed.total_price} {parsed.currency}
                    </td>
                    <td className="p-2">
                      {parsed.delivery_days} days
                    </td>
                    <td className="p-2 font-semibold">
                      {p.score ?? "-"}
                    </td>
                    <td className="p-2">
                      {p.recommendation ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
