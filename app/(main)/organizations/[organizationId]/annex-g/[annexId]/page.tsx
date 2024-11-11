// C:\Users\kercw\code\dev\esorr\app\(main)\organizations\[organizationId]\annex-g\[annexId]\page.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { uploadImage } from "@/utils/storage";
import { useParams } from "next/navigation";

type Nominee = {
  _id?: string;
  name: string;
  faculty: string;
  email: string;
  landline: string;
  mobile: string;
  cv?: File | string;
};

const INITIAL_NOMINEE: Nominee = {
  name: "",
  faculty: "",
  email: "",
  landline: "",
  mobile: "",
};

export default function Component() {
  const { organizationId, annexId } = useParams();
  const [nominees, setNominees] = useState<Nominee[]>([
    { ...INITIAL_NOMINEE },
    { ...INITIAL_NOMINEE },
    { ...INITIAL_NOMINEE },
  ]);
  const [savingStates, setSavingStates] = useState<boolean[]>([false, false, false]);
  const [deletingStates, setDeletingStates] = useState<boolean[]>([false, false, false]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNominees();
  }, [organizationId, annexId]);

  const fetchNominees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/annexes/${organizationId}/annex-g/${annexId}/nominee`);
      if (!response.ok) {
        throw new Error("Failed to fetch nominees");
      }
      const data = await response.json();
      const fetchedNominees = data.nominees;

      const updatedNominees = [
        fetchedNominees[0] || { ...INITIAL_NOMINEE },
        fetchedNominees[1] || { ...INITIAL_NOMINEE },
        fetchedNominees[2] || { ...INITIAL_NOMINEE },
      ];

      setNominees(updatedNominees);
    } catch (error) {
      console.error("Error fetching nominees:", error);
      setError("Failed to load nominees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, field: keyof Nominee, value: string | File) => {
    const updatedNominees = [...nominees];
    updatedNominees[index] = { ...updatedNominees[index], [field]: value };
    setNominees(updatedNominees);
  };

  const saveNominee = async (index: number) => {
    const updatedSavingStates = [...savingStates];
    updatedSavingStates[index] = true;
    setSavingStates(updatedSavingStates);

    setError(null);
    try {
      const nominee = nominees[index];
      let cvUrl = nominee.cv;
      if (nominee.cv instanceof File) {
        cvUrl = await uploadImage(nominee.cv);
      }

      const nomineeData = {
        ...nominee,
        cv: cvUrl,
      };

      const url = nominee._id
        ? `/api/annexes/${organizationId}/annex-g/${annexId}/nominee/${nominee._id}`
        : `/api/annexes/${organizationId}/annex-g/${annexId}/nominee`;
      const method = nominee._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nomineeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save nominee");
      }

      alert(`Nominee ${index + 1} saved successfully!`);
      await fetchNominees();
    } catch (error) {
      console.error("Error saving nominee:", error);
      setError(error instanceof Error ? error.message : `Failed to save nominee ${index + 1}. Please try again.`);
    } finally {
      updatedSavingStates[index] = false;
      setSavingStates(updatedSavingStates);
    }
  };

  const deleteCV = async (index: number) => {
    const updatedDeletingStates = [...deletingStates];
    updatedDeletingStates[index] = true;
    setDeletingStates(updatedDeletingStates);

    setError(null);
    try {
      const nominee = nominees[index];
      if (typeof nominee.cv === "string") {
        const fileName = nominee.cv.split("/").pop();
        if (fileName) {
          await fetch("/api/delete-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName }),
          });
        }
      }

      const updatedNominees = [...nominees];
      updatedNominees[index] = { ...updatedNominees[index], cv: undefined };
      setNominees(updatedNominees);

      if (nominee._id) {
        await fetch(`/api/annexes/${organizationId}/annex-g/${annexId}/nominee/${nominee._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...nominee, cv: null }),
        });
      }

      alert("CV deleted successfully");
    } catch (error) {
      console.error("Error deleting CV:", error);
      setError("Failed to delete CV. Please try again.");
    } finally {
      updatedDeletingStates[index] = false;
      setDeletingStates(updatedDeletingStates);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="text-center">Loading...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-center text-red-500">{error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">Nominee Form</h1>
      <div className="space-y-8">
        <div className="tabs tabs-boxed">
          {nominees.map((_, index) => (
            <a
              key={index}
              className={`tab ${activeTab === index ? "tab-active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {index + 1}
              {getOrdinalSuffix(index + 1)} Nominee
            </a>
          ))}
        </div>
        {nominees.map((nominee, index) => (
          <div key={index} className={activeTab === index ? "" : "hidden"}>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {index + 1}
                  {getOrdinalSuffix(index + 1)} Nominee
                </h2>
                <div className="form-control">
                  <label className="label" htmlFor={`name-${index}`}>
                    <span className="label-text">Name of Faculty (Please specify complete name with rank)</span>
                  </label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`faculty-${index}`}>
                    <span className="label-text">Faculty/College/Institute/School</span>
                  </label>
                  <input
                    type="text"
                    id={`faculty-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.faculty}
                    onChange={(e) => handleInputChange(index, "faculty", e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`email-${index}`}>
                    <span className="label-text">Email address</span>
                  </label>
                  <input
                    type="email"
                    id={`email-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.email}
                    onChange={(e) => handleInputChange(index, "email", e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`landline-${index}`}>
                    <span className="label-text">Contact Nos. (Landline)</span>
                  </label>
                  <input
                    type="tel"
                    id={`landline-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.landline}
                    onChange={(e) => handleInputChange(index, "landline", e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`mobile-${index}`}>
                    <span className="label-text">Contact Nos. (Mobile)</span>
                  </label>
                  <input
                    type="tel"
                    id={`mobile-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.mobile}
                    onChange={(e) => handleInputChange(index, "mobile", e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`cv-${index}`}>
                    <span className="label-text">Upload CV</span>
                  </label>
                  {nominee.cv && typeof nominee.cv === "string" ? (
                    <div className="flex items-center space-x-4 p-4 bg-slate-100 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="flex-grow font-medium">File Uploaded</span>
                      <a
                        href={nominee.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        className="btn btn-sm bg-red-100 text-red-800"
                        onClick={() => deleteCV(index)}
                        disabled={deletingStates[index]}
                      >
                        {deletingStates[index] ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          "Delete CV"
                        )}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      id={`cv-${index}`}
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange(index, "cv", file);
                        }
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={() => saveNominee(index)}
                  disabled={savingStates[index]}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingStates[index] ? "Saving..." : "Save Nominee"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}
