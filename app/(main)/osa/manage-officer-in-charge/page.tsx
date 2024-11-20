"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";

export default function Component() {
  const [officerName, setOfficerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOfficerInCharge();
  }, []);

  const fetchOfficerInCharge = async () => {
    try {
      const response = await fetch("/api/manage-officer-in-charge");
      if (response.ok) {
        const data = await response.json();
        setOfficerName(data.name);
      }
    } catch (error) {
      console.error("Failed to fetch Officer-In-Charge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/manage-officer-in-charge", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: officerName }),
      });
      if (response.ok) {
        console.log("Officer-In-Charge updated successfully");
      } else {
        console.error("Failed to update Officer-In-Charge");
      }
    } catch (error) {
      console.error("Error updating Officer-In-Charge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center page_wrapper_height">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Office for Student Affairs</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full max-w-xs">
                <label htmlFor="officer-name" className="label">
                  <span className="label-text">Officer-In-Charge</span>
                </label>
                <input
                  type="text"
                  id="officer-name"
                  placeholder="Enter name"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                  disabled={isLoading}
                />
              </div>
              <div className="card-actions justify-end mt-6">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
