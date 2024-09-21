"use client";

import PageWrapper from "@/components/PageWrapper";
import { useState } from "react";
import { CornerDownLeft, Check } from "lucide-react";

const AUSetupPage = () => {
  const [step, setStep] = useState<number>(1);

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
          <h1 className="text-3xl font-bold text-primary">Setup a new organization</h1>
          <p className="text-gray-600">
            Follow the steps to setup your organization account before proceeding with ESORR
          </p>
        </div>
        <div className="flex flex-col items-start justify-center w-full">
          <SetupStepper step={step} />
          <div className="p-6 bg-white w-full shadow-md rounded-lg border-t-4 border-primary">
            {step === 1 ? (
              <AUSetupStep1 nextStep={nextStep} />
            ) : (
              <AUSetupStep2 prevStep={prevStep} nextStep={nextStep} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const AUSetupStep1 = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Select Affliation</h2>
        <p className="text-primary mt-2">
          Please select your affiliation to view all the organizations associated with your college.
        </p>
      </div>
      <form className="space-y-4">
        <select className="select select-ghost w-full">
          <option disabled selected>
            Select Affiliation
          </option>
          <option>Homer</option>
          <option>Marge</option>
          <option>Bart</option>
          <option>Lisa</option>
          <option>Maggie</option>
        </select>
        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" type="button" onClick={nextStep}>
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

const AUSetupStep2 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="org-name">
        <h3 id="org-name" className="text-xl font-semibold mb-2 text-gray-700">
          Affiliation
        </h3>
        <p className="text-lg">College of Information and Computing Sciences</p>
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
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className={`flex items-center ${step >= 2 ? "text-primary" : ""}`}>
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

export default AUSetupPage;
