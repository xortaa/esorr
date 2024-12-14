"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Trash2, Upload, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { uploadImage } from "@/utils/storage";
import { useParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import BackButton from "@/components/BackButton";

type Affiliation = {
  _id: string;
  name: string;
};

type Nominee = {
  _id?: string;
  name: string;
  faculty: string;
  email: string;
  landline: string;
  mobile: string;
  cv?: File | string;
  officeAddress1: string;
  officeAddress2: string;
  signature: string;
};

const INITIAL_NOMINEE: Nominee = {
  name: "",
  faculty: "",
  email: "",
  landline: "",
  mobile: "",
  officeAddress1: "",
  officeAddress2: "",
  signature: "",
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
  const signatureRefs = [useRef<SignatureCanvas>(null), useRef<SignatureCanvas>(null), useRef<SignatureCanvas>(null)];

  // New state for affiliations
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [affiliationSearchTerms, setAffiliationSearchTerms] = useState<string[]>(["", "", ""]);
  const [isAffiliationDropdownOpen, setIsAffiliationDropdownOpen] = useState<boolean[]>([false, false, false]);
  const [affiliationsLoading, setAffiliationsLoading] = useState(false);

  useEffect(() => {
    fetchNominees();
    fetchAffiliations();
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

  const fetchAffiliations = async () => {
    setAffiliationsLoading(true);
    try {
      const response = await fetch("/api/affiliations");
      if (!response.ok) {
        throw new Error("Failed to fetch affiliations");
      }
      const data = await response.json();
      setAffiliations(data);
    } catch (error) {
      console.error("Error fetching affiliations:", error);
      setError("Failed to load affiliations. Please try again.");
    } finally {
      setAffiliationsLoading(false);
    }
  };

  const handleInputChange = (index: number, field: keyof Nominee, value: string | File) => {
    const updatedNominees = [...nominees];
    updatedNominees[index] = { ...updatedNominees[index], [field]: value };
    setNominees(updatedNominees);
  };

  const handleAffiliationInputChange = (index: number, value: string) => {
    const updatedSearchTerms = [...affiliationSearchTerms];
    updatedSearchTerms[index] = value;
    setAffiliationSearchTerms(updatedSearchTerms);

    const updatedDropdownStates = [...isAffiliationDropdownOpen];
    updatedDropdownStates[index] = true;
    setIsAffiliationDropdownOpen(updatedDropdownStates);

    handleInputChange(index, "faculty", value);
  };

  const handleSelectAffiliation = (index: number, affiliation: Affiliation) => {
    handleInputChange(index, "faculty", affiliation.name);

    const updatedSearchTerms = [...affiliationSearchTerms];
    updatedSearchTerms[index] = affiliation.name;
    setAffiliationSearchTerms(updatedSearchTerms);

    const updatedDropdownStates = [...isAffiliationDropdownOpen];
    updatedDropdownStates[index] = false;
    setIsAffiliationDropdownOpen(updatedDropdownStates);
  };

  const filteredAffiliations = (index: number) => {
    return affiliations.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(affiliationSearchTerms[index].toLowerCase())
    );
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

  const uploadSignature = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("annexId", annexId as string);
    formData.append("position", `nominee_${index + 1}`);

    try {
      const response = await fetch("/api/upload-signature", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload signature");
      }

      const data = await response.json();
      handleInputChange(index, "signature", data.url);
    } catch (error) {
      console.error("Error uploading signature:", error);
      setError("Failed to upload signature. Please try again.");
    }
  };

  const saveSignature = async (index: number) => {
    const signatureCanvas = signatureRefs[index].current;
    if (signatureCanvas && !signatureCanvas.isEmpty()) {
      const signatureDataURL = signatureCanvas.toDataURL("image/png");
      const response = await fetch(signatureDataURL);
      const blob = await response.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });

      await uploadSignature(index, file);
    } else {
      alert("Please provide a signature before saving.");
    }
  };

  const deleteSignature = async (index: number) => {
    const nominee = nominees[index];
    if (nominee.signature) {
      const fileName = nominee.signature.split("/").pop();
      if (fileName) {
        try {
          await fetch("/api/delete-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName }),
          });

          const updatedNominees = [...nominees];
          updatedNominees[index] = { ...updatedNominees[index], signature: "" };
          setNominees(updatedNominees);

          alert("Signature deleted successfully");
        } catch (error) {
          console.error("Error deleting signature:", error);
          setError("Failed to delete signature. Please try again.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="text-center">Loading...</div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="text-center text-red-500">{error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackButton />
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
                  <div className="invalid-feedback">Name is required.</div>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`faculty-${index}`}>
                    <span className="label-text">Faculty/College/Institute/School</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id={`faculty-${index}`}
                      className="input input-bordered w-full pr-10"
                      placeholder="Search for affiliation..."
                      value={affiliationSearchTerms[index]}
                      onChange={(e) => handleAffiliationInputChange(index, e.target.value)}
                      onFocus={() => {
                        const updatedDropdownStates = [...isAffiliationDropdownOpen];
                        updatedDropdownStates[index] = true;
                        setIsAffiliationDropdownOpen(updatedDropdownStates);
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          const updatedDropdownStates = [...isAffiliationDropdownOpen];
                          updatedDropdownStates[index] = false;
                          setIsAffiliationDropdownOpen(updatedDropdownStates);
                        }, 200)
                      }
                      disabled={affiliationsLoading}
                      required
                    />
                    {affiliationSearchTerms[index] && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => {
                          const updatedSearchTerms = [...affiliationSearchTerms];
                          updatedSearchTerms[index] = "";
                          setAffiliationSearchTerms(updatedSearchTerms);
                          handleInputChange(index, "faculty", "");
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    {isAffiliationDropdownOpen[index] && filteredAffiliations(index).length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredAffiliations(index).map((affiliation) => (
                          <li
                            key={affiliation._id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectAffiliation(index, affiliation)}
                          >
                            {affiliation.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {affiliationsLoading && (
                    <div className="text-center mt-2">
                      <span className="loading loading-dots loading-md"></span>
                    </div>
                  )}
                  <div className="invalid-feedback">Faculty is required.</div>
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
                  <div className="invalid-feedback">Valid email is required.</div>
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
                    pattern="^\d{10}$"
                  />
                  <div className="invalid-feedback">Valid 10-digit landline number is required.</div>
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
                    pattern="^\d{10}$"
                    required
                  />
                  <div className="invalid-feedback">Valid 10-digit mobile number is required.</div>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`officeAddress1-${index}`}>
                    <span className="label-text">Office Address Line 1</span>
                  </label>
                  <input
                    type="text"
                    id={`officeAddress1-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.officeAddress1}
                    onChange={(e) => handleInputChange(index, "officeAddress1", e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Office Address Line 1 is required.</div>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`officeAddress2-${index}`}>
                    <span className="label-text">Office Address Line 2 (Optional)</span>
                  </label>
                  <input
                    type="text"
                    id={`officeAddress2-${index}`}
                    className="input input-bordered w-full"
                    value={nominee.officeAddress2}
                    onChange={(e) => handleInputChange(index, "officeAddress2", e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor={`cv-${index}`}>
                    <span className="label-text">Upload CV (.pdf only)</span>
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
                      <a href={nominee.cv} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
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
                          if (file.size <= 10 * 1024 * 1024) {
                            handleInputChange(index, "cv", file);
                          } else {
                            alert("File size exceeds 10MB limit.");
                          }
                        }
                      }}
                      accept=".pdf"
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
