"use client";

import { useState } from "react";
import { Search, Filter, UserPlus, Bell, CheckCircle, XCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Role = "SOCC" | "AU" | "RSO";

type Account = {
  id: string;
  email: string;
  organization: string;
  status: "Pending" | "Approved" | "Rejected";
  role: Role;
};

type EmailRequest = {
  id: string;
  email: string;
  organization: string;
  requestDate: string;
  role: Role;
};

const AccountsDashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", email: "john@example.com", organization: "Sports Club", status: "Approved", role: "RSO" },
    { id: "2", email: "jane@example.com", organization: "Debate Society", status: "Pending", role: "AU" },
    { id: "3", email: "bob@example.com", organization: "Chess Club", status: "Rejected", role: "SOCC" },
  ]);

  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([
    { id: "1", email: "alice@example.com", organization: "Art Club", requestDate: "2023-06-15", role: "RSO" },
    { id: "2", email: "charlie@example.com", organization: "Science Society", requestDate: "2023-06-16", role: "AU" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | Role>("All");

  const filteredAccounts = accounts.filter(
    (account) =>
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "All" || account.role === filterRole)
  );

  const handleApproveEmail = (id: string) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => (account.id === id ? { ...account, status: "Approved" } : account))
    );
  };

  const handleRejectEmail = (id: string) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => (account.id === id ? { ...account, status: "Rejected" } : account))
    );
  };

  const handleApproveRequest = (id: string) => {
    const approvedRequest = emailRequests.find((request) => request.id === id);
    if (approvedRequest) {
      setAccounts((prevAccounts) => [
        ...prevAccounts,
        {
          id: approvedRequest.id,
          email: approvedRequest.email,
          organization: approvedRequest.organization,
          status: "Approved",
          role: approvedRequest.role,
        },
      ]);
      setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    }
  };

  const handleRejectRequest = (id: string) => {
    setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
  };

  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold mb-2">Accounts Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage email approvals and organization requests</p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="dropdown">
            <label tabIndex={0} className="btn m-1">
              <Filter className="mr-2" />
              Filter: {filterRole}
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => setFilterRole("All")}>All</a>
              </li>
              <li>
                <a onClick={() => setFilterRole("SOCC")}>SOCC</a>
              </li>
              <li>
                <a onClick={() => setFilterRole("AU")}>AU</a>
              </li>
              <li>
                <a onClick={() => setFilterRole("RSO")}>RSO</a>
              </li>
            </ul>
          </div>
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search emails..."
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square">
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        <button className="btn btn-primary">
          <UserPlus className="mr-2" />
          Add Email
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Approved Emails</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.email}</td>
                  <td>{account.organization}</td>
                  <td>
                    <span
                      className={`badge ${
                        account.role === "SOCC"
                          ? "badge-primary"
                          : account.role === "AU"
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      {account.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        account.status === "Approved"
                          ? "badge-success"
                          : account.status === "Pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success mr-2"
                      onClick={() => handleApproveEmail(account.id)}
                      disabled={account.status === "Approved"}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleRejectEmail(account.id)}
                      disabled={account.status === "Rejected"}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Email Approval Requests</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emailRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.email}</td>
                  <td>{request.organization}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.role === "SOCC"
                          ? "badge-primary"
                          : request.role === "AU"
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      {request.role}
                    </span>
                  </td>
                  <td>{request.requestDate}</td>
                  <td>
                    <button className="btn btn-sm btn-success mr-2" onClick={() => handleApproveRequest(request.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleRejectRequest(request.id)}>
                      <XCircle className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AccountsDashboard;
