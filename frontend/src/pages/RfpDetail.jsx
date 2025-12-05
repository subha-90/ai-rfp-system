import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function RfpDetail() {
  const { id } = useParams();

  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [proposals, setProposals] = useState([]);

  const loadRfp = async () => {
    const res = await api.get(`/rfps/${id}`);
    setRfp(res.data);
    setProposals(res.data.responses || []);
  };

  useEffect(() => {
    loadRfp();
    api.get("/vendors").then((res) => setVendors(res.data));
  }, []);

  const toggleVendor = (vendorId) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId)
        ? prev.filter((v) => v !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRfp = async () => {
    if (selectedVendorIds.length === 0)
      return alert("Select at least one vendor");

    await api.post("/proposals/send", {
      rfpId: Number(id),
      vendorIds: selectedVendorIds
    });

    alert("RFP sent to selected vendors!");
  };

  const handleEvaluate = async () => {
    const res = await api.post(`/rfps/${id}/evaluate`);
    setProposals(res.data);
  };

  if (!rfp) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <h1 className="text-4xl font-bold">{rfp.title}</h1>

      {/* STRUCTURED JSON */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-2">Structured RFP</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(rfp.structuredJson, null, 2)}
        </pre>
      </div>

      {/* SEND RFP */}
      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Send RFP to Vendors</h2>

        <div className="space-y-2">
          {vendors.map((v) => (
            <label key={v.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedVendorIds.includes(v.id)}
                onChange={() => toggleVendor(v.id)}
              />
              {v.vendorName} ({v.contactEmail})
            </label>
          ))}
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSendRfp}
        >
          Send RFP
        </button>
      </div>

      {/* PROPOSALS */}
      <div className="bg-white shadow p-5 rounded">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Vendor Proposals</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleEvaluate}
          >
            Run AI Evaluation
          </button>
        </div>

        {proposals.length === 0 ? (
          <p className="text-gray-500 mt-3">No proposals yet.</p>
        ) : (
          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2">Vendor</th>
                <th className="p-2">Price</th>
                <th className="p-2">Delivery</th>
                <th className="p-2">Warranty</th>
                <th className="p-2">Score</th>
                <th className="p-2">Recommendation</th>
              </tr>
            </thead>

            <tbody>
              {proposals.map((p) => {
                const parsed = p.parsedJson || {};
                return (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.vendor?.vendorName}</td>
                    <td className="p-2">
                      {parsed.total_price} {parsed.currency}
                    </td>
                    <td className="p-2">{parsed.delivery_days}</td>
                    <td className="p-2">{parsed.warranty}</td>
                    <td className="p-2">{p.scoreJson?.score ?? "-"}</td>
                    <td className="p-2">{p.scoreJson?.recommendation ?? "-"}</td>
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
