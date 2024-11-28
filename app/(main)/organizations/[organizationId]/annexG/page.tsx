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
import BackButton from "@/components/BackButton";

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
  organization: string;
  academicYear: string;
  isSubmitted: boolean;
  nominees: Nominee[];
  presidentSignature?: Signature;
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: string;
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

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-g/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-g/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-g/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-g/${annexId}/disapprove`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex disapproved successfully.");
    } catch (error) {
      console.error("Error disapproving annex:", error);
      alert("Failed to disapprove annex. Please try again.");
    }
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
      <BackButton />
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
            <AnnexCard
              key={annex._id}
              annex={annex}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              onGeneratePDF={generatePDF}
              session={session}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

interface AnnexCardProps {
  annex: AnnexG;
  onSubmit: (annexId: string) => Promise<void>;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => Promise<void>;
  onApprove: (annexId: string) => Promise<void>;
  onDisapprove: (annexId: string) => Promise<void>;
  onGeneratePDF: (annex: AnnexG) => Promise<void>;
  session: any;
}

function AnnexCard({
  annex,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  onGeneratePDF,

  session,
}: AnnexCardProps) {
  const router = useRouter();
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

  const handleSoccRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSoccRemarks(e.target.value);
  };

  const handleOsaRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOsaRemarks(e.target.value);
  };

  const handleSoccRemarksUpdate = () => {
    onUpdateRemarks(annex._id, "socc", soccRemarks);
  };

  const handleOsaRemarksUpdate = () => {
    onUpdateRemarks(annex._id, "osa", osaRemarks);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Organization Adviser Nomination Form Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
              <button
                className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                onClick={() => router.push(`/organizations/${annex.organization}/annexG/${annex._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Nomination
              </button>
            )}
            <button className="btn btn-sm" onClick={() => onGeneratePDF(annex)}>
              <Eye className="h-4 w-4 mr-2" />
              View PDF
            </button>
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
