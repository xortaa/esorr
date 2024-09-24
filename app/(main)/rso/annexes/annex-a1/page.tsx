"use client";

import { useState } from "react";
import { UserPlus, X, Trash2, Search, FilePenLine, Eye } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

type Officer = {
  id: number;
  name: string;
  position: string;
  academicYear: string;
  status: "Complete" | "Incomplete";
  avatarUrl: string;
};

const AnnexA1Page = () => {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ANNEX A-1 OFFICER'S INFORMATION SHEET DASHBOARD</h1>
        <p className="text-sm text-slate-500">
          Manage and create officer information sheets for student organizations. Use the table below to view existing
          officer information sheets.
        </p>
      </div>
      <OfficersTable />
    </PageWrapper>
  );
};

const OfficersTable = () => {
  const [officers, setOfficers] = useState<Officer[]>([
    {
      id: 1,
      name: "Hart Hagerty",
      position: "President",
      academicYear: "2024-2025",
      status: "Incomplete",
      avatarUrl: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    },
    {
      id: 2,
      name: "Brice Swyre",
      position: "President",
      academicYear: "2023-2024",
      status: "Complete",
      avatarUrl: "https://img.daisyui.com/images/profile/demo/3@94.webp",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedYear === "" || officer.academicYear.includes(selectedYear))
  );

  const handleDeleteOfficer = (id: number) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
  };

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center gap-4">
          <CreateOfficerSidebar officers={officers} setOfficers={setOfficers} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Year Start</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <label className="input input-primary input-bordered border-primary flex items-center gap-2">
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
        <table className="table">
          <thead>
            <tr>
              <th>PDF Preview</th>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map((officer) => (
              <tr key={officer.id}>
                <th>
                  <button className="btn btn-primary">
                    <Eye />
                  </button>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={officer.avatarUrl} alt={`Avatar of ${officer.name}`} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{officer.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {officer.position}
                  <br />
                  <span
                    className={`badge ${
                      officer.academicYear.includes("2024") ? "badge-primary" : "badge-ghost"
                    } badge-sm`}
                  >
                    AY {officer.academicYear}
                  </span>
                </td>
                <td className={officer.status === "Complete" ? "text-success" : "text-error"}>{officer.status}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost">
                      <FilePenLine />
                    </button>
                    <button className="btn btn-ghost text-error" onClick={() => handleDeleteOfficer(officer.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CreateOfficerSidebar = ({ officers, setOfficers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    position: "",
    academicYear: "",
    status: "Incomplete",
    avatarUrl: "https://img.daisyui.com/images/profile/demo/1@94.webp",
    religion: "",
    citizenship: "",
    gender: "",
    college: "",
    program: "",
    educationalBackground: [
      { level: "Secondary", name: "", location: "", yearGraduation: "", organization: "", position: "" },
      { level: "College/Major", name: "", location: "", yearGraduation: "", organization: "", position: "" },
      { level: "Special Training", name: "", location: "", yearGraduation: "", organization: "", position: "" },
    ],
    extraCurricularActivities: [
      { name: "", position: "", inclusiveDates: "" },
      { name: "", position: "", inclusiveDates: "" },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOfficer({ ...newOfficer, [name]: value });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...newOfficer.educationalBackground];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setNewOfficer({ ...newOfficer, educationalBackground: updatedEducation });
  };

  const handleExtraCurricularChange = (index: number, field: string, value: string) => {
    const updatedActivities = [...newOfficer.extraCurricularActivities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setNewOfficer({ ...newOfficer, extraCurricularActivities: updatedActivities });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${newOfficer.firstName} ${newOfficer.middleName} ${newOfficer.surname}`.trim();
    setOfficers([
      ...officers,
      {
        ...newOfficer,
        id: officers.length + 1,
        name: fullName,
      },
    ]);
    setIsOpen(false);
    setNewOfficer({
      firstName: "",
      middleName: "",
      surname: "",
      position: "",
      academicYear: "",
      status: "Incomplete",
      avatarUrl: "https://img.daisyui.com/images/profile/demo/1@94.webp",
      religion: "",
      citizenship: "",
      gender: "",
      college: "",
      program: "",
      educationalBackground: [
        { level: "Secondary", name: "", location: "", yearGraduation: "", organization: "", position: "" },
        { level: "College/Major", name: "", location: "", yearGraduation: "", organization: "", position: "" },
        { level: "Special Training", name: "", location: "", yearGraduation: "", organization: "", position: "" },
      ],
      extraCurricularActivities: [
        { name: "", position: "", inclusiveDates: "" },
        { name: "", position: "", inclusiveDates: "" },
      ],
    });
  };

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Add Officer
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form
          onSubmit={handleSubmit}
          className="menu bg-white min-h-full w-5/6 sm:w-4/6 xl:w-1/2 p-4 mt-20 overflow-auto"
        >
          <div className="mb-4 relative">
            <label className="absolute top-0 right-4 btn btn-ghost" htmlFor="my-drawer">
              <X />
            </label>

            <h2 className="text-3xl font-bold">Officer Details</h2>
            <p className="text-sm text-slate-500">Enter the details below for the officer</p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="w-full">
                <label className="label mb-1">SURNAME</label>
                <input
                  name="surname"
                  className="input input-bordered w-full uppercase"
                  placeholder="DELA CRUZ"
                  value={newOfficer.surname}
                  onChange={handleInputChange}
                />
              </div>
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
                <label className="label mb-1">ACADEMIC YEAR</label>
                <input
                  name="academicYear"
                  className="input input-bordered w-full uppercase"
                  placeholder="2023-2024"
                  value={newOfficer.academicYear}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label className="label mb-1">COLLEGE / FACULTY</label>
                <input
                  name="college"
                  className="input input-bordered w-full uppercase"
                  placeholder="COLLEGE OF EDUCATION"
                  value={newOfficer.college}
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
                        value={edu.name}
                        onChange={(e) => handleEducationChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label mb-1">Location</label>
                      <input
                        className="input input-bordered w-full"
                        value={edu.location}
                        onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label mb-1">Year of Graduation</label>
                      <input
                        className="input input-bordered w-full"
                        value={edu.yearGraduation}
                        onChange={(e) => handleEducationChange(index, "yearGraduation", e.target.value)}
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
              {newOfficer.extraCurricularActivities.map((activity, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="label mb-1">Name of Organization</label>
                      <input
                        className="input input-bordered w-full"
                        value={activity.name}
                        onChange={(e) => handleExtraCurricularChange(index, "name", e.target.value)}
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
      </div>
    </div>
  );
};

export default AnnexA1Page;
