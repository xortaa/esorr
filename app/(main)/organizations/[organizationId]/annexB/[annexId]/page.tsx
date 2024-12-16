"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, FilePenLine, UserPlus, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import axios from "axios";

type Member = {
  _id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  studentNumber: string;
  program: string;
  startYear: number;
  yearLevel: number;
  status: string;
  isOfficer: boolean;
  isNewMember: boolean;
  age: number;
  gender: string;
  affiliation?: string;
};

const AnnexBMembersDashboard = () => {
  const { organizationId, annexId } = useParams<{ organizationId: string; annexId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/annexes/${organizationId}/annex-b/${annexId}/members`);
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const uniqueStartYears = Array.from(new Set(members.map((member) => member.startYear))).sort((a, b) => b - a);

  const filteredMembers = members.filter(
    (member) =>
      (member.lastName + " " + member.firstName + " " + member.middleName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedYear === "" || member.startYear.toString() === selectedYear)
  );

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/annexes/${organizationId}/annex-b/${annexId}/members/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete member");
      setMembers(members.filter((member) => member._id !== id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const checkCompleteness = (member: Partial<Member>): boolean => {
    const requiredFields = [
      "lastName",
      "firstName",
      "studentNumber",
      "program",
      "startYear",
      "yearLevel",
      "age",
      "gender",
    ];
    return requiredFields.every((field) => member[field] && member[field] !== "");
  };

  const handleCreateMember = async (memberData: Omit<Member, "_id" | "status">) => {
    try {
      const isComplete = checkCompleteness(memberData);
      const dataToSend = { ...memberData, status: isComplete ? "COMPLETE" : "INCOMPLETE" };

      console.log("Sending member data:", dataToSend);
      const response = await fetch(`/api/annexes/${organizationId}/annex-b/${annexId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create member: ${errorData.message || response.statusText}`);
      }
      const newMember = await response.json();
      console.log("Received new member:", newMember);
      setMembers([...members, newMember]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleUpdateMember = async (updatedMember: Member) => {
    try {
      const isComplete = checkCompleteness(updatedMember);
      const dataToSend = { ...updatedMember, status: isComplete ? "COMPLETE" : "INCOMPLETE" };

      const response = await fetch(`/api/annexes/${organizationId}/annex-b/${annexId}/members/${updatedMember._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) throw new Error("Failed to update member");
      const updatedMemberData = await response.json();
      setMembers(members.map((m) => (m._id === updatedMemberData._id ? updatedMemberData : m)));
      setEditingMember(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const openDeleteModal = (member: Member) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  return (
    <PageWrapper>
      <BackButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">ANNEX B LIST OF MEMBERS CREATOR</h1>
          <p className="text-sm text-slate-500">
            Manage and create list of members. Use the table below to view existing list of members.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus />
            Add Member
          </button>
          <div className="flex items-center gap-4">
            <select
              className="select select-bordered"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {uniqueStartYears.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Member"
                className="input input-bordered pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student Number</th>
                <th>Program</th>
                <th>Position Level</th>
                <th>Membership</th>
                <th>Completion Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>
                    <div className="font-bold">{`${member.lastName}, ${member.firstName} ${member.middleName}`}</div>
                  </td>
                  <td>{member.studentNumber}</td>
                  <td>{member.program}</td>
                  <td>{member.isOfficer ? "Officer" : "Member"}</td>
                  <td>{member.isNewMember ? "New" : "Renewing"}</td>
                  <td>
                    <span
                      className={`badge ${
                        member.status === "COMPLETE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="btn btn-xs bg-blue-100 text-blue-800" onClick={() => handleEditMember(member)}>
                        <FilePenLine size={16} />
                        Edit
                      </button>
                      <button className="btn btn-xs text-error bg-red-100" onClick={() => openDeleteModal(member)}>
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

        <CreateMemberModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
          }}
          member={
            editingMember || {
              lastName: "",
              firstName: "",
              middleName: "",
              studentNumber: "",
              program: "",
              startYear: new Date().getFullYear(),
              yearLevel: 1,
              isOfficer: false,
              isNewMember: true,
              age: 0,
              gender: "",
            }
          }
          onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
          isEditing={!!editingMember}
          organizationId={organizationId as string}
        />

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
              Are you sure you want to delete {memberToDelete?.firstName} {memberToDelete?.lastName}? This action is
              irreversible.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn bg-red-100 text-red-800"
                onClick={() => memberToDelete && handleDeleteMember(memberToDelete._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Partial<Member>;
  onSubmit: (member: any) => void;
  isEditing: boolean;
  organizationId: string;
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSubmit,
  isEditing,
  organizationId,
}) => {
  const [validationMessage, setValidationMessage] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - i);
  const [formData, setFormData] = useState(member);
  const [affiliationOptions, setAffiliationOptions] = useState([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState(false);
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [isAffiliationDropdownOpen, setIsAffiliationDropdownOpen] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);

  const [programOptions, setProgramOptions] = useState([]);
  const [programOptionsLoading, setProgramOptionsLoading] = useState(false);
  const [programSearchTerm, setProgramSearchTerm] = useState("");
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData(member);
        setAffiliationSearchTerm(member.affiliation || "");
        setProgramSearchTerm(member.program || "");
      } else {
        // Reset form data for new member
        setFormData({
          lastName: "",
          firstName: "",
          middleName: "",
          studentNumber: "",
          program: "",
          startYear: currentYear,
          yearLevel: 1,
          isOfficer: false,
          isNewMember: true,
          age: 0,
          gender: "",
        });
        setAffiliationSearchTerm("");
        setProgramSearchTerm("");
        setSelectedAffiliation(null);
        setSelectedProgram(null);
      }
      fetchAffiliations();
    }
  }, [isOpen, isEditing, member, currentYear]);

  const fetchAffiliations = async () => {
    setAffiliationOptionsLoading(true);
    try {
      const response = await axios.get("/api/affiliations");
      setAffiliationOptions(response.data);
    } catch (error) {
      console.error("Error fetching affiliations:", error);
    } finally {
      setAffiliationOptionsLoading(false);
    }
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAffiliationSearchTerm(value);
    setSelectedAffiliation(null);
    setIsAffiliationDropdownOpen(true);
  };

  const handleSelectAffiliation = async (affiliation) => {
    setSelectedAffiliation(affiliation);
    setAffiliationSearchTerm(affiliation.name);
    setIsAffiliationDropdownOpen(false);
    setSelectedProgram(null);
    setProgramSearchTerm("");

    setProgramOptionsLoading(true);
    try {
      const response = await axios.get(`/api/affiliations/${affiliation._id}/programs`);
      setProgramOptions(response.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setProgramOptionsLoading(false);
    }
  };

  const handleProgramInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProgramSearchTerm(value);
    setSelectedProgram(null);
    setIsProgramDropdownOpen(true);
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setProgramSearchTerm(program.name);
    setIsProgramDropdownOpen(false);
    setFormData({ ...formData, program: program.name });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    onSubmit({
      ...formData,
      affiliation: selectedAffiliation ? selectedAffiliation.name : "",
      program: selectedProgram ? selectedProgram.name : formData.program,
    });
  };

  const validateFormData = (data: Partial<Member>): string[] => {
    const errors: string[] = [];
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!data.lastName || typeof data.lastName !== "string" || !nameRegex.test(data.lastName))
      errors.push("Last Name is required and must be a string without numbers.");
    if (!data.firstName || typeof data.firstName !== "string" || !nameRegex.test(data.firstName))
      errors.push("First Name is required and must be a string without numbers.");
    if (data.middleName && (typeof data.middleName !== "string" || !nameRegex.test(data.middleName)))
      errors.push("Middle Name must be a string without numbers.");
    if (!data.studentNumber || !/^\d{10}$/.test(data.studentNumber))
      errors.push("Student Number is required and must be a 10-digit number.");
    if (
      !data.startYear ||
      isNaN(Number(data.startYear)) ||
      data.startYear < 1900 ||
      data.startYear > new Date().getFullYear()
    )
      errors.push("Start Year is required and must be a valid year.");
    if (!data.yearLevel || isNaN(Number(data.yearLevel)) || data.yearLevel < 1 || data.yearLevel > 5)
      errors.push("Year Level is required and must be between 1 and 5.");
    if (data.affiliation && typeof data.affiliation !== "string") errors.push("Affiliation must be a string.");
    if (!data.program || typeof data.program !== "string") errors.push("Program is required and must be a string.");
    if (!data.age || isNaN(Number(data.age)) || data.age < 0 || data.age > 120)
      errors.push("Age is required and must be between 0 and 120.");
    if (!data.gender || (data.gender !== "Male" && data.gender !== "Female"))
      errors.push("Gender is required and must be either 'Male' or 'Female'.");
    if (typeof data.isOfficer !== "boolean") errors.push("Officer Status is required and must be a boolean.");
    if (typeof data.isNewMember !== "boolean") errors.push("Membership Status is required and must be a boolean.");
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "startYear" || name === "yearLevel" || name === "age" ? parseInt(value) : value,
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "true" });
  };

  const filteredAffiliations = affiliationOptions.filter((affiliation) =>
    affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
  );

  const filteredPrograms = programOptions.filter((program) =>
    program.name.toLowerCase().includes(programSearchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{isEditing ? "Edit Member" : "Add New Member"}</h2>
          <button onClick={onClose} className="btn btn-ghost">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">LASTNAME</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <input
              name="lastName"
              className="input input-bordered w-full"
              placeholder="DELA CRUZ"
              value={formData.lastName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setFormData({ ...formData, lastName: value });
                }
              }}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">FIRST NAME</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <input
              name="firstName"
              className="input input-bordered w-full"
              placeholder="JUAN MIGUEL"
              value={formData.firstName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setFormData({ ...formData, firstName: value });
                }
              }}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">MIDDLE NAME</span>
            </label>
            <input
              name="middleName"
              className="input input-bordered w-full"
              placeholder="GONZALEZ"
              value={formData.middleName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setFormData({ ...formData, middleName: value });
                }
              }}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">STUDENT NUMBER</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <input
              name="studentNumber"
              className={`input input-bordered w-full ${isInvalid ? "border-red-500" : ""}`}
              placeholder="2021148086"
              value={formData.studentNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,9}$/.test(value)) {
                  setFormData({ ...formData, studentNumber: value });
                  setValidationMessage(""); // Clear validation message on valid input
                  setIsInvalid(false); // Reset invalid state on valid input
                }
              }}
              onKeyDown={(e) => {
                const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
                if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onBlur={() => {
                if (formData.studentNumber.length !== 9) {
                  setValidationMessage("Student number must be exactly 9 digits long.");
                  setIsInvalid(true);
                  alert("Student number must be exactly 9 digits long.");
                } else {
                  setIsInvalid(false);
                }
              }}
            />
            {validationMessage && <p className="text-red-500 text-sm mt-1">{validationMessage}</p>}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">START YEAR</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <select
              name="startYear"
              className="select select-bordered w-full"
              value={formData.startYear}
              onChange={handleInputChange}
            >
              <option value={0} disabled>
                SELECT
              </option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">YEAR LEVEL</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <select
              name="yearLevel"
              className="select select-bordered w-full"
              value={formData.yearLevel}
              onChange={handleInputChange}
            >
              <option value={0} disabled>
                SELECT
              </option>
              {[1, 2, 3, 4, 5].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">COLLEGE / AFFILIATION</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <div className="relative w-full">
              <input
                type="text"
                className="input input-bordered w-full pr-10 uppercase"
                placeholder="Search for affiliation..."
                value={affiliationSearchTerm}
                onChange={handleAffiliationInputChange}
                onFocus={() => setIsAffiliationDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsAffiliationDropdownOpen(false), 200)}
                disabled={affiliationOptionsLoading}
              />
              {affiliationSearchTerm && (
                <button
                  type="button"
                  className="btn btn-ghost btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => {
                    setAffiliationSearchTerm("");
                    setSelectedAffiliation(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {isAffiliationDropdownOpen && filteredAffiliations.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
            {affiliationOptionsLoading && (
              <div className="text-center mt-2">
                <span className="loading loading-dots loading-md"></span>
              </div>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">PROGRAM / MAJOR</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <div className="relative w-full">
              <input
                type="text"
                className="input input-bordered w-full pr-10 uppercase"
                placeholder="Search for program..."
                value={programSearchTerm}
                onChange={handleProgramInputChange}
                onFocus={() => setIsProgramDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsProgramDropdownOpen(false), 200)}
                disabled={!selectedAffiliation || programOptionsLoading}
              />
              {programSearchTerm && (
                <button
                  type="button"
                  className="btn btn-ghost btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => {
                    setProgramSearchTerm("");
                    setSelectedProgram(null);
                    setFormData({ ...formData, program: "" });
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {isProgramDropdownOpen && filteredPrograms.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredPrograms.map((program) => (
                    <li
                      key={program._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectProgram(program)}
                    >
                      {program.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {programOptionsLoading && (
              <div className="text-center mt-2">
                <span className="loading loading-dots loading-md"></span>
              </div>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">AGE</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <input
              name="age"
              type="number"
              className="input input-bordered w-full"
              placeholder="18"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">GENDER</span>
              <span className="text-primary text-xs">(required)</span>
            </label>
            <select
              name="gender"
              className="select select-bordered w-full"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                SELECT
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">OFFICER STATUS</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="isOfficer"
                  className="radio"
                  value="true"
                  checked={formData.isOfficer === true}
                  onChange={handleRadioChange}
                />
                <span className="label-text ml-2">Officer</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="isOfficer"
                  className="radio"
                  value="false"
                  checked={formData.isOfficer === false}
                  onChange={handleRadioChange}
                />
                <span className="label-text ml-2">Not an Officer</span>
              </label>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">MEMBERSHIP STATUS</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="isNewMember"
                  className="radio"
                  value="true"
                  checked={formData.isNewMember === true}
                  onChange={handleRadioChange}
                />
                <span className="label-text ml-2">New Member</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="isNewMember"
                  className="radio"
                  value="false"
                  checked={formData.isNewMember === false}
                  onChange={handleRadioChange}
                />
                <span className="label-text ml-2">Renewing Member</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">
            {isEditing ? "UPDATE MEMBER" : "ADD MEMBER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnexBMembersDashboard;
