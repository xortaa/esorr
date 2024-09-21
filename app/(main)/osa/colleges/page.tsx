"use client";

import { useState } from "react";
import { PlusCircle, Trash2, AlertCircle, Edit, Save, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

interface College {
  id: string;
  name: string;
}

export default function CollegeManagement() {
  const [colleges, setColleges] = useState<College[]>([
    { id: "1", name: "College of Science" },
    { id: "2", name: "College of Engineering" },
    { id: "3", name: "College of Liberal Arts" },
  ]);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const addCollege = () => {
    if (newCollegeName.trim() === "") {
      setError("College name cannot be empty");
      return;
    }
    if (colleges.some((college) => college.name.toLowerCase() === newCollegeName.toLowerCase().trim())) {
      setError("College already exists");
      return;
    }
    const newCollege: College = {
      id: Date.now().toString(),
      name: newCollegeName.trim(),
    };
    setColleges([...colleges, newCollege]);
    setNewCollegeName("");
    setError("");
  };

  const removeCollege = (id: string) => {
    setColleges(colleges.filter((college) => college.id !== id));
  };

  const startEditing = (college: College) => {
    setEditingId(college.id);
    setEditName(college.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim() === "") {
      setError("College name cannot be empty");
      return;
    }
    if (colleges.some((college) => college.id !== id && college.name.toLowerCase() === editName.toLowerCase().trim())) {
      setError("College already exists");
      return;
    }
    setColleges(colleges.map((college) => (college.id === id ? { ...college, name: editName.trim() } : college)));
    setEditingId(null);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6">Manage Colleges</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New College</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newCollegeName}
            onChange={(e) => setNewCollegeName(e.target.value)}
            placeholder="Enter college name"
            className="input input-bordered flex-grow"
            aria-label="New college name"
          />
          <button onClick={addCollege} className="btn btn-primary">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add College
          </button>
        </div>
        {error && (
          <div className="text-error mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Colleges</h2>
        {colleges.length === 0 ? (
          <p className="text-gray-500">No colleges added yet.</p>
        ) : (
          <ul className="space-y-2">
            {colleges.map((college) => (
              <li key={college.id} className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
                {editingId === college.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input input-bordered flex-grow mr-2"
                    aria-label={`Edit ${college.name}`}
                  />
                ) : (
                  <span>{college.name}</span>
                )}
                <div className="flex space-x-2">
                  {editingId === college.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(college.id)}
                        className="btn btn-sm btn-primary"
                        aria-label={`Save changes for ${college.name}`}
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
                        onClick={() => startEditing(college)}
                        className="btn btn-sm btn-ghost"
                        aria-label={`Edit ${college.name}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeCollege(college.id)}
                        className="btn btn-sm btn-neutral"
                        aria-label={`Remove ${college.name}`}
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
