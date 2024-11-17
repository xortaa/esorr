"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Edit, Send, Download, Eye, PenTool, Upload, X, Plus } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import axios from "axios";
import PDFMerger from "pdf-merger-js";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

// Register fonts
Font.register({
  family: "Times-Roman",
  src: "/fonts/Times-Roman.ttf",
});

Font.register({
  family: "Times-Bold",
  src: "/fonts/Times-Bold.ttf",
});

Font.register({
  family: "Arial Narrow",
  src: "/fonts/arialnarrow.ttf",
});

Font.register({
  family: "Arial Narrow Bold",
  src: "/fonts/arialnarrow_bold.ttf",
});

Font.register({
  family: "Arial Narrow Italic",
  src: "/fonts/arialnarrow_italic.ttf",
});

Font.register({
  family: "Arial Narrow Bold Italic",
  src: "/fonts/arialnarrow_bolditalic.ttf",
});

type Nominee = {
  _id: string;
  name: string;
  faculty: string;
  email: string;
  landline: string;
  mobile: string;
  cv?: string;
};

type Signature = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned: string;
};

type AnnexG = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  nominees: Nominee[];
  presidentSignature?: Signature;
};

type UserPosition = {
  role: string;
  organizationName: string;
};

type Positions = {
  organization?: {
    _id: string;
    name: string;
  };
  affiliation?: string;
  position: string;
  _id: string;
};

type SignaturePosition = "presidentSignature";

const AnnexGManager: React.FC = () => {
  const { organizationId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexG[]>([]);
  const [newAcademicYear, setNewAcademicYear] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [isCreatingAnnex, setIsCreatingAnnex] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexG | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");

  useEffect(() => {
    fetchAnnexes();
  }, [organizationId]);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-g`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
      setError("Failed to load annexes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-g/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
      setError("Failed to submit annex for review. Please try again.");
    }
  };

  const openSignatureModal = async (annex: AnnexG) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      setSelectedAnnex(updatedAnnex);
      setIsSignatureModalOpen(true);
      const blob = await generatePDFBlob(updatedAnnex);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error opening signature modal:", error);
      setError("Failed to open signature modal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async (annex: AnnexG) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexG> => {
    const response = await axios.get(`/api/annexes/${organizationId}/annex-g/${annexId}`);
    return response.data;
  };

  const fetchCVPDF = async (url: string): Promise<Blob | null> => {
    try {
      console.log("Fetching CV from URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch CV. Status:", response.status);
        throw new Error("Failed to fetch CV");
      }
      const blob = await response.blob();
      console.log("CV fetched successfully. Size:", blob.size, "bytes");
      return blob;
    } catch (error) {
      console.error("Error fetching CV:", error);
      return null;
    }
  };

  const generatePDFBlob = async (annex: AnnexG): Promise<Blob> => {
    try {
      console.log("Generating PDF for annex:", annex._id);
      const cvPromises = annex.nominees
        .filter((nominee) => nominee.cv)
        .map(async (nominee) => {
          console.log("Fetching CV for nominee:", nominee.name);
          const cvBlob = await fetchCVPDF(nominee.cv!);
          return { name: nominee.name, cvBlob };
        });

      const cvResults = await Promise.all(cvPromises);
      console.log("CV fetch results:", cvResults);

      const annexPdf = pdf(<AnnexGDocument annex={annex} />);
      const annexBlob = await annexPdf.toBlob();

      let merger = new PDFMerger();
      await merger.add(annexBlob);

      for (const cv of cvResults) {
        if (cv.cvBlob) {
          await merger.add(cv.cvBlob);
        }
      }

      const mergedPdfBuffer = await merger.saveAsBuffer();
      const mergedPdf = new Blob([mergedPdfBuffer], { type: "application/pdf" });
      console.log("Merged PDF blob generated. Size:", mergedPdf.size, "bytes");
      return mergedPdf;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSignature = async () => {
    if (!selectedUserPosition || !selectedAnnex || !selectedSignaturePosition) {
      alert("Please select a role, an annex, and a signature position");
      return;
    }

    let signatureData: File;
    if (signatureFile) {
      signatureData = signatureFile;
    } else if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas();
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve, "image/png"));
      signatureData = new File([blob], "signature.png", { type: "image/png" });
    } else {
      alert("Please provide a signature");
      return;
    }

    const formData = new FormData();
    formData.append("file", signatureData);
    formData.append("annexId", selectedAnnex._id);
    formData.append("position", selectedSignaturePosition);

    try {
      setIsLoading(true);
      const response = await fetch("/api/upload-signature", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload signature");
      }

      const { url } = await response.json();

      const updateResponse = await axios.patch(`/api/annexes/${organizationId}/annex-g/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.fullName || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
          dateSigned: new Date(),
        },
      });

      if (updateResponse.data) {
        const updatedAnnex = updateResponse.data;
        setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
        setSelectedAnnex(updatedAnnex);

        const newBlob = await generatePDFBlob(updatedAnnex);
        setPdfBlob(newBlob);

        alert("Signature added successfully");
      } else {
        throw new Error("Failed to update Annex G");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
      setError(`Error adding signature: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }

    setSignatureFile(null);
    setSignaturePreview(null);
    setSelectedSignaturePosition("");
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const clearUploadedSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  const AnnexGDocument: React.FC<{ annex: AnnexG }> = ({ annex }) => (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS</Text>
          <Text style={styles.headerTextRight}>ANNEX G</Text>
          <Text style={styles.headerTextRight}>Organization Adviser Nomination Form</Text>
          <Text style={styles.headerTextRight}>AY {annex.academicYear}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>ORGANIZATION ADVISER NOMINATION FORM</Text>

        <Text style={styles.text}>
          Petitioner hereby nominates the following as organization adviser for (university-wide student organization):
        </Text>

        {/* Nominees Table */}
        <View style={styles.table}>
          {[0, 1, 2].map((index) => {
            const nominee = annex.nominees[index] || ({} as Nominee);
            return (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: "60%" }]}>
                  <Text style={styles.boldText}>{index + 1}st Nominee: (Please specify complete name with rank)</Text>
                  <Text>Name of Faculty: {nominee.name || ""}</Text>
                  <Text>Faculty/College/Institute/School: {nominee.faculty || ""}</Text>
                </View>
                <View style={[styles.tableCell, { width: "40%" }]}>
                  <Text>Email address: {nominee.email || ""}</Text>
                  <Text>Contact nos:</Text>
                  <Text>Landline: {nominee.landline || ""}</Text>
                  <Text>Mobile: {nominee.mobile || ""}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          {annex.presidentSignature ? (
            <Image src={annex.presidentSignature.signatureUrl} style={styles.signatureImage} />
          ) : (
            <View style={styles.signatureLine} />
          )}
          <Text style={styles.signatureText}>
            {annex.presidentSignature ? annex.presidentSignature.name : "Signature over Printed Name of President"}
          </Text>
          <Text>President</Text>
          <Text>Name of the Organization with Suffix</Text>
          {annex.presidentSignature && (
            <Text style={styles.dateText}>
              Date Signed: {new Date(annex.presidentSignature.dateSigned).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>All rights reserved by the Office for Student Affairs</Text>
      </Page>
    </Document>
  );

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">ANNEX G Organization Adviser Nomination Form</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {annexList.map((annex) => (
            <div key={annex._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    <h2 className="card-title">
                      Organization Adviser Nomination Form Annex for AY {annex.academicYear}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                      onClick={() => router.push(`/organizations/${organizationId}/annex-g/${annex._id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Nomination
                    </button>
                    <button className="btn btn-sm" onClick={() => openSignatureModal(annex)}>
                      <PenTool className="h-4 w-4 mr-2" />
                      Add Signature
                    </button>
                    <button className="btn btn-sm" onClick={() => generatePDF(annex)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View PDF
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="font-medium">Status:</label>
                    <span className={annex.isSubmitted ? "text-green-600" : "text-yellow-600"}>
                      {annex.isSubmitted ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      className={`btn ${annex.isSubmitted ? "btn-disabled" : "btn-primary"}`}
                      onClick={() => submitAnnexForReview(annex._id)}
                      disabled={annex.isSubmitted || !annex.presidentSignature}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSignatureModalOpen && selectedAnnex && pdfBlob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-7xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                <h3 className="text-2xl font-semibold">Add Signature to Annex G</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsSignatureModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-[600px] overflow-auto">
                    <PDFViewer width="100%" height="100%">
                      <AnnexGDocument annex={selectedAnnex} />
                    </PDFViewer>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <select
                      className="select select-bordered w-full"
                      value={
                        selectedUserPosition
                          ? `${selectedUserPosition.role}-${selectedUserPosition.organizationName}`
                          : ""
                      }
                      onChange={(e) => {
                        const [role, organizationName] = e.target.value.split("-");
                        setSelectedUserPosition({ role, organizationName });
                      }}
                    >
                      <option value="">Select your role</option>
                      {session?.user?.positions?.map((userPosition: Positions, index: number) => {
                        const name = userPosition.organization?.name || userPosition.affiliation;
                        return (
                          <option key={index} value={`${userPosition.position}-${name}`}>
                            {userPosition.position} - {name}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      className="select select-bordered w-full"
                      value={selectedSignaturePosition}
                      onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                    >
                      <option value="">Select signature position</option>
                      <option value="presidentSignature">President</option>
                    </select>
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Draw Your Signature</h4>
                      <div className="border p-2 mb-2">
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
                        />
                      </div>
                      <button className="btn btn-outline w-full" onClick={() => signatureRef.current?.clear()}>
                        Clear Signature
                      </button>
                    </div>
                    <div className="text-center text-lg font-semibold">OR</div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Upload Your Signature</h4>
                      {signaturePreview ? (
                        <div className="relative">
                          <img src={signaturePreview} alt="Signature Preview" className="max-w-full h-auto" />
                          <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={clearUploadedSignature}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="hidden"
                            id="signature-upload"
                          />
                          <label htmlFor="signature-upload" className="btn btn-outline btn-primary w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Signature
                          </label>
                        </div>
                      )}
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmitSignature}>
                      Submit Signature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingRight: 80,
    paddingLeft: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
  },
  header: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "left",
  },
  headerTextRight: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  boldText: {
    fontFamily: "Arial Narrow Bold",
  },
  signatureSection: {
    marginTop: 40,
    alignItems: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: 200,
    marginBottom: 5,
  },
  signatureImage: {
    width: 200,
    height: 100,
    marginBottom: 5,
  },
  signatureText: {
    fontFamily: "Arial Narrow Bold",
    textDecoration: "underline",
    marginBottom: 5,
  },
  dateText: {
    marginTop: 5,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: "center",
  },
});

export default AnnexGManager;
