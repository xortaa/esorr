"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

const containsDigits = (str: string) => /\d/.test(str);

const RatificationForm = () => {
  const { organizationId, annexId } = useParams();
  const router = useRouter();
  const [ratificationDate, setRatificationDate] = useState("");
  const [ratificationVenue, setRatificationVenue] = useState("");
  const [signingVenue, setSigningVenue] = useState("");
  const [signingDate, setSigningDate] = useState("");
  const [assignedSecretary, setAssignedSecretary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-c/${annexId}`);
        const data = response.data;

        // Format dates to YYYY-MM-DD for input type="date"
        setRatificationDate(data.ratificationDate ? new Date(data.ratificationDate).toISOString().split("T")[0] : "");
        setRatificationVenue(data.ratificationVenue || "");
        setSigningDate(data.signingDate ? new Date(data.signingDate).toISOString().split("T")[0] : "");
        setSigningVenue(data.signingVenue || "");
        setAssignedSecretary(data.assignedSecretary || "");
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlert({ type: "error", message: "Failed to load form data" });
      }
    };

    fetchData();
  }, [annexId, organizationId]);

  const handleSigningVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!containsDigits(value)) {
      setSigningVenue(value);
    }
  };

  const handleAssignedSecretaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!containsDigits(value)) {
      setAssignedSecretary(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-c/${annexId}`, {
        ratificationDate,
        ratificationVenue,
        signingVenue,
        signingDate,
        assignedSecretary,
      });

      if (response.status === 200) {
        setAlert({ type: "success", message: "Form submitted successfully" });
        router.refresh();
      } else {
        setAlert({ type: "error", message: "Form submission failed" });
      }
    } catch (error) {
      console.error("An error occurred", error);
      setAlert({ type: "error", message: "An error occurred while submitting the form" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <BackButton />
      {alert && (
        <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
          <span>{alert.message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Ratification Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label" htmlFor="ratificationDate">
                <span className="label-text">Ratification Date:</span>
              </label>
              <input
                type="date"
                id="ratificationDate"
                className="input input-bordered w-full"
                required
                value={ratificationDate}
                max={new Date().toISOString().split("T")[0]} // Set max to current date
                onChange={(e) => setRatificationDate(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="ratificationVenue">
                <span className="label-text">Ratification Venue:</span>
              </label>
              <input
                type="text"
                id="ratificationVenue"
                className="input input-bordered w-full"
                required
                minLength={3}
                maxLength={100}
                value={ratificationVenue}
                onChange={(e) => setRatificationVenue(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="signingDate">
                <span className="label-text">Signing Date:</span>
              </label>
              <input
                type="date"
                id="signingDate"
                className="input input-bordered w-full"
                required
                value={signingDate}
                max={new Date().toISOString().split("T")[0]} // Set max to current date
                onChange={(e) => setSigningDate(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="signingVenue">
                <span className="label-text">Signing Venue:</span>
              </label>
              <input
                type="text"
                id="signingVenue"
                className="input input-bordered w-full"
                required
                minLength={3}
                maxLength={100}
                value={signingVenue}
                onChange={handleSigningVenueChange}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="assignedSecretary">
                <span className="label-text">Assigned Secretary:</span>
              </label>
              <input
                type="text"
                id="assignedSecretary"
                className="input input-bordered w-full"
                required
                minLength={1}
                maxLength={200}
                value={assignedSecretary}
                onChange={handleAssignedSecretaryChange}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RatificationForm;
