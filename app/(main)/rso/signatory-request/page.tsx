"use client";

import { useState, useEffect } from "react";
import { PlusCircle, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";

interface EmailRequest {
  id: string;
  email: string;
  position: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function SignatoryEmailRequestPage() {
  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmailRequests();
  }, []);

  const fetchEmailRequests = async () => {
    try {
      setIsLoading(true);
      // In a real application, replace this with an actual API call
      const response = await axios.get("/api/signatory-email-requests");
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
      // In a real application, replace this with an actual API call
      const response = await axios.post("/api/signatory-email-requests", {
        email: newEmail,
        position: newPosition,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Signatory Email Requests</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1 block w-full input input-bordered"
                placeholder="Enter signatory email"
                required
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="mt-1 block w-full input input-bordered"
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
            <div className="text-error mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
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
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {emailRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.email}</td>
                      <td>{request.position}</td>
                      <td className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className="ml-2 capitalize">{request.status}</span>
                      </td>
                      <td>{new Date(request.submittedAt).toLocaleString()}</td>
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
