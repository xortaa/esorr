"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileText, Send, Download, PenTool, Upload, X, Edit } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import { useParams, useRouter, usePathname } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";

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

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingRight: 80,
    paddingLeft: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
    overflow: "hidden",
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
  section: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 15,
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: "justify",
  },
  signatureSection: {
    marginTop: 10,
    textAlign: "left",
  },
  signatureName: {
    fontSize: 11,
    fontFamily: "Arial Narrow Bold",
    textDecoration: "underline",
  },
  signatureTitle: {
    fontSize: 11,
    fontFamily: "Arial Narrow",
  },
  signature: {
    width: 150,
    height: 50,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

type AnnexF = {
  _id: string;
  organization: {
    _id: string;
    name: string;
  };
  academicYear: string;
  isSubmitted: boolean;
  submissionDate?: Date;
  activities: Activity[];
  outgoingPresident?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  incomingPresident?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  adviser?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
};

type Activity = {
  _id?: string;
  term: string;
  keyUnitActivity: string;
  targetDateRange: string;
  actualDateAccomplished: string;
  postEventEvaluation: string;
  interpretation: string;
};

type UserPosition = {
  role: string;
  organizationName: string;
};

type Positions = {
  organization: {
    _id: string;
    name: string;
  };
  position: string;
  _id: string;
};

type SignaturePosition = "outgoingPresident" | "incomingPresident" | "adviser";

const SignatureImage = ({ signatureUrl }) => {
  if (!signatureUrl) {
    return (
      <View
        style={{ width: 150, height: 50, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ fontSize: 8 }}>Signature not available</Text>
      </View>
    );
  }

  return <Image style={styles.signature} src={signatureUrl} />;
};

const SignatureArea: React.FC<{
  signature?: {
    name: string;
    signatureUrl: string;
  };
  label: string;
}> = ({ signature, label }) => (
  <View style={{ flexDirection: "column", marginBottom: 20 }}>
    {signature ? (
      <>
        <Image style={{ width: 150, height: 50 }} src={signature.signatureUrl} />
        <Text style={{ fontSize: 11, marginTop: 5, textAlign: "left" }}>{signature.name}</Text>
        <Text style={{ fontSize: 11, textAlign: "left" }}>{label}</Text>
      </>
    ) : (
      <>
        <Text style={{ marginTop: 40 }}></Text>
        <Text style={{ borderTopWidth: 1, fontSize: 11, textAlign: "left" }}>{label}</Text>
      </>
    )}
  </View>
);

const MyDocument: React.FC<{ annex: AnnexF }> = ({ annex }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
  };

  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        <View fixed style={styles.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 8, fontFamily: "Times-Roman" }}>
              STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
            </Text>
            <View>
              <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "right" }}>ANNEX F</Text>
              <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "right" }}>Page 1</Text>
              <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "right" }}>
                Activities Monitoring Form
              </Text>
              <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.text}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Key Result Area (KRA): </Text>
          To implement SDG-based activities anchored on the SEAL of Thomasian Education and supporting the University's
          Strategic Directional Areas.
        </Text>

        <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
          <View style={{ width: "20%" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}>Target: </Text>
          </View>
          <View style={{ width: "80%" }}>
            <Text>Minimum of</Text>
            <Text>1 General Assembly,</Text>
            <Text>1 Year-End Assembly/Report,</Text>
            <Text>1 Recruitment Period,</Text>
            <Text>2 Major Activities,</Text>
            <Text>2 Community Service,</Text>
            <Text>Active Involvement in University or OSA-initiated activities</Text>
          </View>
        </View>

        <View style={{ flexDirection: "column", borderWidth: 1, marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ width: "40%", textAlign: "center", borderRightWidth: 1 }}>
              KEY UNIT ACTIVITIES <br /> A.Y. {annex.academicYear}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1 }}>
              Target Date <br /> Month/Day/Year <br /> Month in words/00/0000
            </Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 9, textAlign: "center" }}>
              <Text style={{}}> To be accomplished by OSA / Organization Adviser</Text>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  Actual Date <br />
                  Accomplished
                </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  Post Event <br /> Evaluation <br /> (Mean Rating)
                </Text>
                <Text style={{ width: "33.3%" }}>Interpretation</Text>
              </View>
            </View>
          </View>

          {["First Term", "Second Term", "Special Term"].map((term) => (
            <React.Fragment key={term}>
              <Text
                style={{
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "Arial Narrow Bold",
                  borderTopWidth: 1,
                  padding: 2,
                }}
              >
                {term.toUpperCase()}
              </Text>
              {annex.activities
                .filter((activity) => activity.term === term)
                .map((activity, index) => (
                  <View key={index} style={{ flexDirection: "row", borderTop: 1 }}>
                    <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>{index + 1}</Text>
                    <Text style={{ width: "35%", textAlign: "left", borderRightWidth: 1, paddingHorizontal: 10 }}>
                      {activity.keyUnitActivity}
                    </Text>
                    <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
                      {activity.targetDateRange}
                    </Text>
                    <View style={{ flexDirection: "column", width: "50%", fontSize: 10, textAlign: "center" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                          {formatDate(activity.actualDateAccomplished)}
                        </Text>
                        <Text style={{ width: "33.3%", borderRightWidth: 1 }}>{activity.postEventEvaluation}</Text>
                        <Text style={{ width: "33.3%" }}>{activity.interpretation}</Text>
                      </View>
                    </View>
                  </View>
                ))}
            </React.Fragment>
          ))}
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ width: "50%", flexDirection: "column" }}>
            <Text
              style={{
                fontFamily: "Arial Narrow Bold Italic",
                color: "white",
                marginBottom: 10,
              }}
            >
              <Text style={{ backgroundColor: "black", padding: 2 }}>Prepared by:</Text>
            </Text>

            <SignatureArea
              signature={annex.outgoingPresident}
              label="Signature over Printed Name of Outgoing President"
            />

            <SignatureArea
              signature={annex.incomingPresident}
              label="Signature over Printed Name of Incoming President"
            />

            <Text
              style={{
                fontFamily: "Arial Narrow Bold Italic",
                color: "white",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Text style={{ backgroundColor: "black", padding: 2 }}>Approved by:</Text>
            </Text>

            <SignatureArea
              signature={annex.adviser}
              label="Signature over Printed Name of Current Organization Adviser"
            />
          </View>

          <View style={{ width: "50%", flexDirection: "column" }}></View>
        </View>
      </Page>
    </Document>
  );
};

export default function EnhancedAnnexFManager() {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexF | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { organizationId } = useParams();
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    fetchAnnexes();
  }, [organizationId]);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-f`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-f/${id}`, { isSubmitted: true });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex for review:", error);
      alert("Failed to submit annex for review. Please try again.");
    }
  };

  const openSignatureModal = async (annex: AnnexF) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      setSelectedAnnex(updatedAnnex);
      setIsModalOpen(true);
      const blob = await generatePDFBlob(updatedAnnex);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error opening signature modal:", error);
      alert("Failed to open signature modal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDFBlob = async (annex: AnnexF): Promise<Blob> => {
    try {
      console.log("Preparing annex data with signatures...");
      console.log("Generating PDF for annex:", annex);
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      console.log("PDF blob generated successfully");
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexF) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      console.log("PDF URL created:", url);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexF> => {
    if (!organizationId) {
      throw new Error("Organization ID is not available");
    }
    const response = await axios.get(`/api/annexes/${organizationId}/annex-f/${annexId}`);
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

      const updateResponse = await axios.patch(`/api/annexes/${organizationId}/annex-f/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.name || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
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
        throw new Error("Failed to update Annex F");
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
      <h1 className="text-2xl font-bold mb-6">ANNEX F ACTIVITIES MONITORING FORM</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annexList.map((annex) => (
            <AnnexCard
              key={annex._id}
              annex={annex}
              editAnnex={editAnnex}
              submitAnnexForReview={submitAnnexForReview}
              openSignatureModal={openSignatureModal}
              generatePDF={generatePDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No ACTIVITIES MONITORING FORM Annex created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex F</h3>
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
                  <div className="h-[600px] overflow-auto">
                    <PDFViewer width="100%" height="100%">
                      <MyDocument annex={selectedAnnex} />
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
                      {session?.user?.positions?.map((userPosition: Positions, index: number) => (
                        <option key={index} value={`${userPosition.position}-${userPosition.organization.name}`}>
                          {userPosition.position} - {userPosition.organization.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-bordered w-full"
                      value={selectedSignaturePosition}
                      onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                    >
                      <option value="">Select signature position</option>
                      <option value="outgoingPresident">Outgoing President</option>
                      <option value="incomingPresident">Incoming President</option>
                      <option value="adviser">Adviser</option>
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
}

interface AnnexCardProps {
  annex: AnnexF;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: AnnexF) => void;
  generatePDF: (annex: AnnexF) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, openSignatureModal, generatePDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Activities Monitoring Form Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Activities
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => openSignatureModal(annex)}>
              <PenTool className="h-4 w-4 mr-2" />
              Add Signature
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => generatePDF(annex)}>
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
