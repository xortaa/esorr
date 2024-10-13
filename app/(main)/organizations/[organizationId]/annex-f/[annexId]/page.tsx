"use client";

import { useState } from "react";
import { PlusCircle, Delete, Save, ChevronDown, ChevronUp } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Activity = {
  id: string;
  term: string;
  keyUnitActivity: string;
  targetDate: string;
  actualDateAccomplished: string;
  postEventEvaluation: string;
  interpretation: string;
  isOpen: boolean;
};

type Term = {
  name: string;
  activities: Activity[];
};

export default function ActivitiesFormCreator() {
  const [terms, setTerms] = useState<Term[]>([
    { name: "First Term", activities: [] },
    { name: "Second Term", activities: [] },
    { name: "Special Term", activities: [] },
  ]);
  const [showTable, setShowTable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const addActivity = (termIndex: number) => {
    const newTerms = [...terms];
    const newActivity: Activity = {
      id: Date.now().toString(),
      term: terms[termIndex].name,
      keyUnitActivity: "",
      targetDate: "",
      actualDateAccomplished: "",
      postEventEvaluation: "",
      interpretation: "",
      isOpen: true,
    };
    newTerms[termIndex].activities.push(newActivity);
    setTerms(newTerms);
  };

  const removeActivity = (termIndex: number, activityIndex: number) => {
    const newTerms = [...terms];
    newTerms[termIndex].activities.splice(activityIndex, 1);
    setTerms(newTerms);
  };

  const updateActivity = (termIndex: number, activityIndex: number, field: keyof Activity, value: string | boolean) => {
    const newTerms = [...terms];
    newTerms[termIndex].activities[activityIndex][field] = value as never;
    setTerms(newTerms);
  };

  const toggleActivityOpen = (termIndex: number, activityIndex: number) => {
    updateActivity(termIndex, activityIndex, "isOpen", !terms[termIndex].activities[activityIndex].isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", terms);
    // Here you would typically send the data to your backend
  };

  const allActivities = terms.flatMap((term) => term.activities);

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Draft saved:", terms);
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
      <h1 className="text-2xl font-bold mb-4">Activities Monitoring Form Creator</h1>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowTable(!showTable)}>
          {showTable ? "Show Form" : "Show Table"}
        </button>
      </div>
      {showTable ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Term</th>
                <th>Key Unit Activity</th>
                <th>Target Date</th>
                <th>Actual Date Accomplished</th>
                <th>Post Event Evaluation</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {allActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.term}</td>
                  <td>{activity.keyUnitActivity}</td>
                  <td>{activity.targetDate}</td>
                  <td>{activity.actualDateAccomplished}</td>
                  <td>{activity.postEventEvaluation}</td>
                  <td>{activity.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {terms.map((term, termIndex) => (
            <div key={term.name} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title">{term.name}</h2>
                <div className="space-y-4">
                  {term.activities.map((activity, activityIndex) => (
                    <div key={activity.id} className="collapse collapse-arrow border">
                      <input
                        type="checkbox"
                        checked={activity.isOpen}
                        onChange={() => toggleActivityOpen(termIndex, activityIndex)}
                      />
                      <div className="collapse-title text-xl font-medium flex justify-between items-center">
                        <span>
                          Activity {activityIndex + 1}: {activity.keyUnitActivity || "Untitled"}
                        </span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeActivity(termIndex, activityIndex)}
                        >
                          <Delete className="h-4 w-4" />
                          <span className="sr-only">Remove activity</span>
                        </button>
                      </div>
                      <div className="collapse-content">
                        <div className="form-control">
                          <label className="label" htmlFor={`keyUnitActivity-${activity.id}`}>
                            <span className="label-text">Key Unit Activity</span>
                          </label>
                          <input
                            type="text"
                            id={`keyUnitActivity-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.keyUnitActivity}
                            onChange={(e) =>
                              updateActivity(termIndex, activityIndex, "keyUnitActivity", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`targetDate-${activity.id}`}>
                            <span className="label-text">Target Date Range</span>
                          </label>
                          <input
                            type="text"
                            id={`targetDate-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.targetDate}
                            onChange={(e) => updateActivity(termIndex, activityIndex, "targetDate", e.target.value)}
                            placeholder="e.g., August 2023 - October 2024"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`actualDateAccomplished-${activity.id}`}>
                            <span className="label-text">Actual Date Accomplished</span>
                          </label>
                          <input
                            type="date"
                            id={`actualDateAccomplished-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.actualDateAccomplished}
                            onChange={(e) =>
                              updateActivity(termIndex, activityIndex, "actualDateAccomplished", e.target.value)
                            }
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`postEventEvaluation-${activity.id}`}>
                            <span className="label-text">Post Event Evaluation (Mean Rating)</span>
                          </label>
                          <select
                            id={`postEventEvaluation-${activity.id}`}
                            className="select select-bordered w-full"
                            value={activity.postEventEvaluation}
                            onChange={(e) =>
                              updateActivity(termIndex, activityIndex, "postEventEvaluation", e.target.value)
                            }
                          >
                            <option value="">Select a rating</option>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <option key={rating} value={rating.toString()}>
                                {rating}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`interpretation-${activity.id}`}>
                            <span className="label-text">Interpretation</span>
                          </label>
                          <textarea
                            id={`interpretation-${activity.id}`}
                            className="textarea textarea-bordered h-24"
                            value={activity.interpretation}
                            onChange={(e) => updateActivity(termIndex, activityIndex, "interpretation", e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-primary" onClick={() => addActivity(termIndex)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Activity
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={saveDraft} className="fixed btn btn-neutral bottom-4 right-4 px-16" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
        </form>
      )}
    </PageWrapper>
  );
}
