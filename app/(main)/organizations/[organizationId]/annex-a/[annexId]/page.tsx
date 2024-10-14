"use client";

import { useState } from "react";

export default function Component() {
  const [objectives, setObjectives] = useState([""]);

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Student Organization General Information Report</h1>

      {/* Organization Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Organization Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name of the Organization</label>
              <input type="text" className="input input-bordered w-full" value="LUMINANCE Jr COLLEGE BAND" disabled />
            </div>
            <div>
              <label className="label">Academic Year of Last Recognition</label>
              <input type="text" className="input input-bordered w-full" value="2022-2023" disabled />
            </div>
            <div>
              <label className="label">Faculty / College / Institute / School Affiliation</label>
              <input type="text" className="input input-bordered w-full" value="College of Science" disabled />
            </div>
            <div>
              <label className="label">Official Email address of the Organization</label>
              <input type="email" className="input input-bordered w-full" value="luminance@ust.edu.ph" disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, and Objectives */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Statement of Mission, Vision, and Objectives</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Mission</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value="To promote music appreciation..."
                disabled
              />
            </div>
            <div>
              <label className="label">Vision</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value="To be the leading college band..."
                disabled
              />
            </div>
            <div>
              <label className="label">Brief Description of the Organization</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value="LUMINANCE Jr COLLEGE BAND is a student-led music ensemble..."
                disabled
              />
            </div>
            <div>
              <label className="label">
                Objectives for AY 2022-2023 - SMART (Specific, Measurable, Attainable, Realistic, Time-bound)
              </label>
              {objectives.map((objective, index) => (
                <input
                  key={index}
                  type="text"
                  className="input input-bordered w-full mb-2"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                />
              ))}
              <button onClick={addObjective} className="btn btn-primary mt-2">
                Add Objective
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Officers' Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Officers' Information</h2>
          <p>Please fill out the officers' information in the designated annex.</p>
          <button className="btn btn-primary">Go to Officers' Information Annex</button>
        </div>
      </div>

      {/* Organization Adviser */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Organization Adviser</h2>
          <p>Please fill out the organization adviser information in the designated annex.</p>
          <button className="btn btn-primary">Go to Organization Adviser Annex</button>
        </div>
      </div>

      {/* Specimen Signatures */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Specimen Signatures</h2>
          <p>List of signatures collected</p>
        </div>
      </div>

      {/* Financial Status */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Financial Status</h2>
          <p>Please fill out the financial status information in the designated annex.</p>
          <button className="btn btn-primary">Go to Financial Status Annex</button>
        </div>
      </div>
    </div>
  );
}
