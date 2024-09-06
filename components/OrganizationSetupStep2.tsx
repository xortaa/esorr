import { CornerDownLeft, XCircle, BadgeInfo, CircleFadingPlus } from "lucide-react";
import { useState } from "react";

interface Props {
  prevStep: () => void;
  nextStep: () => void;
}

const OrganizationSetupStep2 = ({ prevStep, nextStep }: Props) => {
  const [signatoryInputs, setSignatoryInputs] = useState([{ email: "", position: "" }]);

  const handleAddSignatoryInput = () => {
    setSignatoryInputs([...signatoryInputs, { email: "", position: "" }]);
  };

  const handleRemoveSignatoryInput = (index) => {
    setSignatoryInputs(signatoryInputs.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Request Signatory Accounts</h2>
        <p className="text-primary">
          Only signatories whose signatures are required, such as executive signatories, need to have ESORR accounts.
        </p>
      </div>
      <form className="w-full flex flex-col">
        {signatoryInputs.map((_, index) => (
          <div className="flex items-center justify-start gap-2 mb-2 w-full">
            <label className="form-control w-full">
              <div className="label">
                <p>Signatory Email</p>
                <span className="label-text-alt text-info flex gap-1 items-center">
                  <BadgeInfo />
                  only ust.edu.ph emails are allowed
                </span>
              </div>
              <input type="text" placeholder="Link" className="input input-bordered w-full" />
            </label>
            <label className="form-control">
              <div className="label">Position</div>
              <input type="text" placeholder="Platform" className="input input-bordered max-w-xs" />
            </label>
            <label className="form-control">
              <div className="label">Remove</div>
              <button type="button" className="btn btn-ghost text-error" onClick={() => handleRemoveSignatoryInput(index)}>
                <XCircle />
              </button>
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-active btn-ghost font-normal" onClick={handleAddSignatoryInput}>
          Add Signatory Input
          <CircleFadingPlus />
        </button>
        <div className="flex justify-end gap-2 items-center w-full mt-8">
          <button className="btn btn-secondary" onClick={prevStep}>
            <CornerDownLeft />
            Previous Step
          </button>
          <button className="btn btn-primary" type="submit" onClick={nextStep}>
            Next Step
          </button>
        </div>
      </form>
    </>
  );
};
export default OrganizationSetupStep2;
