"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

const RatificationForm = () => {
  const { organizationId, annexId } = useParams();
  const router = useRouter();
  const [ratificationDate, setRatificationDate] = useState("");
  const [ratificationVenue, setRatificationVenue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-c/${annexId}`, {
        ratificationDate,
        ratificationVenue,
      });

      if (response.status === 200) {
        console.log("Form submitted successfully");
        router.refresh();
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <PageWrapper>
      <BackButton />
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
                value={ratificationVenue}
                onChange={(e) => setRatificationVenue(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RatificationForm;
