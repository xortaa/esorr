"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const AnnexDCreator = () => {
  const [isSaving, setIsSaving] = useState(false);

  const [enableOrganizationName, setEnableOrganizationName] = useState<boolean>(false);
  const [enableFaculty, setEnableFaculty] = useState<boolean>(false);
  const [faculty, setFaculty] = useState<string>("College of Information and Computer Sciences");
  const [organizationName, setOrganizationName] = useState<string>("Society of Information Technology Enthusiasts");

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Draft saved:", "insert organization name");
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <h1 className="font-bold text-2xl">Organizations Logo and Letterhead Editor</h1>
      <form className="mt-6 relative">
        {/* image */}
        <div className="w-full grid place-items-center">
          <img
            src="https://static.wikia.nocookie.net/roblox-skittles-nextbots/images/f/f6/Sad_spunch.png/revision/latest?cb=20240505183908"
            alt="logo"
            className="w-56 h-56"
          />
        </div>
        {/* description */}
        <label className="form-control w-full mb-4">
          <div className="label">
            <span>Description</span>
          </div>
          <div>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Input detailed description of the logo"
            ></textarea>
          </div>
        </label>
        {/* organization name */}
        <div className="form-control w-full mb-4">
          <div className="label">
            <span>Organization Name</span>
            <div className="flex items-center gap-2">
              <p className="text-slate-500">EDIT</p>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                onChange={() => setEnableOrganizationName(!enableOrganizationName)}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={organizationName}
              disabled={!enableOrganizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>
        </div>
        {/* faculty/college/institute/school */}
        <div className="form-control w-full mb-4">
          <div className="label">
            <span>Faculty/College/Institute/School</span>
            <div className="flex items-center gap-2">
              <p className="text-slate-500">EDIT</p>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                onChange={() => setEnableFaculty(!enableFaculty)}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              className="input input-bordered w-full"
              value={faculty}
              disabled={!enableFaculty}
              onChange={(e) => setFaculty(e.target.value)}
            />
          </div>
        </div>
        <button onClick={saveDraft} className="fixed  btn btn-neutral bottom-4 right-4 px-16" disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
      </form>
    </PageWrapper>
  );
};
export default AnnexDCreator;
