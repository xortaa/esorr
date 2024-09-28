"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { CornerDownLeft, Check, Search, X } from "lucide-react";
import axios from "axios";
import { AffiliationResponse } from "@/types";
import SignatureCanvas from "react-signature-canvas";

interface FormData {
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  position: string;
  affiliation: AffiliationResponse | null;
  signature: string | null;
}

const AUSetupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [affiliationOptions, setAffiliationOptions] = useState<AffiliationResponse[]>([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    position: "",
    affiliation: null,
    signature: null,
  });

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const { data } = await axios.get("/api/affiliations");
        setAffiliationOptions(data);
        setAffiliationOptionsLoading(false);
      } catch (error) {
        console.error("Error fetching affiliations:", error);
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

  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
  
      <div className="flex flex-col items-start justify-start gap-4 w-full max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-primary">Academic Unit Account Setup</h1>
          <p className="text-gray-600">
            Follow the steps to setup your Academic Unit account before proceeding with ESORR
          </p>
        </div>
        <div className="flex flex-col items-start justify-center w-full">
          <SetupStepper step={step} />
          <div className="p-6 bg-white w-full shadow-md rounded-lg border-t-4 border-primary">
            {step === 1 ? (
              <AUSetupStep1
                nextStep={nextStep}
                affiliationOptions={affiliationOptions}
                affiliationOptionsLoading={affiliationOptionsLoading}
                formData={formData}
                handleFormChange={handleFormChange}
              />
            ) : (
              <AUSetupStep2 prevStep={prevStep} nextStep={nextStep} formData={formData} />
            )}
          </div>
        </div>
      </div>
  
  );
};

interface AUSetupStep1Props {
  nextStep: () => void;
  affiliationOptions: AffiliationResponse[];
  affiliationOptionsLoading: boolean;
  formData: FormData;
  handleFormChange: (newData: Partial<FormData>) => void;
}

const AUSetupStep1 = ({
  nextStep,
  affiliationOptions,
  affiliationOptionsLoading,
  formData,
  handleFormChange,
}: AUSetupStep1Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    handleFormChange({ signature: null });
  };

  const handleTrimSignature = () => {
    const trimmedDataUrl = sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png");
    handleFormChange({ signature: trimmedDataUrl || null });
  };

  const filteredAffiliations = useMemo(() => {
    return affiliationOptions.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [affiliationOptions, searchTerm]);

  const handleSelectAffiliation = (affiliation: AffiliationResponse) => {
    handleFormChange({ affiliation });
    setSearchTerm(affiliation.name);
    setIsDropdownOpen(false);
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleFormChange({ affiliation: null });
    setIsDropdownOpen(true);
  };

  const handleAffiliationInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFormChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Basic Setup</h2>
        <p className="text-primary mt-2">Please complete the following steps to setup your Academic Unit account</p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Name Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prefix" className="label">
                Prefix (e.g., Mr., Dr.)
              </label>
              <input
                type="text"
                id="prefix"
                name="prefix"
                className="input input-bordered w-full"
                value={formData.prefix}
                onChange={handleNameInputChange}
              />
            </div>
            <div>
              <label htmlFor="suffix" className="label">
                Suffix (e.g., PhD, Jr.)
              </label>
              <input
                type="text"
                id="suffix"
                name="suffix"
                className="input input-bordered w-full"
                value={formData.suffix}
                onChange={handleNameInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="firstName" className="label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input input-bordered w-full"
                required
                value={formData.firstName}
                onChange={handleNameInputChange}
              />
            </div>
            <div>
              <label htmlFor="middleName" className="label">
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                className="input input-bordered w-full"
                value={formData.middleName}
                onChange={handleNameInputChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input input-bordered w-full"
                required
                value={formData.lastName}
                onChange={handleNameInputChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="position" className="label">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              className="input input-bordered w-full"
              required
              value={formData.position}
              onChange={handleNameInputChange}
              placeholder="e.g., Dean, Department Head, Professor"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Affiliation</h3>
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
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                      setSearchTerm("");
                      handleFormChange({ affiliation: null });
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
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">Signature</h3>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{ width: 350, height: 150, className: "sigCanvas border border-primary" }}
          />
          <div className="flex items-center justify-start gap-2">
            <button type="button" className="btn btn-neutral btn-sm" onClick={handleClearSignature}>
              Clear
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleTrimSignature}>
              Save
            </button>
          </div>
          {formData.signature && (
            <img className="mt-4 border border-gray-300" src={formData.signature} alt="Trimmed Signature" />
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!formData.affiliation || !formData.firstName || !formData.lastName || !formData.position}
          >
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

const AUSetupStep2 = ({
  prevStep,
  nextStep,
  formData,
}: {
  prevStep: () => void;
  nextStep: () => void;
  formData: FormData;
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="name-details">
        <h3 id="name-details" className="text-xl font-semibold mb-2 text-gray-700">
          Name Details
        </h3>
        <p className="text-lg">
          {formData.prefix} {formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}
        </p>
      </section>
      <section aria-labelledby="position">
        <h3 id="position" className="text-xl font-semibold mb-2 text-gray-700">
          Position
        </h3>
        <p className="text-lg">{formData.position}</p>
      </section>
      <section aria-labelledby="affiliation">
        <h3 id="affiliation" className="text-xl font-semibold mb-2 text-gray-700">
          Affiliation
        </h3>
        <p className="text-lg">{formData.affiliation ? formData.affiliation.name : "No affiliation selected"}</p>
      </section>
      {formData.signature && (
        <section aria-labelledby="signature">
          <h3 id="signature" className="text-xl font-semibold mb-2 text-gray-700">
            Signature
          </h3>
          <img src={formData.signature} alt="Your Signature" className="border border-gray-300" />
        </section>
      )}

      <div className="flex justify-between mt-8">
        <button className="btn btn-outline" onClick={prevStep}>
          <CornerDownLeft className="mr-2" />
          Previous Step
        </button>
        <button className="btn btn-primary" type="button" onClick={nextStep}>
          <Check className="mr-2" />
          Confirm Setup
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
        Basic <span className="hidden sm:inline-flex sm:ms-2">Setup</span>
      </li>
      <li className={`flex items-center ${step >= 2 ? "text-primary" : ""}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
            step >= 2 ? "border-primary" : "border-slate-500"
          } rounded-full shrink-0`}
        >
          2
        </span>
        Confirm
      </li>
    </ol>
  );
};

export default AUSetupPage;
