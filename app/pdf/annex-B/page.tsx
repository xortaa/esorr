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
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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

  bodyText: {
    marginLeft: 20,
    marginBottom: 10,
    textAlign: "justify",
  },

  signatureSection: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 40,
    textAlign: "left",
    fontSize: 9,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 10,
    width: "40%",
    alignSelf: "center",
  },
  signatureText: {
    flexDirection: "column",
    width: "50%",
    marginRight: 110,
  },
  signatureDetails: {
    marginTop: 10,
    textAlign: "left",
  },
});

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page} size={"LEGAL"}>
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>List of Members</Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Title Section */}

        <View style={{ flexDirection: "column", textAlign: "center" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 16 }}>LIST OF MEMBERS</Text>
          <Text style={{}}>(as of AY (Insert Year))</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 50 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>NAME OF ORGANIZATION</Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline", paddingLeft: 10 }}>
            TEST ORGANIZATION
          </Text>
        </View>

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 10 }}>
          OSA’s Privacy Notice on the Documentary Requirements for Recognition of Student Organizations
        </Text>

        <Text style={{ marginTop: 10, textAlign: "justify" }}>
          The Office for Student Affairs (OSA) gathers personal data of bonafide students of the University through the
          documentary requirements on Application for Recognition of Student Organizations. The personal data, photos,
          and membership/officership information form part of the student organizations' data bank. Data is stored
          online in a secure and safe server of the OSA, while the equivalent hard copy is kept on file and properly
          secured in a filing cabinet. The OSA administrators, staff in charge of student organizations, and OSA
          reviewers are the persons permitted to access the files of student organizations. These documents are not
          shared with any party outside the University unless the disclosure of such information is compelled by
          operation of law or as requested by external auditors, i.e., PACUCOA, AUN-QA, ISO, etc. These online files and
          hard copies are retained at the OSA/University Archives facility.
        </Text>

        {/* Table */}

        <View style={{ borderWidth: 1, marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={{ padding: 5, width: "25%", borderRightWidth: 1 }}> Number of Officers</Text>
            <Text style={{ width: "75%" }}></Text>
          </View>
          <View style={{ flexDirection: "row", width: "100%", borderTop: 1, textAlign: "left" }}>
            <Text style={{ padding: 5, width: "25%", borderRightWidth: 1 }}>
              Age and Gender
              <Br />
              Distribution of Members
            </Text>

            <View style={{ width: "75%", flexDirection: "column" }}>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center" }}>
                <Text style={{ width: "20%", borderRightWidth: 1 }}></Text>
                <Text style={{ width: "40%", borderRightWidth: 1 }}>Total No. of Male members</Text>
                <Text style={{ width: "40%" }}>Total No. of Female members</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  Below 18
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}></Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}> </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  18 to 20
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}></Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}> </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  21 and above
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}></Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 1 */}

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

// Emphasized text component
const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

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
      <Text
        style={[
          styles.tableCell,
          {
            width: "15%",
            textAlign: "left",
            borderRightWidth: 1,
            borderBottomWidth: 1,
            fontFamily: "Arial Narrow Bold",
          },
        ]}
      >
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
