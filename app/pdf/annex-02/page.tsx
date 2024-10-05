"use client";

// Update the path to the correct location of the fonts module
import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render } from "@react-pdf/renderer";
import { Underline } from "lucide-react";

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
  },
  subsubsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%", // Adjust width to match subsectionCellContent
    textAlign: "justify",
  },

  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  tableCol: {
    display: "flex",
    flexDirection: "column",
  },
  tableCell: {
    padding: 5,

    fontSize: 11,
    textAlign: "left",
  },
  tableLastCell: {
    padding: 5,

    fontSize: 11,
    textAlign: "left",
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

  signatureSection: {
    marginTop: 20,
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
      <Page style={styles.page}>
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>Petition for Recognition</Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Title Section */}

        {/* Table for Beginning Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "50%", borderBottomWidth: 1, borderRightWidth: 1 }]}>
              This petition is filed by <Br />
              Name of Student Organization
            </Text>
            <View
              style={[
                styles.tableCell,
                {
                  width: "50%",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text>
                FOR RECOGNITION <Br />
                WITH APPLICATION FOR OFFICE SPACE
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "50%", borderBottomWidth: 1, borderRightWidth: 1 }]}>
              Level of Recognition A.Y. 202_-202_
            </Text>
            {/* Empty cell to maintain structure */}
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { width: "50%" }]}>
                FOR Office for Student Affairs (OSA) USE ONLY <Br />
                The petition is:
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "50%", borderRightWidth: 1 }]}>
              Represented by: (Name of President)
            </Text>
            {/* Empty cell to maintain structure */}
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { width: "50%" }]}>
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>GRANTED for __ years</Text>
                <Br />
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>GRANTED WITH OFFICE for __ years</Text>
                <Br />
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>DENIED</Text>
                <Br />
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>OTHER REMARKS: ____________</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Section 1 */}

        {/* Table for Annexes */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
            <Text
              style={[
                styles.tableCell,
                { width: "15%", textAlign: "center", borderRightWidth: 1, borderBottomWidth: 1 },
              ]}
            >
              Annex
            </Text>
            <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}></Text>
          </View>
          {/* Annex Row */}
          <AnnexRow annexName="A" annexDescription="Student Organization’s General Information Report" />
          <AnnexRow annexName="A-1 to A-__" annexDescription="Officer’s Information Sheet" />
          <AnnexRow
            annexName="B"
            annexDescription="List of Members (Membership of the current Academic Year of recognition)"
          />
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
            <Text
              style={[styles.tableCell, { width: "15%", textAlign: "left", borderRightWidth: 1, borderBottomWidth: 1 }]}
            >
              C
            </Text>
            <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>
              A certification that the Articles of Association (AoA) was ratified by the student-members, issued by the
              organization‘s Secretary and President, reviewed by the Student Organization Coordinating Council Director
              (SOCC Director) and attested by the Student Welfare and Development Coordinator (SWDC)
              <Br></Br>
              <Br></Br>
            </Text>
          </View>
          <AnnexRow annexName="B" annexDescription="Another Annex Description" />
          <AnnexRow annexName="B" annexDescription="Another Annex Description" />
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

// Function to generate PDF and open in new tab
const generatePDF = async () => {
  const doc = <MyDocument />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const AnnexRow = ({ annexName, annexDescription }) => {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
      <Text style={[styles.tableCell, { width: "15%", textAlign: "left", borderRightWidth: 1, borderBottomWidth: 1 }]}>
        {annexName}
      </Text>
      <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>{annexDescription}</Text>
    </View>
  );
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
