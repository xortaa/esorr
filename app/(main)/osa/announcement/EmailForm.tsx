"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EmailToEdit {
  _id: string;
  subject: string;
  text: string;
  scheduledDate: string;
  recipientType: string;
  affiliation: string;
  specificRecipients: string[];
}

export default function EmailForm({ emailToEdit = null }: { emailToEdit: EmailToEdit | null }) {
  const router = useRouter();
  const [emailData, setEmailData] = useState({
    _id: emailToEdit?._id || "",
    subject: emailToEdit?.subject || "",
    text: emailToEdit?.text || "",
    scheduledDate: emailToEdit?.scheduledDate || "",
    recipientType: emailToEdit?.recipientType || "allRSO",
    affiliation: emailToEdit?.affiliation || "",
    specificRecipients: emailToEdit?.specificRecipients || [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [affiliations, setAffiliations] = useState<{ _id: string; name: string }[]>([]);
  const [allRecipients, setAllRecipients] = useState<{ email: string; affiliation: string }[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, affiliationsResponse] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/affiliations"),
        ]);
        const users = await usersResponse.json();
        const affiliations = await affiliationsResponse.json();

        setAllRecipients(users.filter((user: any) => user.role === "RSO"));
        setAffiliations([{ _id: "university-wide", name: "University Wide" }, ...affiliations]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (emailToEdit) {
      setEmailData(emailToEdit);
    }
  }, [emailToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "scheduledDate") {
      setEmailData((prev) => ({ ...prev, [name]: value ? new Date(value).toISOString() : "" }));
    } else {
      setEmailData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmails = Array.from(e.target.selectedOptions, (option) => option.value);
    setEmailData((prev) => ({ ...prev, specificRecipients: selectedEmails }));
  };

  const handleSubmit = async (e: React.FormEvent, sendImmediately = false) => {
    e.preventDefault();

    // Word count validations
    const subjectWordCount = emailData.subject.trim().split(/\s+/).length;
    const textWordCount = emailData.text.trim().split(/\s+/).length;

    if (subjectWordCount > 10) {
      setStatus("Error: Subject should not exceed 10 words.");
      return;
    }

    if (textWordCount > 500) {
      setStatus("Error: Message should not exceed 500 words.");
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      Object.entries(emailData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (file) {
        formData.append("attachment", file);
      } else {
        formData.append("attachment", "null");
      }
      formData.append("sendImmediately", sendImmediately.toString());

      const response = await fetch("/api/emails", {
        method: emailData._id ? "PUT" : "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus(sendImmediately ? "Email sent successfully!" : "Email saved successfully!");
        router.push("/osa/announcement");
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("An unknown error occurred.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject (max 10 words)
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={emailData.subject}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Message (max 500 words)
        </label>
        <textarea
          id="text"
          name="text"
          value={emailData.text}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full h-40"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
          Schedule Send Date (optional)
        </label>
        <input
          type="date"
          id="scheduledDate"
          name="scheduledDate"
          value={emailData.scheduledDate ? new Date(emailData.scheduledDate).toISOString().split("T")[0] : ""}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
        <p className="text-sm text-gray-500 mt-1">Scheduled emails will be sent at 6:00 AM on the scheduled day.</p>
      </div>
      <div>
        <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-1">
          Select Recipient Type
        </label>
        <select
          id="recipientType"
          name="recipientType"
          value={emailData.recipientType}
          onChange={handleInputChange}
          className="select select-bordered w-full"
        >
          <option value="allRSO">All RSOs</option>
          <option value="affiliationRSO">RSOs in Specific Affiliation</option>
          <option value="specificRSO">Specific RSOs</option>
        </select>
      </div>
      {emailData.recipientType === "affiliationRSO" && (
        <div>
          <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
            Select Affiliation
          </label>
          <select
            id="affiliation"
            name="affiliation"
            value={emailData.affiliation}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select an affiliation</option>
            {affiliations.map((affiliation) => (
              <option key={affiliation._id} value={affiliation._id}>
                {affiliation.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {emailData.recipientType === "specificRSO" && (
        <div>
          <label htmlFor="specificRecipients" className="block text-sm font-medium text-gray-700 mb-1">
            Select Specific RSOs
          </label>
          <select
            id="specificRecipients"
            name="specificRecipients"
            multiple
            value={emailData.specificRecipients}
            onChange={handleRecipientChange}
            className="select select-bordered w-full h-32"
            required
          >
            {allRecipients.map((recipient) => (
              <option key={recipient.email} value={recipient.email}>
                {recipient.email} ({recipient.affiliation})
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
          Attachment (PDF only)
        </label>
        <input
          type="file"
          id="attachment"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="file-input file-input-bordered w-full"
        />
      </div>
      <div className="flex flex-col gap-4">
        <button type="submit" className="btn btn-primary w-full">
          {emailData._id ? "Update" : "Schedule"} Email
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          className="btn btn-secondary w-full"
          disabled={isSending}
        >
          Send Now
        </button>
      </div>
      {status && (
        <p className={`text-center mt-4 ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>{status}</p>
      )}
    </form>
  );
}
