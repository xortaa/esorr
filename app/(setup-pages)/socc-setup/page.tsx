"use client";

import { useState } from "react";
import { CornerDownLeft, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signOut } from "next-auth/react";

interface FormData {
  fullName: string;
  position: string;
}

const positions = [
  "President and CEO",
  "Executive Vice President",
  "Corporate Secretary",
  "Corporate Treasurer",
  "Vice President for Marketing and Sponsorships",
  "Vice President for Audit and Logistics",
  "Vice President for Corporate Communications",
  "Vice President for Quality Management and Assurance",
  "Vice President for Organization Relations",
  "Board of Director",
];

const SOCCSetupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    position: "",
  });
  const { data: session, status } = useSession();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to complete the setup.");
      return;
    }

    try {
      const response = await axios.post("/api/socc-setup", {
        ...formData,
        email: session.user.email,
      });

      if (response.status === 200) {
        alert(
          "SOCC setup completed successfully! You will be signed out now to complete the setup. Please re-login to enter ESORR."
        );
        signOut();
      }
    } catch (error) {
      console.error("Error during SOCC setup:", error);
      alert("An error occurred during setup. Please try again.");
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">SOCC Setup</h1>
        <p className="text-gray-600">Follow the steps to set up your SOCC account before proceeding with ESORR</p>
      </div>
      <div className="flex flex-col items-start justify-center w-full">
        <SetupStepper step={step} />
        <div className="p-6 bg-white w-full shadow-md rounded-lg border-t-4 border-primary">
          {step === 1 ? (
            <SOCCSetupStep1 nextStep={nextStep} formData={formData} handleFormChange={handleFormChange} />
          ) : (
            <SOCCSetupStep2 prevStep={prevStep} formData={formData} handleSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

interface SOCCSetupStep1Props {
  nextStep: () => void;
  formData: FormData;
  handleFormChange: (newData: Partial<FormData>) => void;
}

const SOCCSetupStep1 = ({ nextStep, formData, handleFormChange }: SOCCSetupStep1Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFormChange({ [name]: value });
  };

  const isFormValid = () => {
    return formData.fullName && formData.position;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Basic Setup</h2>
        <p className="text-primary mt-2">Please complete the following steps to set up your SOCC account</p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid()) nextStep();
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Name Details</h3>
          <div>
            <label htmlFor="fullName" className="label">
              Full Name (including any prefix or suffix)
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="input input-bordered w-full"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Dr. John A. Doe Jr."
            />
            <p className="text-sm text-gray-500 mt-1">
              Include any prefix (e.g., Dr., Mr., Ms.) or suffix (e.g., Jr., Sr., III) in your full name.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Position</h3>
          <div>
            <label htmlFor="position" className="label">
              Select your position
            </label>
            <select
              id="position"
              name="position"
              className="select select-bordered w-full"
              required
              value={formData.position}
              onChange={handleInputChange}
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="btn btn-primary" type="submit" disabled={!isFormValid()}>
            Next Step
            <CornerDownLeft className="ml-2 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
};

const SOCCSetupStep2 = ({
  prevStep,
  formData,
  handleSubmit,
}: {
  prevStep: () => void;
  formData: FormData;
  handleSubmit: () => void;
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="name-details">
        <h3 id="name-details" className="text-xl font-semibold mb-2 text-gray-700">
          Name Details
        </h3>
        <p className="text-lg">{formData.fullName}</p>
      </section>
      <section aria-labelledby="position-details">
        <h3 id="position-details" className="text-xl font-semibold mb-2 text-gray-700">
          Position
        </h3>
        <p className="text-lg">{formData.position}</p>
      </section>

      <div className="flex justify-between mt-8">
        <button className="btn btn-outline" onClick={prevStep}>
          <CornerDownLeft className="mr-2" />
          Previous Step
        </button>
        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
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

export default SOCCSetupPage;
