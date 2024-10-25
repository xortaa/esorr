"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useParams } from "next/navigation";

const AnnexDCreator = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>(
    "https://static.wikia.nocookie.net/roblox-skittles-nextbots/images/f/f6/Sad_spunch.png/revision/latest?cb=20240505183908"
  );
  const { organizationId, annexId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-d/${annexId}`);
      console.log(response.data)
      const data = response.data;
      setDescription(data.description);
      setLogoUrl(data.logo);
    };
    fetchData();
  }, []);

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`/api/annexes/${organizationId}/annex-d/${annexId}`, { description });
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
      <h1 className="text-3xl font-bold text-center mb-8">Organizations Logo and Letterhead Editor</h1>
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-56 h-56 mb-4">
              <img src={logoUrl} alt="logo" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Input detailed description of the logo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="card-actions justify-end mt-6">
            <button onClick={saveDraft} className="btn btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnnexDCreator;
