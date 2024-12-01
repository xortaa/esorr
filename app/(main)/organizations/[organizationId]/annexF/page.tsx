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
import BackButton from "@/components/BackButton";

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
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted?: Date;
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
  organization?: {
    _id: string;
    name: string;
  };
  affiliation?: string;
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
      setAnnexList(response.data.reverse());
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
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

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-f/${annexId}/submit`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex submitted successfully.");
    } catch (error) {
      console.error("Error submitting annex:", error);
      alert("Failed to submit annex. Please try again.");
    }
  };

  const handleUpdateRemarks = async (annexId: string, type: "socc" | "osa", remarks: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-f/${annexId}/${type}-remarks`, {
        remarks,
      });
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert(`${type.toUpperCase()} remarks updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${type} remarks:`, error);
      alert(`Failed to update ${type.toUpperCase()} remarks. Please try again.`);
    }
  };

  const handleApprove = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-f/${annexId}/approve`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex approved successfully.");
    } catch (error) {
      console.error("Error approving annex:", error);
      alert("Failed to approve annex. Please try again.");
    }
  };

  const handleDisapprove = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-f/${annexId}/disapprove`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex disapproved successfully.");
    } catch (error) {
      console.error("Error disapproving annex:", error);
      alert("Failed to disapprove annex. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <BackButton />
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
              generatePDF={generatePDF}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
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
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexF;
  editAnnex: (id: string) => void;
  generatePDF: (annex: AnnexF) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  editAnnex,
  generatePDF,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  session,
}: AnnexCardProps) {
  const [soccRemarks, setSoccRemarks] = useState(annex.soccRemarks);
  const [osaRemarks, setOsaRemarks] = useState(annex.osaRemarks);
  const [submissionsStatus, setSubmissionsStatus] = useState({ submissionAllowed: true });

  useEffect(() => {
    toggledSubmissions();
  }, [session]);

  const toggledSubmissions = async () => {
    try {
      const response = await axios.get("/api/organizations/fetch-submission-status");
      setSubmissionsStatus(response.data);
    } catch (error) {
      console.error("Error toggling submissions:", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Activities Monitoring Form Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
              <button
                className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                onClick={() => editAnnex(annex._id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Activities
              </button>
            )}
            {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
              <button className="btn btn-ghost btn-sm" onClick={() => generatePDF(annex)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-semibold">Status: {annex.status}</p>
            {annex.dateSubmitted && (
              <p className="text-sm text-gray-500">Submitted on: {new Date(annex.dateSubmitted).toLocaleString()}</p>
            )}
          </div>
          {(session?.user?.role === "OSA" ||
            session?.user?.role === "RSO" ||
            session?.user?.role === "RSO-SIGNATORY" ||
            session?.user?.role === "AU" ||
            session?.user?.role === "SOCC") && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">SOCC Remarks</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={soccRemarks}
                onChange={(e) => setSoccRemarks(e.target.value)}
                readOnly={session?.user?.role !== "SOCC"}
              ></textarea>
              {session?.user?.role === "SOCC" && annex.status === "For Review" && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => onUpdateRemarks(annex._id, "socc", soccRemarks)}
                >
                  Update SOCC Remarks
                </button>
              )}
            </div>
          )}
          {(session?.user?.role === "OSA" ||
            session?.user?.role === "RSO" ||
            session?.user?.role === "RSO-SIGNATORY" ||
            session?.user?.role === "AU") && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">OSA Remarks</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={osaRemarks}
                onChange={(e) => setOsaRemarks(e.target.value)}
                readOnly={session?.user?.role !== "OSA"}
              ></textarea>
              {session?.user?.role === "OSA" && annex.status === "For Review" && (
                <button className="btn btn-primary mt-2" onClick={() => onUpdateRemarks(annex._id, "osa", osaRemarks)}>
                  Update OSA Remarks
                </button>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            {session?.user?.role === "OSA" && annex.status === "For Review" && (
              <>
                <button className="btn btn-success" onClick={() => onApprove(annex._id)}>
                  Approve
                </button>
                <button className="btn btn-error" onClick={() => onDisapprove(annex._id)}>
                  Disapprove
                </button>
              </>
            )}
            {session?.user?.role === "RSO" && (
              <button
                className="btn btn-primary"
                onClick={() => onSubmit(annex._id)}
                disabled={
                  !submissionsStatus.submissionAllowed || annex.status === "For Review" || annex.status === "Approved"
                }
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
