"use client";

// Update the path to the correct location of the fonts module
import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render, Image } from "@react-pdf/renderer";
import { Underline } from "lucide-react";
import { useState } from "react";

// Register Times New Roman and Arial Narrow fonts
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
    width: "15%", // Adjust width to prevent overflow
    paddingRight: 10, // Add padding for spacing
    fontFamily: "Arial Narrow Bold",
  },
  subsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%", // Adjust width to prevent overflow
    textAlign: "justify",
  },
  subsubsectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: "25%", // Adjust width to match subsectionCellHeader
    paddingRight: 10, // Add padding for spacing
    fontFamily: "Arial Narrow Bold",
  },
  subsubsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%", // Adjust width to match subsectionCellContent
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

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            The Rules of Procedure for Recognition of Student Organizations
          </Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Student Organizations</Text>
          <Text style={styles.heading}>Recognition Requirements</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>The Roles of Procedure for Recognition of Student Organizations</Text>
        </View>
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 1.</Text>
          <Text style={styles.sectionCellContent}>
            Only student organizations created with the purpose consistent with the mission and vision of the University
            may be recognized. Recognition of student organizations is a matter of privilege which may be granted upon
            the discretion of the University
          </Text>
        </View>
        {/* Section 2 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 2.</Text>
          <Text style={styles.sectionCellContent}>
            The Petition for Recognition of a student organization must be submitted to the Office for Student Affairs
            not later than the 21st of June.{" "}
            <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>
              Late and incomplete (unsigned) document submissions will not be accepted.
            </Text>
          </Text>
        </View>
        {/* Section 3 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 3.</Text>
          <Text style={styles.sectionCellContent}>
            The Petition for recognition must be signed by the duly elected president of the organization for the
            upcoming academic year and endorsed by the current organization adviser. For College-based organization
            (CBO), the Petition must be endorsed by the Coordinator of the Student Welfare and Development Committee
            (SWDC), the Dean/Director and Regent.
          </Text>
        </View>
        {/* Section 4 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 4.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
            <Text style={styles.subsectionCellContent}>
              The petition must include as part of its annexes the following documents:
              <Br />
              <Br />
            </Text>
            {/* Subsection */}
            <View style={[styles.sectionTableRow, { paddingBottom: 4 }]}>
              <Text style={styles.subsectionCellHeader}>4.1.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex A:</EmphasizedText> Student Organization’s General Information Report prepared by
                the Executive Board and approved by the President and the Officer’s Information Sheet marked as “Annex
                A-1 to A-n”;
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.2.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex B:</EmphasizedText> List of Members (Membership of the current Academic Year of
                recognition);
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.3.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex C:</EmphasizedText> A certification that the Articles of Association (AoA) was
                ratified by the student-members, issued by the organization‘s Secretary and President, reviewed by the
                SOCC Director and attested by the SWDC coordinator;
                <Br />
                <Br />
                <EmphasizedText>Annex C1:</EmphasizedText> An updated/revised copy of the organization’s AoA guided by
                the Quality Review Form (developed on 14 February 2020).
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.4.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex D:</EmphasizedText> An impression of the organization’s Logo and Letterhead with
                certification from the Secretary that the same was duly approved by its policy-making board or its
                members as the case may be;
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.5.</Text>
              <View style={styles.sectionTableCol}>
                <Text style={styles.subsectionCellContent}>
                  <EmphasizedText>Annex E:</EmphasizedText> The organization’s Accomplishment Report, Evaluation and
                  Financial Reports for each accomplished activity, Performance Assessment of the current Academic Year
                  of recognition using the 2019-2020 format prepared by the outgoing Treasurer consisting of the
                  following:
                  <Br />
                  <Br />
                </Text>

                {/* Subsubsection */}
                <View style={styles.sectionTableRow}>
                  <Text style={styles.subsubsectionCellHeader}>Annex E-1</Text>
                  <Text style={styles.subsubsectionCellContent}>Summary of Receipts and Disbursements</Text>
                </View>
                <View style={styles.sectionTableRow}>
                  <Text style={styles.subsubsectionCellHeader}>Annex E-2</Text>
                  <Text style={styles.subsubsectionCellContent}>Liquidation Reports</Text>
                </View>
                <View style={styles.sectionTableRow}>
                  <Text style={styles.subsubsectionCellHeader}>Annex E-3</Text>
                  <Text style={styles.subsubsectionCellContent}>
                    Performance Assessment of Student Organizations/Councils (PASOC) Forms accomplished by Current
                    Officer, Adviser, SOCC (for USO), SWDC (for CBO)
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.6.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex F:</EmphasizedText> The organization’s Activities’ Monitoring Form Prepared by the
                Executive Board and Approved by the Organization Adviser
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.7.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex G:</EmphasizedText> For USO, a letter containing the names of at least three
                faculty members nominated as organization adviser to the organization. For CBO, attach a photocopy of
                the appointment letter of the current adviser;
              </Text>
            </View>

            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.8.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex H:</EmphasizedText> For both USO and CBO: An Anti-Hazing Statement acknowledging
                that hazing in any form is NOT permitted within the student organization and its activities duly signed
                by the officers and their organization adviser
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.9.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex I:</EmphasizedText> Letter of Commitment to Responsible use of Social Media by the
                officers and members duly signed by the President and PRO;
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.10.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex J:</EmphasizedText> Commitment of Active Participation in all OSA and
                University-initiated Activities and advocacies duly signed by the officers;
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.11.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex K:</EmphasizedText> Commitment to Care for the Environment (PPS 1027) signed by
                the officers;
              </Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={styles.subsectionCellHeader}>4.12.</Text>
              <Text style={styles.subsectionCellContent}>
                <EmphasizedText>Annex L:</EmphasizedText> Commitment to Submit the Post Event Evaluation of Each
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
            submitted in CLEAR BOOK in the color as provided in section 7. Failure to submit the documents in both
            manners may cause the denial of the petition for recognition.
          </Text>
        </View>
        {/* Section 6 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 6.</Text>
          <Text style={styles.sectionCellContent}>
            The Petition for College-based Organization must be prepared in triplicate copies. The ORIGINAL copy, to be
            filed with OSA, the DUPLICATE copy, to the Dean’s Office (optional), the petitioner shall retain the THIRD
            copy.
          </Text>
        </View>
        {/* Section 7 with Table */}
        <View style={styles.sectionTableRow}>
          <Text style={[styles.sectionCellHeader, {}]}>Section 7.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
            <Text style={styles.sectionCellContent}>
              The name of college-based student organizations shall contain a suffix as provided herein.
            </Text>
            {/* Subsection */}
            <View style={styles.sectionTableRow}>
              <Text style={[styles.subsectionCellHeader, { width: 60 }]}>Example:</Text>
              <Text style={styles.subsectionCellContent}>Legal Management Society (AB).</Text>
            </View>
            <View style={styles.sectionTableRow}>
              <Text style={[styles.subsectionCellHeader, { width: 60 }]}></Text>
              <Text style={styles.subsectionCellContent}>
                University-wide student organizations shall not be followed by any suffix.*
              </Text>
            </View>
          </View>
        </View>

        {/* Table starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>NAME OF COLLEGE</Text>
            <Text style={styles.tableCellHeader}>CLEARBOOK COLOR</Text>
            <Text style={styles.tableHeaderLastCell}>ABBREVIATION</Text>
          </View>

          {/* Table Rows */}
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

          <View style={[styles.tableRow, { borderWidth: 0 }]}>
            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}>
              College of Tourism and Hospitality Management
            </Text>
            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}>APPLE GREEN</Text>
            <Text style={[styles.tableLastCell, { borderBottomWidth: 0 }]}>CTHM</Text>
          </View>
        </View>
        {/* Table ends here */}

        {/* Section 8 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 8.</Text>

          <Text style={styles.sectionCellContent}>
            Each student organization shall use the official G-Suite account provided, where it may be officially
            notified of the OSA’s communications. All notices shall be considered served to the organization upon
            sending of the message to the official e-mail address. Further, student organizations shall create a
            “Facebook” page wherein 75% of its members have followed.
            <Br />
            <Br />
            For new organization/reapplying for recognition, shall create a temporary organization email address for
            official communication purposes.
            <Text style={[styles.sectionCellContent, { marginTop: 10 }]}></Text>
          </Text>
        </View>

        {/* Section 8 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 9.</Text>

          <Text style={styles.sectionCellContent}>
            The petition shall contain a commitment to send the President of the Organization to the SOCC Leadership
            Training Summit (SOCC-LTS) conducted by OSA. In case of his/her incapacity to come on the day of the LTS or
            after submitting a written explanation of his/her reason for his/her incapacity to attend the said seminar,
            the officer next in the organizational chart (i.e. Vice President, Secretary, Treasurer, PRO …) will
            automatically be next in line to represent the organization. Failure of the Organization to send a
            representative to the said SOCC-LTS shall cause the sanction/denial of the petition.
            <Text style={[styles.sectionCellContent, { marginTop: 10 }]}></Text>
          </Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.text}>
            I acknowledge that I have read and understood the Rules of Procedure for Recognition of Student
            Organizations in its entirety and agree to abide by them.
          </Text>

          {/* Signature title */}
          <Text style={[styles.signatureText, { paddingTop: 10 }]}>Signed:</Text>

          <SignatureSection
            printedName="PRINT NAME AND SIGNATURE"
            dateSigned="Date Signed: ____________________"
            title="Incoming Organization President"
            signatureImage="/assets/signature.png" // Replace with the actual path to the signature image
          />
        </View>
        <Footer />
      </Page>
    </Document>
  );
};

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
  </View>
);

// Line break component
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

// Function to generate PDF and open in new tab
const generatePDF = async () => {
  const doc = <MyDocument />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const sstyles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "70vh",
  },
});

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Generator Example</h1>
      <button onClick={openModal} className="btn btn-primary">
        Generate PDF
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
          <div className="relative w-11/12 max-w-6xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-3xl font-semibold">PDF Viewer</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600"
                  onClick={closeModal}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <PDFViewer style={sstyles.viewer}>
                  <MyDocument />
                </PDFViewer>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-red-600"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
