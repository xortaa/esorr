"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer } from "@react-pdf/renderer";

// Register Times New Roman and Arial Narrow fonts
Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/timesnewroman/times-new-roman.woff2",
});

Font.register({
  family: "Arial Narrow",
  src: "", // Replace with your actual Arial Narrow font URL
});

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    textAlign: "center",
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
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  subSubHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
  indent: {
    marginLeft: 20,
  },
  indent2: {
    marginLeft: 40,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
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
    marginTop: 40,
    textAlign: "left",
    marginBottom: 40,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 10,
    width: "40%",
    alignSelf: "center",
  },
  signatureText: {
    textAlign: "center",
    marginTop: 5,
  },
  signatureDetails: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

// Footer component
const Footer = ({ currentPage, totalPages }) => (
  <View style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
    <Text>
      Page {currentPage} of {totalPages}
    </Text>
  </View>
);

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            The Rules of Procedure for Recognition of Student Organizations
          </Text>
          <Text style={{ fontSize: 12, marginTop: 5 }}>AY 2024-2025</Text>
        </View>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Student Organizations Recognition Requirements</Text>
        </View>
        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 1</Text>
          <Text style={styles.text}>
            Only student organizations created with the purpose consistent with the mission and vision of the University
            may be recognized. Recognition of student organizations is a matter of privilege which may be granted upon
            the discretion of the University.
          </Text>
        </View>
        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 2</Text>
          <Text style={styles.text}>
            The Petition for Recognition of a student organization must be submitted to the Office for Student Affairs
            not later than the 21st of June.{" "}
            <strong> Late and incomplete (unsigned) document submissions will not be accepted. </strong>
          </Text>

          <Text style={styles.text}>
            The rights and privileges granted under such recognition shall expire on the 31st day of May following the
            year of recognition.
          </Text>
        </View>
        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 3</Text>
          <Text style={styles.text}>
            The Petition for recognition must be signed by the duly elected president of the organization for the
            upcoming academic year and endorsed by the current organization adviser. For College-based organization
            (CBO), the Petition must be endorsed by the Coordinator of the Student Welfare and Development Committee
            (SWDC), the Dean/Director and Regent.
          </Text>
        </View>
        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 4</Text>
          <Text style={styles.text}>The petition must include as part of its annexes the following documents:</Text>
          <View style={styles.indent}>
            <Text style={styles.listItem}>
              4.1 Annex A: Student Organization’s General Information Report prepared by the Executive Board and
              approved by the President and the Officer’s Information Sheet marked as “Annex A-1 to A-n”;
            </Text>
            <Text style={styles.listItem}>
              4.2 Annex B: List of Members (Membership of the current Academic Year of recognition);
            </Text>
            <Text style={styles.listItem}>
              4.3 Annex C: A certification that the Articles of Association (AoA) was ratified by the student-members,
              issued by the organization‘s Secretary and President, reviewed by the SOCC Director and attested by the
              SWDC coordinator;
            </Text>
            <Text style={styles.listItem}>
              4.4 Annex C-1: An updated/revised copy of the organization’s AoA guided by the Quality Review Form
              (developed on 14 February 2020);
            </Text>
            <Text style={styles.listItem}>
              4.5 Annex D: An impression of the organization’s Logo and Letterhead with certification from the Secretary
              that the same was duly approved by its policy-making board or its members as the case may be;
            </Text>
            <Text style={styles.listItem}>
              4.6 Annex E: The organization’s Accomplishment Report, Evaluation and Financial Reports for each
              accomplished activity, Performance Assessment of the current Academic Year of recognition using the
              2019-2020 format prepared by the outgoing Treasurer consisting of the following;
            </Text>
            <Text style={styles.indent2}>Annex E-1: Summary of Receipts and Disbursements</Text>
            <Text style={styles.indent2}>Annex E-2: Liquidation Reports</Text>
            <Text style={styles.indent2}>Annex E-3: Evaluation Report for the previous academic year.</Text>

            <Text style={styles.listItem}>
              The report must be signed by the Treasurer as the person who prepared the reports, by the Auditor who
              audited the financial report and approved by the President and Organization Adviser.
            </Text>
            <Text style={styles.listItem}>
              Further, for CBO, the summary report must be duly noted by the following University officials: the SWDC,
              the Dean/Director and the Regent;
            </Text>
            <Text style={styles.listItem}>
              4.7 Annex F: A certification of the organization’s membership for the previous academic year.
            </Text>
            <Text style={styles.listItem}>
              4.8 Annex G: A letter of endorsement from the College Dean or appropriate authority.
            </Text>
            <Text style={styles.listItem}>
              4.9 Any other documents as may be required by the Office for Student Affairs.
            </Text>
          </View>
        </View>
        {/* Section 5 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 5</Text>
          <Text style={styles.text}>
            All pages must be signed by the incoming president (left margin) before submitting to OSA. Hard copies
            submitted in CLEAR BOOK in the color as provided in section 7. Failure to submit the documents in both
            manners may cause the denial of the petition for recognition.
          </Text>
        </View>
        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 6</Text>
          <Text style={styles.text}>
            The Petition for College-based Organization must be prepared in triplicate copies. The ORIGINAL copy is to
            be filed with OSA, the DUPLICATE copy to the Dean’s Office (optional), and the petitioner shall retain the
            THIRD copy.
          </Text>
        </View>
        {/* Section 7 with Table */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 7</Text>
          <Text style={styles.text}>
            The name of college-based student organizations shall contain a suffix as provided herein. Example: Legal
            Management Society (AB). University-wide student organizations shall not be followed by any suffix.
          </Text>

          {/* Table starts here */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Name of College</Text>
              <Text style={styles.tableCellHeader}>Clear Book Color</Text>
              <Text style={styles.tableHeaderLastCell}>Abbreviation</Text>
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

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Tourism and Hospitality Management</Text>
              <Text style={styles.tableCell}>APPLE GREEN</Text>
              <Text style={styles.tableLastCell}>CTHM</Text>
            </View>
          </View>
          {/* Table ends here */}
        </View>
        {/* Section 8 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 8</Text>
          <Text style={styles.text}>
            Each student organization shall use the official G-Suite account provided, where it may be officially
            notified of the OSA’s communications. All notices shall be considered served to the organization upon
            sending of the message to the official e-mail address.
          </Text>
        </View>
        {/* Section 9 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 9</Text>
          <Text style={styles.text}>
            The petition shall contain a commitment to send the President of the Organization to the SOCC Leadership
            Training Summit (SOCC-LTS) conducted by OSA. In case of incapacity, the officer next in line shall represent
            the organization.
          </Text>
        </View>
        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.text}>
            I acknowledge that I have read and understood the Rules of Procedure for Recognition of Student
            Organizations in its entirety and agree to abide by them.
          </Text>

          {/* Signature line */}
          <View style={styles.signatureLine} />

          {/* Signature title */}
          <Text style={styles.signatureText}>Incoming Organization President</Text>

          {/* Signature details (Print name, Date signed) */}
          <View style={styles.signatureDetails}>
            <Text>Print Name: _______________________</Text>
            <Text>Date Signed: ____________________</Text>
          </View>
        </View>
        {/* Footer with dynamic page numbering */}
        <Footer currentPage={1} totalPages={1} /> {/* This needs to be adjusted based on total pages */}
      </Page>
    </Document>
  );
};

// Function to generate PDF and open in new tab
const generatePDF = async () => {
  const doc = <MyDocument />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const App = () => (
  <div>
    <h1>PDF GENERATOR EXAMPLE</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
