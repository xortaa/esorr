"use client";

import { useState, useEffect, useMemo } from "react";
import { PlusCircle, Trash2, AlertCircle, Edit, Save, X, Search } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { AffiliationResponse } from "@/types";

export default function AffiliationManagement() {
  const [affiliations, setAffiliations] = useState<AffiliationResponse[]>([]);
  const [newAffiliationName, setNewAffiliationName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [affiliationsResponseLoading, setAffiliationsResponseLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const { data } = await axios.get("/api/affiliations");
        setAffiliations(data);
        setAffiliationsResponseLoading(false);
      } catch (error) {
        console.error("Error fetching affiliations:", error);
        setError("Failed to fetch affiliations. Please try again.");
      }
    };

    fetchAffiliations();
  }, []);

  const filteredAffiliations = useMemo(() => {
    return affiliations.filter((affiliation) => affiliation.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [affiliations, searchTerm]);

  const addAffiliation = async () => {
    if (newAffiliationName.trim() === "") {
      setError("Affiliation name cannot be empty");
      return;
    }
    if (
      affiliations.some((affiliation) => affiliation.name.toLowerCase() === newAffiliationName.toLowerCase().trim())
    ) {
      setError("Affiliation already exists");
      return;
    }
    try {
      const { data: newAffiliation } = await axios.post("/api/affiliations", { name: newAffiliationName.trim() });
      setAffiliations([...affiliations, newAffiliation]);
      setNewAffiliationName("");
      setError("");
    } catch (error) {
      console.error("Error adding affiliation:", error);
      setError("Failed to add affiliation. Please try again.");
    }
  };

  const removeAffiliation = async (id: string) => {
    try {
      await axios.patch(`/api/affiliations/${id}`, {
        isArchived: true,
      });
      setAffiliations(affiliations.filter((affiliation) => affiliation._id !== id));
    } catch (error) {
      console.error("Error deleting affiliation:", error);
      setError("Failed to delete affiliation. Please try again.");
    }
  };

  const startEditing = (affiliation: AffiliationResponse) => {
    setEditingId(affiliation._id);
    setEditName(affiliation.name);
  };

  const saveEdit = async (id: string) => {
    if (editName.trim() === "") {
      setError("Affiliation name cannot be empty");
      return;
    }
    if (
      affiliations.some(
        (affiliation) => affiliation._id !== id && affiliation.name.toLowerCase() === editName.toLowerCase().trim()
      )
    ) {
      setError("Affiliation already exists");
      return;
    }

    try {
      await axios.patch(`/api/affiliations/${id}`, {
        name: editName.trim(),
      });

      setAffiliations(
        affiliations.map((affiliation) =>
          affiliation._id === id ? { ...affiliation, name: editName.trim() } : affiliation
        )
      );
      setEditingId(null);
      setError("");
    } catch (error) {
      console.error("Error updating affiliation:", error);
      setError("Failed to update affiliation. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAffiliation();
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6">Manage Affiliations</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Faculty/College/Institute/School</h2>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newAffiliationName}
            onChange={(e) => setNewAffiliationName(e.target.value)}
            placeholder="Enter affiliation name"
            className="input input-bordered flex-grow"
            aria-label="New affiliation name"
          />
          <button type="submit" className="btn btn-primary">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Affiliation
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
        {/* search input */}
        <div className="mb-6 flex justify-between items-center ">
          <h2 className="text-xl font-semibold mb-4">Existing Affiliations</h2>
          <label className="input input-bordered flex items-center gap-2 max-w-xs">
            <input
              type="text"
              className="grow"
              placeholder="Search affiliations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
        {affiliationsResponseLoading ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-dots loading-md"></span>
          </div>
        ) : filteredAffiliations.length === 0 ? (
          <p className="text-gray-500">No affiliations found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredAffiliations.map((affiliation) => (
              <li key={affiliation._id} className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
                {editingId === affiliation._id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input input-bordered flex-grow mr-2"
                    aria-label={`Edit ${affiliation.name}`}
                  />
                ) : (
                  <span>{affiliation.name}</span>
                )}
                <div className="flex space-x-2">
                  {editingId === affiliation._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(affiliation._id)}
                        className="btn btn-sm btn-primary"
                        aria-label={`Save changes for ${affiliation.name}`}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="btn btn-sm btn-ghost" aria-label="Cancel editing">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(affiliation)}
                        className="btn btn-sm btn-ghost"
                        aria-label={`Edit ${affiliation.name}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeAffiliation(affiliation._id)}
                        className="btn btn-sm btn-neutral"
                        aria-label={`Remove ${affiliation.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}
