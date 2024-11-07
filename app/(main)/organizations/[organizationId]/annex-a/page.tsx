"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";

type AnnexA = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
};

export default function AnnexAManager({ params }: { params: { organizationId: string } }) {
  const [annexList, setAnnexList] = useState<AnnexA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-a`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-a/${id}`, {
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
      <h1 className="text-2xl font-bold mb-6">ANNEX A Student Organizations General Information Report</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading your annexes...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annexList.map((annex) => (
            <AnnexCard
              key={annex._id}
              annex={annex}
              editAnnex={editAnnex}
              submitAnnexForReview={submitAnnexForReview}
              addSignature={addSignature}
              downloadPDF={downloadPDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Student Organizations General Information Report Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexA;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  addSignature: (id: string) => void;
  downloadPDF: (id: string) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, addSignature, downloadPDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">
              Student Organizations General Information Report Annex for AY {annex.academicYear}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Annex Details
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => addSignature(annex._id)}>
              <PenTool className="h-4 w-4 mr-2" />
              Add Signature
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => downloadPDF(annex._id)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium">Status:</label>
            <span className={annex.isSubmitted ? "text-green-600" : "text-yellow-600"}>
              {annex.isSubmitted ? "Submitted" : "Not Submitted"}
            </span>
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
      </div>
    </div>
  );
}
