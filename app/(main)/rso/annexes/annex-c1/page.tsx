"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, FileText, Trash2, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";

type AoAStatus = "Not Submitted" | "For Review" | "Ready For Printing";

interface AoA {
  id: string;
  year: number;
  status: AoAStatus;
  remarks: string;
}

export default function AnnexC1Manager() {
  const [aoaList, setAoaList] = useState<AoA[]>([]);
  const [expandedAoA, setExpandedAoA] = useState<string | null>(null);
  const router = useRouter();

  const createNewAoA = () => {
    const currentYear = new Date().getFullYear();
    const newAoA: AoA = {
      id: `123`,
      year: currentYear,
      status: "Not Submitted",
      remarks: "",
    };
    setAoaList([...aoaList, newAoA]);
  };

  const updateAoAStatus = (id: string, status: AoAStatus) => {
    setAoaList(aoaList.map((aoa) => (aoa.id === id ? { ...aoa, status } : aoa)));
  };

  const updateAoARemarks = (id: string, remarks: string) => {
    setAoaList(aoaList.map((aoa) => (aoa.id === id ? { ...aoa, remarks } : aoa)));
  };

  const toggleExpand = (id: string) => {
    setExpandedAoA(expandedAoA === id ? null : id);
  };

  const removeAoA = (id: string) => {
    setAoaList(aoaList.filter((aoa) => aoa.id !== id));
    if (expandedAoA === id) {
      setExpandedAoA(null);
    }
  };

  const editAoA = (id: string) => {
    // Navigate to the article creator page with the AoA id
    router.push(`/rso/annexes/annex-c1/${id}`);
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">Annex C-1 Articles of Association Manager</h1>
      <button onClick={createNewAoA} className="btn btn-primary mb-6">
        <Plus className="mr-2 h-4 w-4" /> Create New Articles of Association Annex
      </button>
      <div className="space-y-4">
        {aoaList.map((aoa) => (
          <div key={aoa.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  <h2 className="card-title">Articles of Association Annex for Year {aoa.year}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn btn-ghost btn-sm text-primary">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => editAoA(aoa.id)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeAoA(aoa.id)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                  <button className="btn btn-ghost btn-circle" onClick={() => toggleExpand(aoa.id)}>
                    {expandedAoA === aoa.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {expandedAoA === aoa.id && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="font-medium">Status:</label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={aoa.status}
                      onChange={(e) => updateAoAStatus(aoa.id, e.target.value as AoAStatus)}
                    >
                      <option value="Not Submitted">Not Submitted</option>
                      <option value="For Review">For Review</option>
                      <option value="Ready For Printing">Ready For Printing</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label htmlFor={`remarks-${aoa.id}`} className="label">
                      <span className="label-text font-medium">SOCC Remarks:</span>
                    </label>
                    <textarea
                      id={`remarks-${aoa.id}`}
                      placeholder="Enter remarks here..."
                      className="textarea textarea-bordered h-24"
                      value={aoa.remarks}
                      onChange={(e) => updateAoARemarks(aoa.id, e.target.value)}
                    ></textarea>
                  </div>
                  <button className="btn btn-primary float-right">Submit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {aoaList.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No Articles of Association Annex created yet.</p>
          <p>Click the button above to create one.</p>
        </div>
      )}
    </PageWrapper>
  );
}
