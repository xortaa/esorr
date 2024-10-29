"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font } from "@react-pdf/renderer";
import { color } from "framer-motion";

// Register fonts
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
  text: {
    fontSize: 11,
    marginBottom: 5,
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
    borderWidth: 1
  },
  tableLastCell: {
    padding: 5,
    fontSize: 11,
    textAlign: "left",
  },

  tableCellHeader: {
    backgroundColor: "#d3d3d3",
    borderWidth: 1,
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
   
  },

  invisibleBorderCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    borderWidth: 0, // Invisible border for the signature section
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
            ANNEX A
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}></Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          Student Organization General Information Report
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center"}}>
            {"\n"}{"\n"}
            <EmphasizedText> UNIVERSITY OF SANTO TOMAS </EmphasizedText>{"\n"}
            Office for Student Affairs
            {"\n"}{"\n"}
          </Text>
        </View>

        <View style={styles.section}>
            <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", textDecoration: "underline" }}>
          <EmphasizedText>STUDENT ORGANIZATION GENERAL INFORMATION REPORT</EmphasizedText> 
            </Text>
        </View>

        <View>
            <Text>Organization Information</Text>
        </View>

       {/*INSERT ANNEX A DETAILS HERE*/}
        <View style={[styles.table, {}]}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, {flex: 2.15, fontSize: 8}]}>Name of the Organization: [ ] UNIV-WIDE [ ] COLLEGE-BASED</Text>
            <Text style={[styles.tableCell, {flex: 1.70, fontSize: 8}]}>Academic Year of last Recognition:</Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8}]}>Starting Fund for AY 2024-2025:{"\n"}
            <Text style={[{fontSize: 7}]}>As reflected on the ending balance of Annex E1</Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {flex: 2.15, fontSize: 8}]}>Faculty / College / Institute / School Affiliation:</Text>
          <Text style={[styles.tableCell, {flex: 1.70, fontSize: 8}]}>Official Email address of the Organization:</Text>
          <Text style={[styles.tableCell, {flex: .75, fontSize: 8}]}>PhP</Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {flex: 2.15, fontSize: 8}]}>Official Organization Website:</Text>
          <Text style={[styles.tableCell, {flex: 1.70, fontSize: 8}]}>Organization’s Social Networking Pages/Sites:</Text>
          <Text style={[styles.tableCell, {flex: .75, fontSize: 8}]}>Row 3, Col 3</Text>
          </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {flex: 2.15, fontSize: 8}]}>Student Organization Category:</Text>
          <Text style={[styles.tableCell, {flex: 1.70, fontSize: 8}]}>Strategic Directional Areas (SDAs):</Text>
          <Text style={[styles.tableCell, {flex: .75, fontSize: 8}]}>Row 3, Col 3</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View>
          <Text>
            {"\n"}
          <EmphasizedText>Statement of Mission, Vision, and Objectives of the Organization</EmphasizedText>
            {"\n"}
          </Text>
          </View>

          <View style={styles.section}>
          <Text style={[{color:"#808080"}]}>Mission:</Text>
          <Text>(LOREM IMPSUM DOLOR MISSION DETAILS HERE)</Text>
          {"\n"}{"\n"} <Br />
          </View>

          <View style={styles.section}>
          <Text style={[{color:"#808080"}]}>Vision:</Text>
          <Text>(LOREM IMPSUM DOLOR VISION DETAILS HERE)</Text>
          {"\n"}{"\n"}
          </View>

          <View style={styles.section}>
          <Text style={[{color:"#808080"}]}>Brief Description of the Organization:</Text>
          <Text>(LOREM IMPSUM DOLOR Brief Description of the Organization DETAILS HERE)</Text>
          {"\n"}{"\n"}
          </View>

          <View style={styles.section}>
          <Text style={[{color:"#808080"}]}>Objectives for AY 2022-2023 - SMART (Specific, Measurable, Attainable, Realistic, Time-bound):</Text>
          <Text>(LOREM IMPSUM DOLOR Objectives for AY 2022-2023 - SMART (Specific, Measurable, Attainable, Realistic, Time-bound) DETAILS HERE)
            {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
          
          </View>

        </View>

        <View>
            <Text>Officer's Information</Text>
        </View>

        <View style={[styles.table, {}]}>
          {/* Row 1 */}
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>Annex</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}>Name of Officer</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Position</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Faculty / College / Institute and Student Number (ex. ICS - 2012081820)</Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}>Contact No.</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Email Address</Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>GWA</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 1</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 2</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 3</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 4</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 5</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 6</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 7</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 8</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 9</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}>A - 10</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: .5, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
        </View>

        <View>
            <Text>{"\n"}Organization Adviser</Text>
        </View>

        <View style={[styles.table, {}]}>
          {/* Row 1 */}
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>Name: </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>Cell no:</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>E-mail Address:</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>Address 1:</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>Faculty / College / Institute / School:</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8,}]}>Address 2:</Text>
          </View>

          </View>

          <View>
            <Text>{"\n"}Specimen Signatures</Text>
          </View>

        <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>Annex</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}>Name of Officer</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 1</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 2</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 3</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 4</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 5</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 6</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 7</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 8</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 9</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>A - 10</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
        </View>

        <View>
        <Text>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
        </View>

        <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}>Name of Adviser</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}>Signature</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>1</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: .35, fontSize: 8, textAlign: "center"}]}>2</Text>
            <Text style={[styles.tableCell, {flex: 1.75, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1.25, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          </View>
          <View>
          <Text style={[{fontSize: 10}]}>{"\n"}Total number of members as of filing of the Petition is _____ as evidence by the list of members attached as Annex B.{"\n"}</Text>
          </View>

          <View>
            <Text>{"\n"}<EmphasizedText>Financial Status</EmphasizedText> (Summary of Financial status){"\n"}</Text>
          </View>

          <View>
            <Text style={{paddingLeft: 25}}>{"\n"}<EmphasizedText>A. Starting fund (as reflected in the application for recognition AY 2023 - 2024)</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 70}}>{"\n"}<EmphasizedText>PhP ___________________________________________</EmphasizedText>{"\n"}</Text>
          </View>

          <View>
            <Text style={{paddingLeft: 25}}>{"\n"}<EmphasizedText>B. Membership fees (indicate amount per member X no. of members)</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 70}}>{"\n"}<EmphasizedText>PhP _____________________________ X _______________________</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 100, paddingTop: -10}}>{"\n"}(Amount of Membership Fee)                 (No. of Members Paid){"\n"}</Text>
          </View>

          <View>
            <Text style={{paddingLeft: 70}}>{"\n"}<EmphasizedText>TOTAL AMOUNT COLLECTED</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 70}}>{"\n"}<EmphasizedText>FROM THE MEMBERSHIP FEE: PhP ____________________________________</EmphasizedText>{"\n"}</Text>
      
            <View>
            <Text style={{paddingLeft: 25}}>{"\n"}<EmphasizedText>C. Other funds raised</EmphasizedText>{"\n"}</Text>

            <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}><EmphasizedText>Title of Activity</EmphasizedText></Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}><EmphasizedText>Total Amount Raised</EmphasizedText></Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
            </View>

            <View>
            <Text style={{paddingLeft: 25}}>{"\n"}<EmphasizedText>D. Expenditures </EmphasizedText> (indicate the activity for which the amount was utilized){"\n"}</Text>
            </View>
            <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}><EmphasizedText>Title of Activity</EmphasizedText></Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}><EmphasizedText>Cost/Expenses</EmphasizedText></Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "center"}]}> </Text>
          </View>
            </View>
          </View>

          <View>
            <Text style={{paddingLeft: 25}}>{"\n"}<EmphasizedText>E. Total Cash          PhP _____________________________</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 50, paddingTop:-10}}>{"\n"}<EmphasizedText>On Hand        PhP _____________________________</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 50, paddingTop:-20}}>{"\n"}<EmphasizedText>On Bank        PhP _____________________________</EmphasizedText>{"\n"}</Text>
          </View>

          <View>
            <Text style={{paddingLeft: 30, paddingTop:-20}}>{"\n"}<EmphasizedText>o     Name of Bank          ____________________         Location of Bank          ___________________</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 50, paddingTop:-30}}>{"\n"}<EmphasizedText>Account Name        ____________________         Account Number          ___________________</EmphasizedText>{"\n"}</Text>
            <Text style={{paddingLeft: 30, paddingTop:-15}}>{"\n"}<EmphasizedText>o     No Bank Account</EmphasizedText>{"\n"}{"\n"}</Text>
          </View>

          <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}>Prepared by: (Secretary)</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}>Noted by: (Treasurer)</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}>Approved by: (President)</Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}>Outgoing:</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}></Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}></Text>
          </View>

          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}>Incoming:</Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}></Text>
            <Text style={[styles.tableCell, {flex: 1, fontSize: 8, textAlign: "left"}]}></Text>
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
    <Text style={{textAlign: "right", color:"#000"}}>UST:S030-00-FO103</Text>
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
    <h1>PDF GENERATOR EXAMPLE ANNEX A</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
