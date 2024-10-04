"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";

interface AssessmentItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
}

const assessmentItems: AssessmentItem[] = [
  {
    id: "1.1",
    category: "1. Servant Leadership",
    subcategory: "1.1",
    description: "Exhibited responsible decision-making and personal accountability",
  },
  {
    id: "1.2",
    category: "1. Servant Leadership",
    subcategory: "1.2",
    description: "Modeled a wide range of Christian leadership skills and abilities",
  },
  {
    id: "1.3",
    category: "1. Servant Leadership",
    subcategory: "1.3",
    description: "Conducted respectful dialogue with advisers and members",
  },
  { id: "2.1", category: "2. Operational Plan", subcategory: "2.1", description: "Adhered to the operational plan" },
  {
    id: "2.2",
    category: "2. Operational Plan",
    subcategory: "2.2",
    description: "Demonstrated commitment to best practices in all program programming",
  },
  {
    id: "3.1",
    category: "3. Constituent Focus",
    subcategory: "3.1",
    description: "Committed to support the UST Strategic Plan and the Sustainable Development Goals",
  },
  {
    id: "3.2",
    category: "3. Constituent Focus",
    subcategory: "3.2",
    description: "Demonstrated understanding of knowledge for optimal programming and diversity issues",
  },
  {
    id: "4.1",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.1",
    description: "Used appropriate evaluation assessment tools for every program/activity conducted",
  },
  {
    id: "4.2",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.2",
    description:
      "Disseminated/utilized evaluation assessment results for continuous improvement and/or research activities",
  },
  {
    id: "4.3",
    category: "4. Monitoring and Evaluation",
    subcategory: "4.3",
    description:
      "Complied with pre and post activity requirements within reasonable time (approval of SOAR, submission, post evaluation, etc.)",
  },
  {
    id: "5.1",
    category: "5. Membership and Organization Climate",
    subcategory: "5.1",
    description: "Modeled the Thomasian identity when serving as an organization representative",
  },
  {
    id: "5.2",
    category: "5. Membership and Organization Climate",
    subcategory: "5.2",
    description: "Built group dynamics and effective teamwork",
  },
  {
    id: "5.3",
    category: "5. Membership and Organization Climate",
    subcategory: "5.3",
    description: "Demonstrated adherence to the student code of conduct and discipline (SCD)",
  },
  {
    id: "6.1",
    category: "6. Personal and Social and Community Service",
    subcategory: "6.1",
    description:
      "Modeled academic integrity and professional attitudes in order to reach the student body in unique ways",
  },
  {
    id: "6.2",
    category: "6. Personal and Social and Community Service",
    subcategory: "6.2",
    description:
      "Assisted in creatively impacting the UST campus community by creating opportunities that foster safe, quality programs/ projects/activities that build community",
  },
  {
    id: "7.1",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1",
    description:
      "Conducted activities that showcase the Thomasian Graduate Attributes (21st century skills) such as, but not limited to:",
  },
  { id: "7.1.1", category: "7. Outcomes and Achievements", subcategory: "7.1.1", description: "Servant Leadership" },
  {
    id: "7.1.2",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.2",
    description: "Effective Communicator and Collaborator",
  },
  {
    id: "7.1.3",
    category: "7. Outcomes and Achievements",
    subcategory: "7.1.3",
    description: "Analytical and Creative Thinker",
  },
  { id: "7.1.4", category: "7. Outcomes and Achievements", subcategory: "7.1.4", description: "Lifelong Learner" },
  {
    id: "7.2",
    category: "7. Outcomes and Achievements",
    subcategory: "7.2",
    description: "Recognitions of exemplifying work",
  },
];

export default function AnnexE3Form() {
  const [assessmentData, setAssessmentData] = useState<Record<string, { rating: string; comment: string }>>({});

  const handleInputChange = (id: string, field: "rating" | "comment", value: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", assessmentData);
    // Here you would typically send the data to your backend
  };

  return (
    <PageWrapper>
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
                      .map((subItem) => (
                        <div key={subItem.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          <div className="md:col-span-2">
                            <p>
                              <span className="font-bold">{subItem.subcategory}</span> {subItem.description}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={assessmentData[subItem.id]?.rating || ""}
                              onChange={(e) => handleInputChange(subItem.id, "rating", e.target.value)}
                              className="input input-bordered w-full"
                              placeholder="Rating"
                            />
                            <textarea
                              value={assessmentData[subItem.id]?.comment || ""}
                              onChange={(e) => handleInputChange(subItem.id, "comment", e.target.value)}
                              className="textarea textarea-bordered w-full h-24"
                              placeholder="Comments"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            }
            return acc;
          }, [])}
          <div className="bg-base-100 p-6 rounded-lg shadow-lg border-l-4 border-primary">
            <h2 className="text-2xl font-bold mb-4 text-primary">Further Comments</h2>
            <textarea
              value={assessmentData["furtherComments"]?.comment || ""}
              onChange={(e) => handleInputChange("furtherComments", "comment", e.target.value)}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Add any additional comments here..."
            />
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="btn btn-primary btn-lg">
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
