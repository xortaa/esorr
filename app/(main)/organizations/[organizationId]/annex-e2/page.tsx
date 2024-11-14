"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, Upload, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

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

type AnnexE2 = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  organization: {
    name: string;
  };
  treasurer?: Signature;
  auditor?: Signature;
  president?: Signature;
  soccCorporateTreasurer?: Signature;
  soccVPAuditAndLogistics?: Signature;
  adviser?: Signature;
  swdCoordinator?: Signature;
  dean?: Signature;
  regent?: Signature;
};

type Signature = {
  name: string;
  position: string;
  signatureUrl: string;
};

type SignaturePosition =
  | "treasurer"
  | "auditor"
  | "president"
  | "soccCorporateTreasurer"
  | "soccVPAuditAndLogistics"
  | "adviser"
  | "swdCoordinator"
  | "dean"
  | "regent";

type UserPosition = {
  role: string;
  organizationName: string;
};

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

  tableCellDate: {
    //FOR DATE INFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellSOF: {
    //FOR SOURCE OF FUNDS INFLOW
    //backgroundColor: "#30D5C8",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
    flex: 0.6,
    fontFamily: "Arial Narrow Bold",
  },

  tableCellDate2: {
    //FOR DATE OUTFLOW
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
    width: "10%",
    flexDirection: "row",
  },

  tableCellDesc: {
    //FOR DETAILS OUTFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellPay: {
    //FOR PAYEE/ESTABLISHMENT OUTFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellBlank: {
    //FOR BLANK CELL OUTFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellRef: {
    //FOR REFERENCE OUTFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellCost: {
    //FOR UNIT COST OUTFLOW
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
    width: "100%",
    flexDirection: "row",
  },

  tableCellUnit: {
    //FOR NUM OF UNIT OUTFLOW
    //backgroundColor: "#30D5C8",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
    flex: 0.6,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    width: "100%",
    flexDirection: "row",
  },

  tableCellTotalPhP: {
    //FOR TOTAL PHP OUTFLOW
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
    width: "100%",
    flexDirection: "row",
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

  tableCell: {
    //CELL FOR INFLOW
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 5,
    fontSize: 10,
    flex: 1,
    fontFamily: "Arial Narrow Bold",
  },

  tableCell2: {
    //CELL FOR OUTFLOW
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
    textAlign: "right",
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
    textAlign: "center",
  },
});

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const MyDocument: React.FC<{ annex: AnnexE2 }> = ({ annex }) => {
  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="landscape">
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Student Organizations Recognition Requirements Annex E-2 Page{" "}
            <Text render={({ pageNumber, totalPages }) => `${pageNumber}`} /> of Financial Report Liquidation Report AY
            2024-2025
          </Text>
        </View>

        <View>
          <View fixed style={styles.banner}>
            <Text style={{ fontSize: 8, textAlign: "center" }}>Financial Report</Text>
          </View>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>
            <EmphasizedText>UNIVERSITY OF SANTO TOMAS</EmphasizedText>
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>Name of Organization/Council</Text>
          {"\n"}
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>
            <EmphasizedText>Liquidation Report</EmphasizedText> {"\n"}
            <EmphasizedText> As of (MONTH)</EmphasizedText> {"\n"}
            (Date covered)
          </Text>
        </View>

        {/* Table Inflow starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate, { backgroundColor: "#30D5C8" }]}>Date</Text>
            <Text style={[styles.tableCellSOF, { textAlign: "center", backgroundColor: "#30D5C8" }]}>
              Source of Fund
            </Text>
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
            <Text style={[styles.tableCellDate, { flex: 0.487 }]}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>TOTAL RECEIPTS</Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>₱. 00 </Text>
          </View>
        </View>

        {/* Table Outflow starts here */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate2, { backgroundColor: "#30D5C8" }]}>Date</Text>
            <Text style={[styles.tableCellDesc, { backgroundColor: "#30D5C8" }]}>Details/Description</Text>
            <Text style={[styles.tableCellPay, { backgroundColor: "#30D5C8" }]}>Payee/Establishment</Text>
            <Text style={[styles.tableCellBlank, { backgroundColor: "#30D5C8" }]}> </Text>
            <Text style={[styles.tableCellRef, { backgroundColor: "#30D5C8" }]}>Reference No.</Text>
            <Text style={[styles.tableCellCost, { backgroundColor: "#30D5C8" }]}>Unit Cost</Text>
            <Text style={[styles.tableCellUnit, { backgroundColor: "#30D5C8" }]}>Unit/s</Text>
            <Text style={[styles.tableCellTotalPhP, { backgroundColor: "#30D5C8" }]}>Total PhP</Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 10000 </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}> II. Transportation </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
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
            <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P 0.00 </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate2}> </Text>
            <Text style={styles.tableCellTotalExp}>TOTAL EXPENSES </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>P 0.00 </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate2, { flex: 0.65 }]}> </Text>
            <Text style={[styles.tableCellTotalNet, { flex: 2 }]}>NET CASH FLOW / ENDING BALANCE </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={[styles.tableCellTotalNet, { textAlign: "right" }]}>P 0.00 </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "35.5%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Prepared by:</Text>
            <Text>Audited:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              Treasurer
            </Text>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              Auditor
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Approved by:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              President
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              SOCC Corporate Treasurer
            </Text>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              SOCC VP Audit and Logistics
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              Adviser
            </Text>
            <Text>
              (Signature over printed name; date) {"\n"}
              ___________________________________ {"\n"}
              Adviser
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Noted by:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (SWD Coordinator's Name) {"\n"}
              ___________________________________ {"\n"}
              SWD Coordinator
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Dean's Name) {"\n"}
              ___________________________________ {"\n"}
              Dean/Director
            </Text>
            <Text>
              (Regent's Name) {"\n"}
              ___________________________________ {"\n"}
              Regent
            </Text>
          </View>
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", color: "#000" }}>UST:S030-00-FO127</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AnnexE2Manager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexE2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexE2 | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e2`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-e2/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const fetchSingleAnnex = async (id: string) => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e2/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching single annex:", error);
      throw error;
    }
  };

  const generatePDFBlob = async (annex: AnnexE2) => {
    const fullAnnex = await fetchSingleAnnex(annex._id);
    const doc = <MyDocument annex={fullAnnex} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    return blob;
  };

  const downloadPDF = async (id: string) => {
    const annex = annexList.find((a) => a._id === id);
    if (!annex) {
      console.error("Annex not found");
      return;
    }

    try {
      const blob = await generatePDFBlob(annex);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const openSignatureModal = async (annex: AnnexE2) => {
    try {
      const fullAnnex = await fetchSingleAnnex(annex._id);
      setSelectedAnnex(fullAnnex);
      setIsModalOpen(true);
      const blob = await generatePDFBlob(fullAnnex);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error opening signature modal:", error);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSignature = async () => {
    if (!selectedAnnex || !selectedSignaturePosition || !selectedUserPosition) {
      alert("Please select an annex, a signature position, and your role");
      return;
    }

    let signatureData: File;
    if (signatureFile) {
      signatureData = signatureFile;
    } else if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas();
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve, "image/png"));
      signatureData = new File([blob], "signature.png", { type: "image/png" });
    } else {
      alert("Please provide a signature");
      return;
    }

    const formData = new FormData();
    formData.append("file", signatureData);
    formData.append("annexId", selectedAnnex._id);
    formData.append("position", selectedSignaturePosition);

    try {
      setIsLoading(true);
      const response = await fetch("/api/upload-signature", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload signature");
      }

      const { url } = await response.json();

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-e2/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.name || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
        },
      });

      if (updateResponse.data) {
        const updatedAnnex = updateResponse.data;
        setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
        setSelectedAnnex(updatedAnnex);

        const newBlob = await generatePDFBlob(updatedAnnex);
        setPdfBlob(newBlob);

        alert("Signature added successfully");
      } else {
        throw new Error("Failed to update Annex E-2");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
      alert(`Error adding signature: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setSignatureFile(null);
      setSignaturePreview(null);
      setSelectedSignaturePosition("");
      setSelectedUserPosition(null);
      if (signatureRef.current) {
        signatureRef.current.clear();
      }
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">ANNEX E-2 Financial Report Liquidation Report</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading your annexes...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annexList.map((annex) => (
            <AnnexCard
              key={annex._id}
              annex={annex}
              editAnnex={editAnnex}
              submitAnnexForReview={submitAnnexForReview}
              openSignatureModal={openSignatureModal}
              downloadPDF={downloadPDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Financial Report Liquidation Report Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedAnnex && pdfBlob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-7xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                <h3 className="text-2xl font-semibold">Add Signature to Annex E-2</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-[600px] overflow-auto">
                    <PDFViewer width="100%" height="100%">
                      <MyDocument annex={selectedAnnex} />
                    </PDFViewer>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <select
                      className="select select-bordered w-full"
                      value={
                        selectedUserPosition
                          ? `${selectedUserPosition.role}-${selectedUserPosition.organizationName}`
                          : ""
                      }
                      onChange={(e) => {
                        const [role, organizationName] = e.target.value.split("-");
                        setSelectedUserPosition({ role, organizationName });
                      }}
                    >
                      <option value="">Select your role</option>
                      {session?.user?.positions?.map((userPosition: any, index: number) => (
                        <option key={index} value={`${userPosition.position}-${userPosition.organization.name}`}>
                          {userPosition.position} - {userPosition.organization.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-bordered w-full"
                      value={selectedSignaturePosition}
                      onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                    >
                      <option value="">Select signature position</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="auditor">Auditor</option>
                      <option value="president">President</option>
                      <option value="soccCorporateTreasurer">SOCC Corporate Treasurer</option>
                      <option value="soccVPAuditAndLogistics">SOCC VP Audit and Logistics</option>
                      <option value="adviser">Adviser</option>
                      <option value="swdCoordinator">SWD Coordinator</option>
                      <option value="dean">Dean/Director</option>
                      <option value="regent">Regent</option>
                    </select>
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Draw Your Signature</h4>
                      <div className="border p-2 mb-2">
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
                        />
                      </div>
                      <button className="btn btn-outline w-full" onClick={() => signatureRef.current?.clear()}>
                        Clear Signature
                      </button>
                    </div>
                    <div className="text-center text-lg font-semibold">OR</div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Upload Your Signature</h4>
                      {signaturePreview ? (
                        <div className="relative">
                          <img src={signaturePreview} alt="Signature Preview" className="max-w-full h-auto" />
                          <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              setSignatureFile(null);
                              setSignaturePreview(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="hidden"
                            id="signature-upload"
                          />
                          <label htmlFor="signature-upload" className="btn btn-outline btn-primary w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Signature
                          </label>
                        </div>
                      )}
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmitSignature}>
                      Submit Signature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexE2;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: AnnexE2) => void;
  downloadPDF: (id: string) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, openSignatureModal, downloadPDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Financial Report Liquidation Report Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Liquidation Report
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => openSignatureModal(annex)}>
              <PenTool className="h-4 w-4 mr-2" />
              Add Signature
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => downloadPDF(annex._id)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium">Status:</label>
            <span className={annex.isSubmitted ? "text-green-600" : "text-yellow-600"}>
              {annex.isSubmitted ? "Submitted" : "Not Submitted"}
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className={`btn ${annex.isSubmitted ? "btn-disabled" : "btn-primary"}`}
              onClick={() => submitAnnexForReview(annex._id)}
              disabled={annex.isSubmitted}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
