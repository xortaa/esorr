"use client";

import PageWrapper from "@/components/PageWrapper";
import { useState } from "react";
import { CircleFadingPlus, XCircle, CornerDownLeft, BadgeInfo, Check } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SOCCSetupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [memberInputs, setMemberInputs] = useState([{ signatoryEmail: "", position: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/socc-setup", {
        email: session?.user?.email,
        signatories: memberInputs,
      });

      if (response.status === 201) {
        alert("SOCC setup completed successfully!");
        router.push("/organizations");
      }
    } catch (error) {
      console.error("Error setting up SOCC:", error);
      setError("An error occurred while setting up SOCC. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (memberInputs.some((input) => !input.signatoryEmail || !input.position)) {
      setError("All member inputs must have both an email and a position.");
      return false;
    }
    return true;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login page if user is not authenticated
    return null;
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-start justify-start gap-4 w-full max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-primary">Setup SOCC member accounts</h1>
          <p className="text-gray-600">Follow the steps to setup SOCC accounts.</p>
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
              <SOCCSetupStep1 nextStep={nextStep} memberInputs={memberInputs} setMemberInputs={setMemberInputs} />
            ) : (
              <SOCCSetupStep2
                prevStep={prevStep}
                memberInputs={memberInputs}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const SOCCSetupStep1 = ({
  nextStep,
  memberInputs,
  setMemberInputs,
}: {
  nextStep: () => void;
  memberInputs: any[];
  setMemberInputs: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const handleAddMemberInput = () => {
    setMemberInputs([...memberInputs, { signatoryEmail: "", position: "" }]);
  };

  const handleRemoveMemberInput = (index: number) => {
    setMemberInputs(memberInputs.filter((_, i) => i !== index));
  };

  const handleMemberInputChange = (index: number, field: "signatoryEmail" | "position", value: string) => {
    const newInputs = [...memberInputs];
    newInputs[index][field] = value;
    setMemberInputs(newInputs);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Request SOCC Member Accounts</h2>
        <p className="text-primary mt-2">
          Fill out the forms to request accounts for SOCC members. An email confirmation will be sent once accounts have
          been approved. Accounts can be requested even after the setup is complete.
        </p>
      </div>
      <form className="space-y-4">
        {memberInputs.map((input, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="form-control flex-grow">
              <label className="label" htmlFor={`member-email-${index}`}>
                <span className="label-text">Member Email</span>
                <span className="label-text-alt text-info flex items-center">
                  <BadgeInfo className="w-4 h-4 mr-1" />
                  only ust.edu.ph emails are allowed
                </span>
              </label>
              <input
                type="email"
                id={`member-email-${index}`}
                placeholder="email@ust.edu.ph"
                className="input input-bordered w-full"
                value={input.signatoryEmail}
                onChange={(e) => handleMemberInputChange(index, "signatoryEmail", e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor={`member-position-${index}`}>
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                id={`member-position-${index}`}
                placeholder="e.g., President"
                className="input input-bordered w-full"
                value={input.position}
                onChange={(e) => handleMemberInputChange(index, "position", e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-square text-error"
              onClick={() => handleRemoveMemberInput(index)}
            >
              <XCircle />
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-primary" onClick={handleAddMemberInput}>
          Add SOCC Member
          <CircleFadingPlus className="ml-2" />
        </button>
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

const SOCCSetupStep2 = ({
  prevStep,
  memberInputs,
  handleSubmit,
  isSubmitting,
}: {
  prevStep: () => void;
  memberInputs: any[];
  handleSubmit: () => void;
  isSubmitting: boolean;
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>

      <section aria-labelledby="org-signatories">
        <h3 id="org-signatories" className="text-xl font-semibold mb-2 text-gray-700">
          Member Accounts
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
              {memberInputs.map((member, index) => (
                <tr key={index}>
                  <td>{member.signatoryEmail}</td>
                  <td>{member.position}</td>
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
        SOCC Member <span className="hidden sm:inline-flex sm:ms-2">Accounts</span>
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
        Confirm
      </li>
    </ol>
  );
};

export default SOCCSetupPage;
