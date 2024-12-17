"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ArchiveIcon, EditIcon } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

interface Email {
  _id: string;
  subject: string;
  scheduledDate: string;
  status: "draft" | "scheduled" | "sent";
}

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/emails");
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800";
      case "scheduled":
        return "bg-blue-200 text-blue-800";
      case "sent":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <PageWrapper>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : emails.length > 0 ? (
        emails.map((email) => (
          <div key={email._id} className="bg-white shadow-sm rounded-lg mb-4 overflow-hidden">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{email.subject}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formatDate(email.scheduledDate)}
              </div>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(email.status)}`}
              >
                {email.status}
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-2">
              <button type="button" onClick={() => handleEdit(email._id)} className="btn btn-outline">
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button type="button" onClick={() => handleArchive(email._id)} className="btn btn-neutral">
                <ArchiveIcon className="w-4 h-4 mr-2" />
                Archive
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 mt-8">No emails found.</div>
      )}
    </PageWrapper>
  );
}
