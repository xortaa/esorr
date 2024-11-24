"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

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

// Styles
const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: 40,
    paddingBottom: 80,
    paddingRight: 80,
    paddingLeft: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensures the image covers the entire page without stretching
    zIndex: -1, // Keeps the image in the background
  },
  section: {
    marginBottom: 15,
  },
  orgname: {
    fontSize: 25,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    paddingTop: 380,
  },
  accred: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "right",
    paddingTop: 5,
    paddingRight: 95,
  },
  year: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "right",
    paddingTop: 165,
    paddingRight: 92,
  },
  signature: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    paddingTop: 2,
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: "left",
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
  },
});

// Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page} size="A4" orientation="portrait">
        {/* Background Image */}
        <Image
          style={styles.backgroundImage}
          src="/images/RecognitionCertification.jpg" // Path to the image in the public folder
        />
        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.orgname}>Environmental Advocates Reaching Towards Humanity UST</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.accred}>-B-24-25-06</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.year}>2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.signature}>signature</Text>
        </View>
      </Page>
    </Document>
  );
};

// Generate PDF function
const generatePDF = async () => {
  const doc = <MyDocument />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

// Main App
const App = () => (
  <div>
    <h1>PDF GENERATOR EXAMPLE ACCREDITATION CERT</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
