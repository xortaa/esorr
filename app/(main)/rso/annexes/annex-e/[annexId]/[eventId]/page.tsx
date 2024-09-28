"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { Plus, Trash2 } from "lucide-react";

interface EvaluationRatings {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface EvaluationSummary {
  [key: string]: EvaluationRatings;
}

interface AssessmentCriteria {
  rating: number;
  analysis: string;
  recommendation: string;
}

interface Comment {
  id: string;
  text: string;
}

interface Assessment {
  criteria: {
    [key: string]: AssessmentCriteria;
  };
  comments: Comment[];
  sponsorName: string;
  sponsorshipTypes: string[];
}

interface Recognition {
  title: string;
  awardGivingBody: string;
  dateOfConferment: string;
  type: string;
}

interface EventData {
  title: string;
  date: string;
  venue: string;
  advisers: string;
  timeAttended: { from: string; to: string };
  speakerName: string;
  speakerTopic: string;
  speakerAffiliations: string;
  speakerPosition: string;
  totalParticipants: number;
  totalRespondents: number;
  evaluationSummary: EvaluationSummary;
  assessment: Assessment;
  recognition: Recognition[];
}

const EventDetails = () => {
  const { annexId, eventId } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData>({
    title: "",
    date: "",
    venue: "",
    advisers: "",
    timeAttended: { from: "", to: "" },
    speakerName: "",
    speakerTopic: "",
    speakerAffiliations: "",
    speakerPosition: "",
    totalParticipants: 0,
    totalRespondents: 0,
    evaluationSummary: {
      "Pre-event Publicity": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      Objectives: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      "Program Flow": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      "Organizers/Facilitators": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      "Venue/Online Platform": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      "Time Allotment": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      "Registration/Attendance": { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      Overall: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
    assessment: {
      criteria: {
        "DISSEMINATION OF INFORMATION": { rating: 0, analysis: "", recommendation: "" },
        "PREPARATION TIME": { rating: 0, analysis: "", recommendation: "" },
        "THEME RELEVANCE": { rating: 0, analysis: "", recommendation: "" },
        VENUE: { rating: 0, analysis: "", recommendation: "" },
        "TIME SCHEDULE": { rating: 0, analysis: "", recommendation: "" },
        "PROGRAM FLOW": { rating: 0, analysis: "", recommendation: "" },
        HOSTS: { rating: 0, analysis: "", recommendation: "" },
        "SOCC ASSISTANCE": { rating: 0, analysis: "", recommendation: "" },
        "OVERALL QUALITY OF THE EVENT": { rating: 0, analysis: "", recommendation: "" },
      },
      comments: [],
      sponsorName: "",
      sponsorshipTypes: [],
    },
    recognition: [],
  });

  useEffect(() => {
    // Mock data
    setEvent({
      title: "Sample Event",
      date: "2023-09-01",
      venue: "Main Hall",
      advisers: "John Doe",
      timeAttended: { from: "09:00", to: "17:00" },
      speakerName: "Jane Smith",
      speakerTopic: "Leadership in the Digital Age",
      speakerAffiliations: "Tech Co.",
      speakerPosition: "CEO",
      totalParticipants: 100,
      totalRespondents: 80,
      evaluationSummary: {
        "Pre-event Publicity": { 5: 24, 4: 10, 3: 5, 2: 2, 1: 1 },
        Objectives: { 5: 33, 4: 7, 3: 1, 2: 1, 1: 0 },
        "Program Flow": { 5: 27, 4: 13, 3: 2, 2: 0, 1: 0 },
        "Organizers/Facilitators": { 5: 32, 4: 6, 3: 4, 2: 0, 1: 0 },
        "Venue/Online Platform": { 5: 31, 4: 6, 3: 5, 2: 0, 1: 0 },
        "Time Allotment": { 5: 31, 4: 9, 3: 2, 2: 0, 1: 0 },
        "Registration/Attendance": { 5: 36, 4: 5, 3: 1, 2: 0, 1: 0 },
        Overall: { 5: 28, 4: 11, 3: 2, 2: 1, 1: 0 },
      },
      assessment: {
        criteria: {
          "DISSEMINATION OF INFORMATION": { rating: 4, analysis: "Good", recommendation: "Improve timing" },
          "PREPARATION TIME": { rating: 5, analysis: "Excellent", recommendation: "Maintain current approach" },
          "THEME RELEVANCE": { rating: 4, analysis: "Relevant", recommendation: "Consider more specific themes" },
          VENUE: { rating: 5, analysis: "Perfect location", recommendation: "Book early for future events" },
          "TIME SCHEDULE": { rating: 4, analysis: "Well-planned", recommendation: "Add more breaks" },
          "PROGRAM FLOW": { rating: 4, analysis: "Smooth", recommendation: "Improve transitions" },
          HOSTS: { rating: 5, analysis: "Engaging", recommendation: "Provide additional training" },
          "SOCC ASSISTANCE": { rating: 4, analysis: "Helpful", recommendation: "Increase staff" },
          "OVERALL QUALITY OF THE EVENT": { rating: 4, analysis: "Successful", recommendation: "Fine-tune details" },
        },
        comments: [{ id: "1", text: "Great event overall" }],
        sponsorName: "XYZ Corporation",
        sponsorshipTypes: ["Cash", "Product Launching"],
      },
      recognition: [
        { title: "Best Event", awardGivingBody: "University Board", dateOfConferment: "2023-10-01", type: "Student" },
      ],
    });
  }, [eventId]);

  const updateEvent = (field: keyof EventData, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAssessment = (field: keyof Assessment, value: any) => {
    setEvent((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        [field]: value,
      },
    }));
  };

  const updateCriteria = (criteria: string, field: keyof AssessmentCriteria, value: any) => {
    setEvent((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        criteria: {
          ...prev.assessment.criteria,
          [criteria]: {
            ...prev.assessment.criteria[criteria],
            [field]: value,
          },
        },
      },
    }));
  };

  const updateEvaluationSummary = (criteria: string, rating: keyof EvaluationRatings, value: number) => {
    setEvent((prev) => ({
      ...prev,
      evaluationSummary: {
        ...prev.evaluationSummary,
        [criteria]: {
          ...prev.evaluationSummary[criteria],
          [rating]: value,
        },
      },
    }));
  };

  const updateComments = (comments: Comment[]) => {
    setEvent((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        comments,
      },
    }));
  };

  const criteriaMapping: { [key: string]: string } = {
    "DISSEMINATION OF INFORMATION": "Pre-event Publicity",
    "PREPARATION TIME": "Objectives",
    "THEME RELEVANCE": "Objectives",
    VENUE: "Venue/Online Platform",
    "TIME SCHEDULE": "Time Allotment",
    "PROGRAM FLOW": "Program Flow",
    HOSTS: "Organizers/Facilitators",
    "SOCC ASSISTANCE": "Organizers/Facilitators",
    "OVERALL QUALITY OF THE EVENT": "Overall",
  };

  const calculateAverageRating = (criteria: string): number => {
    const mappedCriteria = criteriaMapping[criteria] || criteria;
    const ratings = event.evaluationSummary[mappedCriteria];
    if (!ratings) {
      console.warn(`No ratings found for criteria: ${mappedCriteria}`);
      return 0;
    }
    const totalResponses = Object.values(ratings).reduce((sum, count) => sum + count, 0);
    const weightedSum = Object.entries(ratings).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0);
    return totalResponses > 0 ? Math.round((weightedSum / totalResponses) * 10) / 10 : 0;
  };

  const handleSave = () => {
    // Save event details here
    console.log("Saving event:", event);
    router.push(`/rso/annexes/annex-e/${annexId}`);
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6 text-center">Event Details</h1>
      <div className="space-y-8">
        <EventEvaluationForm event={event} updateEvent={updateEvent} />
        <EvaluationSummaryTable event={event} updateEvaluationSummary={updateEvaluationSummary} />
        <EventAssessmentForm
          event={event}
          updateAssessment={updateAssessment}
          updateCriteria={updateCriteria}
          calculateAverageRating={calculateAverageRating}
          updateComments={updateComments}
        />
        <RecognitionForm event={event} updateEvent={updateEvent} />
        <div className="flex justify-between">
          <Link href={`/rso/annexes/annex-e/${annexId}`} className="btn btn-secondary">
            Back to List
          </Link>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

const EventEvaluationForm: React.FC<{
  event: EventData;
  updateEvent: (field: keyof EventData, value: any) => void;
}> = ({ event, updateEvent }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Event Evaluation</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={event.date}
          onChange={(e) => updateEvent("date", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Venue</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.venue}
          onChange={(e) => updateEvent("venue", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name of Adviser/s</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.advisers}
          onChange={(e) => updateEvent("advisers", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Time Attended</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="time"
            className="input input-bordered w-1/2"
            value={event.timeAttended.from}
            onChange={(e) => updateEvent("timeAttended", { ...event.timeAttended, from: e.target.value })}
          />
          <input
            type="time"
            className="input input-bordered w-1/2"
            value={event.timeAttended.to}
            onChange={(e) => updateEvent("timeAttended", { ...event.timeAttended, to: e.target.value })}
          />
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Speaker's Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.speakerName}
          onChange={(e) => updateEvent("speakerName", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Topic</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.speakerTopic}
          onChange={(e) => updateEvent("speakerTopic", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Affiliation/s</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.speakerAffiliations}
          onChange={(e) => updateEvent("speakerAffiliations", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Position</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.speakerPosition}
          onChange={(e) => updateEvent("speakerPosition", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Total number of participants</span>
        </label>
        <input
          type="number"
          className="input input-bordered"
          value={event.totalParticipants}
          onChange={(e) => updateEvent("totalParticipants", parseInt(e.target.value))}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Total number of respondents</span>
        </label>
        <input
          type="number"
          className="input input-bordered"
          value={event.totalRespondents}
          onChange={(e) => updateEvent("totalRespondents", parseInt(e.target.value))}
        />
      </div>
    </div>
  </div>
);

const EvaluationSummaryTable: React.FC<{
  event: EventData;
  updateEvaluationSummary: (criteria: string, rating: keyof EvaluationRatings, value: number) => void;
}> = ({ event, updateEvaluationSummary }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Evaluation Summary</h2>
    <table className="table table-xs w-full">
      <thead>
        <tr>
          <th>Criteria</th>
          <th>Excellent (5)</th>
          <th>Very Good (4)</th>
          <th>Good (3)</th>
          <th>Fair (2)</th>
          <th>Needs Improvement (1)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(event.evaluationSummary).map(([criteria, ratings]) => (
          <tr key={criteria}>
            <td>{criteria}</td>
            {[5, 4, 3, 2, 1].map((rating) => (
              <td key={rating}>
                <input
                  type="number"
                  className="input input-bordered text-xs w-full"
                  value={ratings[rating as keyof EvaluationRatings]}
                  onChange={(e) =>
                    updateEvaluationSummary(criteria, rating as keyof EvaluationRatings, parseInt(e.target.value) || 0)
                  }
                  min="0"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EventAssessmentForm: React.FC<{
  event: EventData;
  updateAssessment: (field: keyof Assessment, value: any) => void;
  updateCriteria: (criteria: string, field: keyof AssessmentCriteria, value: any) => void;
  calculateAverageRating: (criteria: string) => number;
  updateComments: (comments: Comment[]) => void;
}> = ({ event, updateAssessment, updateCriteria, calculateAverageRating, updateComments }) => {
  const addComment = () => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: "",
    };
    updateComments([...event.assessment.comments, newComment]);
  };

  const removeComment = (id: string) => {
    const updatedComments = event.assessment.comments.filter((comment) => comment.id !== id);
    updateComments(updatedComments);
  };

  const updateCommentText = (id: string, text: string) => {
    const updatedComments = event.assessment.comments.map((comment) =>
      comment.id === id ? { ...comment, text } : comment
    );
    updateComments(updatedComments);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Event Assessment</h2>
      <table className="table table-xs w-full">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Rating (1-5)</th>
            <th>Analysis</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(event.assessment.criteria).map(([criteria, value]) => {
            const averageRating = calculateAverageRating(criteria);
            return (
              <tr key={criteria}>
                <td>{criteria}</td>
                <td>
                  <p>{averageRating}</p>
                </td>
                <td>
                  <input
                    type="text"
                    className="input input-bordered w-full text-xs"
                    value={value.analysis}
                    onChange={(e) => updateCriteria(criteria, "analysis", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="input input-bordered w-full text-xs"
                    value={value.recommendation}
                    onChange={(e) => updateCriteria(criteria, "recommendation", e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Comments and Suggestions of Participants, Members, and Attendees (Verbatim)
          </span>
        </label>
        <div className="space-y-2">
          {event.assessment.comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2">
              <textarea
                className="textarea textarea-bordered flex-grow"
                value={comment.text}
                onChange={(e) => updateCommentText(comment.id, e.target.value)}
                placeholder="Enter comment or suggestion"
              ></textarea>
              <button className="btn btn-square btn-sm" onClick={() => removeComment(comment.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button className="btn btn-primary btn-sm" onClick={addComment}>
            <Plus size={16} className="mr-2" /> Add Comment
          </button>
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Sponsor's Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={event.assessment.sponsorName}
          onChange={(e) => updateAssessment("sponsorName", e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Type of Sponsorship</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {["Cash", "Deals", "Booth", "Product Launching", "Flyers", "Discount Coupon"].map((type) => (
            <label key={type} className="label cursor-pointer">
              <span className="label-text mr-2">{type}</span>
              <input
                type="checkbox"
                className="checkbox"
                checked={event.assessment.sponsorshipTypes.includes(type)}
                onChange={(e) => {
                  const updatedTypes = e.target.checked
                    ? [...event.assessment.sponsorshipTypes, type]
                    : event.assessment.sponsorshipTypes.filter((t) => t !== type);
                  updateAssessment("sponsorshipTypes", updatedTypes);
                }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecognitionForm: React.FC<{
  event: EventData;
  updateEvent: (field: keyof EventData, value: any) => void;
}> = ({ event, updateEvent }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Recognition of Organizational Excellence</h2>
    <p className="text-sm">
      Did your organization receive any recognition from award-giving entities inside and outside the university? Did
      your organization represent the University or country with distinction in international conferences or congresses,
      of major religious, socio-cultural, educational or athletic importance?
    </p>
    <table className="table table-xs w-full">
      <thead>
        <tr>
          <th>Title of Award</th>
          <th>Award Giving Body</th>
          <th>Date of Conferment</th>
          <th>Recognition Type</th>
        </tr>
      </thead>
      <tbody>
        {event.recognition.map((award, index) => (
          <tr key={index}>
            <td>
              <input
                type="text"
                className="input input-bordered w-full text-xs"
                value={award.title}
                onChange={(e) => {
                  const updatedRecognition = [...event.recognition];
                  updatedRecognition[index].title = e.target.value;
                  updateEvent("recognition", updatedRecognition);
                }}
              />
            </td>
            <td>
              <input
                type="text"
                className="input input-bordered w-full text-xs"
                value={award.awardGivingBody}
                onChange={(e) => {
                  const updatedRecognition = [...event.recognition];
                  updatedRecognition[index].awardGivingBody = e.target.value;
                  updateEvent("recognition", updatedRecognition);
                }}
              />
            </td>
            <td>
              <input
                type="date"
                className="input input-bordered w-full text-xs"
                value={award.dateOfConferment}
                onChange={(e) => {
                  const updatedRecognition = [...event.recognition];
                  updatedRecognition[index].dateOfConferment = e.target.value;
                  updateEvent("recognition", updatedRecognition);
                }}
              />
            </td>
            <td>
              <select
                className="select select-bordered w-full"
                value={award.type}
                onChange={(e) => {
                  const updatedRecognition = [...event.recognition];
                  updatedRecognition[index].type = e.target.value;
                  updateEvent("recognition", updatedRecognition);
                }}
              >
                <option value="Student">Student</option>
                <option value="Regional">Regional</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      className="btn btn-primary"
      onClick={() =>
        updateEvent("recognition", [
          ...event.recognition,
          { title: "", awardGivingBody: "", dateOfConferment: "", type: "Student" },
        ])
      }
    >
      Add Recognition
    </button>
  </div>
);

export default EventDetails;
