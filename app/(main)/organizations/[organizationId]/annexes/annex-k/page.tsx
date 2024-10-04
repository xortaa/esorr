"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";

type AnnexStatus = "Not Submitted" | "For Review" | "Ready For Printing";

export default function AnnexIManager() {
  const [annexList, setAnnexList] = useState([]);
  const [expandedAnnex, setExpandedAnnex] = useState<string | null>(null);
  const router = useRouter();

  const createNewAnnex = () => {
    const currentYear = new Date().getFullYear();
    const newAnnex = {
      id: `123`,
      year: currentYear,
      status: "Not Submitted",
      remarks: "",
    };
    setAnnexList([...annexList, newAnnex]);
  };

  const updateAnnexStatus = (id: string, status: AnnexStatus) => {
    setAnnexList(annexList.map((annex) => (annex.id === id ? { ...annex, status } : annex)));
  };

  const updateAnnexRemarks = (id: string, remarks: string) => {
    setAnnexList(annexList.map((annex) => (annex.id === id ? { ...annex, remarks } : annex)));
  };

  const toggleExpand = (id: string) => {
    setExpandedAnnex(expandedAnnex === id ? null : id);
  };

  const removeAnnex = (id: string) => {
    setAnnexList(annexList.filter((annex) => annex.id !== id));
    if (expandedAnnex === id) {
      setExpandedAnnex(null);
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">Annex K Commitment To Care for The Environment Manager</h1>
      <button onClick={createNewAnnex} className="btn btn-primary mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Create Commitment To Care for The Environment Annex
      </button>
      <div className="space-y-4">
        {annexList.map((annex) => (
          <div key={annex.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Commitment To Care for The Environment Annex for Year {annex.year}</h2>
                <div className="flex items-center space-x-2">
                  <button className="btn btn-ghost btn-sm text-primary">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeAnnex(annex.id)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                  <button className="btn btn-ghost btn-circle" onClick={() => toggleExpand(annex.id)}>
                    {expandedAnnex === annex.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {expandedAnnex === annex.id && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="font-medium">Status:</label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={annex.status}
                      onChange={(e) => updateAnnexStatus(annex.id, e.target.value as AnnexStatus)}
                    >
                      <option value="Not Submitted">Not Submitted</option>
                      <option value="For Review">For Review</option>
                      <option value="Ready For Printing">Ready For Printing</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label htmlFor={`remarks-${annex.id}`} className="label">
                      <span className="label-text font-medium">SOCC Remarks:</span>
                    </label>
                    <textarea
                      id={`remarks-${annex.id}`}
                      placeholder="Enter remarks here..."
                      className="textarea textarea-bordered h-24"
                      value={annex.remarks}
                      onChange={(e) => updateAnnexRemarks(annex.id, e.target.value)}
                    ></textarea>
                  </div>
                  <button className="btn btn-primary float-right">Submit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {annexList.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No Commitment To Care for The Environment Annex created yet.</p>
          <p>Click the button above to create one.</p>
        </div>
      )}
    </PageWrapper>
  );
}
