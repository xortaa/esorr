//C:\Users\kercwin\code\dev\esorr\app\(main)\organizations\[organizationId]\page.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, AlertCircle, CheckCircle, XCircle, Clock, Archive } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";

interface EmailRequest {
  _id: string;
  email: string;
  position: string;
  submittedAt: string;
  requestedBy: string;
}

export default function SignatoryEmailRequestPage() {
  const { data: session } = useSession();
  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { organizationId } = useParams();

  useEffect(() => {
    fetchEmailRequests();
  }, []);

  const fetchEmailRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/signatory-request-organization/${organizationId}`);
      setEmailRequests(response.data);
    } catch (error) {
      console.error("Error fetching email requests:", error);
      setError("Failed to load email requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPosition) {
      setError("Please fill in both email and position fields.");
      return;
    }
    try {
      const response = await axios.post(`/api/signatory-request-organization/${organizationId}`, {
        email: newEmail,
        position: newPosition,
        requestedBy: session?.user.email,
      });
      setEmailRequests([...emailRequests, response.data]);
      setNewEmail("");
      setNewPosition("");
      setError("");
    } catch (error) {
      console.error("Error submitting email request:", error);
      setError("Failed to submit email request. Please try again.");
    }
  };

  const handleArchive = async (requestId: string) => {
    if (!requestId) {
      console.error("Invalid requestId:", requestId);
      setError("Failed to archive request. Invalid request ID.");
      return;
    }
    try {
      await axios.delete(`/api/signatory-request-organization/${organizationId}/${requestId}`);
      setEmailRequests(
        emailRequests.map((request) => (request._id === requestId ? { ...request, isArchived: true } : request))
      );
    } catch (error) {
      console.error("Error archiving request:", error);
      setError("Failed to archive request. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Signatory Email Requests</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter signatory email"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="position">
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter signatory position"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <PlusCircle className="w-5 h-5 mr-2" />
              Submit Request
            </button>
          </form>
          {error && (
            <div className="alert alert-error mt-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Requests</h2>
          {isLoading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : emailRequests.length === 0 ? (
            <p className="text-gray-500">No email requests submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Requested By</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.email}</td>
                      <td>{request.position}</td>
                      <td>{request.requestedBy}</td>
                      <td>{new Date(request.submittedAt).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleArchive(request._id)} className="btn btn-ghost btn-xs">
                          <Archive className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
