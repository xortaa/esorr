"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render } from "@react-pdf/renderer";

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
    borderStyle: "none", // Remove table borders
    marginBottom: 10,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    borderStyle: "none", // Remove cell borders
  },
  signatureText: {
    textAlign: "left",
    marginBottom: 10,
  },
  
  signatureSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signatureLine: {
    marginTop: 10,
    width: "100%", // Adjust for full width
    textAlign: "left",
  },

  signatureDetails: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});


// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={[styles.page]}>
        {/* Header */}

        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            ANNEX H
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          Commitment to Anti-Hazing Law
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
            COMMITMENT TO ANTI-HAZING LAW
                {"\n"}
                {"\n"}
            </Text>
        </View>
        
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Date: //*Month/Day/Year fetch sa code date today?*/</Text>
        </View>
      
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>__________________________________</Text>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Officer-In-Charge, Office for Student Affairs</Text>
                <Text style={{ fontSize:"11", textAlign: "left"}}>University of Santo Tomas</Text>
        </View>
        
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "center", color:"red", textDecoration: "underline"}}>RE: ANTI-HAZING STATEMENT</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Dear ___________________:</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>This is to inform your kind office that I/we submit ourselves to adhere to the provisions of Republic Act No. 8049,
                otherwise known as the Anti-Hazing Law of 1995, and to any rules and regulations your kind office will issue to
                implement such law.
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Furthermore, I/we find the Anti-Hazing Law in accordance with the constitution as well as with the Thomasian
                principles. It is a just law and we give our unequivocal declaration of support for this law.
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>On behalf of &lt;NAME OF ORGANIZATION&gt;, I/we have attended the seminar on Anti-Hazing Law and its discussion
                on the proposed revision.
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>In compliance with Anti-Hazing Law, I/we understood the provisions discussed. I/We solemnly swear to abide and
                discuss with my co-officers and members the implementation of rules and regulations as part of its rules of conduct.
                </Text>
        </View>
        
    {/* 2-Column Table for Signatures */}
    <View style={styles.table}>
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={styles.tableCell}>
              Signed: {"\n"}{"\n"}{"\n"}
              Print Name and Signature {"\n"}
              President {"\n"}
              {"\n"}{"\n"}
              Print Name and Signature {"\n"}
              Secretary {"\n"}
              {"\n"}{"\n"}
              Print Name and Signature {"\n"}
              Auditor {"\n"}
              {"\n"}{"\n"}
              Attested by: {"\n"}{"\n"}{"\n"}
              Print Name and Signature {"\n"}
              Organization Adviser
            </Text>

            {/* Column 2 */}
            <Text style={styles.tableCell}>
            {"\n"}{"\n"}{"\n"}
              Print Name and Signature {"\n"}
              Vice President {"\n"}
              {"\n"}{"\n"}
              Print Name and Signature {"\n"}
              Treasurer {"\n"}
              {"\n"}{"\n"}
              Print Name and Signature {"\n"}
              PRO {"\n"}
            </Text>
          </View>
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

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

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
    <h1>PDF GENERATOR EXAMPLE ANNEX H</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
