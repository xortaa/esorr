"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Send, Download, PenTool, Plus, Upload, X } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
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

type Signature = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned: string;
};

type AnnexC = {
  _id: string;
  academicYear: string;
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
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: string;
  signingVenue: string;
  signingDate: Date;
  assignedSecretary: string;
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
  const secretarySignatureDate = annex.signingDate ? new Date(annex.signingDate) : null;
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
            <Text style={styles.value}>{new Date(annex.ratificationDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ratification Venue:</Text>
            <Text style={styles.value}>{annex.ratificationVenue}</Text>
          </View>
        </View>

        <Text style={[styles.title, { marginTop: 20 }]}>SECRETARY'S CERTIFICATE</Text>

        <Text style={styles.text}>
          I, <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.assignedSecretary || "_________________"}</Text>, a
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
            {new Date(annex.ratificationDate).toLocaleDateString()} at {annex.ratificationVenue} which assembly a quorum was present and
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
  const currentPath = usePathname();
  const router = useRouter();

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

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
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

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-c/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-c/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-c/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-c/${annexId}/disapprove`);
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
              <p>No ANNEX C Certification of the Articles of Association Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexC;
  editAnnex: (id: string) => void;
  generatePDF: (annex: AnnexC) => void;
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
            <h2 className="card-title">
              ANNEX C Certification of the Articles of Association for AY {annex.academicYear}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && (
              <button
                className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                onClick={() => editAnnex(annex._id)}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Edit Ratification Details
              </button>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => generatePDF(annex)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
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
              {session?.user?.role === "SOCC" && (
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
              {session?.user?.role === "OSA" && (
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
