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
    //borderStyle: "none", // Remove table borders
    marginBottom: 10,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    textAlign: "center",
    //borderStyle: "none", // Remove cell borders
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

  logoTable: {
    display: "flex",
    width: 150, // Fixed width for the square
    height: 150, // Fixed height for the square
    marginTop: 10, // Add margin if needed
    borderWidth: 1, // Border for the logo area
    borderColor: "#000", // Border color
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    marginLeft: "auto", // Automatically adjust left margin
    marginRight: "auto", // Automatically adjust right margin
    //marginTop: "auto", // Automatically adjust top margin for vertical centering
    marginBottom: "auto", // Automatically adjust bottom margin for vertical centering
  },

  logoTableRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
            ANNEX D
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          Organization’s Logo and Letterhead
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
                {"\n"}
           <EmphasizedText>ORGANIZATION'S LOGO AND LETTERHEAD</EmphasizedText>
                {"\n"}
                {"\n"}
            </Text>
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={styles.tableCell}>

              <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify"}}>NAME OF ORGANIZATION </Text>
              {"\n"}{"\n"}
             
              <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify"}}>Faculty/College/Institute/School</Text>
            </Text>

            {/* Column 2 */}
            <Text style={styles.tableCell}>
              
            <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>_______________________________________</Text>
              {"\n"}{"\n"}

              <Text style={{ fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>_______________________________________</Text>
            </Text>
          </View>
        </View>
      
        <View style={styles.logoTable}>
            <View style={styles.logoTableRow}>
                {/* Column for Logo */}
                
                <Text style={{ fontSize: 11, fontFamily: "Arial Narrow Bold", textAlign: "center" }}>
                    PLACE LOGO HERE
              
                </Text>
            </View>
            </View>
        
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Description or Impression of the Organization Logo
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                {"\n"}
                </Text>
               
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>(Attach Organization Letterhead on the next page.)</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>I, (Name of Secretary) of (Name of Organization) hereby certify that the above logo was adopted by the members/ 
                                                                Board in a meeting held for the purpose. </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "left"}}>Date: ______________</Text>
        </View>

        <View style={styles.section}>
                <Text style={{fontSize:"11", fontFamily: "Arial Narrow Bold", textAlign: "justify", textDecoration: "underline"}}>Print Name and Signature</Text>
                <Text>Organization Secretary</Text>
                <Text>Organization Secretary</Text>
                <Text>Faculty / College / Institute / School </Text>
        </View>
        


        <Footer />
      </Page>
    </Document>
  );
};

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text style={{textAlign: "right", color:"#000"}}>UST:S030-00-FO108</Text>
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
    <h1>PDF GENERATOR EXAMPLE ANNEX D</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
