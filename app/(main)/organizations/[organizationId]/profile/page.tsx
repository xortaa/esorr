"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react";
import PageWrapper from "@/components/PageWrapper";

interface Organization {
  name: string;
  logo: string;
  affiliation: string;
  officialEmail: string;
  facebook: string;
  isWithCentralOrganization: boolean;
  isReligiousOrganization: boolean;
  levelOfRecognition: string;
}

export default function OrganizationProfile() {
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [newLevelOfRecognition, setNewLevelOfRecognition] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; facebook?: string }>({}); // Add state for validation errors
  const [isUniversityWide, setIsUniversityWide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/${organizationId}/profile`);
      if (!response.ok) {
        throw new Error("Failed to fetch organization data");
      }
      const data = await response.json();
      setOrganization(data);
      setIsUniversityWide(data.affiliation === "University Wide");
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred while fetching organization data");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setOrganization((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAffiliationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isUniWide = e.target.value === "universityWide";
    setIsUniversityWide(isUniWide);
    setOrganization((prev) => ({
      ...prev!,
      affiliation: isUniWide ? "University Wide" : "",
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Delete old logo if it exists
      if (organization?.logo) {
        const oldFileName = organization.logo.split("/").pop();
        await fetch("/api/delete-file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: oldFileName }),
        });
      }

      setOrganization((prev) => ({
        ...prev!,
        logo: data.url,
      }));
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError("An error occurred while uploading the logo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newValidationErrors: { email?: string; facebook?: string } = {};

    // Validate email domain
    const emailDomain = organization?.officialEmail.split("@")[1];
    if (emailDomain !== "ust.edu.ph") {
      newValidationErrors.email = "Only @ust.edu.ph emails are allowed.";
    }

    // Validate Facebook URL
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
    if (!facebookRegex.test(organization?.facebook || "")) {
      newValidationErrors.facebook = "Invalid Facebook URL.";
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    } else {
      setValidationErrors({});
    }

    try {
      const updatedOrganization = {
        ...organization,
        levelOfRecognition: newLevelOfRecognition || organization?.levelOfRecognition,
      };
      const response = await fetch(`/api/${organizationId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrganization),
      });
      if (!response.ok) {
        throw new Error("Failed to update organization data");
      }
      setOrganization(updatedOrganization);
      setNewLevelOfRecognition("");
      alert("Organization updated successfully");
    } catch (err) {
      setError("An error occurred while updating organization data");
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-error">{error}</div>;
  if (!organization) return <div className="text-center">No organization data found</div>;

  return (
    <PageWrapper>
      <div className="container mx-auto p-4 max-w-4xl">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">Organization Profile</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                {organization.logo ? (
                  <Image
                    src={organization.logo}
                    alt="Organization Logo"
                    width={200}
                    height={200}
                    className="rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">No Logo</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </div>
              <div className="w-full md:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Organization Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={organization.name}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Current Level of Recognition</span>
                    </label>
                    <div className="input input-bordered w-full bg-gray-100 flex items-center justify-center h-10">
                      {organization.levelOfRecognition}
                    </div>
                  </div>
                  {session?.user?.role === "OSA" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">Affiliation</span>
                      </label>
                      <div className="flex space-x-4 mb-2">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="affiliationType"
                            value="universityWide"
                            checked={isUniversityWide}
                            onChange={handleAffiliationChange}
                            className="radio"
                          />
                          <span className="label-text ml-2">University Wide</span>
                        </label>
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="affiliationType"
                            value="other"
                            checked={!isUniversityWide}
                            onChange={handleAffiliationChange}
                            className="radio"
                          />
                          <span className="label-text ml-2">Other</span>
                        </label>
                      </div>
                      {!isUniversityWide && (
                        <input
                          type="text"
                          name="affiliation"
                          value={organization.affiliation}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="Enter affiliation"
                          required
                        />
                      )}
                    </div>
                  )}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Official Email</span>
                    </label>
                    <input
                      type="email"
                      name="officialEmail"
                      value={organization.officialEmail}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                    {validationErrors.email && <p style={{ color: "red" }}>{validationErrors.email}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Facebook</span>
                    </label>
                    <input
                      type="text"
                      name="facebook"
                      value={organization.facebook}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="https://www.facebook.com/yourpage"
                    />
                    {validationErrors.facebook && <p style={{ color: "red" }}>{validationErrors.facebook}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          name="isWithCentralOrganization"
                          checked={organization.isWithCentralOrganization}
                          onChange={handleInputChange}
                          className="checkbox mr-2"
                        />
                        <span className="label-text">With Central Organization</span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          name="isReligiousOrganization"
                          checked={organization.isReligiousOrganization}
                          onChange={handleInputChange}
                          className="checkbox mr-2"
                        />
                        <span className="label-text">Religious Organization</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button type="submit" className="btn btn-primary w-full">
                      Update Organization
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
