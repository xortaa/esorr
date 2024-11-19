"use client";

import { useState, useEffect, useMemo } from "react";
import { UserPlus, X, Trash2, Check, Search, Edit, Plus, RefreshCw } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Organization {
  _id: string;
  name: string;
}

interface Position {
  _id?: string;
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
  fullName?: string;
  isArchived: boolean;
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

interface OrganizationSearchProps {
  onSelect: (organization: Organization) => void;
  initialValue?: string;
}

function OrganizationSearch({ onSelect, initialValue = "" }: OrganizationSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get("/api/organizations");
        if (response.status === 200) {
          setOrganizations(response.data);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectOrganization = (organization: Organization) => {
    onSelect(organization);
    setSearchTerm(organization.name);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          className="input input-bordered w-full pr-10"
          placeholder="Search for organization..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isDropdownOpen && filteredOrganizations.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredOrganizations.map((org) => (
            <li
              key={org._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectOrganization(org)}
            >
              {org.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AccountsDashboard() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [signatoryRequests, setSignatoryRequests] = useState<SignatoryRequest[]>([]);
  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({
    email: "",
    role: "",
    positions: [{ organization: "", position: "" }],
    affiliation: "",
    fullName: "",
    isArchived: false,
  });
  const [activeTab, setActiveTab] = useState<"signatory" | "accounts">("signatory");
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingSignatoryRequests, setIsLoadingSignatoryRequests] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchSignatoryRequests();
  }, [showArchived]);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const endpoint = showArchived ? "/api/users/get-archived" : "/api/users";
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const fetchSignatoryRequests = async () => {
    setIsLoadingSignatoryRequests(true);
    try {
      const response = await axios.get("/api/signatory-request");
      if (response.status === 200) {
        setSignatoryRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching signatory requests:", error);
    } finally {
      setIsLoadingSignatoryRequests(false);
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

  const isCreateButtonDisabled = () => {
    if (!newAccount.email || !newAccount.role) return true;
    if (newAccount.role === "RSO-SIGNATORY" && newAccount.positions.some((pos) => !pos.organization || !pos.position))
      return true;
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

  const handleUnarchiveAccount = async (accountId: string) => {
    try {
      const response = await axios.patch(`/api/users/${accountId}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account._id !== accountId));
      }
    } catch (error) {
      console.error("Error unarchiving account:", error);
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreateButtonDisabled()) return;

    try {
      const accountData: any = {
        email: newAccount.email,
        role: newAccount.role,
        requestedBy: session?.user?.email,
        fullName: newAccount.fullName,
        affiliation: newAccount.affiliation,
        isArchived: newAccount.isArchived,
      };

      if (newAccount.role === "RSO-SIGNATORY") {
        accountData.positions = newAccount.positions;
      }

      const response = await axios.post("/api/users", accountData);
      if (response.status === 201) {
        const newAccountData = response.data;
        setAccounts((prevAccounts) => [...prevAccounts, newAccountData]);
        setNewAccount({
          email: "",
          role: "",
          positions: [{ organization: "", position: "" }],
          affiliation: "",
          fullName: "",
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
        positions: editingAccount.positions.map((pos) => ({
          ...pos,
          organization: pos.organization?._id || pos.organization,
        })),
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
    setIsCreatingAccount(false);
    setNewAccount({
      email: "",
      role: "",
      positions: [{ organization: "", position: "" }],
      affiliation: "",
      fullName: "",
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
            {isLoadingSignatoryRequests ? (
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
            )}
          </div>
        )}

        {activeTab === "accounts" && (
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
                      <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Full Name</th>
                      <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Role</th>
                      <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Affiliations and Positions</th>
                      <th className="bg-gray-100 text-left text-gray-600 py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr key={account._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{account.email}</td>
                        <td className="py-3 px-4">{account.fullName}</td>
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
                          <button
                            className="btn btn-primary btn-xs mr-2"
                            onClick={() => {
                              setEditingAccount(account);
                              setIsEditingAccount(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {showArchived ? (
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
                  <span className="label-text text-gray-700">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newAccount.fullName}
                  onChange={(e) => setNewAccount({ ...newAccount, fullName: e.target.value })}
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
                  {newAccount.positions.map((pos, index) => (
                    <div key={index} className="space-y-2">
                      <div>
                        <label className="label">
                          <span className="label-text text-gray-700">Organization</span>
                        </label>
                        <OrganizationSearch
                          onSelect={(org) => {
                            const newPositions = [...newAccount.positions];
                            newPositions[index].organization = org.name;
                            setNewAccount({ ...newAccount, positions: newPositions });
                          }}
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text text-gray-700">Position</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={pos.position}
                          onChange={(e) => {
                            const newPositions = [...newAccount.positions];
                            newPositions[index].position = e.target.value;
                            setNewAccount({ ...newAccount, positions: newPositions });
                          }}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      setNewAccount({
                        ...newAccount,
                        positions: [...newAccount.positions, { organization: "", position: "" }],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Position
                  </button>
                </>
              )}
              <div>
                <label className="label">
                  <span className="label-text text-gray-700">Affiliation</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newAccount.affiliation}
                  onChange={(e) => setNewAccount({ ...newAccount, affiliation: e.target.value })}
                />
              </div>
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
                  <span className="label-text text-gray-700">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editingAccount.fullName || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, fullName: e.target.value })}
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
                  <option value="RSO-SIGNATORY">RSO-SIGNATORY</option>
                </select>
              </div>
              {editingAccount.role === "RSO-SIGNATORY" &&
                editingAccount.positions.map((pos, index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <label className="label">
                        <span className="label-text text-gray-700">Organization</span>
                      </label>
                      <OrganizationSearch
                        initialValue={pos.organization?.name || ""}
                        onSelect={(org) => {
                          const newPositions = [...editingAccount.positions];
                          newPositions[index].organization = org;
                          setEditingAccount({ ...editingAccount, positions: newPositions });
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-gray-700">Position</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={pos.position}
                        onChange={(e) => {
                          const newPositions = [...editingAccount.positions];
                          newPositions[index].position = e.target.value;
                          setEditingAccount({ ...editingAccount, positions: newPositions });
                        }}
                        required
                      />
                    </div>
                  </div>
                ))}
              {editingAccount.role === "RSO-SIGNATORY" && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setEditingAccount({
                      ...editingAccount,
                      positions: [...editingAccount.positions, { organization: { _id: "", name: "" }, position: "" }],
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </button>
              )}
              <div>
                <label className="label">
                  <span className="label-text text-gray-700">Affiliation</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editingAccount.affiliation || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, affiliation: e.target.value })}
                />
              </div>
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
