"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Save } from "lucide-react";

type Nominee = {
  name: string;
  faculty: string;
  email: string;
  landline: string;
  mobile: string;
};

export default function NomineeForm() {
  const [nominees, setNominees] = useState<Nominee[]>([
    { name: "", faculty: "", email: "", landline: "", mobile: "" },
    { name: "", faculty: "", email: "", landline: "", mobile: "" },
    { name: "", faculty: "", email: "", landline: "", mobile: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (index: number, field: keyof Nominee, value: string) => {
    const updatedNominees = [...nominees];
    updatedNominees[index] = { ...updatedNominees[index], [field]: value };
    setNominees(updatedNominees);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", nominees);
    // Here you would typically send the data to your backend
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Draft saved:", "insert organization name");
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">Nominee Form</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {nominees.map((nominee, index) => (
          <div key={index} className="card bg-base-100 shadow-md">
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
            </div>
          </div>
        ))}
        <button onClick={saveDraft} className="fixed  btn btn-neutral bottom-4 right-4 px-16" disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
      </form>
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
