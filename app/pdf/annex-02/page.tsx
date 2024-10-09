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
    textAlign: "left",
    justifyContent: "space-between",
    width: "100%",
  },
});

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page} size={"A4"}>
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
              (NAME OF STUDENT ORGANIZATION)
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
              Represented by: (NAME OF PRESIDENT)
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

        <Text style={[styles.subheading, { textAlign: "center", paddingVertical: 10 }]}>PETITION FOR RECOGNITION</Text>
        <Text style={[{ marginBottom: 10 }]}>
          {" "}
          Petitioner, through (COMPLETE NAME OF THE REPRESENTATIVE) , respectfully states that:{" "}
        </Text>
        <Text style={styles.bodyText}>
          1. (NAME OF PRESIDENT) of the (AFFILIATION), organized for the purpose as stated in its Article of
          Association.
        </Text>

        <Text style={styles.bodyText}>
          2. In support of the Petition for the recognition, attached to this Petition are the following documents:
        </Text>

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
          <AnnexRow annexName="A-1" annexDescription="Officer’s Information Sheet" />
          <AnnexRow
            annexName="B"
            annexDescription="List of Members (Membership of the current Academic Year of recognition)"
          />

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
              C
            </Text>
            <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>
              A certification that the Articles of Association (AoA) was ratified by the student-members, issued by the
              organization‘s Secretary and President, reviewed by the Student Organization Coordinating Council Director
              (SOCC Director) and attested by the Student Welfare and Development Coordinator (SWDC)
              <Br></Br>
              <Br></Br>
              <Text style={{ fontFamily: "Boxed" }}>O</Text> {"    "}SOCC Director
              <Br></Br>
              <Br></Br>
              <Text style={{ fontFamily: "Boxed" }}>0</Text> {"    "}Organization Secretary and President attested by
              the SWDC
            </Text>
          </View>

          <AnnexRow
            annexName="C-1"
            annexDescription="An updated/revised copy of the organization’s AoA guided by the Quality Review Form (14 February 2020)."
          />
          <AnnexRow
            annexName="D"
            annexDescription="Organization’s Logo and Letterhead (Must follow the UST Visual Identity Guidelines)"
          />

          <View style={{ flexDirection: "column" }}>
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
                E
              </Text>
              <View style={[{ width: "80%", borderBottomWidth: 1, flexDirection: "column" }]}>
                <Text style={[styles.tableLastCell]}>
                  {"\u2022"} Accomplishment Report <Br></Br>
                  {"\u2022"} Evaluation Reports Financial <Br></Br>
                  {"\u2022"} Report consisting of:
                </Text>
                <View style={[styles.tableLastCell, { marginLeft: 10 }]}>
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text> {"a)"} </Text>
                      <Text> Summary of receipts and disbursements marked as Annex “E-1” </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text> {"b)"} </Text>
                      <Text> Liquidation reports marked as Annex “E- 2” </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text> {"c)"} </Text>
                      <Text>
                        {" "}
                        Accomplished Performance Assessment of Student Organizations/Councils (PASOC) Forms marked as
                        Annex “E-3”
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <AnnexRow
            annexName="F"
            annexDescription="The organization’s Activities’ Monitoring Form Prepared by the Executive Board and Approved by the Organization Adviser"
          />

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
              G
            </Text>
            <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>
              {"\u2022"} Accomplishment Report <Br></Br>
              {"\u2022"} Evaluation Reports Financial <Br></Br>
            </Text>
          </View>

          <AnnexRow annexName="H" annexDescription="Commitment to Anti-Hazing Law" />
          <AnnexRow annexName="I" annexDescription="Commitment to Responsible use of Social Media" />
          <AnnexRow
            annexName="J"
            annexDescription="Commitment of Active Participation in all OSA and University-initiated activities"
          />
          <AnnexRow annexName="K" annexDescription="Commitment to Care for the Environment" />
          <AnnexRow
            annexName="L"
            annexDescription="Commitment to Submit the Post Event Evaluation of Each Completed Activity on Time"
          />
        </View>

        <Text style={[styles.bodyText, { paddingTop: 10 }]}>
          3. Petitioner commits to send the{" "}
          <EmphasizedText> President (01 Rules and Procedure for Recognition Section 9) </EmphasizedText> to the
          leadership training summit to be conducted by the Office for Student Affairs.{" "}
        </Text>

        <Text style={styles.bodyText}>
          4. Petitioner has opened an e-mail address at (OFFICIAL E-MAIL ADDRESS) for which petitioner may be served
          with notices and other official communication.
        </Text>

        <Text style={styles.bodyText}>
          5. Petitioner has also opened a Facebook page under the name (FACEBOOK NAME) , with 75% of their members
          having linked to said page. The list of names of student-members who have linked to our official Facebook page
          and their Facebook account names is hereto attached as Annex “B”.
        </Text>
        <Text style={styles.bodyText}>
          6. Petitioner has never been found in violation of the University rules and regulations, and further, commits
          to faithfully abide by its rules and regulations, to cooperate and participate, to the best of its ability,
          all University-sponsored activities, and programs.
        </Text>
        <Text style={styles.bodyText}>
          7. Petitioner is a recognized student organization having been continually recognized for the past two (2)
          consecutive academic years. <EmphasizedText>(for university–wide student organizations only)</EmphasizedText>
        </Text>

        <Text style={[{ marginBottom: 10, marginLeft: 41 }]}> WHEREFORE, petitioner prays that</Text>

        <View style={styles.sectionTableRow}>
          <Text style={[styles.bodyText, { width: "1%" }]}>{"a) "}</Text>
          <Text style={[styles.bodyText, { width: "99%" }]}>
            The (NAME OF ORGANIZATION) be granted recognition by the Office for Student Affairs.
          </Text>
        </View>
        <View style={styles.sectionTableRow}>
          <Text style={[styles.bodyText, { width: "1%" }]}>{"b) "}</Text>
          <Text style={[styles.bodyText, { width: "99%" }]}>
            It be allowed to use an office space at UST Tan Yan Kee Student Center:{" "}
            <EmphasizedText> (for university–wide student organizations only)</EmphasizedText>
          </Text>
        </View>
        <View style={styles.sectionTableRow}>
          <Text style={[styles.bodyText, { width: "1%" }]}>{"c) "}</Text>
          <Text style={[styles.bodyText, { width: "99%" }]}>A faculty adviser will be appointed.</Text>
        </View>

        <Text style={[styles.bodyText]}>
          {" "}
          Date: ______________ <Br />
        </Text>

        {/* Signatory */}

        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <Text style={[styles.bodyText, { width: "50%" }]}> </Text>

          <Text style={[styles.bodyText, { width: "50%", borderTopWidth: 1, fontSize: 7, textAlign: "center" }]}>
            <EmphasizedText> SIGNATURE OVER PRINTED NAME OF THE PRESIDENT </EmphasizedText>
            <Br></Br>
            <Br></Br>
            <Text style={{ textAlign: "left", fontSize: 9 }}>
              Name of Organization with Suffix
              <Br></Br>
              Faculty/College/Institute/School Affiliation
            </Text>
          </Text>
        </View>

        <Text break style={{ fontFamily: "Arial Narrow Bold" }}>
          {" "}
          With our favorable endorsement:{" "}
        </Text>

        {/* FOR COLLEGE-BASED STUDENT ORGANIZATION (REMOVE IF NOT APPLICABLE) */}

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Signature over Printed Name of Adviser
            </Text>
            <Text style={{ borderTopWidth: 1 }}>Signature over Printed Name of Co-Adviser</Text>
          </View>
        </View>

        <View style={styles.signatureDetails}>
          <Text
            style={{
              borderTopWidth: 1,
              fontSize: 9,
              marginTop: 60,
            }}
          >
            Signature over Printed Name <Br></Br>
            <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 12 }}>SWDC Coordinator</Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Signature over Printed Name<Br></Br>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 12 }}>Dean/Director</Text>
            </Text>
            <Text style={{ borderTopWidth: 1 }}>
              Signature over Printed Name<Br></Br>
              <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 12, paddingRight: 30 }}>Regent</Text>
            </Text>
          </View>
        </View>

        {/*  WITH CENTRAL ORGANIZATION (Please delete/remove if not applicable) */}

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Signature over Printed Name of<Br></Br>
              Central Organization President
            </Text>
            <Text style={{ borderTopWidth: 1 }}>
              Signature over Printed Name<Br></Br>
              Central Organization Adviser
            </Text>
          </View>
        </View>

        {/* FOR UNIVERSITY-WIDE STUDENT ORGANIZATION (Please delete/remove if not applicable) */}

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Signature over Printed Name of Adviser
            </Text>
            <Text style={{ borderTopWidth: 1 }}>Signature over Printed Name of Co-Adviser</Text>
          </View>
        </View>

        {/* FOR STUDENT RELIGIOUS ORGANIZATION (Please delete/remove if not applicable) */}

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Signature over Printed Name of<Br></Br>
              Central Organization President
            </Text>
            <Text style={{ borderTopWidth: 1 }}>
              Signature over Printed Name<Br></Br>
              Central Organization Adviser
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "100%", paddingTop: 40, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text
              style={{
                borderTopWidth: 1,
              }}
            >
              Director, Center for Campus Ministry
            </Text>
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
