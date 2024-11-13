"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, X, Upload } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";

type AnnexB = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  organization: {
    name: string;
    affiliation: string;
  };
  numberOfOfficers: number;
  maleMembersBelow18: number;
  maleMembers18To20: number;
  maleMembers21AndAbove: number;
  femaleMembersBelow18: number;
  femaleMembers18To20: number;
  femaleMembers21AndAbove: number;
  memberDistribution: {
    [program: string]: {
      firstYear: { new: number; old: number };
      secondYear: { new: number; old: number };
      thirdYear: { new: number; old: number };
      fourthYear: { new: number; old: number };
      fifthYear: { new: number; old: number };
    };
  };
  totalMembers: number;
  totalOfficersAndMembers: number;
  members: Array<{
    lastName: string;
    firstName: string;
    middleName: string;
    studentNumber: string;
    program: string;
    isNewMember: boolean;
  }>;
  secretary?: {
    name: string;
    position: string;
    signatureUrl: string;
    signatureDate?: Date;
  };
  adviser?: {
    name: string;
    position: string;
    signatureUrl: string;
    signatureDate?: Date;
  };
};

type SignaturePosition = "secretary" | "adviser";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

Font.register({
  family: "Times-Roman",
  src: "/fonts/Times-Roman.ttf",
});

Font.register({
  family: "Times-Bold",
  src: "/fonts/Times-Bold.ttf",
});

Font.register({
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    fontSize: 11,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellHeader: {
    backgroundColor: "#d3d3d3",
    fontWeight: "bold",
    fontSize: 10,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    width: "100%",
    marginBottom: 5,
  },
});

const MyDocument: React.FC<{ annex: AnnexB }> = ({ annex }) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "______________";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page style={styles.page} size="LEGAL">
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>
          <Text style={{ fontSize: 11, textAlign: "right" }}>Page | 1</Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>List of Members</Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: "Arial Narrow Bold", textAlign: "center" }}>LIST OF MEMBERS</Text>
          <Text style={{ textAlign: "center" }}>(as of AY {annex.academicYear})</Text>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>NAME OF ORGANIZATION</Text>
          <Text style={{ fontFamily: "Arial Narrow", textDecoration: "underline" }}>{annex.organization.name}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>
            OSA's Privacy Notice on the Documentary Requirements for Recognition of Student Organizations
          </Text>
          <Text style={{ marginTop: 5, textAlign: "justify" }}>
            The Office for Student Affairs (OSA) gathers personal data of bonafide students of the University through
            the documentary requirements on Application for Recognition of Student Organizations. The personal data,
            photos, and membership/officership information form part of the student organizations' data bank. Data is
            stored online in a secure and safe server of the OSA, while the equivalent hard copy is kept on file and
            properly secured in a filing cabinet. The OSA administrators, staff in charge of student organizations, and
            OSA reviewers are the persons permitted to access the files of student organizations. These documents are
            not shared with any party outside the University unless the disclosure of such information is compelled by
            operation of law or as requested by external auditors, i.e., PACUCOA, AUN-QA, ISO, etc. These online files
            and hard copies are retained at the OSA/University Archives facility.
          </Text>
        </View>

        <View style={[styles.table, { marginBottom: 0 }]}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "30%", borderBottomWidth: 1 }]}>
              <Text>Number of Officers</Text>
            </View>
            <View style={[styles.tableCell, { width: "70%", borderLeftWidth: 1, borderBottomWidth: 1 }]}>
              <Text>{annex.numberOfOfficers}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text>Age and Gender{"\n"}Distribution of Members</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1 }]}>
              <Text style={{ textAlign: "center" }}>Total No. of Male members</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%" }]}>
              <Text style={{ textAlign: "center" }}>Total No. of Female members</Text>
            </View>
          </View>

          <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text>Below 18</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1, textAlign: "center" }]}>
              <Text>{annex.maleMembersBelow18}</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", textAlign: "center" }]}>
              <Text>{annex.femaleMembersBelow18}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text>18 to 20</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1, textAlign: "center" }]}>
              <Text>{annex.maleMembers18To20}</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", textAlign: "center" }]}>
              <Text>{annex.femaleMembers18To20}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text>21 and above</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1, textAlign: "center" }]}>
              <Text>{annex.maleMembers21AndAbove}</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", textAlign: "center" }]}>
              <Text>{annex.femaleMembers21AndAbove}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text>
                Distribution of Members{"\n"}According to Faculty /{"\n"}College / Institute / School{"\n"}and Year
                Level
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "70%" }]}>
              <View style={[styles.tableRow, { borderTopWidth: 0 }]}>
                <View
                  style={[
                    styles.tableCell,
                    { width: "40%", backgroundColor: "#000", color: "#fff", borderRightWidth: 1 },
                  ]}
                >
                  <Text>FACULTY / COLLEGE / INSTITUTE{"\n"}/ SCHOOL UNIVERSITY-WIDE</Text>
                </View>
                <View style={[styles.tableCell, { width: "60%" }]}>
                  <Text style={{ textAlign: "center" }}>YEAR LEVEL</Text>
                  <View style={{ flexDirection: "row" }}>
                    {[1, 2, 3, 4, 5].map((year, index) => (
                      <View
                        key={index}
                        style={[
                          styles.tableCell,
                          { width: "20%", borderTopWidth: 1, ...(index < 4 && { borderRightWidth: 1 }) },
                        ]}
                      >
                        <Text style={{ textAlign: "center" }}>{year}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {Object.entries(annex.memberDistribution).map(([program, years], index) => (
                <View key={index} style={[styles.tableRow, { borderTopWidth: 1 }]}>
                  <View style={[styles.tableCell, { width: "40%", borderRightWidth: 1 }]}>
                    <Text>{program}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "60%" }]}>
                    <View style={{ flexDirection: "row" }}>
                      {Object.values(years).map((year, yearIndex) => (
                        <View
                          key={yearIndex}
                          style={[styles.tableCell, { width: "20%", ...(yearIndex < 4 && { borderRightWidth: 1 }) }]}
                        >
                          <Text style={{ textAlign: "center" }}>
                            N: {year.new}
                            {"\n"}
                            O: {year.old}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "30%", borderRightWidth: 1 }]}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>Total Number of MEMBERS</Text>
            </View>
            <View style={[styles.tableCell, { width: "70%" }]}>
              <Text>{annex.totalMembers}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10, borderWidth: 1, padding: 5 }}>
          <Text style={{ textAlign: "right", fontFamily: "Arial Narrow Bold" }}>
            Total Number of Officers and Members: {annex.totalOfficersAndMembers}
          </Text>
        </View>

        <Text style={{ fontFamily: "Times-Bold", marginTop: 20 }}>Certified By:</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
          <View style={{ width: "45%" }}>
            {annex.secretary?.signatureUrl ? (
              <Image src={annex.secretary.signatureUrl} style={{ width: 200, height: 50 }} />
            ) : (
              <View style={{ borderTopWidth: 1, width: "100%" }} />
            )}
            <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
              SIGNATURE OVER PRINTED NAME OF SECRETARY
            </Text>
            <Text style={{ marginTop: 5 }}>Date: {formatDate(annex.secretary?.signatureDate)}</Text>
          </View>

          <View style={{ width: "45%" }}>
            {annex.adviser?.signatureUrl ? (
              <Image src={annex.adviser.signatureUrl} style={{ width: 200, height: 50 }} />
            ) : (
              <View style={{ borderTopWidth: 1, width: "100%" }} />
            )}
            <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
              SIGNATURE OVER PRINTED NAME OF ADVISER
            </Text>
            <Text style={{ marginTop: 5 }}>Date: {formatDate(annex.adviser?.signatureDate)}</Text>
          </View>
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", marginBottom: 5 }}>UST:S030-00-FO105</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>

      <Page style={styles.page} size="LEGAL">
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>
          <Text style={{ fontSize: 11, textAlign: "right" }}>Page | 2</Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>List of Members</Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
        </View>

        <Text style={{ marginBottom: 10 }}>LIST OF MEMBERS FOR AY {annex.academicYear}</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#f0f0f0" }]}>
            <View style={[styles.tableCell, { width: "5%", borderRightWidth: 1 }]}>
              <Text>No.</Text>
            </View>
            <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1 }]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.tableCell, { width: "20%", borderRightWidth: 1 }]}>
              <Text>Student Number</Text>
            </View>
            <View style={[styles.tableCell, { width: "25%", borderRightWidth: 1 }]}>
              <Text>Program</Text>
            </View>
            <View style={[styles.tableCell, { width: "15%" }]}>
              <Text>Status</Text>
            </View>
          </View>

          {annex.members.map((member, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, { width: "5%", borderRightWidth: 1 }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1 }]}>
                <Text>{`${member.lastName}, ${member.firstName} ${member.middleName}`}</Text>
              </View>
              <View style={[styles.tableCell, { width: "20%", borderRightWidth: 1 }]}>
                <Text>{member.studentNumber}</Text>
              </View>
              <View style={[styles.tableCell, { width: "25%", borderRightWidth: 1 }]}>
                <Text>{member.program}</Text>
              </View>
              <View style={[styles.tableCell, { width: "15%" }]}>
                <Text>
                  <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "0" : "O"}</Text> New{" "}
                  <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "O" : "0"}</Text> Old
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", marginBottom: 5 }}>UST:S030-00-FO105</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AnnexBManager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexB | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-b`);
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
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-b/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const openSignatureModal = async (annex: AnnexB) => {
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

  const generatePDFBlob = async (annex: AnnexB): Promise<Blob> => {
    try {
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexB) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexB> => {
    const response = await axios.get(`/api/annexes/${params.organizationId}/annex-b/${annexId}`);
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
    if (!selectedSignaturePosition || !selectedAnnex) {
      alert("Please select a signature position");
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

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-b/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.name || "",
          position: selectedSignaturePosition,
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
      }
    } catch (error) {
      console.error("Error adding signature:", error);
      alert(`Error adding signature: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setSignatureFile(null);
      setSignaturePreview(null);
      setSelectedSignaturePosition("");
      if (signatureRef.current) {
        signatureRef.current.clear();
      }
    }
  };

  const clearUploadedSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">ANNEX B List of Members</h1>
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
              submitAnnexForReview={submitAnnexForReview}
              openSignatureModal={openSignatureModal}
              generatePDF={generatePDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No List of Members Annex created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex B</h3>
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
                      value={selectedSignaturePosition}
                      onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                    >
                      <option value="">Select signature position</option>
                      <option value="secretary">Secretary</option>
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
  annex: AnnexB;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: AnnexB) => void;
  generatePDF: (annex: AnnexB) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, openSignatureModal, generatePDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">List of Members Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Member List
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
