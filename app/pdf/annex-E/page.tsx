"use client";

// Update the path to the correct location of the fonts module
import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render, Image } from "@react-pdf/renderer";
import { Underline } from "lucide-react";

// Register Times New Roman and Arial Narrow fonts
Font.register({
  family: "Times-Roman",
  src: "/fonts/Times-Roman.ttf",
});

Font.register({
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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
                ANNEX E
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Organization Operational Assessment Form
          </Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>
        {/* Title Section */}
        <Text style={{ textDecoration: "underline", fontSize: 14, fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
          Organizational Operational Assessment Form
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 9 }}>
          Align all event/projects hosted by the organization to the Strategic Directional Areas, SEAL of Thomasian
          Education, and Project Direction. (Include event title and e-ReSERVe No. in all segments applicable)
        </Text>
        {/* Table 1 */}
        <View>
          <View style={{ border: 1, marginTop: 10 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                textAlign: "center",
                backgroundColor: "black",
                color: "white",
                borderColor: "black",
                fontSize: 6,
              }}
            >
              <Text style={{ width: "35%", padding: 2 }}>
                STRATEGIC DIRECTIONAL AREAS (SDAs) SUPPORTED BY THE PROJECT OUTCOMES
              </Text>
              <Text style={{ width: "50%", padding: 2 }}>
                TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SDAs <Br /> (ex. HYPE: Mitolohiya – e-ReSERVe Number:
                72637)
              </Text>
              <Text style={{ width: "15%", padding: 2 }}>
                TOTAL NUMBER OF <Br /> EVENTS
              </Text>
            </View>
            {/* Contents */}
            {/* VO1 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold Italic" }}>VO2</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Thomasian Identity.</Text> To form servant
                  leaders who espouse Thomasian ideals and values as they collaborate with the University in the
                  fulfillment of her mission and actively take part in nation building
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO2 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO2</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Leadership and Governance</Text> To form
                  servant leaders who espouse Thomasian ideals and values as they collaborate with the University in the
                  fulfillment of her mission and actively take part in nation building
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO3 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO3</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Teaching and Learning</Text> To be a
                  world-class institution of higher learning.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO4 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO4</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Research and Innovation</Text>
                  To become an internationally acknowledged expert in pioneering and innovative research in the arts and
                  humanities, social science, business management and education, health and allied sciences, science and
                  technology, and the sacred sciences.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO5 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO5</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Community Development and Advocacy</Text>
                  To become a vibrant community of evangelizers actively engaged in social transformation through
                  advocacy and ministry.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO6 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO2</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Student Welfare and Services.</Text>
                  To promote and ensure student academic achievement and life success through responsive and
                  empirical-based services of global standards.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO7 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO7</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Public Presence.</Text> To be an institution
                  of preeminent influence in the global community by taking a proactive stance in social, cultural, and
                  moral advocacies and assuming a lead role in national and international policy formulation
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO8 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO8</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Resource Management.</Text> To provide a
                  conducive learning and working environment with state-of-the-art facilities and resources in a
                  self-sustainable University through the engagement of a professional Thomasian workforce who meets
                  international standards and adapts to global change.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
            {/* VO9 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO9</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text style={{}}>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Internationalization.</Text> To promote
                  internationalization and integrate it into the institution’s strategic plans and initiatives for the
                  purpose of preparing students for a productive engagement in the global arena of ideas and work.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                <Text style={{}}>Sample Activity</Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>1</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Table 2 */}
        <View break style={{ border: 1 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "black",
              color: "white",
              fontSize: "6",
              textAlign: "center",
            }}
          >
            <Text style={{ width: "15%", padding: 2 }}>THE SEAL OF THOMASIAN EDUCATION</Text>
            <Text style={{ width: "30%", padding: 2 }}>
              SEAL OF THOMASIAN EDUCATION PERFORMANCE INDICATORS (SEAL-PI)
            </Text>
            <Text style={{ width: "40%", padding: 2 }}>TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SEAL-PI</Text>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Servant Leader
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S1: Show leadership abilities to promote advocacies for life, freedom, justice, and solidarity in the
                  service of the family, the local and global communities, the Church and the environment.{" "}
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S2: Implement relevant projects and activities that speak of Christian compassion to the poor and the
                  marginalized in order to raise their quality of life
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S3: Show respect for the human person, regardless of race, religion, age, and gender.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Effective communicator and collaborator
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E1: Express myself clearly, correctly, and confidently in various environments, contexts, and
                  technologies of human interaction.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E2: Work productively with individuals or groups from diverse cultures and demographics.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E3: Show profound respect for individual differences and/or uniqueness as members of God’s creation
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              Analytical and creative thinker
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A1: Show judiciousness and resourcefulness in making personal and professional decisions.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A2: Engage in research undertakings that respond to societal issues.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A3: Express personal and professional insights through an ethical and evidence-based approach.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Lifelong learner
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L1: Engage in reflective practice to ensure disciplinal relevance and professional development.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L2: Exhibit preparedness and interest for continuous upgrading of competencies required by the
                  profession or area of specialization.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L3: Manifest fidelity to the teachings of Christ, mediated by the Catholic Church, in the continuous
                  deepening of faith and spirituality in dealing with new life situations and challenges.
                </Text>
                <Text style={{ width: "47.5%", borderRight: 1, textAlign: "center" }}> test</Text>
                <Text style={{ textAlign: "center", width: "16%" }}> test</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Table 3 */}
        <View break style={{ border: 1 }}>
          <View
            style={{ flexDirection: "row", backgroundColor: "black", color: "white", textAlign: "center", fontSize: 7 }}
          >
            <Text style={{ width: "25%" }}>PROJECT DIRECTION</Text>
            <Text style={{ width: "60%" }}>TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE PROJECT DIRECTION </Text>
            <Text style={{ width: "15%" }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 1 <Br />
              </Text>
              End Poverty
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 2 <Br />
              </Text>
              END HUNGER
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 3 <Br />
              </Text>
              WELL-BEING
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 4 <Br />
              </Text>
              QUALITY EDUCATION
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 5 <Br />
              </Text>
              GENDER EQUALITY
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 6 <Br />
              </Text>
              WATER AND SANITATION FOR ALL
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 7 <Br />
              </Text>
              AFFORDABLE AND SUSTAINABLE ENERGY
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 8 <Br />
              </Text>
              DECENT WORK FOR ALL
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 9 <Br />
              </Text>
              TECHNOLOGY TO BENEFIT ALL
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 10 <Br />
              </Text>
              REDUCE INEQUALITY
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 11 <Br />
              </Text>
              SAFE CITIES AND COMMUNITIES
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 12 <Br />
              </Text>
              RESPONSIBLE CONSUMPTION BY ALL
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 13 <Br />
              </Text>
              STOP CLIMATE CHANGE
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 14 <Br />
              </Text>
              PROTECT THE OCEAN
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 15 <Br />
              </Text>
              TAKE CARE OF THE EARTH
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 16 <Br />
              </Text>
              LIVE IN PEACE
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 17 <Br />
              </Text>
              MECHANISMS AND PARTNERSHIPS TO REACH THE GOAL
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
              <Text>test</Text>
            </View>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>
        </View>
        <Text style={{ marginTop: 30 }}>(Attach Evaluation Report of all Events)</Text>

        
        <View>
          <View break style={{ flexDirection: "column", textAlign: "center" }}>
            <Text>UNIVERSITY OF SANTO TOMAS</Text>
            <Text>A.Y. 2024-2025</Text>
            <Text>Evaluation Report</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>A. TITLE OF EVENT.</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>B. DATE</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>C. VENUE:</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>D. NAME OF ADVISER/S</Text>
            <View style={{ fontFamily: "Arial Narrow Bold", width: "40%", flexDirection: "column" }}>
              <Text> __________________</Text>
              <Text style={{ paddingTop: 10 }}> __________________</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>a) TIME ATTENDED:</Text>
            <Text style={{ width: "40%" }}>from:_______ to:___________</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>E. SPEAKER'S NAME:</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>a) TOPIC:</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>b) AFFILIATION/S:</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>c) POSITION:</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "40%" }}>F. RESPONDENTS DEMOGRAPHICS</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ width: "30%", paddingLeft: 10 }}>Total number of participants</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ width: "30%", paddingLeft: 10 }}>Total number of respondents</Text>
            <Text style={{ width: "40%" }}>__________________</Text>
          </View>
        </View>
        {/* Table 4 */}
        <View>
          <View style={{ marginTop: 10, border: 1, fontSize: 10 }}>
            <View
              style={{
                flexDirection: "row",
                textAlign: "center",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <Text style={{ width: "30%", borderRight: 1, paddingTop: 5 }}>Criteria</Text>
              <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>
                Excellent <Br /> (5)
              </Text>
              <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>
                Very Good <Br /> (4)
              </Text>
              <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>
                Good <Br /> (3)
              </Text>
              <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>
                Fair <Br /> (2)
              </Text>
              <Text style={{ width: "14%", padding: 2 }}>
                Needs <Br />
                Improvement <Br /> (1)
              </Text>
            </View>

            <View style={{ flexDirection: "row", textAlign: "center" }}>
              <Text style={{ width: "30%", borderRight: 1, paddingVertical: 10 }}> Sample Criteria </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%" }}></Text>
            </View>
            <View style={{ flexDirection: "row", textAlign: "center", borderTop: 1 }}>
              <Text style={{ width: "30%", borderRight: 1, paddingVertical: 10 }}> Sample Criteria </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%" }}></Text>
            </View>
            <View style={{ flexDirection: "row", textAlign: "center", borderTop: 1 }}>
              <Text style={{ width: "30%", borderRight: 1, paddingVertical: 10 }}> Sample Criteria </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}> </Text>
              <Text style={{ width: "14%" }}></Text>
            </View>
          </View>
        </View>
        {/* Table 5 */}
        <View break>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>G. ASSESSMENT OF THE EVENT</Text>
          <View style={{ border: 1, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                fontSize: 10,
                textAlign: "center",
                color: "white",
                backgroundColor: "black",
              }}
            >
              <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "35%" }}> </Text>
              <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "15%" }}>
                RATING <Br />
                <Text style={{ fontSize: 8 }}>
                  (5= HIGHEST <Br /> 1=LOWEST)
                </Text>
              </Text>
              <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "25%" }}> ANALYSIS</Text>
              <Text style={{ fontFamily: "Arial Narrow Bold", width: "25%" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>
                DISSEMINATION OF INFORMATION
              </Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>PREPARATION TIME</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}></Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>THEME RELEVANCE</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>VENUE</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>TIME SCHEDULE</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>PROGRAM FLOW</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>HOSTS</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>SOCC ASSISTANCE</Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
            <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
              <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>
                OVERALL QUALITY OF THE EVENT
              </Text>
              <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}> </Text>
              <Text
                style={{
                  borderRight: 1,
                  width: "25%",
                  padding: 2,
                  textAlign: "justify",
                }}
              >
                {" "}
                ANALYSIS
              </Text>
              <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>RECOMMENDATION</Text>
            </View>
          </View>

          <View style={{ flexDirection: "column", marginTop: 10, border: 1 }}>
            <Text style={{ border: 1, color: "white", backgroundColor: "black" }}>
              Comments and Suggestions of Participants, Members, and Attendees (Verbatim)
            </Text>
            <Text style={{ backgroundColor: "gray" }}>test </Text>
            <Text style={{ backgroundColor: "white" }}>test </Text>
            <Text style={{ backgroundColor: "gray" }}>test </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>H. SPONSOR/S NAME:</Text>
          <View style={{ fontFamily: "Arial Narrow Bold", width: "40%", flexDirection: "column" }}>
            <Text> __________________</Text>
            <Text style={{ paddingTop: 10 }}> __________________</Text>
          </View>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold" }}>
          <Text style={{ paddingLeft: 10, paddingTop: 10 }}>Type of Sponsorship</Text>
          <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
            <View style={{ flexDirection: "column", width: "20%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Cash
              </Text>
            </View>
            <View style={{ flexDirection: "column", width: "40%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Product Launching
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
            <View style={{ flexDirection: "column", width: "20%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Deals
              </Text>
            </View>
            <View style={{ flexDirection: "column", width: "40%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Flyers
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
            <View style={{ flexDirection: "column", width: "20%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Booth
              </Text>
            </View>
            <View style={{ flexDirection: "column", width: "40%" }}>
              <Text style={{}}>
                <Text style={{ fontFamily: "Boxed" }}>O</Text> Discount
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>I. Please attach the following:</Text>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
          <Text>•</Text>
          <Text style={{ paddingLeft: 10 }}>Project Proposal Form (PPF)</Text>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
          <Text>•</Text>
          <Text style={{ paddingLeft: 10 }}>Actual answered Evaluation Forms</Text>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
          <Text>•</Text>
          <View style={{ paddingLeft: 10, flexDirection: "column" }}>
            <Text>Liquidation Report and PHOTOCOPY of Original Receipts</Text>
            <Text>(Please follow standard format)</Text>
          </View>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
          <Text>•</Text>
          <Text style={{ paddingLeft: 10 }}>Short write-up of the event for publication.</Text>
        </View>
        <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
          <Text>•</Text>
          <Text style={{ paddingLeft: 10 }}>Pictures of Event with Description</Text>
        </View>




        <Text break style={{}}>
          Recognition of Organizational Excellence
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Italic", paddingTop: 10 }}>
          (Did your organization receive any recognition from award-giving entities inside and outside the university?
          Did your organization represent the University or country, with distinction, in international conferences or
          congresses, of major religious, socio-cultural, educational or athletic importance?){" "}
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Bold Italic", paddingTop: 10, textDecoration: "underline" }}>
          Enumerate and give frequency.
        </Text>
        <View style={{ border: 1, margin: 10 }}>
          <View style={{ flexDirection: "row", fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "center" }}>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Title of Award</Text>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Award Giving Body</Text>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Date of Conferment</Text>
            <View style={{ width: "49%", flexDirection: "column" }}>
              <Text>Recognition from 2019 to 2023</Text>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ borderRight: 1, width: "25%" }}>
                  Student
                  <Br />
                  Awards
                </Text>
                <Text style={{ borderRight: 1, width: "25%" }}>Regional</Text>
                <Text style={{ borderRight: 1, width: "25%" }}>National</Text>
                <Text style={{ width: "25%" }}>International</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              fontSize: 8,
              fontFamily: "Arial Narrow Bold",
              textAlign: "center",
              borderTop: 1,
            }}
          >
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}>Sample</Text>
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}>Sample</Text>
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}>Sample</Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}>
              <Text style={{ fontFamily: "Boxed" }}>0</Text>
            </Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}></Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}></Text>
            <Text style={{ width: "12.25%", padding: 2 }}></Text>
          </View>
        </View>
        {/* Signature Section */}
        <View style={{ fontSize: 8 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 10 }}>Prepared By:</Text>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}>OUTOGING OFFICERS:</Text>
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1, marginTop: 20 }}>
            SIGNATURE OVER PRINTED NAME OF SECRETARY
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1, marginTop: 20 }}>
            SIGNATURE OVER PRINTED NAME OF PRESIDENT
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}>INCOMING OFFICERS:</Text>
          </Text>

          <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1, marginTop: 20 }}>
            SIGNATURE OVER PRINTED NAME OF SECRETARY
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1, marginTop: 20 }}>
            SIGNATURE OVER PRINTED NAME OF PRESIDENT
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}> Certified by:</Text>
          </Text>

          <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1, marginTop: 20 }}>
            SIGNATURE OVER PRINTED NAME OF ADVISER
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
