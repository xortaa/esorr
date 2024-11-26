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
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
};

type MyDocumentProps = {
  annex: Annex01;
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

type SignaturePosition = "president";

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const SignatureSection = ({ printedName, dateSigned, title, signatureImage }) => (
  <View style={styles.signatureSection}>
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

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-01/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-01/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-01/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-01/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX 01 Rules of Procedure for Recognition</h1>

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
              <p>No Rules of Procedure for Recognition Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* {isModalOpen && selectedAnnex && pdfBlob && (
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
      )} */}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: Annex01;
  generatePDF: (annex: Annex01) => void;
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
            <h2 className="card-title">Rules of Procedure for Recognition Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-sm" onClick={() => generatePDF(annex)}>
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
          {(session?.user?.role === "OSA" || session?.user?.role === "RSO" || session?.user?.role === "AU") && (
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
