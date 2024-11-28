"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";

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

type Signature = {
  name: string;
  position: string;
  signatureUrl: string;
};

type Inflow = {
  _id: string;
  category: string;
  date: Date;
  amount: number;
  payingParticipants: number;
  totalMembers: number;
  merchandiseSales: number;
};

type OutflowItem = {
  category: string;
  description: string;
  cost: number;
  quantity: number;
  serialNumber: string;
};

type Outflow = {
  _id: string;
  establishment: string;
  date: Date;
  items: OutflowItem[];
  totalCost: number;
  image: string;
  event: string;
};

type MonthlyReport = {
  inflows: Inflow[];
  outflows: Outflow[];
  treasurer?: Signature;
  auditor?: Signature;
  president?: Signature;
  soccCorporateTreasurer?: Signature;
  soccVPAuditAndLogistics?: Signature;
  adviser?: Signature;
  coAdviser?: Signature;
  swdCoordinator?: Signature;
  dean?: Signature;
  regent?: Signature;
  totalInflow: number;
  totalOutflow: number;
  beginningBalance: number;
  endingBalance: number;
};

type AnnexE2 = {
  _id: string;
  organization: {
    name: string;
  };
  academicYear: string;
  january: MonthlyReport;
  february: MonthlyReport;
  march: MonthlyReport;
  april: MonthlyReport;
  may: MonthlyReport;
  june: MonthlyReport;
  july: MonthlyReport;
  august: MonthlyReport;
  september: MonthlyReport;
  october: MonthlyReport;
  november: MonthlyReport;
  december: MonthlyReport;
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
};

type SignaturePosition = keyof MonthlyReport;

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

const MyDocument: React.FC<{
  organization: string;
  monthlyReport: MonthlyReport;
  month: string;
  academicYear: string;
}> = ({ organization, monthlyReport, month, academicYear }) => {
  const categories = [
    { numeral: "I", name: "Food Expense" },
    { numeral: "II", name: "Transportation" },
    { numeral: "III", name: "Office Supplies" },
    { numeral: "IV", name: "Physical Arrangement" },
    { numeral: "V", name: "Documentation" },
    { numeral: "VI", name: "Promotions" },
    { numeral: "VII", name: "Professional Fee/ Honoraria/ Token" },
    { numeral: "VIII", name: "Awards and Prizes" },
    { numeral: "IX", name: "Publication" },
    { numeral: "X", name: "Rentals" },
    { numeral: "XI", name: "Equipment" },
    { numeral: "XII", name: "Costumes" },
    { numeral: "XIII", name: "Membership Kits" },
    { numeral: "XIV", name: "Registration Fees" },
    { numeral: "XV", name: "Cash Donations or Sponsorship to Other Organizations" },
    { numeral: "XVI", name: "Miscellaneous Expense" },
  ];

  const inflows = monthlyReport?.inflows ?? [];
  const outflows = monthlyReport?.outflows ?? [];
  const totalInflow = monthlyReport?.totalInflow ?? 0;
  const totalOutflow = monthlyReport?.totalOutflow ?? 0;

  const renderSignature = (role: keyof MonthlyReport, title: string) => {
    const signature = monthlyReport?.[role] as Signature | undefined;
    return (
      <View style={styles.signatureDetails}>
        {signature?.signatureUrl ? (
          <View>
            <Image src={signature.signatureUrl} style={styles.signatureImage} />
            <Text>{signature.name}</Text>
            <Text>{title}</Text>
          </View>
        ) : (
          <Text>
            ___________________________________ {"\n"}
            {title}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="landscape">
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Student Organizations Recognition Requirements Annex E-2 Page{" "}
            <Text render={({ pageNumber }) => `${pageNumber}`} /> of Financial Report Liquidation Report AY
            {academicYear}
          </Text>
        </View>

        <View>
          <View fixed style={styles.banner}>
            <Text style={{ fontSize: 8, textAlign: "center" }}>Financial Report</Text>
          </View>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>
            <EmphasizedText>UNIVERSITY OF SANTO TOMAS</EmphasizedText>
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>{organization}</Text>
          {"\n"}
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "center" }}>
            <EmphasizedText>Liquidation Report</EmphasizedText> {"\n"}
            <EmphasizedText> As of {month}</EmphasizedText> {"\n"}
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
          {inflows.length > 0 ? (
            inflows.map((inflow) => (
              <View style={styles.tableRow} key={inflow._id}>
                <Text style={styles.tableCellDate}>{new Date(inflow.date).toLocaleDateString()}</Text>
                <Text style={styles.tableCellSOF}>{inflow.category}</Text>
                <Text style={styles.tableLastCell}>₱ {inflow.amount}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: "center" }]}>No inflows for this period</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Total Inflows</Text>
            <Text style={styles.tableLastCell}>₱ {totalInflow || 0}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Total Outflows</Text>
            <Text style={styles.tableLastCell}>₱ {totalOutflow || 0}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate}> </Text>
            <Text style={styles.tableCellSOF}>Net Cash Flow</Text>
            <Text style={styles.tableLastCell}>₱ {(totalInflow || 0) - (totalOutflow || 0)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate, { flex: 0.487 }]}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>TOTAL RECEIPTS</Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>₱ {totalInflow || 0}</Text>
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
          {outflows.length > 0 ? (
            categories.map((category) => {
              const items = outflows.flatMap((outflow) =>
                (outflow.items || [])
                  .filter((item) => item.category === `${category.numeral}. ${category.name}`)
                  .map((item) => ({
                    ...item,
                    date: outflow.date,
                    establishment: outflow.establishment,
                  }))
              );

              const totalCost = items.reduce((total, item) => total + (item.cost || 0) * (item.quantity || 0), 0);

              return items.length > 0 ? (
                <React.Fragment key={category.name}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {category.numeral}. {category.name}
                    </Text>
                  </View>
                  {items.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableCellDate2}>{new Date(item.date).toLocaleDateString()}</Text>
                      <Text style={styles.tableCellDesc}>{item.description}</Text>
                      <Text style={styles.tableCellPay}>{item.establishment}</Text>
                      <Text style={styles.tableCellBlank}> </Text>
                      <Text style={styles.tableCellRef}>{item.serialNumber}</Text>
                      <Text style={styles.tableCellCost}>{item.cost}</Text>
                      <Text style={styles.tableCellUnit}>{item.quantity}</Text>
                      <Text style={styles.tableCellTotalPhP}>{(item.cost || 0) * (item.quantity || 0)}</Text>
                    </View>
                  ))}
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCellTotal, { textAlign: "right" }]}>P {totalCost.toFixed(2)}</Text>
                  </View>
                </React.Fragment>
              ) : null;
            })
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { textAlign: "center" }]}>No outflows for this period</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={styles.tableCellDate2}> </Text>
            <Text style={styles.tableCellTotalExp}>TOTAL EXPENSES </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={styles.tableCellTotalExp}> </Text>
            <Text style={[styles.tableCellTotalExp, { textAlign: "right" }]}>P {(totalOutflow || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellDate2, { flex: 0.65 }]}> </Text>
            <Text style={[styles.tableCellTotalNet, { flex: 2 }]}>NET CASH FLOW / ENDING BALANCE </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={styles.tableCellTotalNet}> </Text>
            <Text style={[styles.tableCellTotalNet, { textAlign: "right" }]}>
              P {(totalInflow || 0) - (totalOutflow || 0)} / P {monthlyReport?.endingBalance || 0}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "35.5%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Prepared by:</Text>
            <Text>Audited:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("treasurer", "Treasurer")}
          {renderSignature("auditor", "Auditor")}
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Approved by:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("president", "President")}
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("soccCorporateTreasurer", "SOCC Corporate Treasurer")}
          {renderSignature("soccVPAuditAndLogistics", "SOCC VP Audit and Logistics")}
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("adviser", "Adviser")}
          {renderSignature("coAdviser", "Co-Adviser")}
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Noted by:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("swdCoordinator", "SWD Coordinator")}
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          {renderSignature("dean", "Dean")}
          {renderSignature("regent", "Regent")}
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
  const [selectedMonth, setSelectedMonth] = useState<string>("");
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

  const generatePDFBlob = async (annex: AnnexE2, month: string) => {
    const monthlyReport = annex[month.toLowerCase() as keyof AnnexE2] as MonthlyReport;
    const doc = (
      <MyDocument
        organization={annex.organization.name}
        monthlyReport={annex[month.toLowerCase() as keyof AnnexE2] as MonthlyReport | undefined | null}
        month={month}
        academicYear={annex.academicYear}
      />
    );
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    return blob;
  };

  const downloadPDF = async (annex: AnnexE2, month: string) => {
    try {
      const blob = await generatePDFBlob(annex, month);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e2/${annexId}/submit`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex submitted successfully.");
    } catch (error) {
      console.error("Error submitting annex:", error);
      alert("Failed to submit annex. Please try again.");
    }
  };

  const handleUpdateRemarks = async (annexId: string, type: "socc" | "osa", remarks: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e2/${annexId}/${type}-remarks`, {
        remarks,
      });
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert(`${type.toUpperCase()} remarks updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${type} remarks:`, error);
      alert(`Failed to update ${type.toUpperCase()} remarks. Please try again.`);
    }
  };

  const handleApprove = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e2/${annexId}/approve`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex approved successfully.");
    } catch (error) {
      console.error("Error approving annex:", error);
      alert("Failed to approve annex. Please try again.");
    }
  };

  const handleDisapprove = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e2/${annexId}/disapprove`);
      const updatedAnnex = response.data;
      setAnnexList(annexList.map((annex) => (annex._id === updatedAnnex._id ? updatedAnnex : annex)));
      alert("Annex disapproved successfully.");
    } catch (error) {
      console.error("Error disapproving annex:", error);
      alert("Failed to disapprove annex. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <BackButton />
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
              downloadPDF={downloadPDF}
              editAnnex={editAnnex}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
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
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexE2;
  downloadPDF: (annex: AnnexE2, month: string) => void;
  editAnnex: (id: string) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  downloadPDF,
  editAnnex,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  session,
}: AnnexCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [soccRemarks, setSoccRemarks] = useState(annex.soccRemarks);
  const [osaRemarks, setOsaRemarks] = useState(annex.osaRemarks);
  const [submissionsStatus, setSubmissionsStatus] = useState({ submissionAllowed: true });

  useEffect(() => {
    toggledSubmissions();
  }, [session]);

  const toggledSubmissions = async () => {
    try {
      const response = await axios.get("/api/organizations/fetch-submission-status");
      setSubmissionsStatus(response.data);
    } catch (error) {
      console.error("Error toggling submissions:", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-gray-200">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-lg">Financial Report for AY {annex.academicYear}</h2>
          {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
            <button className="btn btn-ghost btn-sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ChevronUp size={20} />
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <span>View Months</span>
                  <ChevronDown size={20} />
                </div>
              )}
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-2">
            {months.map((month) => (
              <div key={month} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="font-medium">{month}</span>
                <div className="space-x-2">
                  <button className="btn btn-xs" onClick={() => downloadPDF(annex, month)}>
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="card-actions justify-between items-center mt-4">
          <div className="space-x-2">
            {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
              <button className="btn btn-primary btn-sm" onClick={() => editAnnex(annex._id)}>
                <Edit size={14} className="mr-1" />
                Edit Liquidation Report
              </button>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold">Status: {annex.status}</p>
          {annex.dateSubmitted && (
            <p className="text-sm text-gray-500">Submitted on: {new Date(annex.dateSubmitted).toLocaleString()}</p>
          )}
        </div>
        {(session?.user?.role === "OSA" ||
          session?.user?.role === "RSO" ||
          session?.user?.role === "RSO-SIGNATORY" ||
          session?.user?.role === "AU" ||
          session?.user?.role === "SOCC") && (
          <div>
            <label className="label">
              <span className="label-text font-semibold">SOCC Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={soccRemarks}
              onChange={(e) => setSoccRemarks(e.target.value)}
              readOnly={session?.user?.role !== "SOCC"}
            ></textarea>
            {session?.user?.role === "SOCC" && annex.status === "For Review" && (
              <button className="btn btn-primary mt-2" onClick={() => onUpdateRemarks(annex._id, "socc", soccRemarks)}>
                Update SOCC Remarks
              </button>
            )}
          </div>
        )}
        {(session?.user?.role === "OSA" ||
          session?.user?.role === "RSO" ||
          session?.user?.role === "RSO-SIGNATORY" ||
          session?.user?.role === "AU") && (
          <div>
            <label className="label">
              <span className="label-text font-semibold">OSA Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={osaRemarks}
              onChange={(e) => setOsaRemarks(e.target.value)}
              readOnly={session?.user?.role !== "OSA"}
            ></textarea>
            {session?.user?.role === "OSA" && annex.status === "For Review" && (
              <button className="btn btn-primary mt-2" onClick={() => onUpdateRemarks(annex._id, "osa", osaRemarks)}>
                Update OSA Remarks
              </button>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          {session?.user?.role === "OSA" && annex.status === "For Review" && (
            <>
              <button className="btn btn-success" onClick={() => onApprove(annex._id)}>
                Approve
              </button>
              <button className="btn btn-error" onClick={() => onDisapprove(annex._id)}>
                Disapprove
              </button>
            </>
          )}
          {session?.user?.role === "RSO" && (
            <button
              className="btn btn-primary"
              onClick={() => onSubmit(annex._id)}
              disabled={
                !submissionsStatus.submissionAllowed || annex.status === "For Review" || annex.status === "Approved"
              }
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
