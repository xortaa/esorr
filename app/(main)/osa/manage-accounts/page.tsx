"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, X, Trash2, Check } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Organization {
  _id: string;
  name: string;
}

interface Position {
  _id: string;
  organization?: Organization;
  position: string;
  affiliation?: string;
}

interface Account {
  _id: string;
  email: string;
  role: string;
  positions: Position[];
  affiliation?: string;
}

interface SignatoryRequest {
  _id: string;
  email: string;
  role: string;
  position: string;
  organization: Organization;
  requestedBy: string;
  submittedAt: string;
}

export default function AccountsDashboard() {
  const [affiliationOptions, setAffiliationOptions] = useState<Organization[]>([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [signatoryRequests, setSignatoryRequests] = useState<SignatoryRequest[]>([]);
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    role: "",
    organization: "",
    position: "",
    affiliation: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"signatory" | "accounts">("signatory");

  useEffect(() => {
    fetchAccounts();
    fetchSignatoryRequests();
    fetchAffiliations();
  }, [showArchived]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status === 200) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchSignatoryRequests = async () => {
    try {
      const response = await axios.get("/api/signatory-request");
      if (response.status === 200) {
        setSignatoryRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching signatory requests:", error);
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

  const filteredSignatoryRequests = useMemo(() => {
    return signatoryRequests.filter(
      (request) =>
        request.email.toLowerCase().includes(accountSearchTerm.toLowerCase()) &&
        (filterRole === "All" || request.role === filterRole)
    );
  }, [signatoryRequests, accountSearchTerm, filterRole]);

  const filteredAffiliations = useMemo(() => {
    return affiliationOptions.filter((affiliation) =>
      affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
    );
  }, [affiliationOptions, affiliationSearchTerm]);

  const isCreateButtonDisabled = () => {
    if (!newAccount.email || !newAccount.role) return true;
    if (newAccount.role === "RSO-SIGNATORY" && (!newAccount.organization || !newAccount.position)) return true;
    if (newAccount.role === "AU" && !newAccount.affiliation) return true;
    return false;
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

  const handleApproveSignatoryRequest = async (requestId: string) => {
    try {
      const response = await axios.patch(`/api/signatory-request/${requestId}`);
      if (response.status === 200) {
        setSignatoryRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        fetchAccounts();
      }
    } catch (error) {
      console.error("Error approving signatory request:", error);
    }
  };

  const handleRejectSignatoryRequest = async (requestId: string) => {
    try {
      const response = await axios.delete(`/api/signatory-request/${requestId}`);
      if (response.status === 200) {
        setSignatoryRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
      }
    } catch (error) {
      console.error("Error rejecting signatory request:", error);
    }
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAffiliationSearchTerm(e.target.value);
    setNewAccount({ ...newAccount, organization: "" });
    setIsDropdownOpen(true);
  };

  const handleAffiliationInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const handleSelectAffiliation = (affiliation: Organization) => {
    setNewAccount({ ...newAccount, organization: affiliation.name });
    setAffiliationSearchTerm(affiliation.name);
    setIsDropdownOpen(false);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreateButtonDisabled()) return;

    try {
      const accountData: any = {
        email: newAccount.email,
        role: newAccount.role,
        requestedBy: session?.user?.email,
      };

      if (newAccount.role === "RSO-SIGNATORY") {
        accountData.positions = [{ organization: newAccount.organization, position: newAccount.position }];
      }

      if (newAccount.role === "AU") {
        accountData.affiliation = newAccount.affiliation;
        accountData.positions = [{ affiliation: newAccount.affiliation, position: newAccount.position }];
      }

      if (newAccount.role === "SOCC") {
        accountData.affiliation = "SOCC";
        accountData.positions = [{ affiliation: "SOCC", position: newAccount.position }];
      }

      const response = await axios.post("/api/users", accountData);
      if (response.status === 201) {
        setAccounts((prevAccounts) => [...prevAccounts, response.data]);
        setNewAccount({ email: "", role: "", organization: "", position: "", affiliation: "" });
        setIsCreatingAccount(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleCancelCreateAccount = () => {
    setIsCreatingAccount(false);
    setNewAccount({ email: "", role: "", organization: "", position: "", affiliation: "" });
    setAffiliationSearchTerm("");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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
              <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
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

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "signatory" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            } rounded-l-lg transition-colors duration-200`}
            onClick={() => setActiveTab("signatory")}
          >
            Signatory Requests
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "accounts" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            } rounded-r-lg transition-colors duration-200`}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </button>
        </div>

        {activeTab === "signatory" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Signatory Requests</h2>
            <div className="overflow-x-auto bg-white rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Email</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Role</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Position</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Organization</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Requested By</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Submitted At</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSignatoryRequests.map((request) => (
                    <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{request.email}</td>
                      <td className="py-3 px-4">{request.role}</td>
                      <td className="py-3 px-4">{request.position}</td>
                      <td className="py-3 px-4">{request.organization?.name || "-"}</td>
                      <td className="py-3 px-4">{request.requestedBy}</td>
                      <td className="py-3 px-4">{formatDateTime(request.submittedAt)}</td>
                      <td className="py-3 px-4">
                        <button
                          className="btn btn-success btn-xs mr-2"
                          onClick={() => handleApproveSignatoryRequest(request._id)}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleRejectSignatoryRequest(request._id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Accounts</h2>
            <div className="overflow-x-auto bg-white rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Email</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Role</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Affiliations and Positions</th>
                    <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{account.email}</td>
                      <td className="py-3 px-4">{account.role}</td>
                      <td className="py-3 px-4">
                        <ul>
                          {account.positions.map((pos, index) => (
                            <li key={pos._id || index}>
                              {pos.affiliation || pos.organization?.name}: {pos.position}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-4">
                        {!showArchived && (
                          <button className="btn btn-ghost btn-xs" onClick={() => handleArchiveAccount(account._id)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isCreatingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
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
                  <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
                </select>
              </div>
              {newAccount.role === "RSO-SIGNATORY" && (
                <>
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-700">Organization</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pr-10"
                        placeholder="Search for organization..."
                        value={affiliationSearchTerm}
                        onChange={handleAffiliationInputChange}
                        onFocus={handleAffiliationInputFocus}
                        onBlur={handleInputBlur}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {isDropdownOpen && filteredAffiliations.length > 0 && (
                      <ul className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
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
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-700">Position</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={newAccount.position}
                      onChange={(e) => setNewAccount({ ...newAccount, position: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
              {(newAccount.role === "AU" || newAccount.role === "SOCC") && (
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Position</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newAccount.position}
                    onChange={(e) => setNewAccount({ ...newAccount, position: e.target.value })}
                    required
                  />
                </div>
              )}
              {newAccount.role === "AU" && (
                <div>
                  <label className="label">
                    <span className="label-text text-gray-700">Affiliation</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newAccount.affiliation}
                    onChange={(e) => setNewAccount({ ...newAccount, affiliation: e.target.value })}
                    required
                  />
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
    </PageWrapper>
  );
}
