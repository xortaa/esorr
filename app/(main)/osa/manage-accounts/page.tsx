"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  X,
  Users,
  Building,
  GraduationCap,
  ClipboardSignature,
  ChevronDown,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";

type Role = "SOCC" | "AU" | "RSO" | "RSO-SIGNATORY" | "SOCC-SIGNATORY";

type Account = {
  id: string;
  email: string;
  organization: string;
  status: "Pending" | "Approved" | "Rejected";
  role: Role;
  position: string;
  requestedBy: string;
};

type EmailRequest = {
  id: string;
  email: string;
  organization: string;
  position: string;
  requestDate: string;
  role: Role;
  requestedBy: string;
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
      requestedBy: "admin@ust.edu.ph",
    },
    {
      id: "2",
      email: "jane@example.com",
      organization: "Debate Society",
      status: "Pending",
      role: "AU",
      position: "President",
      requestedBy: "manager@ust.edu.ph",
    },
    {
      id: "3",
      email: "bob@example.com",
      organization: "Chess Club",
      status: "Rejected",
      role: "SOCC",
      position: "President",
      requestedBy: "coordinator@ust.edu.ph",
    },
    {
      id: "4",
      email: "alice@example.com",
      organization: "Drama Club",
      status: "Approved",
      role: "SOCC-SIGNATORY",
      position: "Secretary",
      requestedBy: "admin@ust.edu.ph",
    },
    {
      id: "5",
      email: "charlie@example.com",
      organization: "Science Society",
      status: "Pending",
      role: "RSO-SIGNATORY",
      position: "Treasurer",
      requestedBy: "manager@ust.edu.ph",
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
      requestedBy: "admin@ust.edu.ph",
    },
    {
      id: "2",
      email: "emma@example.com",
      organization: "Music Society",
      requestDate: "2023-06-16",
      role: "AU",
      position: "Secretary",
      requestedBy: "manager@ust.edu.ph",
    },
    {
      id: "3",
      email: "frank@example.com",
      organization: "Environmental Club",
      requestDate: "2023-06-17",
      role: "SOCC-SIGNATORY",
      position: "Coordinator",
      requestedBy: "coordinator@ust.edu.ph",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | Role>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | Account["status"]>("All");
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const [requestFilterRole, setRequestFilterRole] = useState<"All" | Role>("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Role>("SOCC");
  const [newAccount, setNewAccount] = useState({
    email: "",
    organization: "",
    role: "SOCC" as Role,
  });

  // Mock data for organizations
  const organizations = [
    "Sports Club",
    "Debate Society",
    "Chess Club",
    "Drama Club",
    "Science Society",
    "Art Club",
    "Music Society",
    "Environmental Club",
  ];

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
          requestedBy: approvedRequest.requestedBy,
        },
      ]);
      setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    }
  };

  const handleRejectRequest = (id: string) => {
    setEmailRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to create a new account
    console.log("Creating new account:", newAccount);
    setNewAccount({ email: "", organization: "", role: "SOCC" });
    setIsSidebarOpen(false);
  };

  const roleIcons = {
    SOCC: <Users className="h-4 w-4" />,
    AU: <GraduationCap className="h-4 w-4" />,
    RSO: <Building className="h-4 w-4" />,
    "RSO-SIGNATORY": <ClipboardSignature className="h-4 w-4" />,
    "SOCC-SIGNATORY": <ClipboardSignature className="h-4 w-4" />,
  };

  const roleDescriptions = {
    SOCC: "Student Organizations Coordinating Council",
    AU: "Academic Unit (Faculty or College)",
    RSO: "Recognized Student Organization",
    "RSO-SIGNATORY": "RSO Signatory",
    "SOCC-SIGNATORY": "SOCC Signatory",
  };

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Accounts Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage email approvals and organization requests</p>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Approved Emails</h2>
            <div className="flex flex-wrap gap-4">
              <div className="form-control">
                <label className="input input-bordered flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    placeholder="Search emails..."
                    className="grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="h-4 w-4 opacity-70" />
                </label>
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
              <button className="btn btn-primary" onClick={() => setIsSidebarOpen(true)}>
                <UserPlus className="mr-2" />
                Create Account
              </button>
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
                    <th>Requested By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
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
                      <td>{account.requestedBy}</td>
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Email Approval Requests</h2>
            <div className="flex flex-wrap gap-4">
              <div className="form-control">
                <label className="input input-bordered flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="grow"
                    value={requestSearchTerm}
                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                  />
                  <Search className="h-4 w-4 opacity-70" />
                </label>
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
                    <th>Requested By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmailRequests.map((request) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
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
                      <td>{request.requestedBy}</td>
                      <td>
                        <button
                          className="btn btn-xs btn-primary mr-2"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="btn btn-xs btn-neutral" onClick={() => handleRejectRequest(request.id)}>
                          <XCircle className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-[320px] bg-white shadow-lg z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Create Account</h2>
                  <button className="btn btn-ghost btn-sm p-0" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {["SOCC", "AU", "RSO", "RSO-SIGNATORY", "SOCC-SIGNATORY"].map((role) => (
                    <motion.button
                      key={role}
                      className={`p-2 rounded-lg text-center flex flex-col items-center ${
                        activeTab === role ? "bg-primary text-primary-content" : "bg-base-200"
                      }`}
                      onClick={() => setActiveTab(role as Role)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {roleIcons[role as Role]}
                      <span className="text-xs font-semibold mt-1">{role}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-4">{roleDescriptions[activeTab]}</p>
                <form onSubmit={handleCreateAccount} className="space-y-4 flex-grow">
                  <div>
                    <label className="label text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="input input-bordered w-full text-sm"
                      placeholder="example@ust.edu.ph"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                      required
                    />
                  </div>
                  {activeTab === "RSO-SIGNATORY" && (
                    <div>
                      <label className="label text-sm">Organization</label>
                      <select
                        name="organization"
                        className="select select-bordered w-full text-sm"
                        value={newAccount.organization}
                        onChange={(e) => setNewAccount({ ...newAccount, organization: e.target.value })}
                        required
                      >
                        <option value="">Select an organization</option>
                        {organizations.map((org) => (
                          <option key={org} value={org}>
                            {org}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex-grow"></div>
                  <motion.button
                    type="submit"
                    className="btn btn-primary w-full text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create {activeTab} Account
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default AccountsDashboard;
