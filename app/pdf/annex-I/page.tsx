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
    fontFamily: "Arial Narrow Bold",
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
      <Page style={[styles.page]}>
        {/* Header */}

        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            ANNEX I
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Commitment to Responsible Use of Social Media
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Content */}

        <View style={styles.section}>
            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
                 COMMITMENT TO RESPONSIBLE USE OF SOCIAL MEDIA
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
                <Text style={{ fontSize:"11", textAlign: "center", color:"red", textDecoration: "underline"}}>RE: RESPONSIBLE USE OF SOCIAL MEDIA</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>We, the officers and members of NAME OF ORGANIZATION do hereby read and understand the attached 
                policies and guidelines on the responsible use of social media.
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>Signed:</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>FIRST NAME M.I. SURNAME {"\n"}
                President {"\n"}
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>FIRST NAME M.I. SURNAME {"\n"}
                Secretary {"\n"}
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>FIRST NAME M.I. SURNAME {"\n"}
                PRO {"\n"}  {"\n"} {"\n"}
                </Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>Attested by:</Text>
        </View>
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>FIRST NAME M.I. SURNAME {"\n"}
                Organization Adviser
                </Text>
        </View>
       
        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "center"}}>
                {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}
                    RESPONSIBLE USE OF SOCIAL MEDIA</Text>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "center"}}>(Annex I:  Commitment to Responsible Use of Social Media)</Text>
        </View>

        <View style={styles.section}>

        <Text style={styles.sectionCellHeader}>1.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                    The outgoing set of officers shall turn over to the incoming officers the administration of the social media 
                    accounts. The outgoing officers shall no longer be administrators/ editors of the social media accounts.
                    <Br />
                    <Br />
                </Text>
            </View>
      
            <Text style={styles.sectionCellHeader}>2.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                    There should only be one official social media account per network (i.e. 1 for Facebook – a page; 1 for 
                    Twitter; 1 for Instagram), and these must be passed on to the different batches of officers.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>3.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                The organization adviser must be made an administrator of the Facebook page and must be given the login 
                credentials to the other social media accounts 
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>4.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                For Twitter and Instagram, there should be a limit to the number of those who have access to the username 
                    and password to a maximum of four: organization adviser, president, secretary, and public relations officer 
                    (or their equivalent).
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>5.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                Username and logo should be the official name and logo of the student organization; and passwords
                should be updated every two months, with a document trail provided.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>6.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                Organization adviser shall monitor the social media accounts/postings of the student organization. Posts 
                should, as much as possible, be cleared first by the adviser.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>7.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                In unavoidable circumstances, however, the organization adviser retains the right to remove or edit the 
                post-even if it has already been published-if something is found to be erroneous or irregular.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>8.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                In cases of a deadlock between the officers and the organization adviser, the SWDC/OSA will render the 
                final decision.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>9.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                Student organization officers and members must avoid engaging in an online word “war bashers”, critics,
                and the general public.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>10.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                Student organization officers and the adviser may hide comments that are unrelated to the post (e.g., 
                    advertisements).
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>11.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                In case the organization loses its organization adviser due to a cause duly approved by OSA, the 
                organization will cease to post anything until such time that a next organization adviser is appointed.
                    <Br />
                    <Br />
                </Text>
            </View>

            <Text style={styles.sectionCellHeader}>12.</Text>
          <View style={[styles.sectionTableCol, { paddingLeft: 15 }]}>
                <Text style={styles.subsectionCellContent}>
                The rest of the existing student code of conduct on use of social media will apply.
                    <Br />
                    <Br />
                </Text>
            </View>
        </View>

        <View style={styles.section}>
                <Text style={{ fontSize:"11", textAlign: "justify"}}>When it has been determined after investigation that one or more of these guidelines have been violated by an 
                    organization and/or by a group of organizations, one or more sanctions may be imposed (see Student Handbook, 
                    PPS 1028, letter f, page 86).
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
    <h1>PDF GENERATOR EXAMPLE ANNEX I</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
