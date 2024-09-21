"use client";

import PageWrapper from "@/components/PageWrapper";
import { useState } from "react";
import { CircleFadingPlus, XCircle, CornerDownLeft, BadgeInfo, Check } from "lucide-react";
import Image from "next/image";

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

const OrganizationSetupStep1 = ({ nextStep }: { nextStep: () => void }) => {
  const [isUniversityWide, setIsUniversityWide] = useState(true);
  const [socialInputs, setSocialInputs] = useState([{ platform: "", link: "" }]);
  const [orgName, setOrgName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleToggleChange = () => {
    setIsUniversityWide(!isUniversityWide);
  };

  const handleAddSocialInput = () => {
    setSocialInputs([...socialInputs, { platform: "", link: "" }]);
  };

  const handleRemoveSocialInput = (index: number) => {
    setSocialInputs(socialInputs.filter((_, i) => i !== index));
  };

  const handleSocialInputChange = (index: number, field: "platform" | "link", value: string) => {
    const newInputs = [...socialInputs];
    newInputs[index][field] = value;
    setSocialInputs(newInputs);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
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
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text mr-2">University Wide</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isUniversityWide}
                onChange={handleToggleChange}
              />
            </label>
          </div>
          <div className="form-control flex-grow">
            <label className="label" htmlFor="affiliation">
              <span className="label-text">Affiliation</span>
            </label>
            <input
              type="text"
              id="affiliation"
              placeholder="College of Information and Computing Science"
              className="input input-bordered w-full"
              disabled={isUniversityWide}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Social Media</span>
          </label>
          {socialInputs.map((input, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Platform (e.g., Facebook)"
                className="input input-bordered flex-grow"
                value={input.platform}
                onChange={(e) => handleSocialInputChange(index, "platform", e.target.value)}
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
          />
          {logo && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected file: {logo.name}</p>
            </div>
          )}
        </div>

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

const OrganizationSetupStep2 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [signatoryInputs, setSignatoryInputs] = useState([{ email: "", position: "" }]);

  const handleAddSignatoryInput = () => {
    setSignatoryInputs([...signatoryInputs, { email: "", position: "" }]);
  };

  const handleRemoveSignatoryInput = (index: number) => {
    setSignatoryInputs(signatoryInputs.filter((_, i) => i !== index));
  };

  const handleSignatoryInputChange = (index: number, field: "email" | "position", value: string) => {
    const newInputs = [...signatoryInputs];
    newInputs[index][field] = value;
    setSignatoryInputs(newInputs);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Request Signatory Accounts</h2>
        <p className="text-primary mt-2">
          Only executive signatories, whose signatures are required, need to have ESORR accounts. Please wait for an
          email confirming account approval once your request is submitted. Accounts can be requested even after the
          setup is complete.
        </p>
      </div>
      <form className="space-y-4">
        {signatoryInputs.map((input, index) => (
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

interface Social {
  platform: string;
  link: string;
}

interface Signatory {
  email: string;
  position: string;
}

const OrganizationSetupStep3 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [socials, setSocials] = useState<Social[]>([
    { platform: "Facebook", link: "https://facebook.com/SITE.UST" },
    { platform: "Twitter", link: "https://twitter.com/SITE_UST" },
    { platform: "Instagram", link: "https://instagram.com/site.ust" },
    { platform: "LinkedIn", link: "https://linkedin.com/company/site-ust" },
  ]);

  const [signatories, setSignatories] = useState<Signatory[]>([
    { email: "president@site.org", position: "President" },
    { email: "vicepresident@site.org", position: "Vice President" },
    { email: "secretary@site.org", position: "Secretary" },
  ]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">Confirm Setup</h2>
      <section aria-labelledby="org-name">
        <h3 id="org-name" className="text-xl font-semibold mb-2 text-gray-700">
          Organization Name
        </h3>
        <p className="text-lg">Society of Information Technology Enthusiasts</p>
      </section>

      <section aria-labelledby="org-logo">
        <h3 id="org-logo" className="text-xl font-semibold mb-2 text-gray-700">
          Organization Logo
        </h3>
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Organization Logo"
              width={128}
              height={128}
            />
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
              {socials.map((social, index) => (
                <tr key={index}>
                  <td className="flex items-center gap-2">{social.platform}</td>
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
              {signatories.map((signatory, index) => (
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
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
