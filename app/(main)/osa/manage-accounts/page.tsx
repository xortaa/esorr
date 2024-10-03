"use client";

import { useState, useMemo } from "react";
import { Search, Filter, UserPlus, CheckCircle, XCircle, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Role = "SOCC" | "AU" | "RSO" | "RSO-SIGNATORY" | "SOCC-SIGNATORY";

type Account = {
  id: string;
  email: string;
  organization: string;
  status: "Pending" | "Approved" | "Rejected";
  role: Role;
  position: string;
};

type EmailRequest = {
  id: string;
  email: string;
  organization: string;
  position: string;
  requestDate: string;
  role: Role;
};

const AccountsDashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      email: "john@example.com",
      organization: "Sports Club",
      status: "Approved",
      role: "RSO",
      position: "President",
    },
    {
      id: "2",
      email: "jane@example.com",
      organization: "Debate Society",
      status: "Pending",
      role: "AU",
      position: "President",
    },
    {
      id: "3",
      email: "bob@example.com",
      organization: "Chess Club",
      status: "Rejected",
      role: "SOCC",
      position: "President",
    },
    {
      id: "4",
      email: "alice@example.com",
      organization: "Drama Club",
      status: "Approved",
      role: "SOCC-SIGNATORY",
      position: "Secretary",
    },
    {
      id: "5",
      email: "charlie@example.com",
      organization: "Science Society",
      status: "Pending",
      role: "RSO-SIGNATORY",
      position: "Treasurer",
    },
  ]);

  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([
    {
      id: "1",
      email: "david@example.com",
      organization: "Art Club",
      requestDate: "2023-06-15",
      role: "RSO",
      position: "Vice President",
    },
    {
      id: "2",
      email: "emma@example.com",
      organization: "Music Society",
      requestDate: "2023-06-16",
      role: "AU",
      position: "Secretary",
    },
    {
      id: "3",
      email: "frank@example.com",
      organization: "Environmental Club",
      requestDate: "2023-06-17",
      role: "SOCC-SIGNATORY",
      position: "Coordinator",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | Role>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | Account["status"]>("All");
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [requestFilterRole, setRequestFilterRole] = useState<"All" | Role>("All");
  const [newEmail, setNewEmail] = useState({ email: "" });

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRole === "All" || account.role === filterRole) &&
        (filterStatus === "All" || account.status === filterStatus)
    );
  }, [accounts, searchTerm, filterRole, filterStatus]);

  const filteredEmailRequests = useMemo(() => {
    return emailRequests.filter(
      (request) =>
        request.email.toLowerCase().includes(requestSearchTerm.toLowerCase()) &&
        (requestFilterRole === "All" || request.role === requestFilterRole)
    );
  }, [emailRequests, requestSearchTerm, requestFilterRole]);

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
          position: approvedRequest.position,
        },
      ]);
      setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    }
  };

  const handleRejectRequest = (id: string) => {
    setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
  };

  const handleCreateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to create a new email request
    console.log("Creating new email request:", newEmail);
    setNewEmail({ email: "" });
  };

  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold mb-2">Accounts Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage email approvals and organization requests</p>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Approved Emails</h2>
          <div className="flex flex-wrap gap-4">
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
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as "All" | Role)}
            >
              <option value="All">All Roles</option>
              <option value="SOCC">SOCC</option>
              <option value="AU">AU</option>
              <option value="RSO">RSO</option>
              <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
              <option value="SOCC-SIGNATORY">SOCC-SIGNATORY</option>
            </select>
            <select
              className="select select-bordered w-full max-w-xs"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "All" | Account["status"])}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <CreateMemberSidebar handleCreateEmail={handleCreateEmail} newEmail={newEmail} setNewEmail={setNewEmail} />
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Position</th>
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
                    <td>{account.position}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          account.role === "RSO" || account.role === "RSO-SIGNATORY"
                            ? "badge-primary"
                            : account.role === "SOCC" || account.role === "SOCC-SIGNATORY"
                            ? "badge-secondary"
                            : "badge-accent"
                        }`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          account.status === "Approved"
                            ? "badge-primary"
                            : account.status === "Pending"
                            ? "badge-ghost"
                            : "badge-neutral"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary mr-2"
                        onClick={() => handleApproveEmail(account.id)}
                        disabled={account.status === "Approved"}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-xs btn-neutral"
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

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Email Approval Requests</h2>
          <div className="flex flex-wrap gap-4">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="input input-bordered"
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                />
                <button className="btn btn-xs btn-square">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={requestFilterRole}
              onChange={(e) => setRequestFilterRole(e.target.value as "All" | Role)}
            >
              <option value="All">All Roles</option>
              <option value="SOCC">SOCC</option>
              <option value="AU">AU</option>
              <option value="RSO">RSO</option>
              <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
              <option value="SOCC-SIGNATORY">SOCC-SIGNATORY</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmailRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.email}</td>
                    <td>{request.organization}</td>
                    <td>{request.position}</td>
                    <td>
                      <span
                        className={`badge badge-sm badge-outline ${
                          request.role === "RSO" || request.role === "RSO-SIGNATORY"
                            ? "badge-primary"
                            : request.role === "SOCC" || request.role === "SOCC-SIGNATORY"
                            ? "badge-secondary"
                            : "badge-accent"
                        }`}
                      >
                        {request.role}
                      </span>
                    </td>
                    <td>{request.requestDate}</td>
                    <td>
                      <button className="btn btn-xs btn-primary mr-2" onClick={() => handleApproveRequest(request.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="btn btn-xs btn-neutral" onClick={() => handleRejectRequest(request.id)}>
                        <XCircle className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const CreateMemberSidebar = ({ newEmail, setNewEmail, handleCreateEmail }) => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Create Account
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form
          onSubmit={handleCreateEmail}
          className="menu bg-white min-h-full w-5/6 sm:w-4/6 xl:w-1/2 p-4 mt-20 overflow-auto"
        >
          <div className="mb-4 relative">
            <label className="absolute top-0 right-4 btn btn-ghost" htmlFor="my-drawer">
              <X />
            </label>

            <h2 className="text-3xl font-bold">Account Details</h2>
            <p className="text-sm text-slate-500">Enter the details below for the new account</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <label className="label mb-1">Email</label>
              <input
                name="email"
                className="input input-bordered w-full uppercase"
                placeholder="example@.ust.edu.ph"
                value={newEmail.email}
                onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">
              ADD MEMBER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountsDashboard;
