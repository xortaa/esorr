//C:\Users\kercw\code\dev\esorr\app\pdf\annex-J\page.tsx
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
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 10,
    width: "40%",
    alignSelf: "center",
  },
  signatureText: {
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
      <Page style={styles.page} size="LEGAL" orientation="portrait">
        {/* Header */}

        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            ANNEX J
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          Commitment to Active Participation
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
            <Text style={{ fontSize: 16, fontFamily: "Arial Narrow Bold", textAlign: "center", textDecoration: "underline" }}>
                {"\n"}
            COMMITMENT TO ACTIVE PARTICIPATION
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
                <Text style={{ fontSize:"11", textAlign: "left"}}>Dear ___________________:</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "center", color:"red", textDecoration: "underline"}}>RE: <EmphasizedText> ACTIVE PARTICIPATION IN ALL UNIVERSITY OR OSA-INITIATED ACTIVITIES </EmphasizedText></Text>
        </View>

       

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>We, the officers of NAME OF ORGANIZATION are expected to attend and actively participate, or assure that a
                member of the organization shall be made available to participate in all OSA-initiated activities (specifically the
                Valiant Legion Tool) and advocacies of the University. We understand that failure to attend to any activity for any
                reason shall result in sanction or denial of our recognition the following Academic Year (YEAR FOR ACCREDITATION).
                {"\n"}
                {"\n"}
                </Text>
        </View>
       
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>Signed:</Text>
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>President {"\n"}</Text>
                
        </View>
            
        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>Vice President {"\n"}</Text>
                
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>Secretary {"\n"}</Text>
                
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>Treasurer {"\n"}</Text>
                
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>Auditor {"\n"}</Text>
                
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>PRO {"\n"}</Text>
                
        </View>

    <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>{"\n"}Attested by:</Text>
        </View>

        <View style={styles.section}>
        <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>FIRST NAME M.I. SURNAME </Text>
                <Text style={{ fontSize:"11", fontFamily: "Arial Narrow", textAlign: "justify"}}>Organization Adviser {"\n"}</Text>
                
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text style={{textAlign: "right", color:"#000"}}>UST:S030-00-FO115</Text>
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
    <h1>PDF GENERATOR EXAMPLE ANNEX J</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
