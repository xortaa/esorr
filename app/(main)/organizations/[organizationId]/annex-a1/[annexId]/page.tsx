"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, UserPlus, Trash2, FilePenLine, Search } from "lucide-react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import PageWrapper from "@/components/PageWrapper";

function OfficerModal({ officer, organizationId, annexId, onClose, onSave }) {
  const [editedOfficer, setEditedOfficer] = useState(
    officer || {
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
      signature: "",
      studentNumber: "",
      gwa: "",
    }
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(editedOfficer.image || null);
  const [previewSignature, setPreviewSignature] = useState<string | null>(editedOfficer.signature || null);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [isChangingSignature, setIsChangingSignature] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<"draw" | "upload">("draw");

  const [affiliationOptions, setAffiliationOptions] = useState([]);
  const [affiliationOptionsLoading, setAffiliationOptionsLoading] = useState(false);
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState(editedOfficer.affiliation || "");
  const [isAffiliationDropdownOpen, setIsAffiliationDropdownOpen] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);

  const [programOptions, setProgramOptions] = useState([]);
  const [programOptionsLoading, setProgramOptionsLoading] = useState(false);
  const [programSearchTerm, setProgramSearchTerm] = useState(editedOfficer.program || "");
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const signatureRef = useRef<SignatureCanvas>(null);

  const isFormValid = useMemo(() => {
    return (
      editedOfficer.firstName.trim() !== "" &&
      editedOfficer.lastName.trim() !== "" &&
      editedOfficer.position.trim() !== ""
    );
  }, [editedOfficer.firstName, editedOfficer.lastName, editedOfficer.position]);

  useEffect(() => {
    fetchAffiliations();
  }, []);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsChangingImage(true);

      if (editedOfficer.image) {
        const fileName = editedOfficer.image.split("/").pop();
        if (fileName) {
          await deleteFile(fileName);
        }
      }
    }
  };

  const handleSignatureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedSignature(file);
      setPreviewSignature(URL.createObjectURL(file));
      setIsChangingSignature(true);

      if (editedOfficer.signature) {
        const fileName = editedOfficer.signature.split("/").pop();
        if (fileName) {
          await deleteFile(fileName);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
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
      "studentNumber",
    ];
    setEditedOfficer({
      ...editedOfficer,
      [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value,
    });
  };

  const handleEducationChange = (index: number, field: any, value: string) => {
    const updatedEducation = [...editedOfficer.educationalBackground];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEditedOfficer({ ...editedOfficer, educationalBackground: updatedEducation });
  };

  const handleExtraCurricularChange = (index: number, field: any, value: string) => {
    const updatedActivities = [...editedOfficer.recordOfExtraCurricularActivities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setEditedOfficer({ ...editedOfficer, recordOfExtraCurricularActivities: updatedActivities });
  };

  const handleAffiliationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAffiliationSearchTerm(value);
    setSelectedAffiliation(null);
    setIsAffiliationDropdownOpen(true);
    setEditedOfficer({ ...editedOfficer, affiliation: value });
  };

  const handleSelectAffiliation = async (affiliation) => {
    setSelectedAffiliation(affiliation);
    setAffiliationSearchTerm(affiliation.name);
    setIsAffiliationDropdownOpen(false);
    setEditedOfficer({ ...editedOfficer, affiliation: affiliation.name });
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
    setEditedOfficer({ ...editedOfficer, program: value });
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setProgramSearchTerm(program.name);
    setIsProgramDropdownOpen(false);
    setEditedOfficer({ ...editedOfficer, program: program.name });
  };

  const handleChangeSignature = () => {
    setIsChangingSignature(true);
    setPreviewSignature(null);
    if (signatureMethod === "draw") {
      if (signatureRef.current) {
        signatureRef.current.clear();
      }
    } else {
      setSelectedSignature(null);
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      await axios.post("/api/delete-file", { fileName });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       let imageUrl = editedOfficer.image;
       if (selectedImage) {
         const formData = new FormData();
         formData.append("file", selectedImage);

         const response = await axios.post("/api/upload-image", formData, {
           headers: { "Content-Type": "multipart/form-data" },
         });
         imageUrl = response.data.url;
       }

       let signatureUrl = editedOfficer.signature;
       if (
         isChangingSignature ||
         (!editedOfficer.signature && (signatureRef.current?.isEmpty() === false || selectedSignature))
       ) {
         const formData = new FormData();
         formData.append("annexId", annexId);
         formData.append("position", editedOfficer.position);

         if (signatureRef.current && !signatureRef.current.isEmpty()) {
           const signatureDataURL = signatureRef.current.toDataURL();
           const signatureBlob = await (await fetch(signatureDataURL)).blob();
           formData.append("file", signatureBlob, "signature.png");
         } else if (selectedSignature) {
           formData.append("file", selectedSignature);
         }

         if (formData.has("file")) {
           const response = await axios.post("/api/upload-signature", formData, {
             headers: { "Content-Type": "multipart/form-data" },
           });
           signatureUrl = response.data.url;
         }
       }

       const officerToSubmit = {
         ...editedOfficer,
         image: imageUrl,
         signature: signatureUrl,
       };

       onSave(officerToSubmit);
       onClose();
     } catch (error) {
       console.error("Error saving officer:", error);
     }
   };


  const filteredAffiliations = affiliationOptions.filter((affiliation) =>
    affiliation.name.toLowerCase().includes((affiliationSearchTerm || "").toLowerCase())
  );

  const filteredPrograms = programOptions.filter((program) =>
    program.name.toLowerCase().includes((programSearchTerm || "").toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">{officer ? "Edit Officer Details" : "Add a new officer"}</h2>
            <button className="btn btn-ghost" onClick={onClose} type="button">
              <X />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            {officer ? "Edit the details below for the officer" : "Enter the details below for the officer to be added"}
          </p>
          <div className="space-y-6">
            <div className="mb-6">
              <label className="label mb-1">Officer's 1x1 Picture</label>
              {editedOfficer.image && !isChangingImage ? (
                <div>
                  <img src={editedOfficer.image} alt="Officer's 1x1 Picture" className="w-32 h-32 object-cover mb-2" />
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => setIsChangingImage(true)}>
                    Change Image
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />
              )}
              {previewImage && isChangingImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="New Officer's 1x1 Picture" className="w-32 h-32 object-cover" />
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
                  required
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
                  required
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
                  required
                />
              </div>
              <div className="w-full">
                <label className="label mb-1">COLLEGE / AFFILIATION</label>
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
                        setEditedOfficer({ ...editedOfficer, affiliation: "" });
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

              <div className="w-full">
                <label className="label mb-1">PROGRAM / MAJOR</label>
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
                        setEditedOfficer({ ...editedOfficer, program: "" });
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
              <div className="w-full">
                <label className="label mb-1">STUDENT NUMBER</label>
                <input
                  name="studentNumber"
                  className="input input-bordered w-full uppercase"
                  placeholder="2023-12345"
                  value={editedOfficer.studentNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full">
                <label className="label mb-1">GWA</label>
                <input
                  name="gwa"
                  type="number"
                  step="0.01"
                  min="1.00"
                  max="5.00"
                  className="input input-bordered w-full"
                  placeholder="1.00 - 5.00"
                  value={editedOfficer.gwa}
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

            <div className="mb-6">
              <label className="label mb-1">Officer's Signature</label>
              {editedOfficer.signature && !isChangingSignature ? (
                <div>
                  <img src={editedOfficer.signature} alt="Officer's Signature" className="mb-2" />
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleChangeSignature}>
                    Change Signature
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Draw Signature</h4>
                      <div className="border-2 border-gray-300 rounded-md p-2 flex justify-center">
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{
                            className: "signature-canvas",
                            width: 300,
                            height: 150,
                          }}
                          backgroundColor="white"
                        />
                      </div>
                      <div className="mt-2 flex justify-center">
                        <button type="button" className="btn btn-sm btn-outline" onClick={handleClearSignature}>
                          Clear Signature
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold">OR</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Upload Signature</h4>
                      <input
                        type="file"
                        name="signature"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        className="file-input file-input-bordered w-full"
                      />
                      {previewSignature && (
                        <div className="mt-2">
                          <img src={previewSignature} alt="Uploaded Signature" className="max-w-full h-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white"
              disabled={!isFormValid}
            >
              {officer ? "UPDATE OFFICER" : "ADD OFFICER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OfficerModalTrigger({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <button className="btn btn-primary" onClick={onOpenModal}>
      <UserPlus />
      Add Officer
    </button>
  );
}

export default function OfficersTable({ params }: { params: { organizationId: string; annexId: string } }) {
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-a1/${params.annexId}/officers`);
      setOfficers(response.data);
    } catch (error) {
      console.error("Error fetching officers:", error);
    }
  };

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOfficer = async (id: string) => {
    try {
      await axios.delete(`/api/annexes/${params.organizationId}/annex-a1/${params.annexId}/officers/${id}`);
      setOfficers(officers.filter((officer) => officer._id !== id));
    } catch (error) {
      console.error("Error deleting officer:", error);
    }
  };

  const handleEditOfficer = (officer) => {
    setEditingOfficer(officer);
    setIsModalOpen(true);
  };

  const openDeleteModal = (officer) => {
    setOfficerToDelete(officer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (officerToDelete) {
      handleDeleteOfficer(officerToDelete._id);
    }
    setDeleteModalOpen(false);
  };

  const handleOpenModal = () => {
    setEditingOfficer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOfficer(null);
  };

 const handleSaveOfficer = async (officerData) => {
   try {
     let newOfficer;
     if (editingOfficer) {
       // Update existing officer
       const response = await axios.patch(
         `/api/annexes/${params.organizationId}/annex-a1/${params.annexId}/officers/${editingOfficer._id}`,
         officerData
       );
       newOfficer = response.data;
     } else {
       // Create new officer
       const response = await axios.post(
         `/api/annexes/${params.organizationId}/annex-a1/${params.annexId}/officers`,
         officerData
       );
       newOfficer = response.data;
     }

     // Update the officers state, ensuring no duplicates
     setOfficers((prevOfficers) => {
       const updatedOfficers = prevOfficers.filter((o) => o._id !== newOfficer._id);
       return [...updatedOfficers, newOfficer];
     });

     handleCloseModal();
     await fetchOfficers(); // Refresh the officers list after saving
   } catch (error) {
     console.error("Error saving officer:", error);
   }
 };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <OfficerModalTrigger onOpenModal={handleOpenModal} />
          <div className="relative">
            <input
              type="text"
              placeholder="Search Officer"
              className="input input-bordered pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.map((officer) => (
                <tr key={officer._id}>
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
                  <td className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="btn btn-xs bg-blue-100 text-blue-800"
                        onClick={() => handleEditOfficer(officer)}
                      >
                        <FilePenLine size={16} />
                        Edit
                      </button>
                      <button className="btn btn-xs text-error bg-red-100" onClick={() => openDeleteModal(officer)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <OfficerModal
            officer={editingOfficer || undefined}
            organizationId={params.organizationId}
            annexId={params.annexId}
            onClose={handleCloseModal}
            onSave={handleSaveOfficer}
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
      </div>
    </PageWrapper>
  );
}
