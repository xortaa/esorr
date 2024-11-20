"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, X, Upload } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";

type AnnexD = {
  _id: string;
  academicYear: string;
  description: string;
  organization: {
    name: string;
    affiliation: string;
    logo: string;
  };
  secretary?: {
    name: string;
    position: string;
    signatureUrl: string;
    signatureDate?: Date;
  };
  letterhead?: string;
  status: string; // "Not Submitted" | "Rejected" | "For Review" | "Approved"
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted?: Date;
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

type SignaturePosition = "secretary";

type MyDocumentProps = {
  annex: AnnexD;
};

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
    fontSize: 18,
    fontWeight: "heavy",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Times-Bold",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "heavy",
    marginBottom: 5,
    textAlign: "left",
    textDecoration: "underline",
    fontFamily: "Arial Narrow Bold",
  },
  subSubHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Arial Narrow Bold",
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 11,
    marginLeft: 25,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  sectionTableRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
  },
  sectionTableCol: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
    textAlign: "justify",
  },
  sectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: "20%",
    fontFamily: "Arial Narrow Bold",
  },
  sectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "80%",
    textAlign: "justify",
  },
  subsectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: "15%",
    paddingRight: 10,
    fontFamily: "Arial Narrow Bold",
  },
  subsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%",
    textAlign: "justify",
  },
  subsubsectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: "25%",
    paddingRight: 10,
    fontFamily: "Arial Narrow Bold",
  },
  subsubsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%",
    textAlign: "justify",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    textAlign: "center",
  },
  signatureText: {
    textAlign: "left",
    marginBottom: 10,
  },
  signatureSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 20,
  },
  signatureLine: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 11,
    fontFamily: "Arial Narrow Bold",
    textDecoration: "underline",
    marginTop: 5,
  },
  signatureTitle: {
    fontSize: 11,
    fontFamily: "Arial Narrow",
    marginTop: 2,
  },
  signatureDate: {
    fontSize: 11,
    marginBottom: 10,
  },
  logoTable: {
    display: "flex",
    width: 150,
    height: 150,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
  },
  logoTableRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signature: {
    width: 150,
    height: 50,
  },
  description: {
    marginBottom: 10,
  },
  letterheadPage: {
    width: "100%",
    height: "100%",
  },
});

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const SignatureImage = ({ signatureUrl }) => {
  if (!signatureUrl) {
    return (
      <View
        style={{ width: 150, height: 50, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" }}
      >
        <Text>Signature not available</Text>
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
    signatureDate?: Date;
  };
}> = ({ role, signature }) => (
  <View style={styles.signatureSection}>
    {signature ? (
      <>
        <Image style={{ width: 200, height: 50 }} src={signature.signatureUrl} />
        <Text style={styles.signatureName}>{signature.name}</Text>
        <Text style={styles.signatureTitle}>{role}</Text>
      </>
    ) : (
      <>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureTitle}>{role}</Text>
      </>
    )}
  </View>
);

const MyDocument: React.FC<MyDocumentProps> = ({ annex }) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "______________";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="portrait">
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>ANNEX D</Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Organization's Logo and Letterhead
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
            {"\n"}
            <EmphasizedText>ORGANIZATION'S LOGO AND LETTERHEAD</EmphasizedText>
            {"\n"}
            {"\n"}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              <Text style={{ fontSize: "11", fontFamily: "Arial Narrow Bold", textAlign: "justify" }}>
                NAME OF ORGANIZATION{" "}
              </Text>
              {"\n"}
              {"\n"}
              <Text style={{ fontSize: "11", fontFamily: "Arial Narrow Bold", textAlign: "justify" }}>
                Faculty/College/Institute/School
              </Text>
            </Text>

            <Text style={styles.tableCell}>
              <Text
                style={{
                  fontSize: "11",
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "justify",
                  textDecoration: "underline",
                }}
              >
                {annex.organization.name}
              </Text>
              {"\n"}
              {"\n"}
              <Text
                style={{
                  fontSize: "11",
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "justify",
                  textDecoration: "underline",
                }}
              >
                {annex.organization.affiliation}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.logoTable}>
          <View style={styles.logoTableRow}>
            {annex.organization.logo ? (
              <Image src={annex.organization.logo} style={{ width: 140, height: 140 }} />
            ) : (
              <Text style={{ fontSize: 11, fontFamily: "Arial Narrow Bold", textAlign: "center" }}>
                PLACE LOGO HERE
              </Text>
            )}
          </View>
        </View>

        <View style={styles.description}>
          <Text style={{ fontSize: "11", fontFamily: "Arial Narrow Bold", marginBottom: 5 }}>
            Description or Impression of the Organization Logo:
          </Text>
          <Text style={{ fontSize: "11", textAlign: "justify" }}>
            {annex.description || "No description provided."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>(Attach Organization Letterhead on the next page.)</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>
            I, {annex.secretary?.name || "(Name of Secretary)"} of {annex.organization.name} hereby certify that the
            above logo was adopted by the members/ Board in a meeting held for the purpose.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>Date: {formatDate(annex.secretary?.signatureDate)}</Text>
        </View>

        <View style={styles.section}>
          <SignatureArea role="Organization Secretary" signature={annex.secretary} />
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", color: "#000" }}>UST:S030-00-FO108</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>
      {annex.letterhead && (
        <Page size="LEGAL" orientation="portrait">
          <Image src={annex.letterhead} style={styles.letterheadPage} />
        </Page>
      )}
    </Document>
  );
};

const AnnexDManager: React.FC = () => {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexD | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { organizationId } = useParams();
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");

  useEffect(() => {
    if (organizationId) {
      fetchAnnexes();
    }
  }, [organizationId]);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-d`);
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
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-d/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const openSignatureModal = async (annex: AnnexD) => {
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

  const generatePDFBlob = async (annex: AnnexD): Promise<Blob> => {
    try {
      console.log("Preparing annex data with signatures and letterhead:", annex);
      console.log("Generating PDF for annex:", annex);
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      console.log("PDF blob generated successfully");
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexD) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      console.log("PDF URL:", url);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexD> => {
    const response = await axios.get(`/api/annexes/${organizationId}/annex-d/${annexId}`);
    console.log("Fetched annex data:", response.data);
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

      const updateResponse = await axios.patch(`/api/annexes/${organizationId}/annex-d/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.fullName || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
          signatureDate: new Date(),
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
        throw new Error("Failed to update Annex D");
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

   const handleSubmitAnnex = async (annexId: string) => {
     try {
       const response = await axios.post(`/api/annexes/${organizationId}/annex-d/${annexId}/submit`);
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
       const response = await axios.post(`/api/annexes/${organizationId}/annex-d/${annexId}/${type}-remarks`, {
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
       const response = await axios.post(`/api/annexes/${organizationId}/annex-d/${annexId}/approve`);
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
       const response = await axios.post(`/api/annexes/${organizationId}/annex-d/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX D Organizations Logo and Letterhead</h1>
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
              openSignatureModal={openSignatureModal}
              generatePDF={generatePDF}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No ANNEX D Organizations Logo and Letterhead created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex D</h3>
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
                      <option value="secretary">Secretary</option>
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

interface AnnexCardProps {
  annex: AnnexD;
  editAnnex: (id: string) => void;
  openSignatureModal: (annex: AnnexD) => void;
  generatePDF: (annex: AnnexD) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
}

function AnnexCard({ annex, editAnnex, openSignatureModal, generatePDF, onSubmit, onUpdateRemarks, onApprove, onDisapprove }: AnnexCardProps) {
  const [soccRemarks, setSoccRemarks] = useState(annex.soccRemarks);
  const [osaRemarks, setOsaRemarks] = useState(annex.osaRemarks);
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Organizations Logo and Letterhead Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Logo & Letterhead
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => openSignatureModal(annex)}>
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
          <div>
            <p className="font-semibold">Status: {annex.status}</p>
            {annex.dateSubmitted && (
              <p className="text-sm text-gray-500">Submitted on: {new Date(annex.dateSubmitted).toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold">SOCC Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={soccRemarks}
              onChange={(e) => setSoccRemarks(e.target.value)}
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={() => onUpdateRemarks(annex._id, "socc", soccRemarks)}>
              Update SOCC Remarks
            </button>
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold">OSA Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={osaRemarks}
              onChange={(e) => setOsaRemarks(e.target.value)}
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={() => onUpdateRemarks(annex._id, "osa", osaRemarks)}>
              Update OSA Remarks
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="btn btn-success" onClick={() => onApprove(annex._id)}>
              Approve
            </button>
            <button className="btn btn-error" onClick={() => onDisapprove(annex._id)}>
              Disapprove
            </button>
            <button className="btn btn-primary" onClick={() => onSubmit(annex._id)}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnexDManager;
