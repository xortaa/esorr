"use client";
import { useState, useEffect } from "react";
import { Trash2, Search, FilePenLine, UserPlus, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";
import { Member } from "@/types";
import { useParams } from "next/navigation";

const AnnexBMembersDashboard = () => {
  const { organizationId, annexId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [newMember, setNewMember] = useState<Omit<Member, "_id" | "status">>({
    lastName: "",
    firstName: "",
    middleName: "",
    studentNumber: "",
    program: "",
    startYear: 0,
  });
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
    const requiredFields = ["lastName", "firstName", "studentNumber", "program", "startYear"];
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
      setNewMember({
        lastName: "",
        firstName: "",
        middleName: "",
        studentNumber: "",
        program: "",
        startYear: 0,
      });
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
                <th>Start Year</th>
                <th>Status</th>
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
                  <td>{member.startYear}</td>
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
          member={editingMember || newMember}
          onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
          isEditing={!!editingMember}
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
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ isOpen, onClose, member, onSubmit, isEditing }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - i);
  const [formData, setFormData] = useState(member);

  useEffect(() => {
    setFormData(member);
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "startYear" ? parseInt(value) : value });
  };

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
            </label>
            <input
              name="lastName"
              className="input input-bordered w-full uppercase"
              placeholder="DELA CRUZ"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">FIRST NAME</span>
            </label>
            <input
              name="firstName"
              className="input input-bordered w-full uppercase"
              placeholder="JUAN MIGUEL"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">MIDDLE NAME</span>
            </label>
            <input
              name="middleName"
              className="input input-bordered w-full uppercase"
              placeholder="GONZALEZ"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">STUDENT NUMBER</span>
            </label>
            <input
              name="studentNumber"
              className="input input-bordered w-full uppercase"
              placeholder="2021148086"
              value={formData.studentNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">START YEAR</span>
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
              <span className="label-text">PROGRAM</span>
            </label>
            <input
              name="program"
              className="input input-bordered w-full uppercase"
              placeholder="BS FOOD TECHNOLOGY"
              value={formData.program}
              onChange={handleInputChange}
            />
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
