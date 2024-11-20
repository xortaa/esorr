"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { CircleFadingPlus, XCircle, CornerDownLeft, BadgeInfo, Check, Search, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/utils/storage";
import { signOut } from "next-auth/react";


const RSOSetupPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [affiliationOptions, setAffiliationOptions] = useState([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(true);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [isNotUniversityWide, setIsNotUniversityWide] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    logo: null as File | null,
    socials: [] as string[],
    signatoryRequests: [],
    website: "",
    category: "",
    strategicDirectionalAreas: [],
    mission: "",
    vision: "",
    description: "",
    objectives: [""],
    startingBalance: 0,
    academicYearOfLastRecognition: "",
    currentAcademicYear: "",
    facebook: "",
    isWithCentralOrganization: false,
    isReligiousOrganization: false,
    levelOfRecognition: "",
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
    if (!formData.facebook) {
      setError("Facebook link is required.");
      return false;
    }
    if (formData.academicYearOfLastRecognition !== "Not yet recognized" && !formData.levelOfRecognition) {
      setError("Level of recognition is required if organization is recognized.");
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
      const submitData = {
        name: formData.name,
        logo: formData.logo,
        socials: formData.socials,
        signatoryRequests: formData.signatoryRequests,
        isNotUniversityWide,
        affiliation: isNotUniversityWide && selectedAffiliation ? selectedAffiliation.name : "University Wide",
        email: session?.user?.email,
        website: formData.website,
        category: formData.category,
        strategicDirectionalAreas: formData.strategicDirectionalAreas,
        mission: formData.mission,
        vision: formData.vision,
        description: formData.description,
        objectives: formData.objectives,
        startingBalance: formData.startingBalance,
        currentAcademicYear: formData.currentAcademicYear,
        academicYearOfLastRecognition: formData.academicYearOfLastRecognition,
        facebook: formData.facebook,
        isWithCentralOrganization: formData.isWithCentralOrganization,
        isReligiousOrganization: formData.isReligiousOrganization,
        levelOfRecognition: formData.levelOfRecognition,
      };

      const response = await axios.post("/api/rso-setup", submitData, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });

      if (response.status === 201) {
        alert("Organization created successfully! You will be signed out now to complete the setup. Please re-login to enter ESORR.");
        signOut();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError("The request timed out. Please try again.");
        } else if (error.response) {
          setError(`Server error: ${error.response.data.error || "Unknown error"}`);
        } else if (error.request) {
          setError("No response received from server. Please check your internet connection and try again.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
  affiliationOptions;
  affiliationOptionsLoading: boolean;
  selectedAffiliation;
  setSelectedAffiliation: (affiliation) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isNotUniversityWide: boolean;
  setIsNotUniversityWide: React.Dispatch<React.SetStateAction<boolean>>;
}

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSDAreaDropdownOpen, setIsSDAreaDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const futureYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear + i);
  }, []);

  const pastYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOrganizationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotUniversityWide(event.target.value === "college-based");
    if (event.target.value === "univ-wide") {
      setSelectedAffiliation(null);
      setAffiliationSearchTerm("");
    }
  };

  const handleAdditionalOrgTypeChange = (type: "isWithCentralOrganization" | "isReligiousOrganization") => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: !prevData[type],
    }));
  };

  const filteredAffiliations = useMemo(() => {
    if (affiliationSearchTerm.trim() === "") {
      return [];
    }
    return affiliationOptions.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
    );
  }, [affiliationOptions, affiliationSearchTerm]);

  const handleSelectAffiliation = (affiliation) => {
    setSelectedAffiliation(affiliation);
    setAffiliationSearchTerm(affiliation.name);
    setIsDropdownOpen(false);
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAffiliationSearchTerm(value);
    setSelectedAffiliation(null);
    setIsDropdownOpen(true);
  };

  const handleClearAffiliationSearch = () => {
    setAffiliationSearchTerm("");
    setSelectedAffiliation(null);
    setIsDropdownOpen(false);
  };

  const handleAddSocialInput = () => {
    setFormData({
      ...formData,
      socials: [...formData.socials, ""],
    });
  };

  const handleRemoveSocialInput = (index: number) => {
    const newSocials = formData.socials.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, socials: newSocials });
  };

  const handleSocialInputChange = (index: number, value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  const handleFacebookInputChange = (value: string) => {
    setFormData({ ...formData, facebook: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setLogoError("Logo must be a PNG, JPG, or JPEG file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setLogoError("Logo file size must not exceed 10MB.");
        return;
      }

      setIsUploading(true);
      setLogoError(null);
      try {
        const imageUrl = await uploadImage(file);
        setFormData({ ...formData, logo: imageUrl });
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLogoError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
    setImagePreview(null);
    setLogoError(null);
  };

  const handleStrategicDirectionalAreaChange = (area: string) => {
    const currentAreas = formData.strategicDirectionalAreas || [];
    const updatedAreas = currentAreas.includes(area)
      ? currentAreas.filter((a: string) => a !== area)
      : [...currentAreas, area];
    setFormData({ ...formData, strategicDirectionalAreas: updatedAreas });
  };

  const handleCurrentAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const startYear = parseInt(e.target.value);
    const endYear = startYear + 1;
    setFormData((prevData) => ({
      ...prevData,
      currentAcademicYear: `${startYear}-${endYear}`,
    }));
  };

  const handleAcademicYearOfLastRecognitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "not-recognized") {
      setFormData((prevData) => ({
        ...prevData,
        academicYearOfLastRecognition: "Not yet recognized",
        levelOfRecognition: "",
      }));
    } else {
      const startYear = parseInt(value);
      const endYear = startYear + 1;
      setFormData((prevData) => ({
        ...prevData,
        academicYearOfLastRecognition: `${startYear}-${endYear}`,
      }));
    }
  };

  const handleLevelOfRecognitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      levelOfRecognition: e.target.value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.logo !== null &&
      (!isNotUniversityWide || selectedAffiliation !== null) &&
      formData.category.trim() !== "" &&
      formData.strategicDirectionalAreas.length > 0 &&
      formData.startingBalance >= 0 &&
      formData.academicYearOfLastRecognition.trim() !== "" &&
      formData.currentAcademicYear.trim() !== "" &&
      formData.facebook.trim() !== "" &&
      (formData.academicYearOfLastRecognition === "Not yet recognized" || formData.levelOfRecognition.trim() !== "")
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
      <form className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="current-academic-year">
            <span className="label-text">Current Academic Year (Required)</span>
          </label>
          <select
            id="current-academic-year"
            className="select select-bordered w-full"
            value={formData.currentAcademicYear.split("-")[0]}
            onChange={handleCurrentAcademicYearChange}
            required
          >
            <option value="">Select academic year</option>
            {futureYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}-{year + 1}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-info flex items-center">
              <BadgeInfo className="w-4 h-4 mr-1" />
              Academic year runs from August to May
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="logo-upload">
            <span className="label-text">Upload Organization Logo (Required)</span>
          </label>
          {formData.logo ? (
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={formData.logo} alt="Organization Logo" />
                </div>
              </div>
              <div className="space-y-2">
                <button type="button" className="btn btn-outline btn-error btn-sm" onClick={handleRemoveLogo}>
                  Remove Logo
                </button>
                <label className="btn btn-outline btn-primary btn-sm" htmlFor="logo-upload">
                  Change Logo
                </label>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="logo-upload"
                className="file-input file-input-bordered w-full max-w-xs"
                accept=".png,.jpg,.jpeg"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
              {isUploading && <span className="loading loading-spinner loading-md"></span>}
            </div>
          )}
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept=".png,.jpg,.jpeg"
            onChange={handleLogoUpload}
            disabled={isUploading}
          />
          {logoError && <p className="text-error text-sm mt-1">{logoError}</p>}
          <label className="label">
            <span className="label-text-alt text-info flex items-center">
              <BadgeInfo className="w-4 h-4 mr-1" />
              Logo must be a PNG, JPG, or JPEG file, max 10MB in size
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="org-name">
            <span className="label-text">Organization Name (Required)</span>
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
            <span className="label-text">Organization Type (Required)</span>
          </label>
          <div className="flex space-x-2">
            <label className="label cursor-pointer justify-start space-x-2">
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

        <div className="form-control">
          <label className="label">
            <span className="label-text">Additional Organization Type(s) (Optional)</span>
          </label>
          <div className="flex flex-col space-y-2">
            <label className="label cursor-pointer justify-start space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.isWithCentralOrganization}
                onChange={() => handleAdditionalOrgTypeChange("isWithCentralOrganization")}
              />
              <span className="label-text">With Central Organization</span>
            </label>
            <label className="label cursor-pointer justify-start space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.isReligiousOrganization}
                onChange={() => handleAdditionalOrgTypeChange("isReligiousOrganization")}
              />
              <span className="label-text">Religious Organization</span>
            </label>
          </div>
          <label className="label">
            <span className="label-text-alt text-info flex items-center">
              <BadgeInfo className="w-4 h-4 mr-1" />
              You can select multiple options or leave them unchecked if none apply
            </span>
          </label>
        </div>

        {isNotUniversityWide && (
          <div className="form-control w-full" ref={dropdownRef}>
            <label className="label" htmlFor="affiliation-search">
              <span className="label-text">Search for your affiliation (Required)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="affiliation-search"
                className="input input-bordered w-full pr-10"
                placeholder="Search for your affiliation..."
                value={affiliationSearchTerm}
                onChange={handleAffiliationInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={affiliationOptionsLoading}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              {affiliationSearchTerm && (
                <button
                  type="button"
                  className="btn btn-ghost btn-circle absolute right-10 top-1/2 transform -translate-y-1/2"
                  onClick={handleClearAffiliationSearch}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {isDropdownOpen && filteredAffiliations.length > 0 && (
              <ul className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                {filteredAffiliations.map((affiliation) => (
                  <li
                    key={affiliation._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAffiliation(affiliation)}
                  >
                    {affiliation.name}
                  </li>
                ))}
              </ul>
            )}
            {affiliationOptionsLoading && (
              <div className="text-center mt-2">
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
            <span className="label-text">Student Organization Category (Required)</span>
          </label>
          <select
            id="org-category"
            className="select select-bordered w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {["Academic", "Cultural", "Religious", "Sports"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Strategic Directional Areas (Required)</span>
          </label>
          <div className="dropdown">
            <label tabIndex={0} className="btn m-1" onClick={() => setIsSDAreaDropdownOpen(!isSDAreaDropdownOpen)}>
              Select Areas
            </label>
            {isSDAreaDropdownOpen && (
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {["Research", "Innovation", "Community Engagement", "Sustainability"].map((area) => (
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
          <label className="label" htmlFor="facebook">
            <span className="label-text">Facebook Page Name</span>
          </label>
          <input
            type="url"
            id="facebook"
            placeholder=""
            className="input input-bordered w-full"
            value={formData.facebook}
            onChange={(e) => handleFacebookInputChange(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Additional Social Media Links (Optional)</span>
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
                className="btn btn-ghost btn-circle text-error"
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
            <span className="label-text">Starting Balance (Required)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₱</span>
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
          <label className="label" htmlFor="academic-year-of-last-recognition">
            <span className="label-text">Academic Year of Last Recognition (Required)</span>
          </label>
          <select
            id="academic-year-of-last-recognition"
            className="select select-bordered w-full"
            value={
              formData.academicYearOfLastRecognition === "Not yet recognized"
                ? "not-recognized"
                : formData.academicYearOfLastRecognition.split("-")[0]
            }
            onChange={handleAcademicYearOfLastRecognitionChange}
            required
          >
            <option value="">Select academic year</option>
            <option value="not-recognized">Not yet recognized</option>
            {pastYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}-{year + 1}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt text-info flex items-center">
              <BadgeInfo className="w-4 h-4 mr-1" />
              Select the academic year of last recognition or "Not yet recognized" if this is your first time
            </span>
          </label>
        </div>

        {formData.academicYearOfLastRecognition !== "Not yet recognized" && (
          <div className="form-control">
            <label className="label" htmlFor="level-of-recognition">
              <span className="label-text">Level of Recognition (Required)</span>
            </label>
            <input
              type="text"
              id="level-of-recognition"
              placeholder="Enter level of recognition"
              className="input input-bordered w-full"
              value={formData.levelOfRecognition}
              onChange={handleLevelOfRecognitionChange}
              required
            />
          </div>
        )}

        <div className="flex flex-col justify-center mt-6 items-end gap-2">
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={!isFormValid()}>
            Next Step
          </button>
          {!isFormValid() && <p className="text-info text-xs">Input required fields to enable button</p>}
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
  const [objectives, setObjectives] = useState<string[]>([]);

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, ""]);
    setFormData({ ...formData, objectives: [...objectives, ""] });
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
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
            <span className="label-text">Objectives (optional, can be added/edited later if needed)</span>
          </label>
          {objectives.length > 0 ? (
            objectives.map((objective, index) => (
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
            ))
          ) : (
            <p className="text-sm text-gray-500 mb-2">No objectives added yet. Click the button below to add one.</p>
          )}
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
      signatoryRequests: [...formData.signatoryRequests, { email: "", position: "" }],
    });
  };

  const handleRemoveSignatoryInput = (index: number) => {
    const newSignatoryRequests = formData.signatoryRequests.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, signatoryRequests: newSignatoryRequests });
  };

  const handleSignatoryInputChange = (index: number, field: "email" | "position", value: string | boolean) => {
    const newSignatoryRequests = [...formData.signatoryRequests];
    newSignatoryRequests[index][field] = value;
    setFormData({ ...formData, signatoryRequests: newSignatoryRequests });
  };

  const isFormValid = () => {
    if (formData.signatoryRequests.length === 0) {
      return true; // Allow skipping if no signatories are added
    }
    return formData.signatoryRequests.every(
      (signatory: any) => signatory.email.trim() !== "" && signatory.position.trim() !== ""
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Signatory Accounts (Optional)</h2>
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
                  required
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
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-primary w-full" onClick={handleAddSignatoryInput}>
          <CircleFadingPlus className="mr-2" />
          Add Signatory
        </button>
        <div className="flex justify-between mt-8">
          <button className="btn btn-outline" type="button" onClick={prevStep}>
            <CornerDownLeft className="mr-2" />
            Previous Step
          </button>
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={!isFormValid()}>
            {formData.signatoryRequests.length === 0 ? "Skip Step" : "Next Step"}
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
  selectedAffiliation: any;
}

function OrganizationSetupStep4({
  prevStep,
  formData,
  handleSubmit,
  isSubmitting,
  isNotUniversityWide,
  selectedAffiliation,
}: OrganizationSetupStep4Props) {
  const renderField = (label: string, value: string | string[] | boolean) => (
    <section className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{label}</h3>
      <p className="text-base">
        {Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}
      </p>
    </section>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>

      {renderField("Current Academic Year", formData.currentAcademicYear)}

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Organization Logo</h3>
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {formData.logo && <Image src={formData.logo} alt="Organization Logo" width={128} height={128} />}
          </div>
        </div>
      </section>

      {renderField("Organization Name", formData.name)}
      {renderField("Organization Type", isNotUniversityWide ? "College-Based" : "University-Wide")}
      {renderField("Affiliation", isNotUniversityWide ? selectedAffiliation?.name || "N/A" : "University Wide")}
      {renderField("With Central Organization", formData.isWithCentralOrganization)}
      {renderField("Religious Organization", formData.isReligiousOrganization)}
      {renderField("Website", formData.website)}
      {renderField("Category", formData.category)}
      {renderField("Strategic Directional Areas", formData.strategicDirectionalAreas)}
      {renderField("Facebook Link", formData.facebook)}

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Additional Social Media Links</h3>
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
      {formData.academicYearOfLastRecognition !== "Not yet recognized" &&
        renderField("Level of Recognition", formData.levelOfRecognition)}

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
                </tr>
              </thead>
              <tbody>
                {formData.signatoryRequests.map((signatory: any, index: number) => (
                  <tr key={index}>
                    <td>{signatory.email}</td>
                    <td>{signatory.position}</td>
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
}

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
