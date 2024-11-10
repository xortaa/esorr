"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, Image, PDFViewer, render } from "@react-pdf/renderer";

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
         
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>ANNEX L</Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Commitment to Submit the Post Event Evaluation on Time
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text
            style={{ fontSize: 16, fontFamily: "Arial Narrow Bold", textAlign: "center", textDecoration: "underline" }}
          >
            COMMITMENT TO SUBMIT THE POST EVENT EVALUATION {"\n"}
            OF EACH COMPLETED ACTIVITY ON TIME
            {"\n"}
            {"\n"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>Date: //*Month/Day/Year fetch sa code date today?*/</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>__________________________________</Text>
          <Text style={{ fontSize: "11", textAlign: "left" }}>Officer-In-Charge, Office for Student Affairs</Text>
          <Text style={{ fontSize: "11", textAlign: "left" }}>University of Santo Tomas {"\n"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "left" }}>Dear ___________________:</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "justify" }}>
            We, the officers of NAME OF ORGANIZATION, commit to submit a post event evaluation of each completed
            activity on time to the Office for Student Affairs through the Student Organizations Coordinating Council
            Office.
            {"\n"}
            {"\n"}
            It is the utmost responsibility of the officers to create a culture of excellence and implement best
            practices, systems, and standards in the organization as well as to contribute to the fulfillment of the
            mission, vision, and goals of the University.
            {"\n"}
            {"\n"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "justify" }}>Signed:</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{
              fontSize: "11",
              fontFamily: "Arial Narrow Bold",
              textAlign: "justify",
              textDecoration: "underline",
            }}
          >
            FIRST NAME M.I. SURNAME{" "}
          </Text>
          <Text style={{ fontSize: "11", fontFamily: "Arial Narrow", textAlign: "justify" }}>
            (Officer In-Charge in Post Events Documentation/Evaluation) {"\n"}
            {"\n"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{
              fontSize: "11",
              fontFamily: "Arial Narrow Bold",
              textAlign: "justify",
              textDecoration: "underline",
            }}
          >
            FIRST NAME M.I. SURNAME{" "}
          </Text>
          <Text style={{ fontSize: "11", fontFamily: "Arial Narrow", textAlign: "justify" }}>Secretary {"\n"}</Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{
              fontSize: "11",
              fontFamily: "Arial Narrow Bold",
              textAlign: "justify",
              textDecoration: "underline",
            }}
          >
            FIRST NAME M.I. SURNAME{" "}
          </Text>
          <Text style={{ fontSize: "11", fontFamily: "Arial Narrow", textAlign: "justify" }}>President {"\n"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: "11", textAlign: "justify" }}>{"\n"}Attested by:</Text>
        </View>
        <View style={styles.section}>
          <Text
            style={{
              fontSize: "11",
              fontFamily: "Arial Narrow Bold",
              textAlign: "justify",
              textDecoration: "underline",
            }}
          >
            FIRST NAME M.I. SURNAME{" "}
          </Text>
          <Text style={{ fontSize: "11", fontFamily: "Arial Narrow", textAlign: "justify" }}>
            Organization Adviser{" "}
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text style={{ textAlign: "right", color: "#000" }}>UST:S030-00-FO117</Text>
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
    <h1>PDF GENERATOR EXAMPLE ANNEX L</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
