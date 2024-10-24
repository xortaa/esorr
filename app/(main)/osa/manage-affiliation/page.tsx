"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  Trash2,
  AlertCircle,
  Edit,
  Save,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  School,
  BookOpen,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { Affiliation, Program } from "@/types";

export default function AffiliationManagement() {
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [newAffiliationName, setNewAffiliationName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [affiliationsResponseLoading, setAffiliationsResponseLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProgramName, setNewProgramName] = useState("");
  const [expandedAffiliationId, setExpandedAffiliationId] = useState<string | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editProgramName, setEditProgramName] = useState("");

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

  const startEditing = (affiliation: Affiliation) => {
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

  const addProgram = async (affiliationId: string) => {
    if (newProgramName.trim() === "") {
      setError("Program name cannot be empty");
      return;
    }
    try {
      const { data: updatedAffiliation } = await axios.post(`/api/affiliations/${affiliationId}/programs`, {
        name: newProgramName.trim(),
      });
      setAffiliations(affiliations.map((aff) => (aff._id === affiliationId ? updatedAffiliation : aff)));
      setNewProgramName("");
      setError("");
    } catch (error) {
      console.error("Error adding program:", error);
      setError("Failed to add program. Please try again.");
    }
  };

  const toggleExpand = (affiliationId: string) => {
    setExpandedAffiliationId(expandedAffiliationId === affiliationId ? null : affiliationId);
  };

  const startEditingProgram = (program: Program) => {
    setEditingProgramId(program._id);
    setEditProgramName(program.name);
  };

  const saveEditProgram = async (affiliationId: string, programId: string) => {
    if (editProgramName.trim() === "") {
      setError("Program name cannot be empty");
      return;
    }
    try {
      const { data: updatedAffiliation } = await axios.patch(
        `/api/affiliations/${affiliationId}/programs/${programId}`,
        {
          name: editProgramName.trim(),
        }
      );
      setAffiliations(affiliations.map((aff) => (aff._id === affiliationId ? updatedAffiliation : aff)));
      setEditingProgramId(null);
      setError("");
    } catch (error) {
      console.error("Error updating program:", error);
      setError("Failed to update program. Please try again.");
    }
  };

  const cancelEditProgram = () => {
    setEditingProgramId(null);
    setError("");
  };

  const deleteProgram = async (affiliationId: string, programId: string) => {
    try {
      const { data: updatedAffiliation } = await axios.delete(
        `/api/affiliations/${affiliationId}/programs/${programId}`
      );
      setAffiliations(affiliations.map((aff) => (aff._id === affiliationId ? updatedAffiliation : aff)));
    } catch (error) {
      console.error("Error deleting program:", error);
      setError("Failed to delete program. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Affiliation Management</h1>

      <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <School className="mr-2" />
          Add New Affiliation
        </h2>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newAffiliationName}
            onChange={(e) => setNewAffiliationName(e.target.value)}
            placeholder="Enter affiliation name"
            className="input input-bordered flex-grow"
            aria-label="New affiliation name"
          />
          <button type="submit" className="btn bg-primary">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add
          </button>
        </form>
        {error && (
          <div className="text-error mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <BookOpen className="mr-2" />
            Existing Affiliations
          </h2>
          <div className="relative">
            <input
              type="text"
              className="input input-bordered pl-10"
              placeholder="Search affiliations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {affiliationsResponseLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : filteredAffiliations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No affiliations found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredAffiliations.map((affiliation) => (
              <li
                key={affiliation._id}
                className="bg-base-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out"
              >
                <div className="p-4 flex items-center justify-between">
                  {editingId === affiliation._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input input-bordered flex-grow mr-2"
                      aria-label={`Edit ${affiliation.name}`}
                    />
                  ) : (
                    <span className="font-semibold text-lg">{affiliation.name}</span>
                  )}
                  <div className="flex space-x-2">
                    {editingId === affiliation._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(affiliation._id)}
                          className="btn btn-ghost"
                          aria-label={`Save changes for ${affiliation.name}`}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn bg-red-100 text-red-800 "
                          aria-label="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(affiliation)}
                          className="btn bg-blue-100 text-blue-800"
                          aria-label={`Edit ${affiliation.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeAffiliation(affiliation._id)}
                          className="btn bg-red-100 text-red-800"
                          aria-label={`Remove ${affiliation.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleExpand(affiliation._id)}
                          className="btn btn-ghost"
                          aria-label={`Toggle programs for ${affiliation.name}`}
                        >
                          {expandedAffiliationId === affiliation._id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {expandedAffiliationId === affiliation._id && (
                  <div className="bg-base-100 p-4 border-t border-base-300">
                    <h3 className="text-lg font-semibold mb-2">Programs</h3>
                    <ul className="space-y-2 mb-4">
                      {affiliation.programs.map((program) => (
                        <li key={program._id} className="bg-base-200 p-2 rounded-md flex items-center justify-between">
                          {editingProgramId === program._id ? (
                            <input
                              type="text"
                              value={editProgramName}
                              onChange={(e) => setEditProgramName(e.target.value)}
                              className="input input-bordered flex-grow mr-2"
                              aria-label={`Edit ${program.name}`}
                            />
                          ) : (
                            <span>{program.name}</span>
                          )}
                          <div className="flex space-x-2">
                            {editingProgramId === program._id ? (
                              <>
                                <button
                                  onClick={() => saveEditProgram(affiliation._id, program._id)}
                                  className="btn btn-ghost"
                                  aria-label={`Save changes for ${program.name}`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditProgram}
                                  className="btn bg-red-100 text-red-800"
                                  aria-label="Cancel editing program"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditingProgram(program)}
                                  className="btn bg-blue-100 text-blue-800"
                                  aria-label={`Edit ${program.name}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProgram(affiliation._id, program._id)}
                                  className="btn bg-red-100 text-red-800"
                                  aria-label={`Delete ${program.name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                        placeholder="Enter program name"
                        className="input input-bordered flex-grow"
                        aria-label="New program name"
                      />
                      <button onClick={() => addProgram(affiliation._id)} className="btn bg-blue-100 text-blue-800">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}
