"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font } from "@react-pdf/renderer";

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
      flexDirection: 'row',
      padding: 20,
    },
    landscape: {
      flexDirection: 'row',
      width: '100%',
    },
    header: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subHeader: {
      textAlign: 'center',
      fontSize: 12,
      marginBottom: 5,
    },
    table: {
      //display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCol: {
      width: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColWide: {
      width: '70%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColNarrow: {
      width: '30%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 'auto',
      marginTop: 5,
      fontSize: 10,
    },
    headerCell: {
      margin: 'auto',
      marginTop: 5,
      fontSize: 12,
      fontWeight: 'bold',
    },
    blankCell: {
      margin: 'auto',
      marginTop: 5,
      fontSize: 10,
      color: 'gray',
    },
    sectionHeader: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
      backgroundColor: '#f1f1f1',
      padding: 3,
    },
  });
  
  // Document definition
  const MyDocument = () => (
    <Document>
      <Page size="LEGAL" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.landscape}>
          <Text style={styles.header}>Financial Report</Text>
        </View>
        <View style={styles.landscape}>
          <Text style={styles.subHeader}>UNIVERSITY OF SANTO TOMAS</Text>
        </View>
        <View style={styles.landscape}>
          <Text style={styles.subHeader}>Name of Organization/Council</Text>
        </View>
        <View style={styles.landscape}>
          <Text style={styles.subHeader}>Liquidation Report</Text>
        </View>
        <View style={styles.landscape}>
          <Text style={styles.subHeader}>As of (MONTH)</Text>
        </View>
        <View style={styles.landscape}>
          <Text style={styles.subHeader}>(Date covered)</Text>
        </View>
  
        {/* Source of Fund Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColWide}>
              <Text style={styles.headerCell}>Source of Fund</Text>
            </View>
            <View style={styles.tableColNarrow}>
              <Text style={styles.headerCell}>Total PhP</Text>
            </View>
          </View>
  
          {/* Table Content */}
          {[
            "Organization Fund / Beginning Balance",
            "Membership Fee",
            "Registration Fee",
            "Merchandise Selling",
            "Subsidy: Student Activity Fund (For LSC & CBO Only)",
            "Subsidy: Community Service Fund",
            "Subsidy: University-Wide Student Organization Fund (For USO Only)",
            "Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)",
            "Subsidy: Local Student Council Fund (For LSC Only)",
            "Cash Sponsorships",
            "Interest Income"
          ].map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{item}</Text>
              </View>
              <View style={styles.tableColNarrow}>
                <Text style={styles.tableCell}>₱ _________</Text>
              </View>
            </View>
          ))}
  
          {/* Total */}
          <View style={styles.tableRow}>
            <View style={styles.tableColWide}>
              <Text style={styles.headerCell}>TOTAL RECEIPTS</Text>
            </View>
            <View style={styles.tableColNarrow}>
              <Text style={styles.headerCell}>₱ _________</Text>
            </View>
          </View>
        </View>
  
        {/* Expense Sections */}
        <Text style={styles.sectionHeader}>I. Food Expense</Text>
        <View style={styles.table}>
          {[
            "Notable Individual's Food",
            "Participant's Food",
            "Director's and/or Trainer's Food",
            "Organizer's Food",
            "Driver's Food",
            "Maintenances' Food",
            "Drinks"
          ].map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{item}</Text>
              </View>
              <View style={styles.tableColNarrow}>
                <Text style={styles.tableCell}>₱ _________</Text>
              </View>
            </View>
          ))}
        </View>
  
        <Text style={styles.sectionHeader}>II. Transportation</Text>
        <View style={styles.table}>
          {[
            "Bus, Van, or Car Rental",
            "Gas",
            "Toll Fee",
            "Parking Fee",
            "Fare"
          ].map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{item}</Text>
              </View>
              <View style={styles.tableColNarrow}>
                <Text style={styles.tableCell}>₱ _________</Text>
              </View>
            </View>
          ))}
        </View>
  
        <Text style={styles.sectionHeader}>III. Office Supplies</Text>
        <View style={styles.table}>
          {[
            "Bond Paper",
            "Documentation Material",
            "Other Paper Material",
            "File Compiler",
            "Writing Material"
          ].map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{item}</Text>
              </View>
              <View style={styles.tableColNarrow}>
                <Text style={styles.tableCell}>₱ _________</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );


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
    <h1>PDF GENERATOR EXAMPLE ANNEX E2</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
