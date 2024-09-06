import { CircleFadingPlus, XCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  nextStep: () => void;
}

const OrganizationSetupStep1 = ({ nextStep }: Props) => {
  const [isUniversityWide, setIsUniversityWide] = useState(true);

  const handleToggleChange = () => {
    setIsUniversityWide(!isUniversityWide);
  };

  const [socialInputs, setSocialInputs] = useState([{ platform: "", link: "" }]);

  const handleAddSocialInput = () => {
    setSocialInputs([...socialInputs, { platform: "", link: "" }]);
  };

  const handleRemoveSocialInput = (index) => {
    setSocialInputs(socialInputs.filter((_, i) => i !== index));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">General Information</h2>
      <form className="w-full flex flex-col items-start justify-center">
        <label className="form-control w-full mb-4">
          <div className="label">
            <span>Organization Name</span>
          </div>
          <input
            type="text"
            placeholder="Society of Information Technology Enthusiasts"
            className="input input-bordered w-full"
          />
        </label>
        <div className="flex items-center justify-start gap-4 mb-4 w-full">
          <label className="form-control flex items-center gap-2 w-1/12 text-center">
            <span className="label-text text-xs">University Wide</span>
            <input
              type="checkbox"
              className="toggle toggle-lg"
              checked={isUniversityWide}
              onChange={handleToggleChange}
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span>Affiliation</span>
            </div>
            <input
              type="text"
              placeholder="College of Information and Computing Science"
              className="input input-bordered w-full "
              disabled={isUniversityWide}
            />
          </label>
        </div>
        <label className="form-control w-full mb-4">
          <div className="label">
            <span>Socials</span>
          </div>

          {socialInputs.map((input, index) => (
            <div key={index} className="flex items-center justify-start gap-2 mb-2 w-full">
              <label className="form-control">
                <div className="label"></div>
                <input type="text" placeholder="facebook" className="input input-bordered max-w-xs" />
                <div className="label">
                  <span className="label-text-alt">Platform</span>
                </div>
              </label>
              /
              <label className="form-control w-full">
                <div className="label"></div>
                <input type="text" placeholder="facebook.com/organization" className="input input-bordered w-full" />
                <div className="label">
                  <span className="label-text-alt">Link</span>
                </div>
              </label>
              <button type="button" className="btn btn-ghost text-error" onClick={() => handleRemoveSocialInput(index)}>
                <XCircle />
              </button>
            </div>
          ))}

          <button type="button" className="btn btn-active btn-ghost font-normal" onClick={handleAddSocialInput}>
            Add Social Media Input
            <CircleFadingPlus />
          </button>
        </label>
        <label className="form-control w-full max-w-xs mb-4">
          <div className="label">
            <span>Upload Organization Logo</span>
          </div>
          <input type="file" className="file-input w-full max-w-xs" />
        </label>
        <div className="flex justify-end gap-2 items-center w-full mt-8">
          <button className="btn btn-primary" onClick={nextStep}>Next Step</button>
        </div>
      </form>
    </>
  );
};
export default OrganizationSetupStep1;
