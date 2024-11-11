"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileText, Send, Download, PenTool, Upload, X, Plus } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import { useParams } from "next/navigation";
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
  text: {
    fontSize: 11,
    marginBottom: 5,
  },
  sectionTableRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
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
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#d3d3d3",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
    flex: 1,
    fontFamily: "Arial Narrow Bold",
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontSize: 10,
    flex: 1,
  },
  tableHeaderLastCell: {
    fontFamily: "Arial Narrow Bold",
    backgroundColor: "#d3d3d3",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontSize: 10,
    flex: 1,
  },
  tableLastCell: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontSize: 10,
    flex: 1,
  },
  signatureSection: {
    marginTop: 10,
    textAlign: "left",
    marginBottom: 40,
  },
  signatureText: {
    textAlign: "left",
  },
  signatureDetails: {
    position: "relative",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  signatureImage: {
    width: 100,
    height: 50,
  },
});

type Annex01 = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  organization: {
    _id: string;
    name: string;
  };
  president?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
};

type MyDocumentProps = {
  annex: Annex01;
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

type SignaturePosition = "president";

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const SignatureSection = ({ printedName, dateSigned, title, signatureImage }) => (
  <View style={styles.signatureSection}>
    {signatureImage && <Image src={signatureImage} style={styles.signatureImage} />}
    <View style={styles.signatureDetails}>
      <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>{printedName}</Text>
      <Text style={{}}>{dateSigned}</Text>
    </View>
    <Text break style={styles.signatureText}>
      {title}
    </Text>
  </View>
);

const MyDocument: React.FC<MyDocumentProps> = ({ annex }) => (
  <Document>
    <Page size="LEGAL" style={styles.page}>
      <View fixed style={styles.header}>
        <View fixed style={{ flexDirection: "row" }}>
          <View style={{ width: "80%" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
              STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
            </Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right", fontFamily: "Arial Narrow Bold" }}>
              ANNEX 01
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 8, textAlign: "right" }}
          render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
        />
        <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          The Rules of Procedure for Recognition of Student Organizations
        </Text>
        <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Student Organizations</Text>
        <Text style={styles.heading}>Recognition Requirements</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>The Rules of Procedure for Recognition of Student Organizations</Text>
      </View>

      {/* Section 1 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 1.</Text>
        <Text style={styles.sectionCellContent}>
          Only student organizations created with the purpose consistent with the mission and vision of the University
          may be recognized. Recognition of student organizations is a matter of privilege which may be granted upon the
          discretion of the University
        </Text>
      </View>

      {/* Section 2 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 2.</Text>
        <Text style={styles.sectionCellContent}>
          The Petition for Recognition of a student organization must be submitted to the Office for Student Affairs not
          later than the 21st of June.{" "}
          <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>
            Late and incomplete (unsigned) document submissions will not be accepted.
          </Text>
        </Text>
      </View>

      {/* Section 3 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 3.</Text>
        <Text style={styles.sectionCellContent}>
          The Petition for recognition must be signed by the duly elected president of the organization for the upcoming
          academic year and endorsed by the current organization adviser. For College-based organization (CBO), the
          Petition must be endorsed by the Coordinator of the Student Welfare and Development Committee (SWDC), the
          Dean/Director and Regent.
        </Text>
      </View>

      {/* Section 4 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 4.</Text>
        <View style={[styles.sectionCellContent, { flexDirection: "column" }]}>
          <Text>The petition must include as part of its annexes the following documents:</Text>
          <View style={{ marginLeft: 10, marginTop: 5 }}>
            <Text style={styles.text}>
              <EmphasizedText>4.1. Annex A:</EmphasizedText> Student Organization's General Information Report prepared
              by the Executive Board and approved by the President and the Officer's Information Sheet marked as "Annex
              A-1 to A-n";
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.2. Annex B:</EmphasizedText> List of Members (Membership of the current Academic Year of
              recognition);
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.3. Annex C:</EmphasizedText> A certification that the Articles of Association (AoA) was
              ratified by the student-members, issued by the organization's Secretary and President, reviewed by the
              SOCC Director and attested by the SWDC coordinator;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>Annex C1:</EmphasizedText> An updated/revised copy of the organization's AoA guided by the
              Quality Review Form (developed on 14 February 2020).
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.4. Annex D:</EmphasizedText> An impression of the organization's Logo and Letterhead
              with certification from the Secretary that the same was duly approved by its policy-making board or its
              members as the case may be;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.5. Annex E:</EmphasizedText> The organization's Accomplishment Report, Evaluation and
              Financial Reports for each accomplished activity, Performance Assessment of the current Academic Year of
              recognition using the 2019-2020 format prepared by the outgoing Treasurer;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.6. Annex F:</EmphasizedText> The organization's Activities' Monitoring Form Prepared by
              the Executive Board and Approved by the Organization Adviser;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.7. Annex G:</EmphasizedText> For USO, a letter containing the names of at least three
              faculty members nominated as organization adviser to the organization. For CBO, attach a photocopy of the
              appointment letter of the current adviser;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.8. Annex H:</EmphasizedText> For both USO and CBO: An Anti-Hazing Statement
              acknowledging that hazing in any form is NOT permitted within the student organization and its activities
              duly signed by the officers and their organization adviser;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.9. Annex I:</EmphasizedText> Letter of Commitment to Responsible use of Social Media by
              the officers and members duly signed by the President and PRO;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.10. Annex J:</EmphasizedText> Commitment of Active Participation in all OSA and
              University-initiated Activities and advocacies duly signed by the officers;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.11. Annex K:</EmphasizedText> Commitment to Care for the Environment (PPS 1027) signed
              by the officers;
            </Text>
            <Text style={styles.text}>
              <EmphasizedText>4.12. Annex L:</EmphasizedText> Commitment to Submit the Post Event Evaluation of Each
              Completed Activity On Time signed by the officers;
            </Text>
          </View>
        </View>
      </View>

      {/* Section 5 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 5.</Text>
        <Text style={styles.sectionCellContent}>
          All pages must be signed by the incoming president (left margin) before submitting to OSA. Hard copies
          submitted in CLEAR BOOK in the color as provided in section 7. Failure to submit the documents in both manners
          may cause the denial of the petition for recognition.
        </Text>
      </View>

      {/* Section 6 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 6.</Text>
        <Text style={styles.sectionCellContent}>
          The Petition for College-based Organization must be prepared in triplicate copies. The ORIGINAL copy, to be
          filed with OSA, the DUPLICATE copy, to the Dean's Office (optional), the petitioner shall retain the THIRD
          copy.
        </Text>
      </View>

      {/* Section 7 with Table */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 7.</Text>
        <View style={[styles.sectionCellContent, { flexDirection: "column" }]}>
          <Text>The name of college-based student organizations shall contain a suffix as provided herein.</Text>
          <Text style={{ marginTop: 5 }}>Example: Legal Management Society (AB).</Text>
          <Text>University-wide student organizations shall not be followed by any suffix.*</Text>

          {/* Table */}
          <View style={[styles.table, { marginTop: 10 }]}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>NAME OF COLLEGE</Text>
              <Text style={styles.tableCellHeader}>CLEARBOOK COLOR</Text>
              <Text style={styles.tableHeaderLastCell}>ABBREVIATION</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>University-wide</Text>
              <Text style={styles.tableCell}>BLACK</Text>
              <Text style={styles.tableLastCell}>No suffix</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Accountancy</Text>
              <Text style={styles.tableCell}>CLEAR</Text>
              <Text style={styles.tableLastCell}>ACCT</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Arts and Letters</Text>
              <Text style={styles.tableCell}>DARK BLUE</Text>
              <Text style={styles.tableLastCell}>AB</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Architecture</Text>
              <Text style={styles.tableCell}>MAROON</Text>
              <Text style={styles.tableLastCell}>ARC</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Commerce</Text>
              <Text style={styles.tableCell}>LIGHT YELLOW</Text>
              <Text style={styles.tableLastCell}>COM</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Education</Text>
              <Text style={styles.tableCell}>ORANGE</Text>
              <Text style={styles.tableLastCell}>EDUC</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Engineering</Text>
              <Text style={styles.tableCell}>GRAY</Text>
              <Text style={styles.tableLastCell}>ENG</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Fine Arts and Design</Text>
              <Text style={styles.tableCell}>BROWN</Text>
              <Text style={styles.tableLastCell}>CFAD</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Information and Computing Sciences</Text>
              <Text style={styles.tableCell}>RED</Text>
              <Text style={styles.tableLastCell}>ICS</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Medicine and Surgery</Text>
              <Text style={styles.tableCell}>GOLDEN YELLOW</Text>
              <Text style={styles.tableLastCell}>MED</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Conservatory of Music</Text>
              <Text style={styles.tableCell}>PINK</Text>
              <Text style={styles.tableLastCell}>MUS</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Nursing</Text>
              <Text style={styles.tableCell}>GREEN</Text>
              <Text style={styles.tableLastCell}>NUR</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Pharmacy</Text>
              <Text style={styles.tableCell}>VIOLET</Text>
              <Text style={styles.tableLastCell}>PHA</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Rehabilitation Sciences</Text>
              <Text style={styles.tableCell}>ROYAL BLUE</Text>
              <Text style={styles.tableLastCell}>CRS</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Science</Text>
              <Text style={styles.tableCell}>MARIAN BLUE (UST seal background)</Text>
              <Text style={styles.tableLastCell}>SCI</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Tourism and Hospitality Management</Text>
              <Text style={styles.tableCell}>APPLE GREEN</Text>
              <Text style={styles.tableLastCell}>CTHM</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Section 8 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 8.</Text>
        <Text style={styles.sectionCellContent}>
          Each student organization shall use the official G-Suite account provided, where it may be officially notified
          of the OSA's communications. All notices shall be considered served to the organization upon sending of the
          message to the official e-mail address. Further, student organizations shall create a "Facebook" page wherein
          75% of its members have followed.
          <Br />
          <Br />
          For new organization/reapplying for recognition, shall create a temporary organization email address for
          official communication purposes.
        </Text>
      </View>

      {/* Section 9 */}
      <View style={styles.sectionTableRow}>
        <Text style={styles.sectionCellHeader}>Section 9.</Text>
        <Text style={styles.sectionCellContent}>
          The petition shall contain a commitment to send the President of the Organization to the SOCC Leadership
          Training Summit (SOCC-LTS) conducted by OSA. In case of his/her incapacity to come on the day of the LTS or
          after submitting a written explanation of his/her reason for his/her incapacity to attend the said seminar,
          the officer next in the organizational chart (i.e. Vice President, Secretary, Treasurer, PRO …) will
          automatically be next in line to represent the organization. Failure of the Organization to send a
          representative to the said SOCC-LTS shall cause the sanction/denial of the petition.
        </Text>
      </View>

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        <Text style={styles.text}>
          I acknowledge that I have read and understood the Rules of Procedure for Recognition of Student Organizations
          in its entirety and agree to abide by them.
        </Text>
        <Text style={[styles.signatureText, { paddingTop: 10 }]}>Signed:</Text>
        {annex.president ? (
          <SignatureSection
            printedName={annex.president.name}
            dateSigned={`Date Signed: ${new Date(annex.president.dateSigned).toLocaleDateString()}`}
            title="Incoming Organization President"
            signatureImage={annex.president.signatureUrl}
          />
        ) : (
          <SignatureSection
            printedName="________________________"
            dateSigned="Date Signed: ____________________"
            title="Incoming Organization President"
            signatureImage={null}
          />
        )}
      </View>

      <View fixed style={styles.footer}>
        <Text>All rights reserved by the Office for Student Affairs</Text>
      </View>
    </Page>
  </Document>
);

export default function EnhancedAnnex01Manager() {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<Annex01[]>([]);
  const [newAcademicYear, setNewAcademicYear] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [isCreatingAnnex, setIsCreatingAnnex] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<Annex01 | null>(null);
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
      const response = await axios.get(`/api/annexes/${organizationId}/annex-01`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewAnnex = async () => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-01`, {
        academicYear: newAcademicYear,
      });
      setAnnexList([...annexList, response.data]);
      setIsCreatingAnnex(false);
    } catch (error) {
      console.error("Error creating annex:", error);
    }
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${organizationId}/annex-01/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const generatePDFBlob = async (annex: Annex01): Promise<Blob> => {
    try {
      console.log("Generating PDF for annex:", annex);
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      console.log("PDF blob generated successfully");
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const openSignatureModal = async (annex: Annex01) => {
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

  const generatePDF = async (annex: Annex01) => {
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

  const fetchUpdatedAnnex = async (annexId: string): Promise<Annex01> => {
    if (!organizationId) {
      throw new Error("Organization ID is not available");
    }
    const response = await axios.get(`/api/annexes/${organizationId}/annex-01/${annexId}`);
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

     const updateResponse = await axios.patch(`/api/annexes/${organizationId}/annex-01/${selectedAnnex._id}`, {
       [selectedSignaturePosition]: {
         name: session?.user?.name || "",
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
       throw new Error("Failed to update Annex 01");
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
      <h1 className="text-2xl font-bold mb-6">ANNEX 01 Rules of Procedure for Recognition</h1>
      {!isCreatingAnnex ? (
        <button onClick={() => setIsCreatingAnnex(true)} className="btn btn-primary mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Create New Annex
        </button>
      ) : (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Create New Annex</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Academic Year</span>
              </label>
              <input
                type="text"
                value={newAcademicYear}
                onChange={(e) => setNewAcademicYear(e.target.value)}
                className="input input-bordered"
                placeholder="e.g., 2023-2024"
              />
            </div>
            <div className="card-actions justify-end mt-4">
              <button onClick={() => setIsCreatingAnnex(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={createNewAnnex} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p>No Rules of Procedure for Recognition Annex created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex 01</h3>
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
                      <option value="president">President</option>
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
  annex: Annex01;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: Annex01) => void;
  generatePDF: (annex: Annex01) => void;
}

function AnnexCard({ annex, submitAnnexForReview, openSignatureModal, generatePDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Rules of Procedure for Recognition Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
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
