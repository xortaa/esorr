"use client";

import { useState, useRef } from "react";
import { UserPlus, X, Trash2, Search, FilePenLine, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

export default function Component() {
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
      <OfficersTable />
    </PageWrapper>
  );
}

function OfficersTable() {
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOfficers = officers.filter((officer) => officer.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDeleteOfficer = (id: number) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full w-full"
    >
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center gap-4">
          <CreateOfficerModal officers={officers} setOfficers={setOfficers} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <Search />
            <input
              type="text"
              className="grow"
              placeholder="Search Officer"
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
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map((officer) => (
              <motion.tr
                key={officer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={officer.avatarUrl ? officer.avatarUrl : "/assets/user-placeholder.png"}
                          alt={`Avatar of ${officer.name}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{officer.name}</div>
                    </div>
                  </div>
                </td>
                <td>{officer.position}</td>
                <td className={officer.status === "Complete" ? "text-success" : "text-error"}>{officer.status}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm">
                      <Eye />
                      Preview PDF
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <FilePenLine />
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDeleteOfficer(officer.id)}>
                      <Trash2 />
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function CreateOfficerModal({ officers, setOfficers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    position: "",
    academicYear: "",
    status: "Incomplete",
    avatarUrl: "",
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
  const fileInputRef = useRef(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const uppercaseFields = [
      "firstName",
      "middleName",
      "surname",
      "religion",
      "citizenship",
      "position",
      "college",
      "program",
    ];
    setNewOfficer({
      ...newOfficer,
      [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
    });
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewOfficer({ ...newOfficer, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewOfficer({
      firstName: "",
      middleName: "",
      surname: "",
      position: "",
      academicYear: "",
      status: "Incomplete",
      avatarUrl: "",
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
    handleClose();
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Officer Details</h2>
                  <button className="btn btn-ghost" onClick={handleClose} type="button">
                    <X />
                  </button>
                </div>
                <p className="text-sm text-slate-500">Enter the details below for the officer</p>
                <div className="space-y-6">
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

                  <div className="w-full">
                    <label className="label mb-1">OFFICER IMAGE (1x1)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                  </div>
                  <div className="avatar">
                    <div className="w-24 rounded">
                      <img src={newOfficer.avatarUrl || "/assets/user-placeholder.png"} alt="Officer preview" />
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
