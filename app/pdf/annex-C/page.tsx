"use client";

// Update the path to the correct location of the fonts module
import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render, Image } from "@react-pdf/renderer";
import { Underline } from "lucide-react";
import { Rowdies } from "next/font/google";

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
          <View fixed style={{ flexDirection: "row" }}>
            <View style={{ width: "80%" }}>
              <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
                STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
              </Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right", fontFamily: "Arial Narrow Bold" }}>
                ANNEX C
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>Articles of Association</Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Annex Title */}
        <View>
          <Text
            style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline", fontSize: 16, textAlign: "center" }}
          >
            Articles of Association
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 14, textAlign: "center", paddingTop: 5 }}>
            Consitution and By-Laws of this Organization
          </Text>
        </View>

        {/* Org Info */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 14 }}>Name of Organization</Text>
            </View>
            <Text style={{ width: "50%", borderBottom: 1, fontSize: 14 }}> Name of Org </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 14 }}>Faculty/College/Institute/School</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontSize: 14, borderBottom: 1 }}> Sample Faculty </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 14 }}>Ratification Date</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontSize: 14, borderBottom: 1 }}> Sample Date of Ratification </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 14 }}>Ratification Venue</Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontSize: 14, borderBottom: 1 }}> Sample Venue of Ratification </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            marginTop: 30,
            fontFamily: "Arial Narrow Bold",
            textAlign: "center",
            fontSize: 16,
            textDecoration: "underline",
          }}
        >
          SECRETARY'S CERTIFICATE
        </Text>

        <Text style={{ marginTop: 10, textAlign: "justify" }}>
          I, <Text style={{ fontFamily: "Arial Narrow Bold" }}> First Name M.I. Surname</Text> , a duly elected and
          qualified Secretary of the <Text style={{ fontFamily: "Arial Narrow Bold" }}> Name of the Organization</Text>{" "}
          , of the University of Santo Tomas, do hereby certify that:
        </Text>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={{ width: "10%", marginLeft: 20 }}>1.</Text>
          <Text style={{ width: "90%" }}>
            I am familiar with the facts herein certified and duly authorized to certify the same;
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={{ width: "10%", marginLeft: 20 }}>2.</Text>
          {/* Date and Venue input */}
          <Text style={{ width: "90%", textAlign: "justify" }}>
            At the General Assembly of the Representatives of Recognized Student Organization duly held and convened on
            Month Day, 202_ at _________________ which assembly a quorum was present and acted throughout, the General
            Assembly approved the proposed 202_ Name of Organization Article of Association by a majority vote of its
            members.
          </Text>
        </View>

        <Text style={{ marginTop: 20 }}>
          WITNESS THE SIGNATURE of the undersigned as such officer of the Name of the Organization this ______ day of
          _________________________ at _____________________.
        </Text>

        {/* Signature */}

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Signed:</Text>

        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <View style={{ flexDirection: "column", width: "50%" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
              Print Name and Signature
            </Text>
            <Text style={{}}>Organization Secretary</Text>
          </View>
          <View style={{ flexDirection: "column", width: "50%" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
              Print Name and Signature
            </Text>
            <Text style={{}}>Organization President</Text>
          </View>
        </View>

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>
          Attested by{" "}
          <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>(for College-based Student Organization)</Text>:
        </Text>

        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <View style={{ flexDirection: "column", width: "50%" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
              Print Name and Signature
            </Text>
            <Text style={{}}>Student Welfare and Development Coordinator </Text>
          </View>
          <View style={{ flexDirection: "column", width: "50%" }}></View>
        </View>

        <Text style={{ marginTop: 20 }}>
          Per our record, the attached Constitution and By-Laws were ratified by the members of ORGANIZATION NAME on
          (ratification date).
        </Text>

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Certified by:</Text>

        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <View style={{ flexDirection: "column", width: "50%" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>
              Print Name and Signature
            </Text>
            <Text style={{}}>SOCC Director </Text>
          </View>
          <View style={{ flexDirection: "column", width: "50%" }}></View>
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

const App = () => (
  <div>
    <h1>PDF GENERATOR EXAMPLE</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
