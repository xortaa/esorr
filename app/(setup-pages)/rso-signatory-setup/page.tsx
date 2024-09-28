"use client";

import { useState, useRef } from "react";
import { CornerDownLeft, Check } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  signature: string | null;
}

const RSOSignatorySetupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    signature: null,
  });

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
        <h1 className="text-3xl font-bold text-primary">RSO Signatory Setup</h1>
        <p className="text-gray-600">
          Follow the steps to set up the RSO signatory account before proceeding with ESORR
        </p>
      </div>
      <div className="flex flex-col items-start justify-center w-full">
        <SetupStepper step={step} />
        <div className="p-6 bg-white w-full shadow-md rounded-lg border-t-4 border-primary">
          {step === 1 ? (
            <RSOSignatorySetupStep1 nextStep={nextStep} formData={formData} handleFormChange={handleFormChange} />
          ) : (
            <RSOSignatorySetupStep2 prevStep={prevStep} nextStep={nextStep} formData={formData} />
          )}
        </div>
      </div>
    </div>
  );
};

interface RSOSignatorySetupStep1Props {
  nextStep: () => void;
  formData: FormData;
  handleFormChange: (newData: Partial<FormData>) => void;
}

const RSOSignatorySetupStep1 = ({ nextStep, formData, handleFormChange }: RSOSignatorySetupStep1Props) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    handleFormChange({ signature: null });
  };

  const handleTrimSignature = () => {
    const trimmedDataUrl = sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png");
    handleFormChange({ signature: trimmedDataUrl || null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFormChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Basic Setup</h2>
        <p className="text-primary mt-2">Please complete the following steps to set up the RSO signatory account</p>
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>
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
            disabled={!formData.firstName || !formData.lastName || !formData.signature}
          >
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

const RSOSignatorySetupStep2 = ({
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
          {formData.firstName} {formData.middleName} {formData.lastName}
        </p>
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

export default RSOSignatorySetupPage;
