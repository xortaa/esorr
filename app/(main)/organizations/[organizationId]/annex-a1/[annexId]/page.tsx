"use client";

import { useState, useEffect } from "react";
import { UserPlus, X, Trash2, Search, FilePenLine, Eye, PenTool, List, Grid, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PageWrapper from "@/components/PageWrapper";
import { Officer, OfficerData, EducationalBackground, ExtraCurricularActivity } from "@/types";

export default function OfficerManager({ params }: { params: { organizationId: string; annexId: string } }) {
  const { organizationId, annexId } = params;

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">ANNEX A-1 OFFICER'S INFORMATION SHEET DASHBOARD</h1>
        <p className="text-sm text-slate-500">
          Manage and create officer information sheets for student organizations. Use the table below to view existing
          officer information sheets.
        </p>
      </motion.div>
      <OfficersTable organizationId={organizationId} annexId={annexId} />
    </PageWrapper>
  );
}

function OfficersTable({ organizationId, annexId }: { organizationId: string; annexId: string }) {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">(localStorage.getItem("officersViewMode") as "table" | "card" || "table");

  useEffect(() => {
    const savedViewMode = localStorage.getItem("officersViewMode") as "table" | "card";
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    fetchOfficers();
  }, []);

  useEffect(() => {
    localStorage.setItem("officersViewMode", viewMode);
  }, [viewMode]);

  const fetchOfficers = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-a1/${annexId}/officers`);
      setOfficers(response.data);
    } catch (error) {
      console.error("Error fetching officers:", error);
    }
  };

  const filteredOfficers = officers.filter((officer) =>
    officer.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOfficer = async (id: string) => {
    try {
      await axios.delete(`/api/annexes/${organizationId}/annex-a1/${annexId}/officers/${id}`);
      setOfficers(officers.filter((officer) => officer._id !== id));
    } catch (error) {
      console.error("Error deleting officer:", error);
    }
  };

  const handleEditOfficer = (officer: Officer) => {
    setEditingOfficer(officer);
  };

  const handleAddSignature = (officerId: string) => {
    // Implement signature functionality here
    console.log(`Add signature for officer ${officerId}`);
  };

  const openDeleteModal = (officer: Officer) => {
    setOfficerToDelete(officer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (officerToDelete) {
      handleDeleteOfficer(officerToDelete._id);
    }
    setDeleteModalOpen(false);
  };

  const renderTableView = () => (
    <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOfficers.map((officer) => (
            <motion.tr
              key={officer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={officer.image || "/assets/user-placeholder.png"}
                        alt={`Avatar of ${officer.firstName} ${officer.lastName}`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{`${officer.firstName} ${officer.lastName}`}</div>
                  </div>
                </div>
              </td>
              <td>{officer.position}</td>
              <td>
                <span
                  className={`badge ${
                    officer.status === "COMPLETE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {officer.status}
                </span>
              </td>
              <td className="text-right">
                <div className="flex justify-end space-x-2">
                  <button className="btn btn-xs bg-blue-100 text-blue-800" onClick={() => handleEditOfficer(officer)}>
                    <FilePenLine size={16} />
                    Edit
                  </button>
                  <button className="btn btn-xs btn-primary" onClick={() => handleAddSignature(officer._id)}>
                    <PenTool size={16} />
                    Add Signature
                  </button>
                  <button className="btn btn-ghost btn-xs">
                    <Eye size={16} />
                    Preview PDF
                  </button>
                  <button className="btn btn-xs text-error bg-red-100" onClick={() => openDeleteModal(officer)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOfficers.map((officer) => (
        <motion.div
          key={officer._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full">
                  <img
                    src={officer.image || "/assets/user-placeholder.png"}
                    alt={`Avatar of ${officer.firstName} ${officer.lastName}`}
                  />
                </div>
              </div>
              <div>
                <h2 className="card-title">{`${officer.firstName} ${officer.lastName}`}</h2>
                <p className="text-sm opacity-70">{officer.position}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`badge ${
                  officer.status === "COMPLETE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {officer.status}
              </span>
            </div>
            <div className="card-actions justify-between items-center mb-2">
              <button className="btn bg-blue-100 text-blue-800 btn-sm" onClick={() => handleEditOfficer(officer)}>
                <FilePenLine size={18} />
                Edit
              </button>
              <button className="btn btn-ghost btn-sm">
                <Eye size={18} />
                Preview PDF
              </button>
            </div>
            <div className="card-actions justify-between items-center">
              <button className="btn btn-ghost btn-sm bg-red-100 text-error" onClick={() => openDeleteModal(officer)}>
                <Trash2 size={18} />
                Delete
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleAddSignature(officer._id)}>
                <PenTool size={18} />
                Add Signature
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <CreateOfficerModal
          organizationId={organizationId}
          annexId={annexId}
          officers={officers}
          setOfficers={setOfficers}
        />
        <div className="flex items-center gap-4">
          <button
            className={`btn btn-ghost ${viewMode === "table" ? "btn-active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <List size={16} />
            Table View
          </button>
          <button
            className={`btn btn-ghost ${viewMode === "card" ? "btn-active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            <Grid size={16} />
            Grid View
          </button>

          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search Officer"
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square">
                <Search />
              </button>
            </div>
          </div>
        </div>
      </div>
      {viewMode === "table" ? renderTableView() : renderCardView()}
      {editingOfficer && (
        <EditOfficerModal
          officer={editingOfficer}
          setOfficer={setEditingOfficer}
          organizationId={organizationId}
          annexId={annexId}
          updateOfficers={fetchOfficers}
        />
      )}
      <input
        type="checkbox"
        id="delete-modal"
        className="modal-toggle"
        checked={deleteModalOpen}
        onChange={() => setDeleteModalOpen(!deleteModalOpen)}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete {officerToDelete?.firstName} {officerToDelete?.lastName}? This action is
            irreversible.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn bg-red-100 text-red-800" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CreateOfficerModal({
  organizationId,
  annexId,
  officers,
  setOfficers,
}: {
  organizationId: string;
  annexId: string;
  officers: OfficerData[];
  setOfficers: (officers: OfficerData[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState<OfficerData>({
    firstName: "",
    middleName: "",
    lastName: "",
    position: "",
    affiliation: "",
    program: "",
    mobileNumber: "",
    residence: "",
    email: "",
    facebook: "",
    status: "INCOMPLETE",
    image: "",
    religion: "",
    citizenship: "",
    gender: "",
    educationalBackground: [
      { level: "Secondary", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
      { level: "College/Major", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
      { level: "Special Training", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
    ],
    recordOfExtraCurricularActivities: [
      { nameOfOrganization: "", position: "", inclusiveDates: "" },
      { nameOfOrganization: "", position: "", inclusiveDates: "" },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewOfficer({ ...newOfficer, [name]: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    } else {
      const uppercaseFields = [
        "firstName",
        "middleName",
        "lastName",
        "religion",
        "citizenship",
        "position",
        "affiliation",
        "program",
        "residence",
      ];
      setNewOfficer({
        ...newOfficer,
        [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
      });
    }
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationalBackground | "name" | "location",
    value: string
  ) => {
    const updatedEducation = [...newOfficer.educationalBackground];
    if (field === "name" || field === "location") {
      const currentNameAndLocation = updatedEducation[index].nameAndLocation.split(" - ");
      const newName = field === "name" ? value : currentNameAndLocation[0] || "";
      const newLocation = field === "location" ? value : currentNameAndLocation[1] || "";
      updatedEducation[index].nameAndLocation =
        newName && newLocation ? `${newName} - ${newLocation}` : newName || newLocation;
    } else {
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    }
    setNewOfficer({ ...newOfficer, educationalBackground: updatedEducation });
  };

  const handleExtraCurricularChange = (index: number, field: keyof ExtraCurricularActivity, value: string) => {
    const updatedActivities = [...newOfficer.recordOfExtraCurricularActivities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setNewOfficer({ ...newOfficer, recordOfExtraCurricularActivities: updatedActivities });
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewOfficer({
      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      affiliation: "",
      program: "",
      mobileNumber: "",
      residence: "",
      email: "",
      facebook: "",
      status: "INCOMPLETE",
      image: "",
      religion: "",
      citizenship: "",
      gender: "",
      educationalBackground: [
        { level: "Secondary", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
        { level: "College/Major", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
        { level: "Special Training", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
      ],
      recordOfExtraCurricularActivities: [
        { nameOfOrganization: "", position: "", inclusiveDates: "" },
        { nameOfOrganization: "", position: "", inclusiveDates: "" },
      ],
    });
  };

  const checkCompletionStatus = (officer: OfficerData): "COMPLETE" | "INCOMPLETE" => {
    const requiredFields = [
      "firstName",
      "lastName",
      "position",
      "affiliation",
      "program",
      "mobileNumber",
      "residence",
      "email",
      "facebook",
      "religion",
      "citizenship",
      "gender",
    ];

    const isComplete = requiredFields.every((field) => officer[field as keyof OfficerData] !== "");

    const isSecondaryEducationComplete =
      officer.educationalBackground[0].nameAndLocation !== "" &&
      officer.educationalBackground[0].yearOfGraduation !== "";

    const isCollegeEducationComplete =
      officer.educationalBackground[1].nameAndLocation !== "" &&
      officer.educationalBackground[1].yearOfGraduation !== "";

    return isComplete && isSecondaryEducationComplete && isCollegeEducationComplete ? "COMPLETE" : "INCOMPLETE";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const officerToSubmit = {
        ...newOfficer,
        status: checkCompletionStatus(newOfficer),
      };
      const response = await axios.post(`/api/annexes/${organizationId}/annex-a1/${annexId}/officers`, officerToSubmit);
      setOfficers([...officers, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error creating officer:", error);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        <UserPlus />
        Add Officer
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Officer Details</h2>
                  <button className="btn btn-ghost" onClick={handleClose} type="button">
                    <X />
                  </button>
                </div>
                <p className="text-sm text-slate-500">Enter the details below for the officer</p>
                <div className="space-y-6">
                  <div className="mb-6">
                    <label className="label mb-1">Officer's 1x1 Picture</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewOfficer({ ...newOfficer, image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="file-input file-input-bordered w-full"
                    />
                    {newOfficer.image && (
                      <div className="mt-2">
                        <img src={newOfficer.image} alt="Officer's 1x1 Picture" className="w-32 h-32 object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="w-full">
                      <label className="label mb-1">FIRST NAME</label>
                      <input
                        name="firstName"
                        className="input input-bordered w-full uppercase"
                        placeholder="JUAN MIGUEL"
                        value={newOfficer.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">MIDDLE NAME</label>
                      <input
                        name="middleName"
                        className="input input-bordered w-full uppercase"
                        placeholder="GONZALEZ"
                        value={newOfficer.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">LAST NAME</label>
                      <input
                        name="lastName"
                        className="input input-bordered w-full uppercase"
                        placeholder="DELA CRUZ"
                        value={newOfficer.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">RELIGION</label>
                      <input
                        name="religion"
                        className="input input-bordered w-full uppercase"
                        placeholder="CATHOLIC"
                        value={newOfficer.religion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">CITIZENSHIP</label>
                      <input
                        name="citizenship"
                        className="input input-bordered w-full uppercase"
                        placeholder="FILIPINO"
                        value={newOfficer.citizenship}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">GENDER</label>
                      <div className="flex gap-4">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary"
                            value="MALE"
                            checked={newOfficer.gender === "MALE"}
                            onChange={handleInputChange}
                          />
                          <span className="label-text ml-2">MALE</span>
                        </label>
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary"
                            value="FEMALE"
                            checked={newOfficer.gender === "FEMALE"}
                            onChange={handleInputChange}
                          />
                          <span className="label-text ml-2">FEMALE</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="w-full">
                      <label className="label mb-1">POSITION</label>
                      <input
                        name="position"
                        className="input input-bordered w-full uppercase"
                        placeholder="EXTERNAL VICE PRESIDENT"
                        value={newOfficer.position}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">COLLEGE / AFFILIATION</label>
                      <input
                        name="affiliation"
                        className="input input-bordered w-full uppercase"
                        placeholder="COLLEGE OF EDUCATION"
                        value={newOfficer.affiliation}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">PROGRAM / MAJOR</label>
                      <input
                        name="program"
                        className="input input-bordered w-full uppercase"
                        placeholder="BS FOOD TECHNOLOGY"
                        value={newOfficer.program}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">MOBILE NUMBER</label>
                      <input
                        name="mobileNumber"
                        className="input input-bordered w-full"
                        placeholder="+63 XXX XXX XXXX"
                        value={newOfficer.mobileNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">RESIDENCE</label>
                      <input
                        name="residence"
                        className="input input-bordered w-full"
                        placeholder="Full address"
                        value={newOfficer.residence}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">EMAIL</label>
                      <input
                        name="email"
                        type="email"
                        className="input input-bordered w-full"
                        placeholder="example@email.com"
                        value={newOfficer.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <label className="label mb-1">FACEBOOK</label>
                      <input
                        name="facebook"
                        className="input input-bordered w-full"
                        placeholder="Facebook profile URL or username"
                        value={newOfficer.facebook}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Educational Background</h3>
                    {newOfficer.educationalBackground.map((edu, index) => (
                      <div key={index} className="mb-4 p-4 border rounded">
                        <h4 className="font-semibold mb-2">{edu.level}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="label mb-1">Name of Institution</label>
                            <input
                              className="input input-bordered w-full"
                              value={edu.nameAndLocation.split(" - ")[0]}
                              onChange={(e) => handleEducationChange(index, "name", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Location</label>
                            <input
                              className="input input-bordered w-full"
                              value={edu.nameAndLocation.split(" - ")[1]}
                              onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Year of Graduation</label>
                            <input
                              className="input input-bordered w-full"
                              value={edu.yearOfGraduation}
                              onChange={(e) => handleEducationChange(index, "yearOfGraduation", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Organization/Club/Society</label>
                            <input
                              className="input input-bordered w-full"
                              value={edu.organization}
                              onChange={(e) => handleEducationChange(index, "organization", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Position</label>
                            <input
                              className="input input-bordered w-full"
                              value={edu.position}
                              onChange={(e) => handleEducationChange(index, "position", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Record of Extra-Curricular Activities</h3>
                    {newOfficer.recordOfExtraCurricularActivities.map((activity, index) => (
                      <div key={index} className="mb-4 p-4 border rounded">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="label mb-1">Name of Organization</label>
                            <input
                              className="input input-bordered w-full"
                              value={activity.nameOfOrganization}
                              onChange={(e) => handleExtraCurricularChange(index, "nameOfOrganization", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Position</label>
                            <input
                              className="input input-bordered w-full"
                              value={activity.position}
                              onChange={(e) => handleExtraCurricularChange(index, "position", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label mb-1">Inclusive Dates</label>
                            <input
                              className="input input-bordered w-full"
                              placeholder="e.g. 2022-2023"
                              value={activity.inclusiveDates}
                              onChange={(e) => handleExtraCurricularChange(index, "inclusiveDates", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">
                    ADD OFFICER
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EditOfficerModal({
  officer,
  setOfficer,
  organizationId,
  annexId,
  updateOfficers,
}: {
  officer: Officer;
  setOfficer: (officer: Officer | null) => void;
  organizationId: string;
  annexId: string;
  updateOfficers: () => void;
}) {
  const [editedOfficer, setEditedOfficer] = useState<Officer>({
    ...officer,
    educationalBackground: officer.educationalBackground || [
      { level: "Secondary", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
      { level: "College/Major", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
      { level: "Special Training", nameAndLocation: "", yearOfGraduation: "", organization: "", position: "" },
    ],
    recordOfExtraCurricularActivities: officer.recordOfExtraCurricularActivities || [
      { nameOfOrganization: "", position: "", inclusiveDates: "" },
      { nameOfOrganization: "", position: "", inclusiveDates: "" },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditedOfficer({ ...editedOfficer, [name]: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    } else {
      const uppercaseFields = [
        "firstName",
        "middleName",
        "lastName",
        "religion",
        "citizenship",
        "position",
        "affiliation",
        "program",
        "residence",
      ];
      setEditedOfficer({
        ...editedOfficer,
        [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
      });
    }
  };

  const handleEducationChange = (index: number, field: keyof EducationalBackground, value: string) => {
    const updatedEducation = [...editedOfficer.educationalBackground];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEditedOfficer({ ...editedOfficer, educationalBackground: updatedEducation });
  };

  const handleExtraCurricularChange = (index: number, field: keyof ExtraCurricularActivity, value: string) => {
    const updatedActivities = [...editedOfficer.recordOfExtraCurricularActivities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setEditedOfficer({ ...editedOfficer, recordOfExtraCurricularActivities: updatedActivities });
  };

  const checkCompletionStatus = (officer: Officer): "COMPLETE" | "INCOMPLETE" => {
    const requiredFields = [
      "firstName",
      "lastName",
      "position",
      "affiliation",
      "program",
      "mobileNumber",
      "residence",
      "email",
      "facebook",
      "religion",
      "citizenship",
      "gender",
    ];

    const isComplete = requiredFields.every((field) => officer[field as keyof Officer] !== "");

    const isSecondaryEducationComplete =
      officer.educationalBackground[0].nameAndLocation !== "" &&
      officer.educationalBackground[0].yearOfGraduation !== "";

    const isCollegeEducationComplete =
      officer.educationalBackground[1].nameAndLocation !== "" &&
      officer.educationalBackground[1].yearOfGraduation !== "";

    return isComplete && isSecondaryEducationComplete && isCollegeEducationComplete ? "COMPLETE" : "INCOMPLETE";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const officerToSubmit = {
        ...editedOfficer,
        status: checkCompletionStatus(editedOfficer),
      };
      await axios.patch(`/api/annexes/${organizationId}/annex-a1/${annexId}/officers/${officer._id}`, officerToSubmit);
      updateOfficers();
      setOfficer(null);
    } catch (error) {
      console.error("Error updating officer:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">Edit Officer Details</h2>
              <button className="btn btn-ghost" onClick={() => setOfficer(null)} type="button">
                <X />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Edit the details below for the officer</p>
            <div className="space-y-6">
              <div className="mb-6">
                <label className="label mb-1">Officer's 1x1 Picture</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="file-input file-input-bordered w-full"
                />
                {editedOfficer.image && (
                  <div className="mt-2">
                    <img src={editedOfficer.image} alt="Officer's 1x1 Picture" className="w-32 h-32 object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="w-full">
                  <label className="label mb-1">FIRST NAME</label>
                  <input
                    name="firstName"
                    className="input input-bordered w-full uppercase"
                    placeholder="JUAN MIGUEL"
                    value={editedOfficer.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">MIDDLE NAME</label>
                  <input
                    name="middleName"
                    className="input input-bordered w-full uppercase"
                    placeholder="GONZALEZ"
                    value={editedOfficer.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">LAST NAME</label>
                  <input
                    name="lastName"
                    className="input input-bordered w-full uppercase"
                    placeholder="DELA CRUZ"
                    value={editedOfficer.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">RELIGION</label>
                  <input
                    name="religion"
                    className="input input-bordered w-full uppercase"
                    placeholder="CATHOLIC"
                    value={editedOfficer.religion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">CITIZENSHIP</label>
                  <input
                    name="citizenship"
                    className="input input-bordered w-full uppercase"
                    placeholder="FILIPINO"
                    value={editedOfficer.citizenship}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">GENDER</label>
                  <div className="flex gap-4">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        className="radio radio-primary"
                        value="MALE"
                        checked={editedOfficer.gender === "MALE"}
                        onChange={handleInputChange}
                      />
                      <span className="label-text ml-2">MALE</span>
                    </label>
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        className="radio radio-primary"
                        value="FEMALE"
                        checked={editedOfficer.gender === "FEMALE"}
                        onChange={handleInputChange}
                      />
                      <span className="label-text ml-2">FEMALE</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="label mb-1">POSITION</label>
                  <input
                    name="position"
                    className="input input-bordered w-full uppercase"
                    placeholder="EXTERNAL VICE PRESIDENT"
                    value={editedOfficer.position}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">COLLEGE / AFFILIATION</label>
                  <input
                    name="affiliation"
                    className="input input-bordered w-full uppercase"
                    placeholder="COLLEGE OF EDUCATION"
                    value={editedOfficer.affiliation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">PROGRAM / MAJOR</label>
                  <input
                    name="program"
                    className="input input-bordered w-full uppercase"
                    placeholder="BS FOOD TECHNOLOGY"
                    value={editedOfficer.program}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">MOBILE NUMBER</label>
                  <input
                    name="mobileNumber"
                    className="input input-bordered w-full"
                    placeholder="+63 XXX XXX XXXX"
                    value={editedOfficer.mobileNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">RESIDENCE</label>
                  <input
                    name="residence"
                    className="input input-bordered w-full uppercase"
                    placeholder="Full address"
                    value={editedOfficer.residence}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">EMAIL</label>
                  <input
                    name="email"
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="example@email.com"
                    value={editedOfficer.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <label className="label mb-1">FACEBOOK</label>
                  <input
                    name="facebook"
                    className="input input-bordered w-full"
                    placeholder="Facebook profile URL or username"
                    value={editedOfficer.facebook}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Educational Background</h3>
                {editedOfficer.educationalBackground.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <h4 className="font-semibold mb-2">{edu.level}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="label mb-1">Name and Location of Institution</label>
                        <input
                          className="input input-bordered w-full"
                          value={edu.nameAndLocation}
                          onChange={(e) => handleEducationChange(index, "nameAndLocation", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label mb-1">Year of Graduation</label>
                        <input
                          className="input input-bordered w-full"
                          value={edu.yearOfGraduation}
                          onChange={(e) => handleEducationChange(index, "yearOfGraduation", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label mb-1">Organization/Club/Society</label>
                        <input
                          className="input input-bordered w-full"
                          value={edu.organization}
                          onChange={(e) => handleEducationChange(index, "organization", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label mb-1">Position</label>
                        <input
                          className="input input-bordered w-full"
                          value={edu.position}
                          onChange={(e) => handleEducationChange(index, "position", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Record of Extra-Curricular Activities</h3>
                {editedOfficer.recordOfExtraCurricularActivities.map((activity, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="label mb-1">Name of Organization</label>
                        <input
                          className="input input-bordered w-full"
                          value={activity.nameOfOrganization}
                          onChange={(e) => handleExtraCurricularChange(index, "nameOfOrganization", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label mb-1">Position</label>
                        <input
                          className="input input-bordered w-full"
                          value={activity.position}
                          onChange={(e) => handleExtraCurricularChange(index, "position", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label mb-1">Inclusive Dates</label>
                        <input
                          className="input input-bordered w-full"
                          placeholder="e.g. 2022-2023"
                          value={activity.inclusiveDates}
                          onChange={(e) => handleExtraCurricularChange(index, "inclusiveDates", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">
                UPDATE OFFICER
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
