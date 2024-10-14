"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CircleFadingPlus,
  XCircle,
  CornerDownLeft,
  BadgeInfo,
  Check,
  Search,
  X,
  Plus,
  Minus,
  PhilippinePeso,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { AffiliationResponse } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RSOSetupPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [affiliationOptions, setAffiliationOptions] = useState<AffiliationResponse[]>([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(true);
  const [selectedAffiliation, setSelectedAffiliation] = useState<AffiliationResponse | null>(null);
  const [isNotUniversityWide, setIsNotUniversityWide] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    logo: null as File | null,
    socials: [] as string[],
    signatoryRequests: [{ email: "", position: "", isExecutive: false }],
    website: "",
    category: "",
    strategicDirectionalAreas: [],
    mission: "",
    vision: "",
    description: "",
    objectives: [""],
    startingBalance: 0,
    academicYearOfLastRecognition: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const { data } = await axios.get("/api/affiliations");
        setAffiliationOptions(data);
        setAffiliationOptionsLoading(false);
      } catch (error) {
        console.error("Error fetching affiliations:", error);
        setError("Failed to fetch affiliations. Please try again.");
      }
    };

    fetchAffiliations();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const validateForm = () => {
    if (!formData.name) {
      setError("Organization name is required.");
      return false;
    }
    if (!formData.logo) {
      setError("Organization logo is required.");
      return false;
    }
    if (isNotUniversityWide && !selectedAffiliation) {
      setError("Please select an affiliation for non-university-wide organizations.");
      return false;
    }
    if (!formData.website) {
      setError("Organization website is required.");
      return false;
    }
    if (!formData.category) {
      setError("Organization category is required.");
      return false;
    }
    if (formData.strategicDirectionalAreas.length === 0) {
      setError("At least one strategic directional area is required.");
      return false;
    }
    if (!formData.mission) {
      setError("Organization mission is required.");
      return false;
    }
    if (!formData.vision) {
      setError("Organization vision is required.");
      return false;
    }
    if (!formData.description) {
      setError("Organization description is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          submitFormData.append(key, value);
        } else if (Array.isArray(value)) {
          submitFormData.append(key, JSON.stringify(value));
        } else {
          submitFormData.append(key, value as string);
        }
      });

      submitFormData.append("isNotUniversityWide", isNotUniversityWide.toString());

      if (isNotUniversityWide && selectedAffiliation) {
        submitFormData.append("affiliation", selectedAffiliation.name);
      } else {
        submitFormData.append("affiliation", "University Wide");
      }

      if (!session?.user?.email) {
        throw new Error("User email not found. Please ensure you're logged in.");
      }
      submitFormData.append("email", session.user.email);

      const response = await axios.post("/api/rso-setup", submitFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Organization created successfully!");
        router.push("/organizations");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      setError("An error occurred while creating the organization. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Setup a new organization</h1>
        <p className="text-gray-600">
          Follow the steps to setup your organization account before proceeding with ESORR
        </p>
      </div>
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div className="flex flex-col items-start justify-center w-full">
        <SetupStepper step={step} />
        <div className="p-6 bg-white w-full shadow-md rounded-lg border-t-4 border-primary">
          {step === 1 ? (
            <OrganizationSetupStep1
              nextStep={nextStep}
              affiliationOptions={affiliationOptions}
              affiliationOptionsLoading={affiliationOptionsLoading}
              selectedAffiliation={selectedAffiliation}
              setSelectedAffiliation={setSelectedAffiliation}
              formData={formData}
              setFormData={setFormData}
              isNotUniversityWide={isNotUniversityWide}
              setIsNotUniversityWide={setIsNotUniversityWide}
            />
          ) : step === 2 ? (
            <OrganizationSetupStep2
              prevStep={prevStep}
              nextStep={nextStep}
              formData={formData}
              setFormData={setFormData}
            />
          ) : step === 3 ? (
            <OrganizationSetupStep3
              prevStep={prevStep}
              nextStep={nextStep}
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <OrganizationSetupStep4
              prevStep={prevStep}
              formData={formData}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isNotUniversityWide={isNotUniversityWide}
              selectedAffiliation={selectedAffiliation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface OrganizationSetupStep1Props {
  nextStep: () => void;
  affiliationOptions: AffiliationResponse[];
  affiliationOptionsLoading: boolean;
  selectedAffiliation: AffiliationResponse | null;
  setSelectedAffiliation: (affiliation: AffiliationResponse | null) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isNotUniversityWide: boolean;
  setIsNotUniversityWide: React.Dispatch<React.SetStateAction<boolean>>;
}

const strategicDirectionalAreas = [
  "Academic Excellence",
  "Research and Innovation",
  "Community Engagement",
  "Internationalization",
  "Sustainability",
  "Diversity and Inclusion",
];

const organizationCategories = [
  "Academic",
  "Cultural",
  "Religious",
  "Sports",
  "Special Interest",
  "Volunteer and Service",
];

const OrganizationSetupStep1 = ({
  nextStep,
  affiliationOptions,
  affiliationOptionsLoading,
  selectedAffiliation,
  setSelectedAffiliation,
  formData,
  setFormData,
  isNotUniversityWide,
  setIsNotUniversityWide,
}: OrganizationSetupStep1Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSDAreaDropdownOpen, setIsSDAreaDropdownOpen] = useState(false);

  const handleOrganizationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotUniversityWide(event.target.value === "college-based");
    if (event.target.value === "univ-wide") {
      setSelectedAffiliation(null);
      setSearchTerm("");
    }
  };

  const filteredAffiliations = useMemo(() => {
    return affiliationOptions.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [affiliationOptions, searchTerm]);

  const handleSelectAffiliation = (affiliation: AffiliationResponse) => {
    setSelectedAffiliation(affiliation);
    setSearchTerm(affiliation.name);
    setIsDropdownOpen(false);
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedAffiliation(null);
    setIsDropdownOpen(true);
  };

  const handleAffiliationInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const handleAddSocialInput = () => {
    setFormData({
      ...formData,
      socials: [...formData.socials, ""],
    });
  };

  const handleRemoveSocialInput = (index: number) => {
    const newSocials = formData.socials.filter((_, i) => i !== index);
    setFormData({ ...formData, socials: newSocials });
  };

  const handleSocialInputChange = (index: number, value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStrategicDirectionalAreaChange = (area: string) => {
    const currentAreas = formData.strategicDirectionalAreas || [];
    const updatedAreas = currentAreas.includes(area)
      ? currentAreas.filter((a: string) => a !== area)
      : [...currentAreas, area];
    setFormData({ ...formData, strategicDirectionalAreas: updatedAreas });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.logo !== null &&
      (!isNotUniversityWide || selectedAffiliation !== null) &&
      formData.website.trim() !== "" &&
      formData.category.trim() !== "" &&
      formData.strategicDirectionalAreas.length > 0 &&
      formData.startingBalance >= 0 &&
      formData.academicYearOfLastRecognition.trim() !== ""
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
      <form className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="logo-upload">
            <span className="label-text">Upload Organization Logo</span>
          </label>
          <input
            type="file"
            id="logo-upload"
            className="file-input file-input-bordered w-full max-w-xs"
            accept="image/*"
            onChange={handleLogoUpload}
            required
          />
          {imagePreview && (
            <div className="mt-4">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={imagePreview} alt="Organization Logo" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="org-name">
            <span className="label-text">Organization Name</span>
          </label>
          <input
            type="text"
            id="org-name"
            placeholder="Society of Information Technology Enthusiasts"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Organization Type</span>
          </label>
          <div className="flex space-x-2">
            <label className="label cursor-pointer justify-start space-x-2 ">
              <input
                type="radio"
                name="organization-type"
                className="radio radio-primary"
                value="univ-wide"
                checked={!isNotUniversityWide}
                onChange={handleOrganizationTypeChange}
              />
              <span className="label-text">University-Wide</span>
            </label>
            <label className="label cursor-pointer justify-start space-x-2">
              <input
                type="radio"
                name="organization-type"
                className="radio radio-primary"
                value="college-based"
                checked={isNotUniversityWide}
                onChange={handleOrganizationTypeChange}
              />
              <span className="label-text">College-Based</span>
            </label>
          </div>
        </div>

        {isNotUniversityWide && (
          <div className="flex items-center justify-between w-full">
            <div className="relative w-5/6">
              <div className="flex w-full">
                <input
                  type="text"
                  className="input input-bordered w-full pr-10"
                  placeholder="Search for your affiliation..."
                  value={searchTerm}
                  onChange={handleAffiliationInputChange}
                  onFocus={handleAffiliationInputFocus}
                  onBlur={handleInputBlur}
                  disabled={affiliationOptionsLoading}
                  required
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedAffiliation(null);
                    }}
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {isDropdownOpen && filteredAffiliations.length > 0 && (
                <ul className="menu bg-base-100 w-full p-2 rounded-box shadow-lg max-h-60 overflow-auto">
                  {filteredAffiliations.map((affiliation) => (
                    <li key={affiliation._id}>
                      <a onClick={() => handleSelectAffiliation(affiliation)}>{affiliation.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {affiliationOptionsLoading && (
              <div className="text-center w-1/6">
                <span className="loading loading-dots loading-md"></span>
              </div>
            )}
          </div>
        )}

        <div className="form-control">
          <label className="label" htmlFor="org-website">
            <span className="label-text">Official Organization Website</span>
          </label>
          <input
            type="url"
            id="org-website"
            placeholder="https://www.example.com"
            className="input input-bordered w-full"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="org-category">
            <span className="label-text">Student Organization Category</span>
          </label>
          <select
            id="org-category"
            className="select select-bordered w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {organizationCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Strategic Directional Areas</span>
          </label>
          <div className="dropdown">
            <label tabIndex={0} className="btn m-1" onClick={() => setIsSDAreaDropdownOpen(!isSDAreaDropdownOpen)}>
              Select Areas
            </label>
            {isSDAreaDropdownOpen && (
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {strategicDirectionalAreas.map((area) => (
                  <li key={area}>
                    <label className="label cursor-pointer justify-start">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={formData.strategicDirectionalAreas?.includes(area)}
                        onChange={() => handleStrategicDirectionalAreaChange(area)}
                      />
                      <span className="label-text ml-2">{area}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {formData.strategicDirectionalAreas?.length > 0 && (
            <div className="mt-2">
              <span className="font-semibold">Selected Areas: </span>
              {formData.strategicDirectionalAreas.join(", ")}
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Social Media Links (Optional)</span>
          </label>
          {formData.socials.map((link: string, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="url"
                placeholder="https://www.example.com"
                className="input input-bordered flex-grow"
                value={link}
                onChange={(e) => handleSocialInputChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-square text-error"
                onClick={() => handleRemoveSocialInput(index)}
              >
                <Minus />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary mt-2" onClick={handleAddSocialInput}>
            Add Social Media Link
            <Plus className="ml-2" />
          </button>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="starting-balance">
            <span className="label-text">Starting Balance</span>
          </label>
          <div className="relative">
            <PhilippinePeso className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="starting-balance"
              placeholder="0.00"
              className="input input-bordered w-full pl-10"
              value={formData.startingBalance}
              onChange={(e) => setFormData({ ...formData, startingBalance: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="academic-year">
            <span className="label-text">Academic Year of Last Recognition</span>
          </label>
          <input
            type="text"
            id="academic-year"
            placeholder="e.g., 2023-2024"
            className="input input-bordered w-full"
            value={formData.academicYearOfLastRecognition}
            onChange={(e) => setFormData({ ...formData, academicYearOfLastRecognition: e.target.value })}
            pattern="\d{4}-\d{4}"
            required
          />
          <label className="label">
            <span className="label-text-alt text-info flex items-center">
              <BadgeInfo className="w-4 h-4 mr-1" />
              Format: YYYY-YYYY (e.g., 2023-2024)
            </span>
          </label>
        </div>

        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={!isFormValid()}>
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

const OrganizationSetupStep2 = ({
  prevStep,
  nextStep,
  formData,
  setFormData,
}: {
  prevStep: () => void;
  nextStep: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const handleAddObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ""] });
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = formData.objectives.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const isFormValid = () => {
    return formData.mission.trim() !== "" && formData.vision.trim() !== "" && formData.description.trim() !== "";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Statement of Mission, Vision, and Objectives</h2>
      <form className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="mission">
            <span className="label-text">Mission</span>
          </label>
          <textarea
            id="mission"
            className="textarea textarea-bordered h-24"
            placeholder="Enter your organization's mission"
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="vision">
            <span className="label-text">Vision</span>
          </label>
          <textarea
            id="vision"
            className="textarea textarea-bordered h-24"
            placeholder="Enter your organization's vision"
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Brief Description of the Organization</span>
          </label>
          <textarea
            id="description"
            className="textarea textarea-bordered h-24"
            placeholder="Provide a brief description of your organization"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Objectives (can be added/editted later if needed)</span>
          </label>
          {formData.objectives.map((objective: string, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <textarea
                placeholder="Enter an objective"
                className="textarea textarea-bordered w-full"
                value={objective}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-square text-error"
                onClick={() => handleRemoveObjective(index)}
              >
                <Minus />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary mt-2" onClick={handleAddObjective}>
            Add Objective
            <Plus className="ml-2" />
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button className="btn btn-outline" type="button" onClick={prevStep}>
            <CornerDownLeft className="mr-2" />
            Previous Step
          </button>
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={!isFormValid()}>
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

interface OrganizationSetupStep3Props {
  prevStep: () => void;
  nextStep: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const OrganizationSetupStep3: React.FC<OrganizationSetupStep3Props> = ({
  prevStep,
  nextStep,
  formData,
  setFormData,
}) => {
  const handleAddSignatoryInput = () => {
    setFormData({
      ...formData,
      signatoryRequests: [...formData.signatoryRequests, { email: "", position: "", isExecutive: false }],
    });
  };

  const handleRemoveSignatoryInput = (index: number) => {
    const newSignatoryRequests = formData.signatoryRequests.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, signatoryRequests: newSignatoryRequests });
  };

  const handleSignatoryInputChange = (
    index: number,
    field: "email" | "position" | "isExecutive",
    value: string | boolean
  ) => {
    const newSignatoryRequests = [...formData.signatoryRequests];
    newSignatoryRequests[index][field] = value;
    setFormData({ ...formData, signatoryRequests: newSignatoryRequests });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Signatory Accounts</h2>
        <p className="text-primary">
          Only executive signatories, whose signatures are required, need to have ESORR accounts. Please wait for an
          email confirming account approval once your request is submitted. Requesting accounts for executive
          signatories is optional and can also be done after the setup is complete.
        </p>
      </div>
      <form className="space-y-6">
        {formData.signatoryRequests.map((input: any, index: number) => (
          <div key={index} className="p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Signatory {index + 1}</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => handleRemoveSignatoryInput(index)}
              >
                <XCircle className="mr-2" /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label" htmlFor={`signatory-email-${index}`}>
                  <span className="label-text">Signatory Email</span>
                </label>
                <input
                  type="email"
                  id={`signatory-email-${index}`}
                  placeholder="email@ust.edu.ph"
                  className="input input-bordered w-full"
                  value={input.email}
                  onChange={(e) => handleSignatoryInputChange(index, "email", e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt text-info flex items-center">
                    <BadgeInfo className="w-4 h-4 mr-1" />
                    only ust.edu.ph emails are allowed
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label" htmlFor={`signatory-position-${index}`}>
                  <span className="label-text">Position</span>
                </label>
                <input
                  type="text"
                  id={`signatory-position-${index}`}
                  placeholder="e.g., President"
                  className="input input-bordered w-full"
                  value={input.position}
                  onChange={(e) => handleSignatoryInputChange(index, "position", e.target.value)}
                />
              </div>
            </div>
            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="toggle toggle-primary mr-3"
                  checked={input.isExecutive}
                  onChange={(e) => handleSignatoryInputChange(index, "isExecutive", e.target.checked)}
                />
                <span className="label-text">Executive Officer</span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Enabling this toggle will add the signatory to the officer list.
              </p>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-primary w-full" onClick={handleAddSignatoryInput}>
          <CircleFadingPlus className="mr-2" />
          Add Another Signatory
        </button>
        <div className="flex justify-between mt-8">
          <button className="btn btn-outline" type="button" onClick={prevStep}>
            <CornerDownLeft className="mr-2" />
            Previous Step
          </button>
          <button className="btn btn-primary" type="button" onClick={nextStep}>
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

interface OrganizationSetupStep4Props {
  prevStep: () => void;
  formData: any;
  handleSubmit: () => void;
  isSubmitting: boolean;
  isNotUniversityWide: boolean;
  selectedAffiliation: AffiliationResponse | null;
}

const OrganizationSetupStep4: React.FC<OrganizationSetupStep4Props> = ({
  prevStep,
  formData,
  handleSubmit,
  isSubmitting,
  isNotUniversityWide,
  selectedAffiliation,
}) => {
  const renderField = (label: string, value: string | string[]) => (
    <section className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{label}</h3>
      <p className="text-base">{Array.isArray(value) ? value.join(", ") : value || "N/A"}</p>
    </section>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Organization Logo</h3>
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {formData.logo && (
              <Image src={URL.createObjectURL(formData.logo)} alt="Organization Logo" width={128} height={128} />
            )}
          </div>
        </div>
      </section>

      {renderField("Organization Name", formData.name)}
      {renderField("Affiliation", isNotUniversityWide ? selectedAffiliation?.name || "N/A" : "University Wide")}
      {renderField("Website", formData.website)}
      {renderField("Category", formData.category)}
      {renderField("Strategic Directional Areas", formData.strategicDirectionalAreas)}

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Social Media Links</h3>
        {formData.socials.length > 0 ? (
          <ul className="list-disc pl-5">
            {formData.socials.map((social: string, index: number) => (
              <li key={index}>
                <a href={social} target="_blank" rel="noopener noreferrer" className="link link-primary">
                  {social}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
      </section>

      {renderField("Mission", formData.mission)}
      {renderField("Vision", formData.vision)}
      {renderField("Brief Description", formData.description)}
      {renderField("Starting Balance", `₱${formData.startingBalance.toFixed(2)}`)}
      {renderField("Academic Year of Last Recognition", formData.academicYearOfLastRecognition)}

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Objectives</h3>
        {formData.objectives.length > 0 ? (
          <ul className="list-disc pl-5">
            {formData.objectives.map((objective: string, index: number) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Signatory Accounts</h3>
        {formData.signatoryRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Executive</th>
                </tr>
              </thead>
              <tbody>
                {formData.signatoryRequests.map((signatory: any, index: number) => (
                  <tr key={index}>
                    <td>{signatory.email}</td>
                    <td>{signatory.position}</td>
                    <td>{signatory.isExecutive ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <div className="flex justify-between mt-8">
        <button className="btn btn-outline" onClick={prevStep} disabled={isSubmitting}>
          <CornerDownLeft className="mr-2" />
          Previous Step
        </button>
        <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2" />
              Confirm Setup
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const SetupStepper = ({ step }: { step: number }) => {
  return (
    <ol className="flex items-center w-full space-x-2 text-sm font-medium text-center text-slate-500 sm:text-base sm:py-4 sm:space-x-4 rtl:space-x-reverse">
      <li className={`flex items-center ${step >= 1 ? "text-primary" : ""}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
            step >= 1 ? "border-primary" : "border-slate-500"
          } rounded-full shrink-0`}
        >
          1
        </span>
        General <span className="hidden sm:inline-flex sm:ms-2">Information</span>
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className={`flex items-center ${step >= 2 ? "text-primary" : ""}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
            step >= 2 ? "border-primary" : "border-slate-500"
          } rounded-full shrink-0`}
        >
          2
        </span>
        Mission & Vision
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className={`flex items-center ${step >= 3 ? "text-primary" : ""}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
            step >= 3 ? "border-primary" : "border-slate-500"
          } rounded-full shrink-0`}
        >
          3
        </span>
        Signatory Accounts
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className={`flex items-center ${step >= 4 ? "text-primary" : ""}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
            step >= 4 ? "border-primary" : "border-slate-500"
          } rounded-full shrink-0`}
        >
          4
        </span>
        Confirm
      </li>
    </ol>
  );
};

export default RSOSetupPage;
