"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font } from "@react-pdf/renderer";

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
  table: {
    display: "flex",
    flexDirection: "column",
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
    borderWidth: 1, // Border for the nominee table
    borderColor: "#000",
  },
  invisibleBorderCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    borderWidth: 0, // Invisible border for the signature section
  },
});

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            ANNEX G
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Organization Adviser Nomination Form
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Nomination Table */}
        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
            <EmphasizedText>ORGANIZATION ADVISER NOMINATION FORM</EmphasizedText> 
            {"\n"}{"\n"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            Petitioner hereby nominates the following as organization adviser for (university-wide student organization):
            {"\n"}{"\n"}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Nominees */}
          {[1, 2, 3].map((num) => (
            <View style={styles.tableRow} key={num}>
              <Text style={styles.tableCell}>
                {num} Nominee: (Please specify complete name with rank) {"\n"}
                Name of Faculty: {"\n"}
                Faculty/College/Institute/School: {"\n"}
              </Text>
              <Text style={styles.tableCell}>
                Email address: {"\n"}
                Contact nos: {"\n"}
                Landline: {"\n"}
                Mobile: {"\n"}
              </Text>
            </View>
          ))}
        </View>

        {/* Signature Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.invisibleBorderCell}></Text>
            <Text style={styles.invisibleBorderCell}>
              {"\n"}{"\n"}{"\n"}
              <Text style={{ fontSize: 11, fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
                Signature over Printed Name of President {"\n"}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Arial Narrow" }}>
                President {"\n"}
                Name of the Organization with Suffix
              </Text>
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 9, fontFamily: "Arial Narrow Bold", textAlign: "left" }}>
          {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}*FOR NEW ORGANIZATION ADVISER NOMINATION, PLEASE ATTACH A COPY OF HIS/HER CURRICULUM VITAE.
        </Text>

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
    <h1>PDF GENERATOR EXAMPLE ANNEX G</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
