"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileText, Send, Download, PenTool, Upload, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import { useParams } from "next/navigation";
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
});

type AnnexH = {
  _id: string;
  organization: {
    _id: string;
    name: string;
  };
  academicYear: string;
  president?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  vicePresident?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  secretary?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  treasurer?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  auditor?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  pro?: {
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
  dateSubmitted: Date;
  osaOfficerInCharge: string;
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

type SignaturePosition = "president" | "vicePresident" | "secretary" | "treasurer" | "auditor" | "pro" | "adviser";

type MyDocumentProps = {
  annex: AnnexH;
};

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
  role: string;
  signature?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
}> = ({ role, signature }) => (
  <View style={styles.signatureSection}>
    {signature ? (
      <>
        <SignatureImage signatureUrl={signature.signatureUrl} />
        <Text style={styles.signatureName}>{signature.name}</Text>
        <Text style={styles.signatureTitle}>{signature.position}</Text>
      </>
    ) : (
      <>
        <Text style={styles.signatureName}>________________________</Text>
        <Text style={styles.signatureTitle}>{role}</Text>
      </>
    )}
  </View>
);

const MyDocument: React.FC<MyDocumentProps> = ({ annex }) => (
  <Document>
    <Page style={styles.page} size="LEGAL" orientation="portrait">
      <View fixed style={styles.header}>
        <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "left" }}>
          STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
        </Text>
        <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "right" }}>ANNEX H</Text>
        <Text style={{ fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "right" }}>
          Commitment to Anti-Hazing Law
        </Text>
        <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>COMMITMENT TO ANTI-HAZING LAW</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{annex.osaOfficerInCharge}</Text>
        <Text style={styles.text}>Officer-In-Charge, Office for Student Affairs</Text>
        <Text style={styles.text}>University of Santo Tomas</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Dear {annex.osaOfficerInCharge}:</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 11, textAlign: "center", color: "red", textDecoration: "underline" }}>
          RE: <Text style={{ fontFamily: "Arial Narrow Bold" }}>ANTI-HAZING LAW</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          We, the officers and members of {annex.organization.name}, do hereby read and understand the attached policies
          and guidelines on the Anti-Hazing Law (Republic Act No. 8049 as amended by Republic Act No. 11053). We commit
          to abide by these policies and guidelines and ensure that no form of hazing or initiation rites that may
          endanger the life or safety of our members will be conducted by our organization.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Signed:</Text>
      </View>

      <SignatureArea role="President" signature={annex.president} />
      <SignatureArea role="Vice President" signature={annex.vicePresident} />
      <SignatureArea role="Secretary" signature={annex.secretary} />
      <SignatureArea role="Treasurer" signature={annex.treasurer} />
      <SignatureArea role="Auditor" signature={annex.auditor} />
      <SignatureArea role="PRO" signature={annex.pro} />

      <View style={styles.section}>
        <Text style={styles.text}>Attested by:</Text>
      </View>

      <SignatureArea role="Organization Adviser" signature={annex.adviser} />

      <View fixed style={styles.footer}>
        <Text style={{ textAlign: "right", color: "#000" }}>UST:S030-00-FO113</Text>
        <Text>All rights reserved by the Office for Student Affairs</Text>
      </View>
    </Page>
  </Document>
);

export default function EnhancedAnnexHManager() {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexH[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexH | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { organizationId } = useParams();
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");

  useEffect(() => {
    fetchAnnexes();
  }, [organizationId]);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-h`);
      setAnnexList(response.data.reverse());
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSignatureModal = async (annex: AnnexH) => {
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

  const generatePDFBlob = async (annex: AnnexH): Promise<Blob> => {
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

  const generatePDF = async (annex: AnnexH) => {
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

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexH> => {
    if (!organizationId) {
      throw new Error("Organization ID is not available");
    }
    const response = await axios.get(`/api/annexes/${organizationId}/annex-h/${annexId}`);
    return response.data;
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-h/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-h/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-h/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-h/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX H COMMITMENT TO ANTI-HAZING LAW</h1>
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
              <p>No COMMITMENT TO ANTI-HAZING LAW Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexH;
  generatePDF: (annex: AnnexH) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  generatePDF,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  session: session,
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
            <h2 className="card-title">COMMITMENT TO ANTI-HAZING LAW Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
              <button className="btn btn-outline btn-sm" onClick={() => generatePDF(annex)}>
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
