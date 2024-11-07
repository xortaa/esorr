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
                ANNEX C-1
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Articles of Association (Constitution and By-Laws)
          </Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>
        <Text style={{ fontSize: "14" }}>UNIVERSITY OF SANTO TOMAS</Text>
        <Text style={{ fontSize: "12" }}>(CHANGE TO NAME OF ORGANIZATION)</Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Arial Narrow Bold",
            textDecoration: "underline",
            marginTop: 20,
            fontSize: 16,
          }}
        >
          Articles of Association
        </Text>
        <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 14 }}>
          Constitution and By-Laws of the Organization
        </Text>
        <Text style={{ marginTop: 20, fontSize: 11 }}>
          Student organizations are enjoined to reflect the minimum requirements for their Articles of
          Association/Constitution:
        </Text>
        <View style={{ border: 1, marginTop: 10, fontSize: 9 }}>
          <View style={{ flexDirection: "row", textAlign: "center" }}>
            <Text style={{ width: "20%", borderRight: 1 }}>PARTS</Text>
            <Text style={{ width: "80%" }}>The Organization’s Article of Association</Text>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Name of Organization</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Contains the name of the University. (Ex. EARTH-UST) for University-wide Student Organizations (USO).
              </Text>
              <Text style={{ borderTop: 1 }}>
                Contains the name of their faculty, college, institute, or school. (Ex. Guild of Thomasian
                Speducators-EDUC) for College-Based Organizations (CBO)
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Logo/Seal</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Adopts a logo/seal within the norms of the Thomasian Core Values and the Seal of Thomasian Education
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Vision</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Includes the following keywords: Catholic institution, professional and moral formation, social
                transformation (discussed during the SOCC LTS- 16 July 2019)
              </Text>
              <Text style={{ borderTop: 1 }}>
                States the reason for theof the organization’s existence which must be consistent with the
                mission-vision of the University of Santo Tomas.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Purpose/Mission</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Includes the following keywords: recognized organization, 3Cs, Church, community (discussed during the
                SOCC LTS- 16 July 2019)
              </Text>
              <Text style={{ borderTop: 1 }}>
                Designates organization as “Recognized” not “Official” organization of the University. (discussed during
                the SOCC LTS- 16 July 2019)
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Membership Qualifications</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Admits for membership only bona fide students of University of Santo Tomas (Student Handbook).
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Membership Fee</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Charges membership fees in the amount as may be deemed sufficient to support the needs of the
                organization and must not exceed the amount of P250.00 annually.
              </Text>
              <Text style={{ borderTop: 1 }}>
                Designates organization as “Recognized” not “Official” organization of the University. (discussed during
                the SOCC LTS- 16 July 2019)
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Code of Conduct of Members and Officers</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                States that members and officers must abide by the code of conduct formulated by the University (PPS
                1027)
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Election Procedures</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                States that the Election of Officers must be held within the Month of April of the current Academic
                Year.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Resignation</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>States the ethical guidelines in resignation.</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Removal from Office/Impeachment</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                States ethical policies, procedures and guidelines in removing an officer from his/her position.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Vacancies</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>States clearly the rules of procedure in vacancies.</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>General Assemblies/Meetings</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>States the (1) schedule, (2) quorum and (3) power of the General Assembly/Meetings</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Committees</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>Includes the following Committees but not limited to : Evaluation, Research, Environment</Text>
              <Text style={{ borderTop: 1 }}>
                Specifies the created committees, their functions and responsibilities.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Advisers/Co-Advisers</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                States that University-wide Student Organization Adviser(s)/Co-Adviser(s) shall be appointed by the
                Director of the Office for Student Affairs.
              </Text>
              <Text style={{ borderTop: 1 }}>
                States that College-Based Student Organization Adviser(s)/Co-Adviser(s) shall be appointed by the
                Dean/Director of its Faculty/College/Institute/School.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Funds</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Authority. Contains the list of authorities that must sign every report or document related to financial
                management. .
              </Text>
              <Text style={{ borderTop: 1 }}>
                Reports. Contains the terms by which an organization should submit or declare its cash flows/financial
                report.
              </Text>
              <Text style={{ borderTop: 1 }}>
                Classification. Contains the types of fund that the organization has.
              </Text>
              <Text style={{ borderTop: 1 }}>
                Fund Raising. Mentions PPS 1030 of the Student Handbook 2018, pages 91-92.
              </Text>
              <Text style={{ borderTop: 1 }}>Bank Account. Declares policies on the money in custody of a bank.</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Funds</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                States the following” fixed” minimum content:<Br></Br>
                Section 1. The Executive Board may draft the proposed amendment or revision of these Articles.<Br></Br>
                Section 2. Any proposed amendment / revision to this Articles of Association shall be submitted to the
                Director of the Office for Student Affairs (OSA Director) for his/her approval.<Br></Br>
                Section 3. Upon approval of the proposed amendments/ revision by the OSA Director, it shall be submitted
                to the General Assembly for ratification by a vote of the majority of all the members of the General
                Assembly.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Effectivity</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>States that the Articles of Association shall take effect immediately upon ratification.</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
            <Text style={{ width: "20%", borderRight: 1 }}>Certificate of Ratification</Text>
            <View style={{ width: "80%", flexDirection: "column" }}>
              <Text>
                Includes the certificate of ratification following the template provided by the Office for Student
                Affairs.
              </Text>
            </View>
          </View>
        </View>
        <Text style={{ marginTop: 30 }}>
          The standardization is aimed to eliminate confusion among organizations and to easily resolve issues in case
          of intra-organization or inter-organization disputes.
        </Text>
        <Text
          break
          style={{ textAlign: "center", textDecoration: "underline", fontFamily: "Arial Narrow Bold", fontSize: 10 }}
        >
          UNIVERSITY OF SANTO TOMAS
        </Text>
        <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 10 }}>ORG NAME</Text>
        <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 10 }}>
          ARTICLES OF ASSOCIATION
        </Text>

        {/* AOA proper */}

        <View style={{ marginTop: 30 }}>
          {/* Article Number and Name */}
          <Text style={{ fontFamily: "Arial Narrow Bold", textAlign: "center" }}>ARTICLE I - GENERAL INFORMATION</Text>
          <View style={{ flexDirection: "row", marginTop: 10, lineHeight: 2 }}>
            {/* Section */}
            <Text style={{ width: "15%", fontFamily: "Arial Narrow Bold" }}>Section 1.</Text>
            {/* Body */}
            <View style={{ width: "85%", flexDirection: "column" }}>
              <Text>
                Name. This body shall be known as the University of Santo Tomas – Name of the Organization and may be
                referred to as the Acronym of the Organization (AO).
              </Text>
              {/* Lettered Subheading */}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "10%" }}>a.</Text>
                <Text style={{ width: "90%", textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid impedit nihil ullam, officiis alias
                  magnam sequi facere rem porro libero. Modi quaerat soluta dignissimos? Doloribus neque ea in itaque?
                  Optio.
                </Text>
              </View>

              {/* Decimal Subheading */}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "10%" }}>1.1</Text>
                <View style={{ width: "90%", textAlign: "justify", flexDirection: "column" }}>
                  <Text>President</Text>
                  {/* Subsubheading */}
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ width: "10%" }}>a.</Text>
                    <Text style={{ width: "90%" }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga mollitia quibusdam consequatur,
                      quam praesentium rerum tempore cum placeat, corporis quaerat nesciunt ut aspernatur accusantium
                      error! Neque eius reprehenderit animi et.{" "}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: "auto" }}>
            <Image src="/assets/sameplePhoto.jpeg" style={{ height: 100, width: 100 }} />
          </View>
        </View>

        {/* Signatories */}

        <Text style={{ fontFamily: "Arial Narrow Bold" }}>
          Wherefore, we resolved to approve the (NAME OF THE ORGANIZATION) Articles of Association and submit the same
          to the Director of the Office for Student Affairs for approval and the General Assembly for its ratification.
        </Text>

        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>President</Text> (NAME OF ORGANIZATION) 2023-2024
          </Text>
        </View>
        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>Vice President</Text> (NAME OF ORGANIZATION) 2023-2024
          </Text>
        </View>
        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>Secretary</Text> (NAME OF ORGANIZATION) 2023-2024
          </Text>
        </View>
        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>Treasurer</Text> (NAME OF ORGANIZATION) 2023-2024
          </Text>
        </View>
        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>Auditor</Text> (NAME OF ORGANIZATION) 2023-2024
          </Text>
        </View>
        <View style={{ textAlign: "center", flexDirection: "column" }}>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>First name M.I. Last Name</Text>
          <Text style={{}}>
            <Text style={{ fontFamily: "Arial Narrow Italic" }}>Peace Relations Officer</Text> (NAME OF ORGANIZATION)
            2023-2024
          </Text>
        </View>

        <Text style={{ marginTop: 10 }}>
          Done in the University of Santo Tomas, Philippines, Month Day, Year (CURRENT DATE)
        </Text>

        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Attested by:</Text>

        <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>Complete Name of Organization Adviser</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Adviser, </Text>Name of Org
        </Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>A.Y. </Text>2021-2024
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Certified by:</Text>
        <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
        <Text style={{ fontFamily: "Arial Narrow  Bold" }}>Name of Local COMELEC representative</Text>
        <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Position </Text>

        {/* Annex Title */}
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
