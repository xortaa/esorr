"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";

export default function Page() {
  const [emailData, setEmailData] = useState({
    subject: "",
    text: "",
  });
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await fetch("/api/users");
        const users = await response.json();
        const rsoEmails = users.filter((user: any) => user.role === "RSO").map((user: any) => user.email);
        setRecipients(rsoEmails);
      } catch (error) {
        console.error("Error fetching recipients:", error);
      }
    };

    fetchRecipients();
  }, []);

  const sendEmail = async () => {
    try {
      const formData = new FormData();
      formData.append("subject", emailData.subject);
      formData.append("text", emailData.text);
      formData.append("recipients", JSON.stringify(recipients));
      if (file) {
        formData.append("attachment", file);
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus("Email sent successfully!");
        setEmailData({ subject: "", text: "" });
        setFile(null);
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("An unknown error occurred.");
      }
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center px-4">
        <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Announcement to RSOs</h1>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Subject"
                className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                className="textarea textarea-bordered w-full h-40 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={emailData.text}
                onChange={(e) => setEmailData({ ...emailData, text: e.target.value })}
              ></textarea>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf"
                className="file-input file-input-bordered w-full bg-gray-50 border-gray-300 text-gray-700"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
              <p className="mt-1 text-sm text-gray-500">Attach a PDF file (optional)</p>
            </div>
            <button onClick={sendEmail} className="btn btn-primary w-full ">
              Send Announcement
            </button>
            {status && (
              <p className={`text-center mt-4 ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
