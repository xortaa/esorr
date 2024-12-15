"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import formatMoney from "@/utils/formatMoney";

type Organization = {
  _id: string;
  name: string;
};

type AnnexA = {
  organization: Organization;
  academicYearOfLastRecognition: string;
  affiliation: string;
  officialEmail: string;
  officialWebsite: string;
  organizationSocials: string[];
  category: string;
  strategicDirectionalAreas: string[];
  mission: string;
  vision: string;
  description: string;
  objectives: string[];
  startingBalance: number;
  validUntil: Date;
};

const MAX_OBJECTIVE_LENGTH = 500;
const MAX_WEBSITE_LENGTH = 100;
const MAX_SOCIAL_LENGTH = 100;

const validateWebsite = (url: string): boolean => {
  const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
};

export default function AnnexAEditor() {
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [originalObjectives, setOriginalObjectives] = useState<string[]>([""]);
  const [annexA, setAnnexA] = useState<AnnexA | null>(null);
  const params = useParams();
  const organizationId = params.organizationId as string;
  const annexId = params.annexId as string;
  const [isUpdating, setIsUpdating] = useState(false);
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [organizationSocials, setOrganizationSocials] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAnnexA = async () => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-a/${annexId}`);
        setAnnexA(response.data);
        setObjectives(response.data.objectives);
        setOriginalObjectives(response.data.objectives);
        setOfficialWebsite(response.data.officialWebsite);
        setOrganizationSocials(response.data.organizationSocials);
      } catch (error) {
        console.error("Error fetching Annex A:", error);
      }
    };
    fetchAnnexA();
  }, [organizationId, annexId]);

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);

    // Validate objective length
    if (value.length > MAX_OBJECTIVE_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        [`objective_${index}`]: `Objective must be ${MAX_OBJECTIVE_LENGTH} characters or less`,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`objective_${index}`];
        return newErrors;
      });
    }
  };

  const removeObjective = async (index: number) => {
    try {
      await axios.delete(`/api/annexes/${organizationId}/annex-a/${annexId}/objectives/${index}`);
      const newObjectives = objectives.filter((_, i) => i !== index);
      setObjectives(newObjectives);
      setOriginalObjectives(newObjectives);
      alert("Objective removed successfully");
    } catch (error) {
      console.error("Error removing objective:", error);
      alert("Failed to remove objective");
    }
  };

  const updateObjectives = async () => {
    if (Object.keys(errors).length > 0) {
      alert("Please fix all errors before updating objectives");
      return;
    }

    setIsUpdating(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-a/${annexId}/update-objectives`, { objectives });
      setOriginalObjectives([...objectives]);
      alert("Objectives updated successfully");
    } catch (error) {
      console.error("Error updating objectives:", error);
      alert("Failed to update objectives");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOfficialWebsite = async () => {
    if (!validateWebsite(officialWebsite)) {
      setErrors((prev) => ({ ...prev, officialWebsite: "Please enter a valid website URL" }));
      return;
    }

    setIsUpdating(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-a/${annexId}/update-website`, { officialWebsite });
      alert("Official website updated successfully");
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.officialWebsite;
        return newErrors;
      });
    } catch (error) {
      console.error("Error updating official website:", error);
      alert("Failed to update official website");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrganizationSocials = async () => {
    if (organizationSocials.some((social) => !validateWebsite(social))) {
      setErrors((prev) => ({ ...prev, organizationSocials: "Please enter valid URLs for all social media links" }));
      return;
    }

    setIsUpdating(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-a/${annexId}/update-socials`, { organizationSocials });
      alert("Organization socials updated successfully");
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.organizationSocials;
        return newErrors;
      });
    } catch (error) {
      console.error("Error updating organization socials:", error);
      alert("Failed to update organization socials");
    } finally {
      setIsUpdating(false);
    }
  };

  const addSocial = () => {
    setOrganizationSocials([...organizationSocials, ""]);
  };

  const updateSocial = (index: number, value: string) => {
    const newSocials = [...organizationSocials];
    newSocials[index] = value;
    setOrganizationSocials(newSocials);

    // Validate social media URL
    if (!validateWebsite(value)) {
      setErrors((prev) => ({ ...prev, [`social_${index}`]: "Please enter a valid URL" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`social_${index}`];
        return newErrors;
      });
    }
  };

  const removeSocial = (index: number) => {
    const newSocials = organizationSocials.filter((_, i) => i !== index);
    setOrganizationSocials(newSocials);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`social_${index}`];
      return newErrors;
    });
  };

  const hasChanges = () => {
    if (objectives.length !== originalObjectives.length) return true;
    return objectives.some((obj, index) => obj !== originalObjectives[index]);
  };

  if (!annexA) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <PageWrapper>
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-8">Student Organization General Information Report</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Organization Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name of the Organization</span>
              </label>
              <p className="text-lg font-medium">{annexA.organization.name}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year of Last Recognition</span>
              </label>
              <p className="text-lg font-medium">{annexA.academicYearOfLastRecognition}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Faculty / College / Institute / School Affiliation</span>
              </label>
              <p className="text-lg font-medium">{annexA.affiliation}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Official Email address of the Organization</span>
              </label>
              <p className="text-lg font-medium">{annexA.officialEmail}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Official Website</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.officialWebsite ? "input-error" : ""}`}
                value={officialWebsite}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_WEBSITE_LENGTH) {
                    setOfficialWebsite(value);
                    if (!validateWebsite(value)) {
                      setErrors((prev) => ({ ...prev, officialWebsite: "Please enter a valid website URL" }));
                    } else {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.officialWebsite;
                        return newErrors;
                      });
                    }
                  }
                }}
                maxLength={MAX_WEBSITE_LENGTH}
              />
              {errors.officialWebsite && <p className="text-error text-sm mt-1">{errors.officialWebsite}</p>}
              <button
                onClick={updateOfficialWebsite}
                className="btn btn-primary mt-2"
                disabled={!!errors.officialWebsite}
              >
                Update Website
              </button>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Organization's Social Networking Pages/Sites:</span>
              </label>
              {organizationSocials.map((social, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    className={`input input-bordered flex-grow ${errors[`social_${index}`] ? "input-error" : ""}`}
                    value={social}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= MAX_SOCIAL_LENGTH) {
                        updateSocial(index, value);
                      }
                    }}
                    maxLength={MAX_SOCIAL_LENGTH}
                  />
                  <button onClick={() => removeSocial(index)} className="btn btn-ghost btn-sm">
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                </div>
              ))}
              {errors.organizationSocials && <p className="text-error text-sm mt-1">{errors.organizationSocials}</p>}
              <div className="flex justify-between mt-2">
                <button onClick={addSocial} className="btn btn-outline btn-primary btn-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Social
                </button>
                <button
                  onClick={updateOrganizationSocials}
                  className="btn btn-primary btn-sm"
                  disabled={!!errors.organizationSocials}
                >
                  Update Socials
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <p className="text-lg font-medium">{annexA.category}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Strategic Directional Areas (SDAs)2:</span>
              </label>
              {annexA.strategicDirectionalAreas.map((strategicDirectionalArea, index) => (
                <p key={index} className="text-lg font-medium">
                  {strategicDirectionalArea}
                </p>
              ))}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Starting Fund</span>
              </label>
              <p className="text-lg font-medium">{formatMoney(annexA.startingBalance).toString()}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Starting Fund</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <p className="text-lg font-medium">{formatMoney(annexA.startingBalance).toString()}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl overflow-scroll">
        <div className="card-body">
          <h2 className="card-title">Statement of Mission, Vision, and Objectives</h2>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mission</span>
              </label>
              <p className="text-lg">{annexA.mission}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vision</span>
              </label>
              <p className="text-lg">{annexA.vision}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Brief Description of the Organization</span>
              </label>
              <p className="text-lg">{annexA.description}</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Objectives for AY {annexA.academicYearOfLastRecognition} - SMART (Specific, Measurable, Attainable,
                  Realistic, Time-bound)
                </span>
              </label>
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <textarea
                    className={`textarea textarea-bordered w-full ${
                      errors[`objective_${index}`] ? "textarea-error" : ""
                    }`}
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Objective ${index + 1}`}
                    maxLength={MAX_OBJECTIVE_LENGTH}
                  />
                  <button onClick={() => removeObjective(index)} className="btn btn-ghost btn-sm">
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                </div>
              ))}
              {errors[`objective_${objectives.length - 1}`] && (
                <p className="text-error text-sm mt-1">{errors[`objective_${objectives.length - 1}`]}</p>
              )}
              <div className="flex justify-between mt-2">
                <button onClick={addObjective} className="btn btn-outline btn-primary btn-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Objective
                </button>
                <button
                  onClick={updateObjectives}
                  className="btn btn-primary btn-sm"
                  disabled={isUpdating || !hasChanges() || Object.keys(errors).length > 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? "Updating..." : "Save Objectives"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Officers' Information</h2>
          <p className="mb-4">Please fill out the officers' information in the designated annex.</p>
          <Link href={`/organizations/${organizationId}/annexA1`}>
            <button className="btn btn-primary">Go to Officers' Information Annex</button>
          </Link>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Organization Adviser</h2>
          <p className="mb-4">Please fill out the organization adviser information in the designated annex.</p>
          <Link href={`/organizations/${organizationId}/annexG`}>
            <button className="btn btn-primary">Go to Organization Adviser Annex</button>
          </Link>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Financial Status</h2>
          <p className="mb-4">Please fill out the financial status information in the designated annex.</p>
          <Link href={`/organizations/${organizationId}/annexE2`}>
            <button className="btn btn-primary">Go to Financial Status Annex</button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
