"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render } from "@react-pdf/renderer";
import { Just_Another_Hand } from "next/font/google";

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
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 10,

    marginBottom: 5,
    textAlign: "center",
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
  boldItalic: {
    fontFamily: "Arial Narrow Bold Italic",
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
          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber} / ${totalPages}`}
          />
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            PERFORMANCE ASSESSMENT OF STUDENT ORGANIZATIONS/COUNCILS (PASOC) FORM
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>PERFORMANCE ASSESSMENT OF STUDENT ORGANIZATIONS/COUNCILS (PASOC) FORM</Text>
          <Text style={styles.subheading}>Accomplished by the Current Officers</Text>
        </View>
        {/* Section */}
        <View style={{ flexDirection: "row", width: "100%", marginBottom: 10, fontSize: 9 }}>
          <Text style={{ width: "50%" }}>NAME OF ORGANIZATION</Text>
          <Text style={{ width: "50%", borderBottomWidth: 1 }}></Text>
        </View>
        <View style={{ flexDirection: "row", width: "100%", marginBottom: 20, fontSize: 9 }}>
          <Text style={{ width: "50%" }}>FACULTY/COLLEGE/INSTITUTE/SCHOOL</Text>
          <Text style={{ width: "50%", borderBottomWidth: 1 }}></Text>
        </View>
        <Text style={{ fontSize: "9" }}>
          Assess this organization using the likert scale performance score guide below
        </Text>
        <Text style={{ fontSize: "7" }}>
          (Refer to the attached SUMMARY OF PROJECT/ACTIVITIES for your reference. Use blue ink in marking/writing on
          this form)
        </Text>
        {/* Content */}
        <View style={{ borderWidth: 1, width: "100%", flexDirection: "row", fontSize: 8, marginTop: 10 }}>
          <Text style={{ width: "40%", borderRightWidth: 1, textAlign: "center", paddingTop: 5 }}>
            Performance Assessment of Student Organizations/Councils (PASOC)
          </Text>
          <Text style={{ width: "10%", borderRightWidth: 1 }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 5 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>(Outstanding)</Text>
          </Text>
          <Text style={{ width: "10%", borderRightWidth: 1 }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 4 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>(Very Good)</Text>
          </Text>
          <Text style={{ width: "10%", borderRightWidth: 1 }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 3 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>(Good)</Text>
          </Text>
          <Text style={{ width: "10%", borderRightWidth: 1 }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 2 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>(Fair)</Text>
          </Text>
          <Text style={{ width: "10%", borderRightWidth: 1 }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 1 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>(Poor)</Text>
          </Text>
          <Text style={{ width: "10%" }}>
            <Text style={{ fontSize: 9, textAlign: "center" }}> 0 </Text> <Br />
            <Text style={{ fontSize: 7, textAlign: "center" }}>Missing or Write Comments</Text>
          </Text>
        </View>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 10, borderWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "60%" }}>
            Performance Assessment of Student Organizations/Councils (PASOC)
          </Text>
          <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "10%" }}>
            {" "}
            Current <Br /> Officer{" "}
          </Text>
          <Text style={{ fontSize: 9, textAlign: "center", width: "30%" }}>Remarks/Comments</Text>
        </View>
        {/* PASOC 1 */}
        <CriteriaSection
          criteriaNum="1"
          criteria={"Leadership and Governance"}
          subcriteria={[
            {
              id: "1.1",
              description: "Exhibited responsible decision-making and personal accountability.",
              name: "",
              remarks: "",
            },
            {
              id: "1.2",
              description: "Modeled a wide range of Christian leadership skills and abilities.",
              name: "",
              remarks: "",
            },
            {
              id: "1.3",
              description: "Conducted respectful dialogue with adviser/s and members.",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 2 */}
        <CriteriaSection
          criteriaNum="2"
          criteria={"Leadership and Governance"}
          subcriteria={[
            {
              id: "2.1",
              description: "Adhered to the operational plan.",
              name: "",
              remarks: "",
            },
            {
              id: "2.2",
              description: "Demonstrated commitment to best practices in/off campus programming.",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 3 */}
        <CriteriaSection
          criteriaNum="3"
          criteria={"Constituent Focus"}
          subcriteria={[
            {
              id: "3.1",
              description: "Committed  to support the UST Strategic Plan  and the Sustainable Development Goals.",
              name: "",
              remarks: "",
            },
            {
              id: "3.2",
              description: "Demonstrated understanding of knowledge for  campus programming and University policies.",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 4 */}
        <CriteriaSection
          criteriaNum="4"
          criteria={"Monitoring and Evaluation"}
          subcriteria={[
            {
              id: "4.1",
              description: "Used  appropriate evaluation/assessment tools for every project/activity conducted.",
              name: "",
              remarks: "",
            },
            {
              id: "4.2",
              description:
                "Disseminated/utilized evaluation/assessment results for continuous improvement and/or research activity/ies.",
              name: "",
              remarks: "",
            },

            {
              id: "4.3",
              description:
                "Complied with pre and post activity requirements within reasonable time (Approval of SAAF, liquidations, post evaluation, etc.) ",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 5 */}
        <CriteriaSection
          criteriaNum="5"
          criteria={"Membership and Organization Climate"}
          subcriteria={[
            {
              id: "5.1",
              description: "Modeled the Thomasian Identity when serving as an organization representative",
              name: "",
              remarks: "",
            },
            {
              id: "5.2",
              description: "Built group dynamics and effective teamwork.",
              name: "",
              remarks: "",
            },

            {
              id: "5.3",
              description: "Demonstrated obedience to the student code of conduct and discipline (PPS 1027).",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 6 */}
        <CriteriaSection
          criteriaNum="6"
          criteria={"Program Activities and Community Service"}
          subcriteria={[
            {
              id: "6.1",
              description:
                "Worked on creative marketing and promotional ventures in order to reach the student body in unique ways.",
              name: "",
              remarks: "",
            },
            {
              id: "6.2",
              description:
                "Assisted in positively impacting the UST campus community by creating experiences that foster safe, quality programs/  projects/activities that build community.",
              name: "",
              remarks: "",
            },
          ]}
        />
        {/* PASOC 7 */}
        <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, fontSize: 9 }}>
          <View style={{ flexDirection: "row", width: "20%", borderRightWidth: 1 }}>
            <Text style={{ width: "20%" }}> 7. </Text>
            <Text style={{ width: "80%" }}>Outcomes and Achievements</Text>
          </View>

          {/* Subcriteria */}
          <View style={{ flexDirection: "column", width: "80%", fontSize: 8 }}>
            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 4 }}>7.1</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 4 }}>
                  <Text style={styles.boldItalic}>Conducted </Text>activities that developed the Thomasian Graduate
                  Attributes (21st century skills) such as, but not limited to:
                </Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>

            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.1</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>
                  Servant Leadership
                </Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>
            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.2</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>
                  Effective Communicator and Collaborator
                </Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>
            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.3</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>
                  Analytical and Creative Thinker
                </Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>
            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.4</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>Lifelong Learner</Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>

            <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
              <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
                <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2 }}>7.2</Text>
                <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2 }}>
                  {" "}
                  <Text style={styles.boldItalic}> Recipients </Text>of award-giving body
                </Text>
              </View>
              {/* Current Officer */}
              <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}></Text>
              {/* Remarks */}
              <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}></Text>
            </View>
          </View>
        </View>
        <View style={{ borderWidth: 1, borderTop: 0, flexDirection: "column" }}>
          <Text style={{ borderBottomWidth: 1 }}> FURTHER COMMENTS </Text>
          <Text style={{ marginHorizontal: 10, textAlign: "justify" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur eius soluta, itaque cum laborum deleniti
            dicta fugit explicabo alias, perferendis dolor. Tempora, animi. Voluptatibus accusamus eius quod ut totam
            hic?
          </Text>
        </View>{" "}
        <View style={{ fontSize: 8 }}>
          <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
            <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
              <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Prepared by:</Text>
              <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of Secretary</Text>
              <Text>Date Signed: __________________ </Text>
            </View>
            <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
              <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Endorsed:</Text>
              <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of President</Text>
              <Text>Date Signed: __________________ </Text>
            </View>
            <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
              <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Noted:</Text>
              <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of Adviser</Text>
              <Text>Date Signed: __________________ </Text>
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

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const formatDescription = (description) => {
  const words = description.split(" ");
  return (
    <>
      <Text style={styles.boldItalic}>{words[0]}</Text>
      <Text style={{}}> {words.slice(1).join(" ")}</Text>
    </>
  );
};

const CriteriaSection = ({ criteriaNum, criteria, subcriteria }) => (
  <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, fontSize: 9 }}>
    <View style={{ flexDirection: "row", width: "20%", borderRightWidth: 1 }}>
      <Text style={{ width: "20%" }}> {criteriaNum}. </Text>
      <Text style={{ width: "80%" }}>{criteria}</Text>
    </View>

    {/* Subcriteria */}
    <View style={{ flexDirection: "column", width: "80%", fontSize: 7, textAlign: "justify" }}>
      {subcriteria.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", borderBottomWidth: index === subcriteria.length - 1 ? 0 : 1 }}>
          <View style={{ borderBottomWidth: 1 }}> </View>
          <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
            <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2 }}>{item.id}</Text>
            <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginRight: 4 }}>
              {formatDescription(item.description)}
            </Text>
          </View>

          {/* Current Officer */}
          <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>{item.name}</Text>
          {/* Remarks */}
          <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>{item.remarks}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Funcation to generate PDF and open in new tab
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
