"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Send, Download, PenTool, Plus, Upload, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";

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

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

type Signature = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned: string;
};

type AnnexC = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  ratificationDate: string;
  ratificationVenue: string;
  secretaryRatificationVenue: string;
  organization: {
    name: string;
    affiliation: string;
  };
  secretary?: Signature;
  president?: Signature;
  swdCoordinator?: Signature;
  soccDirector?: Signature;
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

type SignaturePosition = "secretary" | "president";

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
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Arial Narrow Bold",
    textDecoration: "underline",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Arial Narrow Bold",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "50%",
    fontFamily: "Arial Narrow Bold",
    fontSize: 14,
  },
  value: {
    width: "50%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    fontSize: 14,
  },
  text: {
    marginBottom: 5,
    textAlign: "justify",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  listItemNumber: {
    width: "5%",
    marginLeft: 20,
  },
  listItemContent: {
    width: "95%",
  },
  signatureSection: {
    marginTop: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureColumn: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 5,
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5,
  },
});

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // This will return the date in "yyyy-MM-dd" format
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const SignatureSection = ({ signature, title }: { signature?: Signature; title: string }) => (
  <View style={styles.signatureColumn}>
    {signature && signature.signatureUrl ? (
      <Image style={styles.signatureImage} src={signature.signatureUrl} />
    ) : (
      <Text style={styles.signatureLine}></Text>
    )}
    <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
      {signature ? signature.name : "Print Name and Signature"}
    </Text>
    <Text>{title}</Text>
    {signature && <Text>Date Signed: {formatDate(signature.dateSigned)}</Text>}
  </View>
);

const MyDocument: React.FC<{ annex: AnnexC }> = ({ annex }) => {
  const secretarySignatureDate = annex.secretary?.dateSigned ? new Date(annex.secretary.dateSigned) : null;
  const witnessText = secretarySignatureDate
    ? `this ${secretarySignatureDate.getDate()} day of ${secretarySignatureDate.toLocaleString("default", {
        month: "long",
      })} ${secretarySignatureDate.getFullYear()} at ${annex.secretaryRatificationVenue}.`
    : "this ______ day of _________________________ at _____________________.";

  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        <View fixed style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "80%" }}>
              <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
                STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
              </Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right", fontFamily: "Arial Narrow Bold" }}>
                ANNEX C
              </Text>
            </View>
          </View>
          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>Articles of Association</Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
        </View>

        <Text style={styles.title}>Articles of Association</Text>
        <Text style={styles.subtitle}>Constitution and By-Laws of this Organization</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name of Organization:</Text>
            <Text style={styles.value}>{annex.organization.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Faculty/College/Institute/School:</Text>
            <Text style={styles.value}>{annex.organization.affiliation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ratification Date:</Text>
            <Text style={styles.value}>{formatDate(annex.ratificationDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ratification Venue:</Text>
            <Text style={styles.value}>{annex.ratificationVenue}</Text>
          </View>
        </View>

        <Text style={[styles.title, { marginTop: 20 }]}>SECRETARY'S CERTIFICATE</Text>

        <Text style={styles.text}>
          I, <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.secretary?.name || "_________________"}</Text>, a
          duly elected and qualified Secretary of the{" "}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.organization.name}</Text>, of the University of Santo
          Tomas, do hereby certify that:
        </Text>

        <View style={styles.listItem}>
          <Text style={styles.listItemNumber}>1.</Text>
          <Text style={styles.listItemContent}>
            I am familiar with the facts herein certified and duly authorized to certify the same;
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listItemNumber}>2.</Text>
          <Text style={styles.listItemContent}>
            At the General Assembly of the Representatives of Recognized Student Organization duly held and convened on{" "}
            {formatDate(annex.ratificationDate)} at {annex.ratificationVenue} which assembly a quorum was present and
            acted throughout, the General Assembly approved the proposed {annex.academicYear} {annex.organization.name}{" "}
            Article of Association by a majority vote of its members.
          </Text>
        </View>

        <Text style={[styles.text, { marginTop: 20 }]}>
          WITNESS THE SIGNATURE of the undersigned as such officer of the {annex.organization.name} {witnessText}
        </Text>

        <Text style={[styles.text, { fontFamily: "Arial Narrow Bold", marginTop: 20 }]}>Signed:</Text>

        <View style={styles.signatureRow}>
          <SignatureSection signature={annex.secretary} title="Organization Secretary" />
          <SignatureSection signature={annex.president} title="Organization President" />
        </View>

        {annex.organization.affiliation !== "University Wide" && (
          <View style={styles.signatureSection}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}>
              Attested by (for College-based Student Organization):
            </Text>
            <View style={styles.signatureRow}>
              <SignatureSection signature={annex.swdCoordinator} title="Student Welfare and Development Coordinator" />
            </View>
          </View>
        )}

        <Text style={[styles.text, { marginTop: 20 }]}>
          Per our record, the attached Constitution and By-Laws were ratified by the members of{" "}
          {annex.organization.name} on {formatFullDate(annex.ratificationDate)}.
        </Text>

        <Text style={[styles.text, { fontFamily: "Arial Narrow Bold", marginTop: 20 }]}>Certified by:</Text>

        <View style={styles.signatureRow}>
          <SignatureSection signature={annex.soccDirector} title="SOCC Director" />
        </View>

        <View fixed style={styles.footer}>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AnnexCManager() {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexC | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { organizationId } = useParams();
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [ratificationDate, setRatificationDate] = useState<string>("");
  const [ratificationVenue, setRatificationVenue] = useState<string>("");
  const [secretaryRatificationVenue, setSecretaryRatificationVenue] = useState<string>("");

  useEffect(() => {
    fetchAnnexes();
  }, [organizationId]);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-c`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-c/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const generatePDFBlob = async (annex: AnnexC): Promise<Blob> => {
    try {
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

const openSignatureModal = async (annex: AnnexC) => {
  try {
    setIsLoading(true);
    const updatedAnnex = await fetchUpdatedAnnex(annex._id);
    setSelectedAnnex(updatedAnnex);
    setRatificationDate(updatedAnnex.ratificationDate ? formatDateForInput(updatedAnnex.ratificationDate) : "");
    setRatificationVenue(updatedAnnex.ratificationVenue || "");
    setSecretaryRatificationVenue(updatedAnnex.secretaryRatificationVenue || "");
    const blob = await generatePDFBlob(updatedAnnex);
    setPdfBlob(blob);
    setIsModalOpen(true);
  } catch (error) {
    console.error("Error opening signature modal:", error);
    alert("Failed to open signature modal. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  const generatePDF = async (annex: AnnexC) => {
    try {
      setIsLoading(true);
      const blob = await generatePDFBlob(annex);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexC> => {
    if (!organizationId) {
      throw new Error("Organization ID is not available");
    }
    const response = await axios.get(`/api/annexes/${organizationId}/annex-c/${annexId}`);
    return response.data;
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

      const updateData: any = {
        [selectedSignaturePosition]: {
          name: session?.user?.fullName || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
          dateSigned: new Date().toISOString(),
        },
        ratificationDate,
        ratificationVenue,
      };

      if (selectedSignaturePosition === "secretary") {
        updateData.secretaryRatificationVenue = secretaryRatificationVenue;
      }

      const updateResponse = await axios.patch(
        `/api/annexes/${organizationId}/annex-c/${selectedAnnex._id}`,
        updateData
      );

      if (updateResponse.data) {
        const updatedAnnex = updateResponse.data;
        setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
        setSelectedAnnex(updatedAnnex);
        alert("Signature and ratification details added successfully");
        setIsModalOpen(false);
      } else {
        throw new Error("Failed to update Annex C");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
      alert(`Error adding signature: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }

    setSignatureFile(null);
    setSignaturePreview(null);
    setSelectedSignaturePosition("");
    setSecretaryRatificationVenue("");
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const clearUploadedSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">ANNEX C Certification of the Articles of Association</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading your annexes...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annexList.map((annex) => (
            <AnnexCard
              key={annex._id}
              annex={annex}
              submitAnnexForReview={submitAnnexForReview}
              openSignatureModal={openSignatureModal}
              generatePDF={generatePDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No ANNEX C Certification of the Articles of Association Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedAnnex && pdfBlob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-7xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                <h3 className="text-2xl font-semibold">Add Signature to Annex C</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col h-[600px] overflow-auto">
                    <PDFViewer width="100%" height="100%">
                      <MyDocument annex={selectedAnnex} />
                    </PDFViewer>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Your Role</span>
                      </label>
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
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Signature Position</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedSignaturePosition}
                        onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                      >
                        <option value="">Select signature position</option>
                        <option value="secretary">Secretary</option>
                        <option value="president">President</option>
                      </select>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Ratification Date</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={ratificationDate}
                        onChange={(e) => setRatificationDate(e.target.value)}
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Ratification Venue</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={ratificationVenue}
                        onChange={(e) => setRatificationVenue(e.target.value)}
                        placeholder="Enter ratification venue"
                      />
                    </div>

                    {selectedSignaturePosition === "secretary" && (
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text">Secretary Ratification Venue</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={secretaryRatificationVenue}
                          onChange={(e) => setSecretaryRatificationVenue(e.target.value)}
                          placeholder="Enter secretary ratification venue"
                        />
                      </div>
                    )}

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
                      Submit Signature and Ratification Details
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
}

interface AnnexCardProps {
  annex: AnnexC;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: AnnexC) => void;
  generatePDF: (annex: AnnexC) => void;
}

function AnnexCard({ annex, submitAnnexForReview, openSignatureModal, generatePDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">
              ANNEX C Certification of the Articles of Association for AY {annex.academicYear}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-sm btn-outline" onClick={() => openSignatureModal(annex)}>
              <PenTool className="h-4 w-4 mr-2" />
              Add Signature
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => generatePDF(annex)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
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
              disabled={annex.isSubmitted}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
