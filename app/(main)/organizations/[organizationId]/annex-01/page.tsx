"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Plus, FileText, Send, Download, PenTool } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Annex01 = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
};

export default function Annex01Manager({ params }: { params: { organizationId: string } }) {
  const [annexList, setAnnexList] = useState<Annex01[]>([]);
  const [expandedAnnex, setExpandedAnnex] = useState<string | null>(null);
  const [newAcademicYear, setNewAcademicYear] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [isCreatingAnnex, setIsCreatingAnnex] = useState(false);

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-01`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    }
  };

  const createNewAnnex = async () => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-01`, {
        academicYear: newAcademicYear,
      });
      setAnnexList([...annexList, response.data]);
      setIsCreatingAnnex(false);
    } catch (error) {
      console.error("Error creating annex:", error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAnnex(expandedAnnex === id ? null : id);
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-01/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const addSignature = (id: string) => {
    // Implement signature functionality here
    console.log("Add signature for annex:", id);
  };

  const downloadPDF = (id: string) => {
    // Implement PDF download functionality here
    console.log("Download PDF for annex:", id);
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">ANNEX 01 Rules of Procedure for Recognition</h1>
      {!isCreatingAnnex ? (
        <button onClick={() => setIsCreatingAnnex(true)} className="btn btn-primary mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Create New Annex
        </button>
      ) : (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Create New Annex</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year</span>
              </label>
              <input
                type="text"
                value={newAcademicYear}
                onChange={(e) => setNewAcademicYear(e.target.value)}
                className="input input-bordered"
                placeholder="e.g., 2023-2024"
              />
            </div>
            <div className="card-actions justify-end mt-4">
              <button onClick={() => setIsCreatingAnnex(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={createNewAnnex} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {annexList.map((annex) => (
          <AnnexCard
            key={annex._id}
            annex={annex}
            expandedAnnex={expandedAnnex}
            toggleExpand={toggleExpand}
            submitAnnexForReview={submitAnnexForReview}
            addSignature={addSignature}
            downloadPDF={downloadPDF}
          />
        ))}
      </div>
      {annexList.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No Rules of Procedure for Recognition Annex created yet.</p>
          <p>Click the button above to create one.</p>
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: Annex01;
  expandedAnnex: string | null;
  toggleExpand: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  addSignature: (id: string) => void;
  downloadPDF: (id: string) => void;
}

function AnnexCard({
  annex,
  expandedAnnex,
  toggleExpand,
  submitAnnexForReview,
  addSignature,
  downloadPDF,
}: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Rules of Procedure for Recognition Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-sm" onClick={() => addSignature(annex._id)}>
              <PenTool className="h-4 w-4" />
              <span className="ml-2">Add Signature</span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => downloadPDF(annex._id)}>
              <Download className="h-4 w-4" />
              <span className="ml-2">Download PDF</span>
            </button>
            <button className="btn btn-ghost btn-circle" onClick={() => toggleExpand(annex._id)}>
              {expandedAnnex === annex._id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {expandedAnnex === annex._id && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Status:</label>
              <span>{annex.isSubmitted ? "Submitted" : "Not Submitted"}</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className={`btn ${annex.isSubmitted ? "btn-disabled" : "btn-primary"}`}
                onClick={() => submitAnnexForReview(annex._id)}
                disabled={annex.isSubmitted}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
