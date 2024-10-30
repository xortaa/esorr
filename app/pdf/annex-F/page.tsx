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
                ANNEX F
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>Activities Monitoring Form</Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        {/* Title Section */}

        {/* Section 1 */}

        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Key Result Area (KRA): </Text>
          To implement SDG-based activities anchored on the SEAL of Thomasian Education and supporting the University’s
          Strategic Directional Areas.
        </Text>

        <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
          <View style={{ width: "20%", flexDirection: "column" }}>
            <Text style={{}}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>Target: </Text> Minimum of
            </Text>
          </View>
          <View style={{ width: "80%", flexDirection: "column", marginLeft: 10 }}>
            <Text>1 General Assembly,</Text>
            <Text>1 Year-End Assembly/Report,</Text>
            <Text>1 Recruitment Period,</Text>
            <Text>2 Major Activities, </Text>
            <Text>2 Community Service,</Text>
            <Text>Active Involvement in University or OSA-initiated activities</Text>
          </View>
        </View>

        <View style={{ flexDirection: "column", borderWidth: 1, marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ width: "40%", textAlign: "center", borderRightWidth: 1 }}>
              KEY UNIT ACTIVITIES <Br /> A.Y. 202_-202_
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1 }}>
              Target Date <Br /> Month/Day/Year <Br /> Month in words/00/0000
            </Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 9, textAlign: "center" }}>
              <Text style={{}}> To be accomplished by OSA / Organization Adviser</Text>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  Actual Date <Br />
                  Accomplished
                </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  Post Event <Br /> Evaluation <Br /> (Mean Rating)
                </Text>
                <Text style={{ width: "33.3%" }}>Interpretation</Text>
              </View>
            </View>
          </View>
          {/* First Term */}
          <Text
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: "Arial Narrow Bold",
              borderTopWidth: 1,
              padding: 2,
            }}
          >
            FIRST TERM
          </Text>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Recruitment 101 (USO) / Organization Fair (CBO){" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              August 2024 - October 2024 (USO) CBO - depending on Academic unit
            </Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Recruitment 101 (USO) / Organization Fair (CBO){" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}></Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>2</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              General Assembly{" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}></Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>

          {/* Second Term */}
          <Text
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: "Arial Narrow Bold",
              borderTopWidth: 1,
              padding: 2,
            }}
          >
            SECOND TERM
          </Text>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Recruitment 101 (USO) / Organization Fair (CBO){" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}></Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Recruitment 101 (USO) / Organization Fair (CBO){" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}></Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Recruitment 101 (USO) / Organization Fair (CBO){" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}></Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>

          {/* Special Term */}
          <Text
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: "Arial Narrow Bold",
              borderTopWidth: 1,
              padding: 2,
            }}
          >
            SECOND TERM
          </Text>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Day 0{" "}
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Jun 3, 2024
            </Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", borderTop: 1 }}>
            <Text style={{ width: "5%", borderRightWidth: 1, paddingHorizontal: 2 }}>1</Text>
            <Text style={{ width: "35%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              Attendance in SOCC LTW
            </Text>
            <Text style={{ width: "30%", textAlign: "center", borderRightWidth: 1, paddingHorizontal: 10 }}>
              {" "}
              July 3-5, 2024
            </Text>
            <View style={{ flexDirection: "column", width: "50%", fontSize: 15, textAlign: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}> </Text>
                <Text style={{ width: "33.3%", borderRightWidth: 1 }}>
                  <Br />
                  <Br />
                  <Br />
                </Text>
                <Text style={{ width: "33.3%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ width: "50%", flexDirection: "column" }}>
            <Text
              style={{
                fontFamily: "Arial Narrow Bold Italic",

                display: "flex",
                color: "white",
              }}
            >
              <Text style={{ backgroundColor: "black" }}>Prepared by:</Text>
            </Text>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ marginTop: 40, textAlign: "center" }}>My name is</Text>
              <Text style={{ borderTopWidth: 1 }}> Signature of over Printed Name of Outgoing President</Text>
            </View>

            <View style={{ flexDirection: "column" }}>
              <Text style={{ marginTop: 40, textAlign: "center" }}>My name is</Text>
              <Text style={{ borderTopWidth: 1 }}> Signature of over Printed Name of Incoming President</Text>
            </View>

            <Text
              style={{
                fontFamily: "Arial Narrow Bold Italic",

                color: "white",
                marginTop: 40,
              }}
            >
              <Text style={{ backgroundColor: "black" }}>Appproved by:</Text>
            </Text>

            <View style={{ flexDirection: "column" }}>
              <Text style={{ marginTop: 40, textAlign: "center" }}>My name is</Text>
              <Text style={{ borderTopWidth: 1 }}> Signature of over Current Organization Adviser</Text>
            </View>
          </View>

          <View style={{ width: "50%", flexDirection: "column" }}></View>
        </View>
        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>
          Suggested list of KEY UNIT ACTIVITIES (KUA) to ensure the achievement of the expected targets from student
          organizations.
        </Text>

        <View style={{ flexDirection: "row", paddingTop: 20, fontSize: 10 }}>
          <Text style={{ width: "20%", flexDirection: "column", fontFamily: "Arial Narrow Bold" }}>First Term</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              <Br />
              <Br />
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Recruitment 101 or Organization Fair</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>General Assembly</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>{"<Bulletin Board>"}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>
                Meetings on Ratification or Amendments of the Articles of Association
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Team Building</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>Meetings </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>
                Active Participation in OSA/University-initiated Activities{" "}
                <Text style={{ fontFamily: "Arial Narrow Italic" }}> (at least attended by a representative)</Text>{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>Active Support/Cooperation in SOCC-initiated Activities </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>
                Specific Activities of the Organization
                <Text style={{ fontFamily: "Arial Narrow Italic" }}> (aligned with your Mission or KRA)</Text>{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>Community Service </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>Timely submission of Evaluation Report and Financial Statement for every completed activity –</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>Midyear review and evaluation of Operational Plan</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", paddingTop: 20, fontSize: 10 }}>
          <Text style={{ width: "20%", flexDirection: "column", fontFamily: "Arial Narrow Bold" }}>Second Term</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              <Br />
              <Br />
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Meetings</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Year-End Assembly/Report</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>
                Active participation in OSA/University-initiated Activities
                <Text style={{ fontFamily: "Arial Narrow Italic" }}> (at least attended by a representative)</Text>{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Active Support/Cooperation in SOCC-initiated Activities</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>
                Specific Activities of the Organization{" "}
                <Text style={{ fontFamily: "Arial Narrow Italic" }}> (aligned with your Mission or KRA)</Text>{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text> Election of Officers </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text> Application for Petition for Re-recognition </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text> Timely submission of Evaluation Report and Financial Statement for every completed activity </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text>
                Student Awards
                <Text style={{ fontFamily: "Arial Narrow Italic" }}>
                  (be a Student Awards Recipient by completing/accomplishing worthy activities not later than every 30th
                  of April)
                </Text>{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text> End-of-Year review and evaluation of Operational Plan </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", paddingTop: 20, fontSize: 10 }}>
          <Text style={{ width: "20%", flexDirection: "column", fontFamily: "Arial Narrow Bold" }}>Special Term</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              <Br />
              <Br />
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Attendance in Day 0</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Attendance in SOCC LTS</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Attendance in VLT 1 (Anti Hazing Law)</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "5%" }}> {"\u2022"} </Text>
              <Text style={{ width: "95%" }}>Monitoring, Evaluation and Review of Operational Plan</Text>
            </View>
          </View>
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
