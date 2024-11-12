"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Delete, Save, ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageWrapper from "@/components/PageWrapper";

type Activity = {
  _id?: string;
  id: string;
  term: string;
  keyUnitActivity: string;
  targetDateRange: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const organizationId = params.organizationId as string;
  const annexId = params.annexId as string;

  useEffect(() => {
    fetchActivities();
  }, [organizationId, annexId]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-f/${annexId}/activities`);
      const activities = response.data;

      const newTerms = [
        { name: "First Term", activities: [] },
        { name: "Second Term", activities: [] },
        { name: "Special Term", activities: [] },
      ];

      activities.forEach((activity: Activity) => {
        const termIndex = newTerms.findIndex((term) => term.name === activity.term);
        if (termIndex !== -1) {
          newTerms[termIndex].activities.push({
            ...activity,
            id: activity._id || activity.id,
            isOpen: false,
            actualDateAccomplished: activity.actualDateAccomplished
              ? new Date(activity.actualDateAccomplished).toISOString().split("T")[0]
              : "",
          });
        }
      });

      setTerms(newTerms);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addActivity = (termIndex: number) => {
    const newTerms = [...terms];
    const newActivity: Activity = {
      id: `temp_${Date.now().toString()}`,
      term: terms[termIndex].name,
      keyUnitActivity: "",
      targetDateRange: "",
      actualDateAccomplished: "",
      postEventEvaluation: "",
      interpretation: "",
      isOpen: true,
    };
    newTerms[termIndex].activities.push(newActivity);
    setTerms(newTerms);
  };

  const removeActivity = async (termIndex: number, activityIndex: number) => {
    const activity = terms[termIndex].activities[activityIndex];
    if (!activity.id.startsWith("temp_")) {
      try {
        await axios.delete(`/api/annexes/${organizationId}/annex-f/${annexId}/activities/${activity.id}`);
        alert("Activity deleted successfully!");
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Failed to delete activity. Please try again.");
        return;
      }
    }

    const newTerms = [...terms];
    newTerms[termIndex].activities.splice(activityIndex, 1);
    setTerms(newTerms);
  };

  const updateActivity = (termIndex: number, activityIndex: number, field: keyof Activity, value: string | boolean) => {
    const newTerms = [...terms];
    if (field === "actualDateAccomplished" && typeof value === "string") {
      newTerms[termIndex].activities[activityIndex][field] = value ? new Date(value).toISOString().split("T")[0] : "";
    } else if (field === "postEventEvaluation" && typeof value === "string") {
      const rating = parseFloat(value);
      newTerms[termIndex].activities[activityIndex][field] = value;
      newTerms[termIndex].activities[activityIndex].interpretation = getInterpretation(rating);
    } else {
      newTerms[termIndex].activities[activityIndex][field] = value as never;
    }
    setTerms(newTerms);
  };

  const getInterpretation = (rating: number): string => {
    if (rating >= 4.5) return "EXCELLENT";
    if (rating >= 3.5) return "VERY GOOD";
    if (rating >= 2.5) return "GOOD";
    if (rating >= 1.5) return "FAIR";
    return "NEEDS IMPROVEMENT";
  };

  const toggleActivityOpen = (termIndex: number, activityIndex: number) => {
    updateActivity(termIndex, activityIndex, "isOpen", !terms[termIndex].activities[activityIndex].isOpen);
  };

  const saveActivity = async (termIndex: number, activityIndex: number) => {
    setIsSaving(true);
    const activity = terms[termIndex].activities[activityIndex];
    try {
      const activityData = {
        ...activity,
        actualDateAccomplished: activity.actualDateAccomplished
          ? new Date(activity.actualDateAccomplished).toISOString()
          : null,
      };

      let savedActivity;
      if (activity.id.startsWith("temp_")) {
        const response = await axios.post(`/api/annexes/${organizationId}/annex-f/${annexId}/activities`, activityData);
        savedActivity = response.data;
      } else {
        const response = await axios.put(
          `/api/annexes/${organizationId}/annex-f/${annexId}/activities/${activity.id}`,
          activityData
        );
        savedActivity = response.data;
      }

      const newTerms = [...terms];
      newTerms[termIndex].activities[activityIndex] = {
        ...savedActivity,
        id: savedActivity._id || savedActivity.id,
        isOpen: true,
        actualDateAccomplished: savedActivity.actualDateAccomplished
          ? new Date(savedActivity.actualDateAccomplished).toISOString().split("T")[0]
          : "",
      };
      setTerms(newTerms);
      alert("Activity saved successfully!");
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Failed to save activity. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Activities Monitoring Form Creator</h1>
      <form className="space-y-8">
        {terms.map((term, termIndex) => (
          <div key={term.name} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">{term.name}</h2>
              <div className="space-y-4">
                {term.activities.map((activity, activityIndex) => (
                  <div key={activity.id} className="border rounded-lg">
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-lg font-medium">
                        Activity {activityIndex + 1}: {activity.keyUnitActivity || "Untitled"}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeActivity(termIndex, activityIndex)}
                        >
                          <Delete className="h-4 w-4" />
                          <span className="sr-only">Remove activity</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => toggleActivityOpen(termIndex, activityIndex)}
                        >
                          {activity.isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <span className="sr-only">{activity.isOpen ? "Collapse" : "Expand"}</span>
                        </button>
                      </div>
                    </div>
                    {activity.isOpen && (
                      <div className="p-4 border-t">
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
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`targetDateRange-${activity.id}`}>
                            <span className="label-text">Target Date Range</span>
                          </label>
                          <input
                            type="text"
                            id={`targetDateRange-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.targetDateRange}
                            onChange={(e) =>
                              updateActivity(termIndex, activityIndex, "targetDateRange", e.target.value)
                            }
                            placeholder="e.g., August 2023 - October 2024"
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
                            value={activity.actualDateAccomplished || ""}
                            onChange={(e) =>
                              updateActivity(termIndex, activityIndex, "actualDateAccomplished", e.target.value)
                            }
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`postEventEvaluation-${activity.id}`}>
                            <span className="label-text">Post Event Evaluation (Mean Rating)</span>
                          </label>
                          <input
                            type="number"
                            id={`postEventEvaluation-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.postEventEvaluation}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (value <= 5) {
                                updateActivity(termIndex, activityIndex, "postEventEvaluation", value.toString());
                              } else {
                                // If the value is greater than 5, set it to 5
                                updateActivity(termIndex, activityIndex, "postEventEvaluation", "5");
                              }
                            }}
                            min="0"
                            max="5"
                            step="0.001"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor={`interpretation-${activity.id}`}>
                            <span className="label-text">Interpretation</span>
                          </label>
                          <input
                            type="text"
                            id={`interpretation-${activity.id}`}
                            className="input input-bordered w-full"
                            value={activity.interpretation}
                            readOnly
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary mt-4"
                          onClick={() => saveActivity(termIndex, activityIndex)}
                          disabled={isSaving}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Activity"}
                        </button>
                      </div>
                    )}
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
      </form>
    </PageWrapper>
  );
}
