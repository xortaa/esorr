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
      backgroundColor: "#30D5C8",
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

    tableCellDate: { //FOR DATE INFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 0.15,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
      width:"100%",
      flexDirection:"row"
    },

    tableCellSOF: { //FOR SOURCE OF FUNDS INFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: .6,
      fontFamily: "Arial Narrow Bold",
      
    },

    tableCellDate2: { //FOR DATE OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 1.92,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"10%",
      flexDirection:"row"
    },

    tableCellDesc: { //FOR DETAILS OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 7.8,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
      width:"100%",
      flexDirection:"row"
    },

    tableCellPay: { //FOR PAYEE/ESTABLISHMENT OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 4,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellBlank: { //FOR BLANK CELL OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 1,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellRef: { //FOR REFERENCE OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 3.4,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellCost: { //FOR UNIT COST OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 1,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellUnit: { //FOR NUM OF UNIT OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: .6,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellTotalPhP: { //FOR TOTAL PHP OUTFLOW
      //backgroundColor: "#30D5C8",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      flex: 1.3,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
       width:"100%",
      flexDirection:"row"
    },

    tableCellTotal: {
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

      tableCellTotalExp: {
        backgroundColor: "#FFFF00",
       // borderRightWidth: 1,
        borderRightColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        padding: 5,
        fontWeight: "bold",
        fontSize: 10,
        flex: 1,
        fontFamily: "Arial Narrow Bold",
      },

      tableCellTotalNet: {
        backgroundColor: "#30D5C8",
       // borderRightWidth: 1,
        borderRightColor: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        padding: 5,
        fontWeight: "bold",
        fontSize: 10,
        flex: 1,
        fontFamily: "Arial Narrow Bold",
      },

    tableCell: {//CELL FOR INFLOW
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontSize: 10,
      flex: 1,
      fontFamily: "Arial Narrow Bold",
    },

    tableCell2: {//CELL FOR OUTFLOW 
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
      textAlign: "right"
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

    banner: {
        fontFamily: "Arial Narrow Bold",
      backgroundColor: "#FFFF00",
      //borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontSize: 10,
      flex: 1,
      textAlign: "center"
      },
  });

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="landscape">
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Student Organizations Recognition Requirements Annex E-2 Page <Text render={({ pageNumber, totalPages }) => `${pageNumber}`}/> of Financial Report Liquidation Report AY 2024-2025
          </Text>
        </View>

        <View>
            
        <View fixed style={styles.banner}>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
          Financial Report
          </Text>
        </View>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>
          <EmphasizedText>UNIVERSITY OF SANTO TOMAS</EmphasizedText>
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>Name of Organization/Council</Text> 
        {"\n"}
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}><EmphasizedText>Liquidation Report</EmphasizedText> {"\n"}
          <EmphasizedText> As of (MONTH)</EmphasizedText> {"\n"}
          (Date covered)
          </Text>
        </View>

        {/* Table Inflow starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate, {backgroundColor: "#30D5C8"}]}>Date</Text>
            <Text style={[styles.tableCellSOF,{textAlign: "center", backgroundColor: "#30D5C8"}]}>Source of Fund</Text>
            <Text style={styles.tableCellHeader}>Total PhP</Text>
          </View>

          {/* Table Rows */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Organization Fund / Beginning Balance</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Membership Fee</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Registration Fee</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Merchandise Selling</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Subsidy: Student Activity Fund (For LSC & CBO Only)</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Subsidy: Community Service Fund </Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Subsidy: University-Wide Student Organization Fund (For USO Only)</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Subsidy: Local Student Council Fund (For LSC Only)</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Cash Sponsorships</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Interest Income</Text>
            <Text style={styles.tableLastCell}>₱ </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate,{flex:0.487}]}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={[styles.tableCellTotalExp,{textAlign:"right",}]}>TOTAL RECEIPTS</Text>
            <Text style={[styles.tableCellTotalExp,{textAlign:"right",}]}>₱. 00 </Text>
          </View>

          </View>

           {/* Table Outflow starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellDate2, {backgroundColor: "#30D5C8"}]}>Date</Text>
            <Text style={[styles.tableCellDesc, {backgroundColor: "#30D5C8"}]}>Details/Description</Text>
            <Text style={[styles.tableCellPay, {backgroundColor: "#30D5C8"}]}>Payee/Establishment</Text>
            <Text style={[styles.tableCellBlank, {backgroundColor: "#30D5C8"}]}> </Text>
            <Text style={[styles.tableCellRef, {backgroundColor: "#30D5C8"}]}>Reference No.</Text>
            <Text style={[styles.tableCellCost, {backgroundColor: "#30D5C8"}]}>Unit Cost</Text>
            <Text style={[styles.tableCellUnit, {backgroundColor: "#30D5C8"}]}>Unit/s</Text>
            <Text style={[styles.tableCellTotalPhP, {backgroundColor: "#30D5C8"}]}>Total PhP</Text>
          </View>

          {/* Table Rows */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> I. Food Expense </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> 10/10/24 </Text>
          <Text style={styles.tableCellDesc}> Jollibee Yum Burger </Text>
          <Text style={styles.tableCellPay}> Jollibee </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> JB1095248702 </Text>
          <Text style={styles.tableCellCost}> 100 </Text>
          <Text style={styles.tableCellUnit}> 10 </Text>
          <Text style={styles.tableCellTotalPhP}> 10000 </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 10000  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> II. Transportation </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}>  </Text>
          <Text style={styles.tableCellDesc}>  </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> III. Office Supplies </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> IV. Physical Arrangement </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> V. Documentation </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> VI. Promotions </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> VII. Professional Fee/ Honoraria/ Token </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> VIII. Awards and Prizes </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> IX. Publication </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> X. Rentals </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XI. Equipment </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XII. Costumes </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XIII. Membership Kits </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XIV. Registration Fees </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XV. Cash Donations or Sponsorship to Other Organizations </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> XVI. Miscellaneous Expense </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={styles.tableCellDate2}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCellPay}> </Text>
          <Text style={styles.tableCellBlank}> </Text>
          <Text style={styles.tableCellRef}> </Text>
          <Text style={styles.tableCellCost}> </Text>
          <Text style={styles.tableCellUnit}> </Text>
          <Text style={styles.tableCellTotalPhP}> </Text>
          </View>
          <View style={styles.tableRow}>
          <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00  </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate2}>  </Text>
            <Text style={styles.tableCellTotalExp}>TOTAL EXPENSES  </Text>
            <Text style={styles.tableCellTotalExp}>  </Text>
            <Text style={styles.tableCellTotalExp}>  </Text>
            <Text style={styles.tableCellTotalExp}>  </Text>
            <Text style={styles.tableCellTotalExp}>  </Text>
            <Text style={styles.tableCellTotalExp}>  </Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>P 0.00  </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate2,{flex:.65}]}>  </Text>
            <Text style={[styles.tableCellTotalNet,{flex:2}]}>NET CASH FLOW / ENDING BALANCE  </Text>
            <Text style={styles.tableCellTotalNet}>  </Text>
            <Text style={styles.tableCellTotalNet}>  </Text>
            <Text style={styles.tableCellTotalNet}>  </Text>
            <Text style={styles.tableCellTotalNet}>  </Text>
            <Text style={styles.tableCellTotalNet}>  </Text>
            <Text style={[styles.tableCellTotalNet, { textAlign: "right" }]}>P 0.00  </Text>
          </View>

          </View>

          <View style={{ flexDirection: "row", width: "35.5%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
             Prepared by:
            </Text>
            <Text>
             Audited:
            </Text>
          </View>
          </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
              Treasurer
            </Text>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
              Auditor
            </Text>
          </View>
        </View>



        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
             Approved by:
            </Text>
           
          </View>
          </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
          <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
              President
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
            SOCC Corporate Treasurer
            </Text>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
            SOCC VP Audit and Logistics
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
            Adviser
            </Text>
            <Text>
            (Signature over printed name; date) <Br></Br>
            ___________________________________    <Br></Br>
            Adviser
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
             Noted by:
            </Text>
           
          </View>
          </View>

          <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            (SWD Coordinator's Name) <Br></Br>
            ___________________________________    <Br></Br>
            SWD Coordinator
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            (Dean's Name) <Br></Br>
            ___________________________________    <Br></Br>
            Dean/Director
            </Text>
            <Text>
            (Regent's Name) <Br></Br>
            ___________________________________    <Br></Br>
            Regent
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
    <Text style={{textAlign: "right", color:"#000"}}>UST:S030-00-FO127</Text>
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
