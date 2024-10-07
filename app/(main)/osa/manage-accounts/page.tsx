"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, X, Archive } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";
import { AffiliationResponse } from "@/types";

type Role = "SOCC" | "AU" | "RSO" | "RSO-SIGNATORY" | "SOCC-SIGNATORY";

type Account = {
  _id: string;
  email: string;
  role: Role;
  position: string;
  requestedBy: string;
  isArchived: boolean;
  organization?: string;
  affiliation?: string;
};

const AccountsDashboard = () => {
  const [affiliationOptions, setAffiliationOptions] = useState<AffiliationResponse[]>([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | Role>("All");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    role: "" as Role | "",
    organization: "",
    affiliation: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchAffiliations();
  }, [showArchived]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(showArchived ? "/api/users/get-archived" : "/api/users");
      if (response.status === 200) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchAffiliations = async () => {
    try {
      setAffiliationOptionsLoading(true);
      const { data } = await axios.get("/api/affiliations");
      setAffiliationOptions(data);
    } catch (error) {
      console.error("Error fetching affiliations:", error);
    } finally {
      setAffiliationOptionsLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.email.toLowerCase().includes(accountSearchTerm.toLowerCase()) &&
        (filterRole === "All" || account.role === filterRole)
    );
  }, [accounts, accountSearchTerm, filterRole]);

  const filteredAffiliations = useMemo(() => {
    return affiliationOptions.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
    );
  }, [affiliationOptions, affiliationSearchTerm]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.role) {
      alert("Please select a role");
      return;
    }
    if ((newAccount.role === "AU" || newAccount.role === "RSO-SIGNATORY") && !newAccount.affiliation) {
      alert("Please select an affiliation");
      return;
    }
    try {
      const response = await axios.post("/api/users", {
        email: newAccount.email,
        role: newAccount.role,
        position: newAccount.role === "SOCC" || newAccount.role === "RSO" ? "CENTRAL EMAIL" : "",
        requestedBy: session?.user?.email,
        organization: newAccount.organization,
        affiliation: newAccount.affiliation,
      });
      if (response.status === 201) {
        setAccounts((prevAccounts) => [...prevAccounts, response.data]);
        setNewAccount({ email: "", role: "", organization: "", affiliation: "" });
        setAffiliationSearchTerm(""); // Clear the affiliation search term
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

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAffiliationSearchTerm(e.target.value);
    setNewAccount({ ...newAccount, affiliation: "" });
    setIsDropdownOpen(true);
  };

  const handleAffiliationInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const handleSelectAffiliation = (affiliation: AffiliationResponse) => {
    setNewAccount({ ...newAccount, affiliation: affiliation.name });
    setAffiliationSearchTerm(affiliation.name);
    setIsDropdownOpen(false);
  };

  const handleCancelCreateAccount = () => {
    setIsCreatingAccount(false);
    setNewAccount({ email: "", role: "", organization: "", affiliation: "" });
    setAffiliationSearchTerm(""); // Clear the affiliation search term when canceling
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Accounts Dashboard</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search emails..."
          className="input input-bordered w-full max-w-xs"
          value={accountSearchTerm}
          onChange={(e) => setAccountSearchTerm(e.target.value)}
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
              <th>Affiliation</th>
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
                <td>{account.affiliation || "-"}</td>
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
                  <h3 className="text-lg font-semibold mb-2">Affiliation</h3>
                  <div className="flex items-center justify-between w-full">
                    <div className="relative w-full">
                      <div className="flex w-full">
                        <input
                          type="text"
                          className="input input-bordered w-full pr-10"
                          placeholder="Search for affiliation..."
                          value={affiliationSearchTerm}
                          onChange={handleAffiliationInputChange}
                          onFocus={handleAffiliationInputFocus}
                          onBlur={handleInputBlur}
                          disabled={affiliationOptionsLoading}
                        />
                        {affiliationSearchTerm && (
                          <button
                            type="button"
                            className="absolute right-10 top-1/2 transform -translate-y-1/2"
                            onClick={() => {
                              setAffiliationSearchTerm("");
                              setNewAccount({ ...newAccount, affiliation: "" });
                            }}
                          >
                            <X className="h-5 w-5 text-gray-400" />
                          </button>
                        )}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {isDropdownOpen && filteredAffiliations.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredAffiliations.map((affiliation) => (
                            <li
                              key={affiliation._id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectAffiliation(affiliation)}
                            >
                              {affiliation.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn" onClick={handleCancelCreateAccount}>
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
