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
      borderWidth: 0,
  
      borderColor: "#000",
      marginBottom: 10,
    },

    tableInfo: { //ORG INFO
      display: "flex",
      width: "auto",
      borderWidth: 0,
      marginBottom: 10,
      fontSize: 9,
    },

    tableOfc: { //OFFICE USE ONLY
      display: "flex",
      width: "auto",
      borderWidth: 0,
     
      fontSize: 9,
    },
  
    tableRow: {
      flexDirection: "row",
    },
  
    tableCellHeader: {
      backgroundColor: "#993300",
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
      color: "white",
    },

    tableCellDesc: {
      //backgroundColor: "#993300",
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontWeight: "bold",
      fontSize: 10,
      fontFamily: "Arial Narrow Bold",
      textAlign: "center",
      //color: "white",
      flex: 2, 
    },

    tableCellTotal: {
        backgroundColor: "#FFFF00",
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

      bannerlogo: {
        fontFamily: "Arial Narrow Bold",
      backgroundColor: "#FFFFFF",
      //borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
      fontSize: 10,
      flex: 1,
      textAlign: "center",
      position: "relative",
      marginTop: 10,
      flexDirection: "row",
      //justifyContent: "space-between",
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

        <View style={styles.tableOfc}>
          {/* Header Row */}
          <View style={[styles.tableRow, {borderWidth: 0}]}>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {backgroundColor:"#FFA550", color:"#000", border:0, fontFamily:"Arial Narrow"}]}>For Office Use Only</Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
          <Text style={[styles.tableCellHeader, {borderWidth: 0, backgroundColor:"#FFFFFF"}]}></Text>
            </View>
          </View>
            
        <View style={{ flexDirection: "row",  paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.bannerlogo}>
            <Text>
            (UST LOGO) 
        </Text>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
                EXPENSE REPORT {"\n"}{"\n"}
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
                .Note:     This form shall be used for expense report reimbursements, petty cash replenishment and liquidation of cash advances {"\n"}
                (if budget released by the University) {"\n"}
                .Please attach original receipts/invoices and any other pertinent documents. Single payment of over P2000 from petty cash is not allowed
            </Text>
        </Text>
          </View>
          </View>

        
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>PURPOSE:_____________________________________________________________________________________________________</Text> 
        {"\n"}{"\n"}
        </View>

        <View> 
            <Text style={{ fontSize: 8, fontWeight: "bold", paddingTop:20, textAlign: "left" }}>ORGANIZATION INFORMATION: </Text>
        </View>

        <View style={{ flexDirection: "row", width: "640.5", textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            Name of Organization: ___________________________________
            </Text>
            <Text>
            Department: ___________________________________
            </Text>
            <Text>
              Date Submitted: ___________________________________
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            Source of Funds: ___________________________________
            </Text>
            <Text>
             ___________________________________
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            Source of Funds: ___________________________________
            </Text>
            <Text>
             ___________________________________
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "53.5%", textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            Subsidies from the University: _____________________________
            </Text>
            <Text>
            Cash Requisition No. ___________________________________
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "53.5%", textAlign: "left", paddingBottom: 5, fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
            Subsidies from the University: _____________________________
            </Text>
            <Text>
            Cash Requisition No. ___________________________________
            </Text>
          </View>
        </View>

           {/* Table EXPENSES starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, {borderTop: 1, borderLeft: 1}]}>
            <Text style={styles.tableCellHeader }>Date</Text>
            <Text style={styles.tableCellHeader}>Ref</Text>
            <Text style={[styles.tableCellDesc, {backgroundColor: "#993300", color:"#FFFFFF"}]}>Description</Text>
            <Text style={styles.tableCellHeader}>Meals </Text>
            <Text style={styles.tableCellHeader}>Transport</Text>
            <Text style={styles.tableCellHeader}>Supplies</Text>
            <Text style={styles.tableCellHeader}>Lodging</Text>
            <Text style={styles.tableCellHeader}>Repairs</Text>
            <Text style={styles.tableCellHeader}>Others</Text>
            <Text style={styles.tableCellHeader}>Misc.</Text>
            <Text style={styles.tableCellHeader}>Total</Text>
          </View>

          {/* Table Rows */}
          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>

          <View style={[styles.tableRow, {borderWidth: 1}]}>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCellDesc}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> </Text>
          <Text style={styles.tableCell}> - </Text>
          </View>


          {/*subtotals */}
          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {borderWidth: 0,}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCellDesc, {borderWidth: 0, flex:2.04}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1}]}> - </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderBottom: 1, borderRight:1, backgroundColor:"#000000", flex:1.01}]}>  </Text>
          </View>

          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCellDesc, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, textAlign: "right"}]}> Subtotal </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderRight:1, borderBottom:1}]}> - </Text>
          </View>

          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {borderWidth: 0, flex: .001}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, flex: 1}]}> </Text>
          <Text style={[styles.tableCellDesc, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, width:"1%", flex: 2, textAlign:"right"}]}>Check No. __________  </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, flex: 2.1, textAlign:"right"}]}>Less-Advances(Subsidies) </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderRight:1, borderBottom:1, flex: 1.1}]}>  </Text>
          </View>

          <View style={styles.tableRow}>
          <Text style={[styles.tableCell, {borderWidth: 0, flex: 0.001}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCellDesc, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0}]}> </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, flex:2, textAlign:"right"}]}> Refund (Reimbursement) </Text>
          <Text style={[styles.tableCell, {borderWidth: 0, borderLeft: 1, borderRight:1, borderBottom:1}]}> - </Text>
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
            (Treasurer's Name) <Br></Br>
            ___________________________________    <Br></Br>
              Treasurer
            </Text>
            <Text>
            (Auditor's Name) <Br></Br>
            ___________________________________    <Br></Br>
              Auditor
            </Text>
          </View>
        </View>



        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
             Prepared by:
            </Text>
           
          </View>
          </View>

        <View style={{ flexDirection: "row", width: "81.5%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
          <Text>
            (Name of President) <Br></Br>
            ___________________________________    <Br></Br>
              President
            </Text>

            <Text>
            (Adviser's Name) <Br></Br>
            ___________________________________    <Br></Br>
            Adviser
            </Text>
            
            <Text>
            (Adviser's Name) <Br></Br>
            ___________________________________    <Br></Br>
            Adviser
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
             Noted:
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
    <h1>PDF GENERATOR EXAMPLE EXPENSE REPORT</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
