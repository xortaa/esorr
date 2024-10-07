"use client";

import { useState, useEffect, useMemo } from "react";
import { CircleFadingPlus, XCircle, CornerDownLeft, BadgeInfo, Check, Search, X } from "lucide-react";
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
    socials: [{ name: "", link: "" }],
    signatoryRequests: [{ email: "", position: "" }],
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

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

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
     submitFormData.append("name", formData.name);
     if (formData.logo) {
       submitFormData.append("logo", formData.logo);
     }

     // Filter out empty social links
     const nonEmptySocials = formData.socials.filter((social) => social.name && social.link);
     submitFormData.append("socials", JSON.stringify(nonEmptySocials));

     // Filter out empty signatory requests
     const nonEmptySignatoryRequests = formData.signatoryRequests.filter(
       (request) => request.email && request.position
     );
     submitFormData.append("signatoryRequests", JSON.stringify(nonEmptySignatoryRequests));

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
          ) : (
            <OrganizationSetupStep3
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

  const handleToggleChange = () => {
    setIsNotUniversityWide(!isNotUniversityWide);
    if (isNotUniversityWide) {
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
      socials: [...formData.socials, { name: "", link: "" }],
    });
  };

  const handleRemoveSocialInput = (index: number) => {
    const newSocials = formData.socials.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, socials: newSocials });
  };

  const handleSocialInputChange = (index: number, field: "name" | "link", value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" && formData.logo !== null && (!isNotUniversityWide || selectedAffiliation !== null)
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
      <form className="space-y-4">
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

        <div className="flex flex-col gap-4 items-start justify-center">
          <div className="form-control">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={!isNotUniversityWide}
                onChange={handleToggleChange}
              />
              <span className="label-text mx-2">University Wide</span>
            </label>
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
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
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
              </div>
              {affiliationOptionsLoading && (
                <div className="text-center w-1/6">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Social Media (Optional)</span>
          </label>
          {formData.socials.map((input: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Platform (e.g., Facebook)"
                className="input input-bordered flex-grow"
                value={input.name}
                onChange={(e) => handleSocialInputChange(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Link"
                className="input input-bordered flex-grow"
                value={input.link}
                onChange={(e) => handleSocialInputChange(index, "link", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-square text-error"
                onClick={() => handleRemoveSocialInput(index)}
              >
                <XCircle />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-primary mt-2" onClick={handleAddSocialInput}>
            Add Social Media
            <CircleFadingPlus className="ml-2" />
          </button>
        </div>

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
                  <Image src={imagePreview} alt="Organization Logo" width={128} height={128} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={!isFormValid()}>
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
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

  const handleSignatoryInputChange = (index: number, field: "email" | "position", value: string) => {
    const newSignatoryRequests = [...formData.signatoryRequests];
    newSignatoryRequests[index][field] = value;
    setFormData({ ...formData, signatoryRequests: newSignatoryRequests });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Request Signatory Accounts</h2>
        <p className="text-primary mt-2">
          Only executive signatories, whose signatures are required, need to have ESORR accounts. Please wait for an
          email confirming account approval once your request is submitted. Requesting accounts for executive
          signatories is optional and can also be done after the setup is complete.
        </p>
      </div>
      <form className="space-y-4">
        {formData.signatoryRequests.map((input: any, index: number) => (
          <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="form-control flex-grow">
              <label className="label" htmlFor={`signatory-email-${index}`}>
                <span className="label-text">Signatory Email</span>
                <span className="label-text-alt text-info flex items-center">
                  <BadgeInfo className="w-4 h-4 mr-1" />
                  only ust.edu.ph emails are allowed
                </span>
              </label>
              <input
                type="email"
                id={`signatory-email-${index}`}
                placeholder="email@ust.edu.ph"
                className="input input-bordered w-full"
                value={input.email}
                onChange={(e) => handleSignatoryInputChange(index, "email", e.target.value)}
              />
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
            <button
              type="button"
              className="btn btn-ghost btn-square text-error"
              onClick={() => handleRemoveSignatoryInput(index)}
            >
              <XCircle />
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-primary" onClick={handleAddSignatoryInput}>
          Add Signatory
          <CircleFadingPlus className="ml-2" />
        </button>
        <div className="flex justify-between mt-6">
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

const OrganizationSetupStep3 = ({
  prevStep,
  formData,
  handleSubmit,
  isSubmitting,
  isNotUniversityWide,
  selectedAffiliation,
}: {
  prevStep: () => void;
  formData: any;
  handleSubmit: () => void;
  isSubmitting: boolean;
  isNotUniversityWide: boolean;
  selectedAffiliation: AffiliationResponse | null;
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="org-name">
        <h3 id="org-name" className="text-xl font-semibold mb-2 text-gray-700">
          Organization Name
        </h3>
        <p className="text-lg">{formData.name}</p>
      </section>

      <section aria-labelledby="org-affiliation">
        <h3 id="org-affiliation" className="text-xl font-semibold mb-2 text-gray-700">
          Affiliation
        </h3>
        <p className="text-lg">{isNotUniversityWide ? selectedAffiliation?.name : "University Wide"}</p>
      </section>

      <section aria-labelledby="org-logo">
        <h3 id="org-logo" className="text-xl font-semibold mb-2 text-gray-700">
          Organization Logo
        </h3>
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {formData.logo && (
              <Image src={URL.createObjectURL(formData.logo)} alt="Organization Logo" width={128} height={128} />
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="org-socials">
        <h3 id="org-socials" className="text-xl font-semibold mb-2 text-gray-700">
          Social Media
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {formData.socials.map((social: any, index: number) => (
                <tr key={index}>
                  <td className="flex items-center gap-2">{social.name}</td>
                  <td>
                    <a href={social.link} target="_blank" rel="noopener noreferrer" className="link link-primary">
                      {social.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="org-signatories">
        <h3 id="org-signatories" className="text-xl font-semibold mb-2 text-gray-700">
          Signatory Accounts
        </h3>
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
        Signatory <span className="hidden sm:inline-flex sm:ms-2">Accounts</span>
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
        Confirm
      </li>
    </ol>
  );
};

export default RSOSetupPage;
