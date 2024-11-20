"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";
import BackButton from "@/components/BackButton";

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
    setIsUpdating(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-a/${annexId}/update-website`, { officialWebsite });
      alert("Official website updated successfully");
    } catch (error) {
      console.error("Error updating official website:", error);
      alert("Failed to update official website");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrganizationSocials = async () => {
    setIsUpdating(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-a/${annexId}/update-socials`, { organizationSocials });
      alert("Organization socials updated successfully");
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
  };

  const removeSocial = (index: number) => {
    const newSocials = organizationSocials.filter((_, i) => i !== index);
    setOrganizationSocials(newSocials);
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
                className="input input-bordered"
                value={officialWebsite}
                onChange={(e) => setOfficialWebsite(e.target.value)}
              />
              <button onClick={updateOfficialWebsite} className="btn btn-primary mt-2">
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
                    className="input input-bordered flex-grow"
                    value={social}
                    onChange={(e) => updateSocial(index, e.target.value)}
                  />
                  <button onClick={() => removeSocial(index)} className="btn btn-ghost btn-sm">
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-2">
                <button onClick={addSocial} className="btn btn-outline btn-primary btn-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Social
                </button>
                <button onClick={updateOrganizationSocials} className="btn btn-primary btn-sm">
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
              <p className="text-lg font-medium">₱{annexA.startingBalance}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Starting Fund</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <p className="text-lg font-medium">₱{annexA.startingBalance}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
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
                    className="textarea textarea-bordered w-full"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Objective ${index + 1}`}
                  />
                  <button onClick={() => removeObjective(index)} className="btn btn-ghost btn-sm">
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-2">
                <button onClick={addObjective} className="btn btn-outline btn-primary btn-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Objective
                </button>
                <button
                  onClick={updateObjectives}
                  className="btn btn-primary btn-sm"
                  disabled={isUpdating || !hasChanges()}
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
          <Link href={`/organizations/${organizationId}/annex-a1`}>
            <button className="btn btn-primary">Go to Officers' Information Annex</button>
          </Link>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Organization Adviser</h2>
          <p className="mb-4">Please fill out the organization adviser information in the designated annex.</p>
          <Link href={`/organizations/${organizationId}/annex-g`}>
            <button className="btn btn-primary">Go to Organization Adviser Annex</button>
          </Link>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Financial Status</h2>
          <p className="mb-4">Please fill out the financial status information in the designated annex.</p>
          <Link href={`/organizations/${organizationId}/annex-e2`}>
            <button className="btn btn-primary">Go to Financial Status Annex</button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
