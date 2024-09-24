"use client";

import PageWrapper from "@/components/PageWrapper";
import { useState, useEffect, useMemo } from "react";
import { CornerDownLeft, Check, Search, X } from "lucide-react";
import axios from "axios";
import { AffiliationResponse } from "@/types";

const AUSetupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [affiliationOptions, setAffiliationOptions] = useState<AffiliationResponse[]>([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(true);
  const [selectedAffiliation, setSelectedAffiliation] = useState<AffiliationResponse | null>(null);

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

  return (
    <PageWrapper>
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
                selectedAffiliation={selectedAffiliation}
                setSelectedAffiliation={setSelectedAffiliation}
              />
            ) : (
              <AUSetupStep2 prevStep={prevStep} nextStep={nextStep} selectedAffiliation={selectedAffiliation} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

interface AUSetupStep1Props {
  nextStep: () => void;
  affiliationOptions: AffiliationResponse[];
  affiliationOptionsLoading: boolean;
  selectedAffiliation: AffiliationResponse | null;
  setSelectedAffiliation: (affiliation: AffiliationResponse | null) => void;
}

const AUSetupStep1 = ({
  nextStep,
  affiliationOptions,
  affiliationOptionsLoading,
  selectedAffiliation,
  setSelectedAffiliation,
}: AUSetupStep1Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredAffiliations = useMemo(() => {
    return affiliationOptions.filter((affiliation) => affiliation.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
    // Delay closing the dropdown to allow for option selection
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Select Affiliation</h2>
        <p className="text-primary mt-2">
          Please select your affiliation to view all the organizations associated with your affiliation.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
      >
        <div className="relative">
          <div className="flex">
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
          <div className="text-center">
            <span className="loading loading-dots loading-md"></span>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" type="submit" disabled={!selectedAffiliation}>
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
  selectedAffiliation,
}: {
  prevStep: () => void;
  nextStep: () => void;
  selectedAffiliation: AffiliationResponse | null;
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="org-name">
        <h3 id="org-name" className="text-xl font-semibold mb-2 text-gray-700">
          Affiliation
        </h3>
        <p className="text-lg">{selectedAffiliation ? selectedAffiliation.name : "No affiliation selected"}</p>
      </section>

      <div className="flex justify-between mt-8">
        <button className="btn btn-outline" onClick={prevStep}>
          <CornerDownLeft className="mr-2" />
          Previous Step
        </button>
        <button className="btn btn-primary" type="submit" onClick={nextStep}>
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
        Select <span className="hidden sm:inline-flex sm:ms-2">Affiliation</span>
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
