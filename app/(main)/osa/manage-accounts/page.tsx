"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, X, Archive } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";

type Role = "SOCC" | "AU" | "RSO" | "RSO-SIGNATORY" | "SOCC-SIGNATORY";

type Account = {
  _id: string;
  email: string;
  role: Role;
  position: string;
  requestedBy: string;
  isArchived: boolean;
  organization?: string;
};

const AccountsDashboard = () => {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | Role>("All");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    role: "" as Role | "",
    organization: "",
  });

  // Mock data for organizations (replace with actual data later)
  const organizations = [
    "Faculty of Engineering",
    "College of Science",
    "School of Economics",
    "UST Tiger Scouts",
    "UST Yellow Jackets",
    "UST Salinggawi Dance Troupe",
  ];

  useEffect(() => {
    fetchAccounts();
  }, [showArchived]);

  const fetchAccounts = async () => {
    try {
      let response;
      if (showArchived) {
        response = await axios.get("/api/users/get-archived");
      } else {
        response = await axios.get("/api/users");
      }
      if (response.status === 200) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRole === "All" || account.role === filterRole)
    );
  }, [accounts, searchTerm, filterRole]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.role) {
      alert("Please select a role");
      return;
    }
    if ((newAccount.role === "AU" || newAccount.role === "RSO-SIGNATORY") && !newAccount.organization) {
      alert("Please select an organization");
      return;
    }
    try {
      const response = await axios.post("/api/users", {
        email: newAccount.email,
        role: newAccount.role,
        position: newAccount.role === "SOCC" || newAccount.role === "RSO" ? "CENTRAL EMAIL" : "",
        requestedBy: session?.user?.email,
        organization: newAccount.organization,
      });
      if (response.status === 201) {
        setAccounts((prevAccounts) => [...prevAccounts, response.data]);
        setNewAccount({ email: "", role: "", organization: "" });
        setIsCreatingAccount(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleArchiveAccount = async (accountId: string) => {
    try {
      const response = await axios.delete(`/api/users/${accountId}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account._id !== accountId));
      }
    } catch (error) {
      console.error("Error archiving account:", error);
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Accounts Dashboard</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search emails..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          value={showArchived ? "archived" : "active"}
          onChange={(e) => setShowArchived(e.target.value === "archived")}
        >
          <option value="active">Active Accounts</option>
          <option value="archived">Archived Accounts</option>
        </select>
        <button className="btn btn-primary" onClick={() => setIsCreatingAccount(true)}>
          <UserPlus className="mr-2" />
          Create Account
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Position</th>
              <th>Organization</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account._id}>
                <td>{account.email}</td>
                <td>{account.role}</td>
                <td>{account.position}</td>
                <td>{account.organization || "-"}</td>
                <td>{account.requestedBy}</td>
                <td>
                  {!showArchived && (
                    <button className="btn btn-ghost btn-xs" onClick={() => handleArchiveAccount(account._id)}>
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreatingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newAccount.role}
                  onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value as Role })}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="SOCC">SOCC</option>
                  <option value="AU">AU</option>
                  <option value="RSO">RSO</option>
                  <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
                  <option value="SOCC-SIGNATORY">SOCC-SIGNATORY</option>
                </select>
              </div>
              {(newAccount.role === "AU" || newAccount.role === "RSO-SIGNATORY") && (
                <div>
                  <label className="label">
                    <span className="label-text">Organization</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
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
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn" onClick={() => setIsCreatingAccount(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default AccountsDashboard;
