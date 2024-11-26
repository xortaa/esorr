"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

interface AssessmentItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
}

const assessmentItems: AssessmentItem[] = [
  {
    id: "servantLeadership.1",
    category: "1. Servant Leadership",
    subcategory: "1.1",
    description: "Exhibited responsible decision-making and personal accountability",
  },
  {
    id: "servantLeadership.2",
    category: "1. Servant Leadership",
    subcategory: "1.2",
    description: "Modeled a wide range of Christian leadership skills and abilities",
  },
  {
    id: "servantLeadership.3",
    category: "1. Servant Leadership",
    subcategory: "1.3",
    description: "Conducted respectful dialogue with advisers and members",
  },
  {
    id: "operationalPlan.1",
    category: "2. Operational Plan",
    subcategory: "2.1",
    description: "Adhered to the operational plan",
  },
  {
    id: "operationalPlan.2",
    category: "2. Operational Plan",
    subcategory: "2.2",
    description: "Demonstrated commitment to best practices in all program programming",
  },
  {
    id: "constituentFocus.1",
    category: "3. Constituent Focus",
    subcategory: "3.1",
    description: "Committed to support the UST Strategic Plan and the Sustainable Development Goals",
  },
  {
    id: "constituentFocus.2",
    category: "3. Constituent Focus",
    subcategory: "3.2",
    description: "Demonstrated understanding of knowledge for optimal programming and diversity issues",
  },
  {
    id: "monitoringAndEvaluation.1",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.1",
    description: "Used appropriate evaluation assessment tools for every program/activity conducted",
  },
  {
    id: "monitoringAndEvaluation.2",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.2",
    description:
      "Disseminated/utilized evaluation assessment results for continuous improvement and/or research activities",
  },
  {
    id: "monitoringAndEvaluation.3",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.3",
    description:
      "Complied with pre and post activity requirements within reasonable time (approval of SOAR, submission, post evaluation, etc.)",
  },
  {
    id: "membershipAndOrganizationClimate.1",
    category: "5. Membership and Organization Climate",
    subcategory: "5.1",
    description: "Modeled the Thomasian identity when serving as an organization representative",
  },
  {
    id: "membershipAndOrganizationClimate.2",
    category: "5. Membership and Organization Climate",
    subcategory: "5.2",
    description: "Built group dynamics and effective teamwork",
  },
  {
    id: "membershipAndOrganizationClimate.3",
    category: "5. Membership and Organization Climate",
    subcategory: "5.3",
    description: "Demonstrated adherence to the student code of conduct and discipline (SCD)",
  },
  {
    id: "personalAndSocialAndCommunityService.1",
    category: "6. Personal and Social and Community Service",
    subcategory: "6.1",
    description:
      "Modeled academic integrity and professional attitudes in order to reach the student body in unique ways",
  },
  {
    id: "personalAndSocialAndCommunityService.2",
    category: "6. Personal and Social and Community Service",
    subcategory: "6.2",
    description:
      "Assisted in creatively impacting the UST campus community by creating opportunities that foster safe, quality programs/ projects/activities that build community",
  },
  {
    id: "outcomesAndAchievements.1",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1",
    description:
      "Conducted activities that showcase the Thomasian Graduate Attributes (21st century skills) such as, but not limited to:",
  },
  {
    id: "outcomesAndAchievements.2",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.1",
    description: "Servant Leadership",
  },
  {
    id: "outcomesAndAchievements.3",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.2",
    description: "Effective Communicator and Collaborator",
  },
  {
    id: "outcomesAndAchievements.4",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.3",
    description: "Analytical and Creative Thinker",
  },
  {
    id: "outcomesAndAchievements.5",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.4",
    description: "Lifelong Learner",
  },
  {
    id: "outcomesAndAchievements.6",
    category: "7. Outcomes and Achievements",
    subcategory: "7.2",
    description: "Recognitions of exemplifying work",
  },
];

export default function AnnexE3Form() {
  const { organizationId, annexId } = useParams();
  const [assessmentData, setAssessmentData] = useState<
    Record<string, Record<string, { rating: number; comment: string }>>
  >({});
  const [furtherComments, setFurtherComments] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-e3/${annexId}/pasoc`);
        const data = response.data;
        setAssessmentData(data);
        setFurtherComments(data.furtherComments || "");
      } catch (error) {
        console.error("Error fetching PASOC data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId, annexId]);

  const handleInputChange = (id: string, field: "rating" | "comment", value: string | number) => {
    const [category, subKey] = id.split(".");
    setAssessmentData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subKey]: {
          ...prev[category]?.[subKey],
          [field]: field === "rating" ? Number(value) : value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...assessmentData,
      furtherComments,
    };

    try {
      console.log("Data being submitted:", dataToSubmit);
      const response = await axios.put(`/api/annexes/${organizationId}/annex-e3/${annexId}/pasoc`, dataToSubmit);
      setAssessmentData(response.data);
      alert("Assessment saved successfully!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Error saving assessment. Please try again.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackButton />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Annex E3: Performance Assessment of Student Organizations/Councils (PASOC)
        </h1>
        <div className="overflow-x-auto mb-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary text-primary-content text-center">5 (Outstanding)</th>
                <th className="bg-primary text-primary-content text-center">4 (Very Good)</th>
                <th className="bg-primary text-primary-content text-center">3 (Good)</th>
                <th className="bg-primary text-primary-content text-center">2 (Fair)</th>
                <th className="bg-primary text-primary-content text-center">1 (Poor)</th>
                <th className="bg-primary text-primary-content text-center">0- Missing or Write Comments</th>
              </tr>
            </thead>
          </table>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {assessmentItems.reduce((acc: JSX.Element[], item, index, array) => {
            if (index === 0 || item.category !== array[index - 1].category) {
              acc.push(
                <div
                  key={item.category}
                  className="bg-base-100 p-6 rounded-lg shadow-lg mb-8 border-l-4 border-primary"
                >
                  <h2 className="text-2xl font-bold mb-4 text-primary">{item.category}</h2>
                  <div className="space-y-6">
                    {array
                      .filter((subItem) => subItem.category === item.category)
                      .map((subItem) => {
                        const [category, subKey] = subItem.id.split(".");
                        return (
                          <div key={subItem.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-2">
                              <p>
                                <span className="font-bold">{subItem.subcategory}</span> {subItem.description}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="font-medium text-sm">Rating:</label>
                              <div className="flex flex-wrap gap-2">
                                {[0, 1, 2, 3, 4, 5].map((rating) => (
                                  <label key={rating} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`rating-${subItem.id}`}
                                      value={rating}
                                      checked={assessmentData[category]?.[subKey]?.rating === rating}
                                      onChange={(e) => handleInputChange(subItem.id, "rating", e.target.value)}
                                      className="radio radio-primary"
                                    />
                                    <span>{rating}</span>
                                  </label>
                                ))}
                              </div>
                              <textarea
                                value={assessmentData[category]?.[subKey]?.comment || ""}
                                onChange={(e) => handleInputChange(subItem.id, "comment", e.target.value)}
                                className="textarea textarea-bordered w-full h-24"
                                placeholder="Comments"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }
            return acc;
          }, [])}
          <div className="bg-base-100 p-6 rounded-lg shadow-lg border-l-4 border-primary">
            <h2 className="text-2xl font-bold mb-4 text-primary">Further Comments</h2>
            <textarea
              value={furtherComments}
              onChange={(e) => setFurtherComments(e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Add any additional comments here..."
            />
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="btn btn-primary btn-lg">
              Save Assessment
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
