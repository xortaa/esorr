"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import BackButton from "@/components/BackButton";

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
}

interface EventData {
  title: string;
  eReserveNumber: string;
  date: string | null;
  venue: string;
  adviser: string;
  timeAttended?: { from: string; to: string };
  speakerName: string;
  speakerTopic: string;
  speakerAffiliation: string;
  speakerPosition: string;
  totalParticipants: number;
  totalRespondents: number;
  evaluationSummary: EvaluationSummary;
  assessment: Assessment;
  comments: Comment[];
  sponsorName: string;
  sponsorshipTypes: string[];
  projectProposalForm: string[];
  actualAnsweredEvaluationForms: string[];
  shortWriteUp: string[];
  picturesOfEvent: string[];
}

interface FileToUpload {
  file: File;
  fileType: string;
}

const defaultEvaluationRatings: EvaluationRatings = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};

const EventDetails = () => {
  const { organizationId, annexId, eventId } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData>({
    title: "",
    eReserveNumber: "",
    date: null,
    venue: "",
    adviser: "",
    timeAttended: { from: "", to: "" },
    speakerName: "",
    speakerTopic: "",
    speakerAffiliation: "",
    speakerPosition: "",
    totalParticipants: 0,
    totalRespondents: 0,
    evaluationSummary: {},
    assessment: {
      criteria: {},
    },
    comments: [],
    sponsorName: "",
    sponsorshipTypes: [],
    projectProposalForm: [],
    actualAnsweredEvaluationForms: [],
    shortWriteUp: [],
    picturesOfEvent: [],
  });
  const [newCriteria, setNewCriteria] = useState("");
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `/api/annexes/${organizationId}/annex-e/${annexId}/operational-assessment/${annexId}/event/${eventId}`
      );
      const data = response.data;
      const formattedDate = data.date ? new Date(data.date).toISOString().split("T")[0] : null;
      setEvent((prevEvent) => ({
        ...prevEvent,
        ...data,
        date: formattedDate,
        evaluationSummary: data.evaluationSummary || {},
        assessment: {
          ...prevEvent.assessment,
          ...data.assessment,
          criteria: data.assessment?.criteria || {},
        },
        comments: data.comments || [],
        sponsorName: data.sponsorName || "",
        sponsorshipTypes: data.sponsorshipTypes || [],
        projectProposalForm: data.projectProposalForm || [],
        actualAnsweredEvaluationForms: data.actualAnsweredEvaluationForms || [],
        shortWriteUp: data.shortWriteUp || [],
        picturesOfEvent: data.picturesOfEvent || [],
      }));
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const updateEvent = (field: keyof EventData, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: field === "timeAttended" && !prev.timeAttended ? { from: "", to: "", ...value } : value,
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
    updateAssessmentRating(criteria);
  };

  const updateComments = (comments: Comment[]) => {
    setEvent((prev) => ({
      ...prev,
      comments,
    }));
  };

  const addNewCriteria = () => {
    if (newCriteria && !event.evaluationSummary[newCriteria]) {
      setEvent((prev) => ({
        ...prev,
        evaluationSummary: {
          ...prev.evaluationSummary,
          [newCriteria]: { ...defaultEvaluationRatings },
        },
        assessment: {
          ...prev.assessment,
          criteria: {
            ...prev.assessment.criteria,
            [newCriteria]: { rating: 0, analysis: "", recommendation: "" },
          },
        },
      }));
      setNewCriteria("");
    }
  };

  const calculateAverageRating = (criteria: string): number => {
    const ratings = event.evaluationSummary[criteria];
    if (!ratings) {
      return 0;
    }
    const totalResponses = Object.values(ratings).reduce((sum, count) => sum + count, 0);
    const weightedSum = Object.entries(ratings).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0);
    return totalResponses > 0 ? Math.round((weightedSum / totalResponses) * 10) / 10 : 0;
  };

  const updateAssessmentRating = (criteria: string) => {
    const averageRating = calculateAverageRating(criteria);
    updateCriteria(criteria, "rating", averageRating);

    setEvent((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        criteria: {
          ...prev.assessment.criteria,
          [criteria]: {
            ...prev.assessment.criteria[criteria],
            rating: averageRating,
          },
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Upload files
      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (fileToUpload) => {
          const formData = new FormData();
          formData.append("file", fileToUpload.file);
          formData.append("fileType", fileToUpload.fileType);

          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Upload failed: ${errorData.message || "Unknown error"}`);
          }

          const data = await response.json();
          return { url: data.url, fileType: fileToUpload.fileType };
        })
      );

      // Update event with new file URLs
      const updatedEvent = {
        ...event,
        projectProposalForm: [
          ...event.projectProposalForm,
          ...uploadedFiles.filter((file) => file.fileType === "projectProposalForm").map((file) => file.url),
        ],
        actualAnsweredEvaluationForms: [
          ...event.actualAnsweredEvaluationForms,
          ...uploadedFiles.filter((file) => file.fileType === "actualAnsweredEvaluationForms").map((file) => file.url),
        ],
        shortWriteUp: [
          ...event.shortWriteUp,
          ...uploadedFiles.filter((file) => file.fileType === "shortWriteUp").map((file) => file.url),
        ],
        picturesOfEvent: [
          ...event.picturesOfEvent,
          ...uploadedFiles.filter((file) => file.fileType === "picturesOfEvent").map((file) => file.url),
        ],
      };

      // Save event data
      const saveResponse = await axios.put(
        `/api/annexes/${organizationId}/annex-e/${annexId}/operational-assessment/${annexId}/event/${eventId}`,
        updatedEvent
      );

      if (saveResponse.status !== 200) {
        throw new Error("Failed to save event data");
      }

      // Clear filesToUpload after successful save
      setFilesToUpload([]);

      // Update local state
      setEvent(updatedEvent);

      console.log("Event saved successfully:", updatedEvent);
      alert("Event saved successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert(`Error saving event: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h2 className="text-2xl font-bold ty">{event.title}</h2>
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Event Details</h1>
      <div className="space-y-8">
        <EventEvaluationForm event={event} updateEvent={updateEvent} />
        <EvaluationSummaryTable
          event={event}
          updateEvaluationSummary={updateEvaluationSummary}
          newCriteria={newCriteria}
          setNewCriteria={setNewCriteria}
          addNewCriteria={addNewCriteria}
        />
        <EventAssessmentForm
          event={event}
          updateAssessment={updateAssessment}
          updateCriteria={updateCriteria}
          calculateAverageRating={calculateAverageRating}
        />
        <CommentsForm comments={event.comments} updateComments={updateComments} />
        <SponsorForm
          sponsorName={event.sponsorName}
          sponsorshipTypes={event.sponsorshipTypes}
          updateEvent={updateEvent}
        />
        <FileUploadForm
          event={event}
          filesToUpload={filesToUpload}
          setFilesToUpload={setFilesToUpload}
          updateEvent={updateEvent}
        />
        <div className="flex justify-between">
          <Link href={`/organizations/${organizationId}/annexE/${annexId}`} className="btn btn-secondary">
            Back to List
          </Link>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const EventEvaluationForm: React.FC<{
  event: EventData;
  updateEvent: (field: keyof EventData, value: any) => void;
}> = ({ event, updateEvent }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={event.date || ""}
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
            minLength={1}
            maxLength={200}
            onChange={(e) => updateEvent("venue", e.target.value)}
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
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                updateEvent("totalParticipants", parseInt(value));
              }
            }}
            onKeyDown={(e) => {
              const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
              if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                updateEvent("totalParticipants", parseInt(value));
              }
            }}
            onKeyDown={(e) => {
              const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
              if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Adviser Information</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name of Adviser</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={event.adviser}
              onChange={(e) => updateEvent("adviser", e.target.value)}
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
                value={event.timeAttended?.from || ""}
                onChange={(e) => updateEvent("timeAttended", { ...event.timeAttended, from: e.target.value })}
              />
              <input
                type="time"
                className="input input-bordered w-1/2"
                value={event.timeAttended?.to || ""}
                onChange={(e) => updateEvent("timeAttended", { ...event.timeAttended, to: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Speaker Information</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Speaker's Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={event.speakerName}
              onChange={(e) => updateEvent("speakerName", e.target.value)}
              required
              maxLength={100}
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
              required
              maxLength={100}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Affiliation</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={event.speakerAffiliation}
              onChange={(e) => updateEvent("speakerAffiliation", e.target.value)}
              required
              maxLength={100}
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
              required
              maxLength={100}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EvaluationSummaryTable: React.FC<{
  event: EventData;
  updateEvaluationSummary: (criteria: string, rating: keyof EvaluationRatings, value: number) => void;
  newCriteria: string;
  setNewCriteria: (value: string) => void;
  addNewCriteria: () => void;
}> = ({ event, updateEvaluationSummary, newCriteria, setNewCriteria, addNewCriteria }) => (
  <div className="card bg-base-100 border-2">
    <div className="card-body">
      <h2 className="card-title text-primary">Evaluation Summary</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-primary text-primary-content">
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
                      className="input input-bordered w-full"
                      value={ratings[rating as keyof EvaluationRatings]}
                      onChange={(e) =>
                        updateEvaluationSummary(
                          criteria,
                          rating as keyof EvaluationRatings,
                          parseInt(e.target.value) || 0
                        )
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
      <div className="flex items-center mt-4">
        <input
          type="text"
          className="input input-bordered flex-grow mr-2"
          value={newCriteria}
          onChange={(e) => setNewCriteria(e.target.value)}
          placeholder="New criteria"
        />
        <button className="btn btn-primary" onClick={addNewCriteria}>
          Add Criteria
        </button>
      </div>
    </div>
  </div>
);

const EventAssessmentForm: React.FC<{
  event: EventData;
  updateAssessment: (field: keyof Assessment, value: any) => void;
  updateCriteria: (criteria: string, field: keyof AssessmentCriteria, value: any) => void;
  calculateAverageRating: (criteria: string) => number;
}> = ({ event, updateAssessment, updateCriteria, calculateAverageRating }) => {
  return (
    <div className="card bg-base-100 border-2">
      <div className="card-body">
        <h2 className="card-title text-primary">Event Assessment</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
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
                      <p>{value.rating.toFixed(1)}</p>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={value.analysis}
                        onChange={(e) => updateCriteria(criteria, "analysis", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={value.recommendation}
                        onChange={(e) => updateCriteria(criteria, "recommendation", e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CommentsForm: React.FC<{
  comments: Comment[];
  updateComments: (comments: Comment[]) => void;
}> = ({ comments, updateComments }) => {
  const addComment = () => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: "",
    };
    updateComments([...comments, newComment]);
  };

  const removeComment = (id: string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    updateComments(updatedComments);
  };

  const updateCommentText = (id: string, text: string) => {
    const updatedComments = comments.map((comment) => (comment.id === id ? { ...comment, text } : comment));
    updateComments(updatedComments);
  };

  return (
    <div className="card bg-base-100 border-2">
      <div className="card-body">
        <h2 className="card-title text-primary">Comments and Suggestions</h2>
        <div className="space-y-2">
          {comments.map((comment) => (
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
    </div>
  );
};

const SponsorForm: React.FC<{
  sponsorName: string;
  sponsorshipTypes: string[];
  updateEvent: (field: keyof EventData, value: any) => void;
}> = ({ sponsorName, sponsorshipTypes, updateEvent }) => {
  return (
    <div className="card bg-base-100 border-2">
      <div className="card-body">
        <h2 className="card-title text-primary">Sponsor Information</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Sponsor's Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={sponsorName}
            onChange={(e) => updateEvent("sponsorName", e.target.value)}
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
                  checked={sponsorshipTypes.includes(type)}
                  onChange={(e) => {
                    const updatedTypes = e.target.checked
                      ? [...sponsorshipTypes, type]
                      : sponsorshipTypes.filter((t) => t !== type);
                    updateEvent("sponsorshipTypes", updatedTypes);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUploadForm: React.FC<{
  event: EventData;
  filesToUpload: FileToUpload[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileToUpload[]>>;
  updateEvent: (field: keyof EventData, value: any) => void;
}> = ({ event, filesToUpload, setFilesToUpload, updateEvent }) => {
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      alert("File size must not exceed 200MB.");
      return;
    }

    setFilesToUpload((prev) => [...prev, { file, fileType }]);
    setUploadStatus((prev) => ({ ...prev, [fileType]: "selected" }));
  };

  const getStatusColor = (fileType: string) => {
    switch (uploadStatus[fileType]) {
      case "selected":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const handleDeleteFile = async (fileType: keyof EventData, fileName: string) => {
    try {
      await axios.post("/api/delete-file", { fileName });
      updateEvent(
        fileType,
        (event[fileType] as string[]).filter((file) => file !== fileName)
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const renderFileList = (fileType: keyof EventData, label: string) => {
    const files = event[fileType];
    if (Array.isArray(files) && files.length > 0) {
      return files.map((file, index) => {
        const fileUrl = typeof file === "string" ? file : file.text;
        return (
          <li key={`${fileType}-${index}`} className="text-sm flex items-center justify-between">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {`${label} ${index + 1}`}
            </a>
            <button
              onClick={() => handleDeleteFile(fileType, fileUrl)}
              className="btn btn-ghost btn-xs"
              aria-label={`Delete ${label}`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        );
      });
    }
    return null;
  };

  return (
    <div className="card bg-base-100 border-2">
      <div className="card-body">
        <h2 className="card-title text-primary">Required Attachments</h2>
        <div className="space-y-4">
          <p className="text-lg font-medium">Please attach the following:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Project Proposal Form (PPF)</li>
            <li>Actual answered Evaluation Forms</li>
            <li>Short write-up of the event for publication.</li>
            <li>Pictures of Event with Description</li>
          </ul>
          <p className="text-sm text-slate-500">
            Note: Liquidation Report and PHOTOCOPY of Original Receipts (Please follow standard format) is accomplished
            in the annex E2. There won't be a file upload here.
          </p>
          <div className="grid gap-4">
            {[
              { type: "projectProposalForm", label: "Project Proposal Form (PPF)" },
              { type: "actualAnsweredEvaluationForms", label: "Actual answered Evaluation Forms" },
              { type: "shortWriteUp", label: "Short write-up" },
              { type: "picturesOfEvent", label: "Pictures of Event (PDF with images and descriptions)" },
            ].map(({ type, label }) => (
              <div key={type} className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{label}</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => handleFileSelect(e, type)}
                  accept=".pdf"
                />
                <span className={`text-sm mt-1 ${getStatusColor(type)}`}>
                  {uploadStatus[type] === "selected" && "File selected (will be uploaded on save)"}
                </span>
              </div>
            ))}
          </div>

          {(event.projectProposalForm.length > 0 ||
            event.actualAnsweredEvaluationForms.length > 0 ||
            event.shortWriteUp.length > 0 ||
            event.picturesOfEvent.length > 0) && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Previously Uploaded Files:</h3>
              <ul className="list-disc list-inside space-y-1">
                {renderFileList("projectProposalForm", "Project Proposal Form")}
                {renderFileList("actualAnsweredEvaluationForms", "Evaluation Forms")}
                {renderFileList("shortWriteUp", "Short Write-up")}
                {renderFileList("picturesOfEvent", "Event Pictures")}
              </ul>
            </div>
          )}

          {filesToUpload.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Files to be uploaded:</h3>
              <ul className="list-disc list-inside space-y-1">
                {filesToUpload.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.file.name} ({file.fileType})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
