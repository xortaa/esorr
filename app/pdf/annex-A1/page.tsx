"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render, Image } from "@react-pdf/renderer";
import { Underline, Vegan } from "lucide-react";

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
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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
      <Page size="LEGAL" style={[styles.page]}>
        {/* Header */}

        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>
          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Organization Officer's Information Sheet
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}
        <View style={{ flexDirection: "row", width: "100%", marginBottom: 40 }}>
          <View style={{ width: "80%", flexDirection: "column", textAlign: "center", paddingHorizontal: "40" }}>
            <Text style={{ textDecoration: "underline", fontSize: 16, fontFamily: "Arial Narrow Bold" }}>
              Organization Officer's Information Sheet
            </Text>
            <Text style={{ fontSize: 10 }}>Academic Year __ - __</Text>
          </View>
          <View style={{ width: "20%", flexDirection: "column", borderWidth: 1 }}>
            <Text style={styles.subheading}>(NEED TO TEST PICTURE HERE)</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{}}>NAME OF ORGANIZATION: ____________________</Text>
          <Text style={{ marginLeft: 5 }}>
            <Text style={{ fontFamily: "Boxed" }}>O</Text>
            USO
          </Text>
          <Text style={{ marginLeft: 5 }}>
            <Text style={{ fontFamily: "Boxed" }}>O</Text>
            CBO:{" "}
            <Text style={{ textDecoration: "underline", fontSize: 7 }}>
              {" "}
              (Di ko alam ano input dito basta naka underline){" "}
            </Text>
          </Text>
        </View>

        {/* Table */}

        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              width: "100%",
              textAlign: "center",
              marginTop: 10,
              backgroundColor: "yellow",
            }}
          >
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>SURNAME</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>FIRST NAME</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column" }}>
              <Text>MIDDLE NAME</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT SURNAME </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text>INPUT FIRS NAME</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", padding: 10 }}>
              <Text>INPUT MIDDLE NAME</Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              width: "100%",
              textAlign: "center",
              borderTopWidth: 0,
              backgroundColor: "yellow",
            }}
          >
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>POSITION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>COLLEGE / FACULTY </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column" }}>
              <Text>PROGRAM / MAJOR</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT POSITION </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text>INPUT COLLEGE / FACULTY</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", padding: 10 }}>
              <Text>INPUT PROGRAM / MAJOR</Text>
            </View>
          </View>
        </View>

        <Text style={{ textDecoration: "underline", paddingTop: 10 }}>CONTACT DETAILS: </Text>

        <View style={{ paddingTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 1,
              width: "100%",
              textAlign: "center",
              backgroundColor: "yellow",
            }}
          >
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text> MOBILE # </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>RESIDENCE/HOME #</Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>E-MAIL</Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column" }}>
              <Text>FACEBOOK</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT MOBILE # </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT RESIDENCE/HOME #</Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", padding: 10, borderRightWidth: 1 }}>
              <Text> INPUT E-MAIL</Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", padding: 10 }}>
              <Text> INPUT FACEBOOK</Text>
            </View>
          </View>
        </View>

        <Text style={{ textDecoration: "underline", paddingTop: 10 }}>EDUCATIONAL BACKGROUND: </Text>

        <View style={{ paddingTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 1,
              width: "100%",
              textAlign: "center",
              backgroundColor: "yellow",
              fontSize: 9,
            }}
          >
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text> EDUCATIONAL ATTAINMENT </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                {" "}
                NAME AND LOCATION OF <Br /> INSTITUTION{" "}
              </Text>
            </View>
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                YEAR OF <Br /> GRADUATION
              </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                ORGANIZATION / CLUB / <Br /> SOCIETY
              </Text>
            </View>
            <View style={{ width: "20%", flexDirection: "column" }}>
              <Text>POSITION</Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 0,
              width: "100%",
              textAlign: "center",

              fontSize: 9,
            }}
          >
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text style={{ marginTop: 10 }}> Secondary </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                {" "}
                INPUT FOR NAME AND LOCATION OF <Br /> INSTITUTION{" "}
              </Text>
            </View>
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR YEAR OF <Br /> GRADUATION
              </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR ORGANIZATION / CLUB / <Br /> SOCIETY
              </Text>
            </View>
            <View style={{ width: "20%", flexDirection: "column" }}>
              <Text> INPUT FOR POSITION</Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 0,
              width: "100%",
              textAlign: "center",

              fontSize: 9,
            }}
          >
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text style={{ marginTop: 10 }}> College / Major </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                {" "}
                INPUT FOR NAME AND LOCATION OF <Br /> INSTITUTION{" "}
              </Text>
            </View>
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR YEAR OF <Br /> GRADUATION
              </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR ORGANIZATION / CLUB / <Br /> SOCIETY
              </Text>
            </View>
            <View style={{ width: "20%", flexDirection: "column" }}>
              <Text> INPUT FOR POSITION</Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 0,
              width: "100%",
              textAlign: "center",

              fontSize: 9,
            }}
          >
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text style={{ marginTop: 10 }}> Special Training </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                {" "}
                INPUT FOR NAME AND LOCATION OF <Br /> INSTITUTION{" "}
              </Text>
            </View>
            <View style={{ width: "15%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR YEAR OF <Br /> GRADUATION
              </Text>
            </View>
            <View style={{ width: "25%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>
                INPUT FOR ORGANIZATION / CLUB / <Br /> SOCIETY
              </Text>
            </View>
            <View style={{ width: "20%", flexDirection: "column" }}>
              <Text> INPUT FOR POSITION</Text>
            </View>
          </View>
        </View>

        <Text style={{ textDecoration: "underline", paddingTop: 10 }}>OTHER INFORMATION: </Text>

        <View style={{ marginTop: 10 }}>
          <Text style={{ backgroundColor: "yellow", borderWidth: 1, paddingLeft: 5 }}>
            RECORD OF EXTRA-CURRICULAR ACTIVITIES (Inside and Outside of the University)
          </Text>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              width: "100%",
              textAlign: "center",
              borderTopWidth: 0,
              backgroundColor: "yellow",
            }}
          >
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>NAME OF ORGANIZATION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>POSITION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column" }}>
              <Text>INCLUSIVE DATES</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT NAME OF ORGANIZATION </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text>INPUT POSITION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", padding: 10 }}>
              <Text>INPUT INCLUSIVE DATES</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT NAME OF ORGANIZATION </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text>INPUT POSITION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", padding: 10 }}>
              <Text>INPUT INCLUSIVE DATES</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              width: "100%",
              textAlign: "center",
              borderTopWidth: 0,
              backgroundColor: "yellow",
            }}
          >
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>RELIGION</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1 }}>
              <Text>CITIZENSHIP</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column" }}>
              <Text>GENDER</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, width: "100%", textAlign: "center" }}>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text> INPUT RELIGION </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", borderRightWidth: 1, padding: 10 }}>
              <Text>INPUT CITIZENSHIP</Text>
            </View>
            <View style={{ width: "33%", flexDirection: "column", padding: 10 }}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "50%", flexDirection: "column" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>O</Text> Male
                  </Text>
                </View>
                <View style={{ width: "50%", flexDirection: "column" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>O</Text> Female
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>
          To the best of my knowledge, the above-stated information is true and correct. Furthermore, the information
          stated herein will be subject to UST’s policies on Privacy and Disclosure of Information.
        </Text>

        <View style={{ textAlign: "center", marginTop: 30, alignItems: "center" }}>
          <Image src="/assets/signature.png" style={{ width: 100, height: 50 }} />
          <Text style={{}}>___________________________________________</Text>
          <Text style={{}}>SIGNATURE OF OFFICER (with watermark)</Text>
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
    <h1>PDF GENERATOR EXAMPLE</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
