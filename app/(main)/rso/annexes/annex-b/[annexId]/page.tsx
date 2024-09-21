"use client";

import { useState } from "react";
import { Trash2, Search, FilePenLine, UserPlus, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Member = {
  id: number;
  surname: string;
  firstName: string;
  middleName: string;
  studentNumber: string;
  program: string;
  startYear: number;
};

const AnnexBMembersDashboard = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      surname: "ALAMEDA",
      firstName: "PRINCE ALEC",
      middleName: "SANTOS",
      studentNumber: "2023-189138",
      program: "BS FOOD TECHNOLOGY",
      startYear: 2024,
    },
    {
      id: 2,
      surname: "BAUTISTA",
      firstName: "MARIA",
      middleName: "LUISA",
      studentNumber: "2023-189139",
      program: "BS CHEMISTRY",
      startYear: 2023,
    },
    {
      id: 3,
      surname: "CRUZ",
      firstName: "JUAN",
      middleName: "CARLOS",
      studentNumber: "2023-189140",
      program: "BS BIOLOGY",
      startYear: 2023,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [newMember, setNewMember] = useState<Omit<Member, "id">>({
    surname: "",
    firstName: "",
    middleName: "",
    studentNumber: "",
    program: "",
    startYear: 0,
  });

  const filteredMembers = members.filter(
    (member) =>
      (member.surname + " " + member.firstName + " " + member.middleName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedYear === "" || member.startYear.toString() === selectedYear)
  );

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...members.map((m) => m.id), 0) + 1;
    setMembers([...members, { ...newMember, id: newId }]);
    setNewMember({
      surname: "",
      firstName: "",
      middleName: "",
      studentNumber: "",
      program: "",
      startYear: 0,
    });
    const drawerCheckbox = document.getElementById("my-drawer") as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: name === "startYear" ? parseInt(value) : value });
  };

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ANNEX B LIST OF MEMBERS CREATOR</h1>
        <p className="text-sm text-slate-500">
          Manage and create list of members. Use the table below to view existing list of members.
        </p>
      </div>

      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center gap-4">
          <CreateMemberSidebar
            newMember={newMember}
            setNewMember={setNewMember}
            handleCreateMember={handleCreateMember}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <label className="input input-bordered flex items-center gap-2">
            <Search />
            <input
              type="text"
              className="grow"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Student Number</th>
              <th>Program</th>
              <th>Start Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr key={member.id}>
                <th>{index + 1}</th>
                <td>{`${member.surname}, ${member.firstName} ${member.middleName}`}</td>
                <td>{member.studentNumber}</td>
                <td>{member.program}</td>
                <td>{member.startYear}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost btn-sm">
                      <FilePenLine className="h-4 w-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
};

const CreateMemberSidebar = ({ newMember, setNewMember, handleCreateMember }) => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Add Member
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form
          onSubmit={handleCreateMember}
          className="menu bg-white min-h-full w-5/6 sm:w-4/6 xl:w-1/2 p-4 mt-20 overflow-auto"
        >
          <div className="mb-4 relative">
            <label className="absolute top-0 right-4 btn btn-ghost" htmlFor="my-drawer">
              <X />
            </label>

            <h2 className="text-3xl font-bold">Member Details</h2>
            <p className="text-sm text-slate-500">Enter the details below for the member</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <label className="label mb-1">SURNAME</label>
              <input
                name="surname"
                className="input input-bordered w-full uppercase"
                placeholder="DELA CRUZ"
                value={newMember.surname}
                onChange={(e) => setNewMember({ ...newMember, surname: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <label className="label mb-1">FIRST NAME</label>
              <input
                name="firstName"
                className="input input-bordered w-full uppercase"
                placeholder="JUAN MIGUEL"
                value={newMember.firstName}
                onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <label className="label mb-1">MIDDLE NAME</label>
              <input
                name="middleName"
                className="input input-bordered w-full uppercase"
                placeholder="GONZALEZ"
                value={newMember.middleName}
                onChange={(e) => setNewMember({ ...newMember, middleName: e.target.value })}
              />
            </div>
            <div className="w-full">
              <label className="label mb-1">STUDENT NUMBER</label>
              <input
                name="studentNumber"
                className="input input-bordered w-full uppercase"
                placeholder="2021148086"
                value={newMember.studentNumber}
                onChange={(e) => setNewMember({ ...newMember, studentNumber: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <label className="label mb-1">START YEAR</label>
              <select
                name="startYear"
                className="select select-bordered w-full"
                value={newMember.startYear}
                onChange={(e) => setNewMember({ ...newMember, startYear: parseInt(e.target.value) })}
                required
              >
                <option value={0} disabled>
                  SELECT
                </option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
              </select>
            </div>
            <div className="w-full">
              <label className="label mb-1">PROGRAM</label>
              <input
                name="program"
                className="input input-bordered w-full uppercase"
                placeholder="BS FOOD TECHNOLOGY"
                value={newMember.program}
                onChange={(e) => setNewMember({ ...newMember, program: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white">
              ADD MEMBER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnexBMembersDashboard;
