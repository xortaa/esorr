"use client";

import { useState, useEffect, useMemo } from "react";
import { UserPlus, X, Trash2, Check, Search, Edit, Plus, RefreshCw } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Account {
  _id: string;
  email: string;
  role: string;
  affiliation?: string;
  isArchived: boolean;
}

interface Affiliation {
  id: string;
  name: string;
}

export default function AccountsDashboard() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({
    email: "",
    role: "",
    affiliation: "",
    isArchived: false,
  });
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [isAffiliationDropdownOpen, setIsAffiliationDropdownOpen] = useState(false);
  const [editAffiliationSearchTerm, setEditAffiliationSearchTerm] = useState("");
  const [isEditAffiliationDropdownOpen, setIsEditAffiliationDropdownOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchAffiliations();
  }, []);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const response = await axios.get("/api/users");
      if (response.status === 200) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const fetchAffiliations = async () => {
    try {
      const response = await axios.get("/api/affiliations");
      if (response.status === 200) {
        setAffiliations(response.data);
      }
    } catch (error) {
      console.error("Error fetching affiliations:", error);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.email.toLowerCase().includes(accountSearchTerm.toLowerCase()) &&
        (filterRole === "All" || account.role === filterRole) &&
        account.isArchived === showArchived
    );
  }, [accounts, accountSearchTerm, filterRole, showArchived]);

  const filteredAffiliations = useMemo(() => {
    return affiliations.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
    );
  }, [affiliations, affiliationSearchTerm]);

  const isCreateButtonDisabled = () => {
    if (!newAccount.email || !newAccount.role) return true;
    if (newAccount.role === "AU" && !newAccount.affiliation) return true;
    return false;
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAffiliationSearchTerm(value);
    setNewAccount((prev) => ({ ...prev, affiliation: value }));
    setIsAffiliationDropdownOpen(true);
  };

  const handleSelectAffiliation = (affiliation: Affiliation) => {
    setNewAccount((prev) => ({ ...prev, affiliation: affiliation.name }));
    setAffiliationSearchTerm(affiliation.name);
    setIsAffiliationDropdownOpen(false);
  };

  const handleArchiveAccount = async (accountId: string) => {
    try {
      const response = await axios.delete(`/api/users/${accountId}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) => (account._id === accountId ? { ...account, isArchived: true } : account))
        );
      }
    } catch (error) {
      console.error("Error archiving account:", error);
    }
  };

  const handleUnarchiveAccount = async (accountId: string) => {
    try {
      const response = await axios.patch(`/api/users/${accountId}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) => (account._id === accountId ? { ...account, isArchived: false } : account))
        );
      }
    } catch (error) {
      console.error("Error unarchiving account:", error);
    }
  };

  const [emailWarning, setEmailWarning] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreateButtonDisabled()) return;

    const emailDomain = newAccount.email.split("@")[1];
    if (emailDomain !== "ust.edu.ph") {
      setEmailWarning(true);
      console.warn("Invalid email domain. Only @ust.edu.ph emails are allowed.");
      return;
    } else {
      setEmailWarning(false);
    }

    try {
      const accountData: any = {
        email: newAccount.email,
        role: newAccount.role,
        requestedBy: session?.user?.email,
      };

      if (newAccount.role === "AU") {
        accountData.affiliation = newAccount.affiliation;
      }

      const response = await axios.post("/api/users", accountData);
      if (response.status === 201) {
        const newAccountData = response.data;
        setAccounts((prevAccounts) => [...prevAccounts, newAccountData]);
        setNewAccount({
          email: "",
          role: "",
          affiliation: "",
          isArchived: false,
        });
        setIsCreatingAccount(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    try {
      const updatedAccount = {
        ...editingAccount,
      };

      const response = await axios.put(`/api/users/${editingAccount._id}`, updatedAccount);
      if (response.status === 200) {
        const updatedAccountData = response.data;
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) => (account._id === updatedAccountData._id ? updatedAccountData : account))
        );
        setIsEditingAccount(false);
        setEditingAccount(null);
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleCancelCreateAccount = () => {
    setEmailWarning(false);
    setIsCreatingAccount(false);
    setNewAccount({
      email: "",
      role: "",
      affiliation: "",
      isArchived: false,
    });
  };

  const handleCancelEditAccount = () => {
    setIsEditingAccount(false);
    setEditingAccount(null);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleEditAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditAffiliationSearchTerm(value);
    setEditingAccount((prev) => (prev ? { ...prev, affiliation: value } : null));
    setIsEditAffiliationDropdownOpen(true);
  };

  const handleSelectEditAffiliation = (affiliation: Affiliation) => {
    setEditingAccount((prev) => (prev ? { ...prev, affiliation: affiliation.name } : null));
    setEditAffiliationSearchTerm(affiliation.name);
    setIsEditAffiliationDropdownOpen(false);
  };

  const filteredEditAffiliations = useMemo(() => {
    return affiliations.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(editAffiliationSearchTerm.toLowerCase())
    );
  }, [affiliations, editAffiliationSearchTerm]);

  return (
    <PageWrapper>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Accounts Dashboard</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search emails..."
              className="input input-bordered w-full"
              value={accountSearchTerm}
              onChange={(e) => setAccountSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <select
              className="select select-bordered w-full"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="OSA">OSA</option>
              <option value="SOCC">SOCC</option>
              <option value="AU">AU</option>
              <option value="RSO">RSO</option>
            </select>
          </div>
          <div className="flex-1">
            <select
              className="select select-bordered w-full"
              value={showArchived ? "archived" : "active"}
              onChange={(e) => setShowArchived(e.target.value === "archived")}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreatingAccount(true)}>
            <UserPlus className="mr-2" />
            Create Account
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Accounts</h2>
          {isLoadingAccounts ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Email</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Role</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{account.email}</td>
                      <td className="py-3 px-4">{account.role}</td>
                      <td className="py-3 px-4">
                        <button
                          className="btn btn-primary btn-xs mr-2"
                          onClick={() => {
                            setEditingAccount(account);
                            setIsEditingAccount(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {account.isArchived ? (
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => handleUnarchiveAccount(account._id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="btn btn-error btn-xs" onClick={() => handleArchiveAccount(account._id)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isCreatingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {emailWarning && <p style={{ color: "red" }}>Only @ust.edu.ph emails are allowed.</p>}
              <div>
                <label className="label">
                  <span className="label-text text-gray-700">Email</span>
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
                  <span className="label-text text-gray-700">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newAccount.role}
                  onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="OSA">OSA</option>
                  <option value="SOCC">SOCC</option>
                  <option value="AU">AU</option>
                  <option value="RSO">RSO</option>
                </select>
              </div>
              {newAccount.role === "AU" && (
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Affiliation</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="input input-bordered w-full pr-10"
                      placeholder="Search for affiliation..."
                      value={affiliationSearchTerm}
                      onChange={handleAffiliationInputChange}
                      onFocus={() => setIsAffiliationDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsAffiliationDropdownOpen(false), 200)}
                    />
                    {affiliationSearchTerm && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => {
                          setAffiliationSearchTerm("");
                          setNewAccount((prev) => ({ ...prev, affiliation: "" }));
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    {isAffiliationDropdownOpen && filteredAffiliations.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredAffiliations.map((affiliation) => (
                          <li
                            key={affiliation.id}
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
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn" onClick={handleCancelCreateAccount}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isCreateButtonDisabled()}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingAccount && editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Account</h2>
            <form onSubmit={handleEditAccount} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-gray-700">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={editingAccount.email}
                  onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-gray-700">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingAccount.role}
                  onChange={(e) => setEditingAccount({ ...editingAccount, role: e.target.value })}
                  required
                >
                  <option value="OSA">OSA</option>
                  <option value="SOCC">SOCC</option>
                  <option value="AU">AU</option>
                  <option value="RSO">RSO</option>
                </select>
              </div>
              {editingAccount.role === "AU" && (
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Affiliation</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="input input-bordered w-full pr-10"
                      placeholder="Search for affiliation..."
                      value={editAffiliationSearchTerm}
                      onChange={handleEditAffiliationInputChange}
                      onFocus={() => setIsEditAffiliationDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsEditAffiliationDropdownOpen(false), 200)}
                    />
                    {editAffiliationSearchTerm && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => {
                          setEditAffiliationSearchTerm("");
                          setEditingAccount((prev) => (prev ? { ...prev, affiliation: "" } : null));
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    {isEditAffiliationDropdownOpen && filteredEditAffiliations.length > 0 && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredEditAffiliations.map((affiliation) => (
                          <li
                            key={affiliation.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectEditAffiliation(affiliation)}
                          >
                            {affiliation.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" className="btn" onClick={handleCancelEditAccount}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
