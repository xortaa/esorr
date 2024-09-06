"use client";

import PageWrapper from "@/components/PageWrapper";
import OrganizationSetupStep1 from "@/components/OrganizationSetupStep1";
import OrganizationSetupStep2 from "@/components/OrganizationSetupStep2";
import OrganizationSetupStep3 from "@/components/OrganizationSetupStep3";
import SetupStepper from "@/components/SetupStepper";
import { useState } from "react";

const RSOSetupPage = () => {
  const [step, setStep] = useState<number>(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-start justify-start gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold text-primary">Setup a new organization</h1>
          <p className="text-base-500">
            Follow the steps to setup your organization account before proceeding with ESORR
          </p>
        </div>
        <div className="flex flex-col items-start justify-center min-w-full">
          <SetupStepper step={step} />
          <div className="p-6 bg-white w-full shadow-sm border-t-8 border-black">
            {step === 1 ? (
              <OrganizationSetupStep1 nextStep={nextStep} />
            ) : step === 2 ? (
              <OrganizationSetupStep2 prevStep={prevStep} nextStep={nextStep} />
            ) : (
              <OrganizationSetupStep3 prevStep={prevStep} nextStep={nextStep} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RSOSetupPage;
