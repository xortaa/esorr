"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Email {
  _id: string;
  subject: string;
  scheduledDate: string;
  status: "draft" | "scheduled" | "sent";
}

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("/api/emails");
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/osa/announcement/compose?id=${id}`);
  };

  const handleArchive = async (id: string) => {
    if (confirm("Are you sure you want to archive this email?")) {
      try {
        const response = await fetch(`/api/emails/${id}/archive`, {
          method: "PUT",
        });
        if (response.ok) {
          setEmails(emails.filter((email) => email._id !== id));
        } else {
          console.error("Failed to archive email");
        }
      } catch (error) {
        console.error("Error archiving email:", error);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Scheduled Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email._id}>
              <td>{email.subject}</td>
              <td>{email.scheduledDate || "Not scheduled"}</td>
              <td>{email.status}</td>
              <td>
                <button className="btn btn-sm btn-info mr-2" onClick={() => handleEdit(email._id)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-warning" onClick={() => handleArchive(email._id)}>
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
