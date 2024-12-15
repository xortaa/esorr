"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, Image } from "@react-pdf/renderer";
import formatMoney from "@/utils/formatMoney";

// const inflowCategories = [
//   "Organization Fund / Beginning Balance",
//   "Membership Fee",
//   "Registration Fee",
//   "Merchandise Selling",
//   "Subsidy: Student Activity Fund (For LSC & CBO Only)",
//   "Subsidy: Community Service Fund",
//   "Subsidy: University-Wide Student Organization Fund (For USO Only)",
//   "Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)",
//   "Subsidy: Local Student Council Fund (For LSC Only)",
//   "Cash Sponsorships",
//   "Interest Income",
// ];

type Inflow = {
  _id: string;
  category: string;
  date: Date;
  amount: number;
  payingParticipants: number;
  totalMembers: number;
  merchandiseSales: number;
};

interface Organization {
  _id: string;
  name: string;
  affiliation: string;
}
interface EvaluationRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}
interface AssessmentCriteria {
  rating: number;
  analysis: string;
  recommendation: string;
}
interface OutflowItem {
  category: string;
  description: string;
  cost: number;
  quantity: number;
  serialNumber: string;
  expenseReportCategory: string;
}
interface Outflow {
  _id: string;
  establishment: string;
  date: Date;
  items: OutflowItem[];
  totalCost: number;
  image: string;
}
interface Event {
  _id: string;
  academicYear: string;
  organization: string;
  title: string;
  eReserveNumber: string;
  date: Date;
  venue: string;
  adviser: string;
  timeAttended: {
    from: string;
    to: string;
  };
  speakerName: string;
  speakerTopic: string;
  speakerAffiliation: string;
  speakerPosition: string;
  totalParticipants: number;
  totalRespondents: number;
  evaluationSummary: Map<string, EvaluationRating>;
  assessment: {
    criteria: Map<string, AssessmentCriteria>;
  };
  comments: Array<{ id: string; text: string }>;
  sponsorName: string;
  sponsorshipTypes: SponsorshipType[];

  outflows: Outflow[];
  projectProposalForm: string[];
  actualAnsweredEvaluationForms: string[];
  shortWriteUp: string[];
  picturesOfEvent: string[];
}

interface OperationalAssessmentCategory {
  event: Event;
}
interface OperationalAssessment {
  _id: string;
  annexE: string;
  v01: OperationalAssessmentCategory[];
  v02: OperationalAssessmentCategory[];
  v03: OperationalAssessmentCategory[];
  v04: OperationalAssessmentCategory[];
  v05: OperationalAssessmentCategory[];
  v06: OperationalAssessmentCategory[];
  v07: OperationalAssessmentCategory[];
  v08: OperationalAssessmentCategory[];
  v09: OperationalAssessmentCategory[];
  s1: OperationalAssessmentCategory[];
  s2: OperationalAssessmentCategory[];
  s3: OperationalAssessmentCategory[];
  e1: OperationalAssessmentCategory[];
  e2: OperationalAssessmentCategory[];
  e3: OperationalAssessmentCategory[];
  a1: OperationalAssessmentCategory[];
  a2: OperationalAssessmentCategory[];
  a3: OperationalAssessmentCategory[];
  l1: OperationalAssessmentCategory[];
  l2: OperationalAssessmentCategory[];
  l3: OperationalAssessmentCategory[];
  sdg1: OperationalAssessmentCategory[];
  sdg2: OperationalAssessmentCategory[];
  sdg3: OperationalAssessmentCategory[];
  sdg4: OperationalAssessmentCategory[];
  sdg5: OperationalAssessmentCategory[];
  sdg6: OperationalAssessmentCategory[];
  sdg7: OperationalAssessmentCategory[];
  sdg8: OperationalAssessmentCategory[];
  sdg9: OperationalAssessmentCategory[];
  sdg10: OperationalAssessmentCategory[];
  sdg11: OperationalAssessmentCategory[];
  sdg12: OperationalAssessmentCategory[];
  sdg13: OperationalAssessmentCategory[];
  sdg14: OperationalAssessmentCategory[];
  sdg15: OperationalAssessmentCategory[];
  sdg16: OperationalAssessmentCategory[];
  sdg17: OperationalAssessmentCategory[];
}
interface AnnexE {
  _id: string;
  organization: Organization;
  academicYear: string;
  operationalAssessment: OperationalAssessment;
  outgoingSecretary: Signature;
  outgoingPresident: Signature;
  incomingSecretary: Signature;
  incomingPresident: Signature;
  adviser: Signature;
  dateSubmitted: Date;
}

interface Signature {
  name: string;
  position: string;
  signatureUrl: string;
}

type UserPosition = {
  role: string;
  organizationName: string;
};

type Positions = {
  organization?: {
    _id: string;
    name: string;
  };
  affiliation?: string;
  position: string;
  _id: string;
};

type SignaturePosition =
  | "outgoingSecretary"
  | "outgoingPresident"
  | "incomingSecretary"
  | "incomingPresident"
  | "adviser";

type MyDocumentProps = {
  annex: AnnexE;
};

type SponsorshipType = "Cash" | "Deals" | "Booth" | "Product Launching" | "Flyers" | "Discount Coupon";

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

  tableInfo: {
    //ORG INFO
    display: "flex",
    width: "auto",
    borderWidth: 0,
    marginBottom: 10,
    fontSize: 9,
  },

  tableOfc: {
    //OFFICE USE ONLY
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

const subsidyCategories = [
  "Subsidy: Student Activity Fund (For LSC & CBO Only)",
  "Subsidy: Community Service Fund",
  "Subsidy: University-Wide Student Organization Fund (For USO Only)",
  "Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)",
  "Subsidy: Local Student Council Fund (For LSC Only)",
];

// Create Document Component
const MyDocument = ({ event, inflows, annex }: { event: Event; inflows: Inflow[]; annex: AnnexE }) => {
  const otherInflows = inflows.filter((inflow) => !subsidyCategories.includes(inflow.category));
  const subsidyInflows = inflows.filter((inflow) => subsidyCategories.includes(inflow.category));

  const formatCurrency = (amount: number) => amount.toFixed(2);
  const formatDate = (dateObj: { $date: string }) => {
    const date = new Date(dateObj.$date);
    return date.toISOString().split("T")[0];
  };

  const categories = ["Meals", "Transport", "Supplies", "Lodging", "Repairs", "Others", "Misc"];

  const totals = event.outflows.reduce(
    (acc, outflow) => {
      outflow.items.forEach((item) => {
        acc[item.expenseReportCategory] = (acc[item.expenseReportCategory] || 0) + item.cost;
        acc.Total += item.cost;
      });
      return acc;
    },
    { Meals: 0, Transport: 0, Supplies: 0, Lodging: 0, Repairs: 0, Others: 0, Misc: 0, Total: 0 }
  );

  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="landscape">
        {/* Header */}
        <Text>{event.title}</Text>
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Student Organizations Recognition Requirements Annex E-2 Page{" "}
            <Text render={({ pageNumber, totalPages }) => `${pageNumber}`} /> of Financial Report Liquidation Report AY
            2024-2025
          </Text>
        </View>

        <View>
          <View style={styles.tableOfc}>
            {/* Header Row */}
            <View style={[styles.tableRow, { borderWidth: 0 }]}>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text
                style={[
                  styles.tableCellHeader,
                  { backgroundColor: "#FFA550", color: "#000", border: 0, fontFamily: "Arial Narrow" },
                ]}
              >
                For Office Use Only
              </Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
              <Text style={[styles.tableCellHeader, { borderWidth: 0, backgroundColor: "#FFFFFF" }]}></Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
            <View style={styles.bannerlogo}>
              <Image src="/assets/UST.png" style={{ width: 50, height: 50 }} />
              <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
                EXPENSE REPORT {"\n"}
                {"\n"}
                <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
                  .Note: This form shall be used for expense report reimbursements, petty cash replenishment and
                  liquidation of cash advances {"\n"}
                  (if budget released by the University) {"\n"}
                  .Please attach original receipts/invoices and any other pertinent documents. Single payment of over
                  P2000 from petty cash is not allowed
                </Text>
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>PURPOSE:{event.title}</Text>
          {"\n"}
          {"\n"}
        </View>

        <View>
          <Text style={{ fontSize: 8, fontWeight: "bold", paddingTop: 20, textAlign: "left" }}>
            ORGANIZATION INFORMATION:{" "}
          </Text>
        </View>

        <View style={{ flexDirection: "row", width: "640.5", textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Name of Organization: {annex.organization.name}</Text>
            <Text>Department: {annex.organization.affiliation}</Text>
            <Text>Date Submitted: {new Date(annex.dateSubmitted).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Map through other inflows or show empty fields if none */}
        {otherInflows.length > 0 ? (
          otherInflows.map((inflow, index) => (
            <View key={index} style={{ flexDirection: "row", width: "50%", textAlign: "left", fontSize: 9 }}>
              <View style={styles.signatureDetails}>
                <Text>Source of Funds: {inflow.category}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ flexDirection: "row", width: "50%", textAlign: "left", fontSize: 9 }}>
            <View style={styles.signatureDetails}>
              <Text>Source of Funds: ___________________________________</Text>
              <Text>___________________________________</Text>
            </View>
          </View>
        )}

        {/* Map through subsidy inflows */}
        {subsidyInflows.map((inflow, index) => (
          <View key={index} style={{ flexDirection: "row", width: "53.5%", textAlign: "left", fontSize: 9 }}>
            <View style={styles.signatureDetails}>
              <Text>Subsidies from the University: {inflow.category}</Text>
              <Text>Cash Requisition No. ___________________________________</Text>
            </View>
          </View>
        ))}

        {/* If no subsidy inflows, show empty fields */}
        {subsidyInflows.length === 0 && (
          <View style={{ flexDirection: "row", width: "53.5%", textAlign: "left", fontSize: 9 }}>
            <View style={styles.signatureDetails}>
              <Text>Subsidies from the University: _____________________________</Text>
              <Text>Cash Requisition No. ___________________________________</Text>
            </View>
          </View>
        )}

        {/* Table EXPENSES starts here */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, { borderTop: 1, borderLeft: 1 }]}>
            <Text style={styles.tableCellHeader}>Date</Text>
            <Text style={styles.tableCellHeader}>Ref</Text>
            <Text style={[styles.tableCellDesc, { backgroundColor: "#993300", color: "#FFFFFF" }]}>Description</Text>
            {categories.map((category) => (
              <Text key={category} style={styles.tableCellHeader}>
                {category}
              </Text>
            ))}
            <Text style={styles.tableCellHeader}>Total</Text>
          </View>

          {/* Table Rows */}
          {event.outflows.map((outflow) => (
            <React.Fragment key={outflow._id}>
              {outflow.items.map((item, itemIndex) => (
                <View key={`${outflow._id}-${itemIndex}`} style={[styles.tableRow, { borderWidth: 1 }]}>
                  <Text style={styles.tableCell}>{new Date(outflow.date).toDateString()}</Text>
                  <Text style={styles.tableCell}>{item.serialNumber}</Text>
                  <Text style={styles.tableCellDesc}>{item.description}</Text>
                  {categories.map((category) => (
                    <Text key={category} style={styles.tableCell}>
                      {item.expenseReportCategory === category ? formatMoney(item.cost).toString() : ""}
                    </Text>
                  ))}
                  <Text style={styles.tableCell}>{formatMoney(item.cost).toString()}</Text>
                </View>
              ))}
            </React.Fragment>
          ))}

          {/* Subtotals */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCellDesc, { borderWidth: 0, flex: 2.04 }]}> </Text>
            {categories.map((category) => (
              <Text key={category} style={[styles.tableCell, { borderWidth: 0, borderLeft: 1, borderBottom: 1 }]}>
                {formatMoney(totals[category]).toString()}
              </Text>
            ))}
            <Text
              style={[
                styles.tableCell,
                {
                  borderWidth: 0,
                  borderLeft: 1,
                  borderBottom: 1,
                  borderRight: 1,
                  backgroundColor: "#000000",
                  flex: 1.01,
                },
              ]}
            >
              {" "}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCellDesc, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, textAlign: "right" }]}> Subtotal </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, borderLeft: 1, borderRight: 1, borderBottom: 1 }]}>
              {formatMoney(totals.Total).toString()}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderWidth: 0, flex: 0.001 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, flex: 1 }]}> </Text>
            <Text style={[styles.tableCellDesc, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, width: "1%", flex: 2, textAlign: "right" }]}>
              Check No. __________
            </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, flex: 2.1, textAlign: "right" }]}>
              Less-Advances(Subsidies)
            </Text>
            <Text
              style={[styles.tableCell, { borderWidth: 0, borderLeft: 1, borderRight: 1, borderBottom: 1, flex: 1.1 }]}
            >
              {" "}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { borderWidth: 0, flex: 0.001 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCellDesc, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0 }]}> </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, flex: 2, textAlign: "right" }]}>
              Refund (Reimbursement)
            </Text>
            <Text style={[styles.tableCell, { borderWidth: 0, borderLeft: 1, borderRight: 1, borderBottom: 1 }]}>
              {formatMoney(totals.Total).toString()}
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
          <View style={styles.signatureDetails}>
            <Text>
              (Treasurer's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Treasurer
            </Text>
            <Text>
              (Auditor's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Auditor
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Prepared by:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "81.5%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Name of President) <Br></Br>
              ___________________________________ <Br></Br>
              President
            </Text>

            <Text>
              (Adviser's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Adviser
            </Text>

            <Text>
              (Adviser's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Adviser
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "42%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>Noted:</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (SWD Coordinator's Name) <Br></Br>
              ___________________________________ <Br></Br>
              SWD Coordinator
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "50%", paddingTop: 20, textAlign: "left", fontSize: 9 }}>
          <View style={styles.signatureDetails}>
            <Text>
              (Dean's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Dean/Director
            </Text>
            <Text>
              (Regent's Name) <Br></Br>
              ___________________________________ <Br></Br>
              Regent
            </Text>
          </View>
        </View>

        <Footer />

        {/* map trough all the outflow iamge and display it */}
        {event.outflows.map((outflow, index) => (
          <View break key={outflow._id}>
            <Text>Event: {event.title}</Text>
            <Text>Establishment: {outflow.establishment}</Text>
            {outflow.image && (
              <Image src={outflow.image} style={{ height: "70vh", width: "100%", objectFit: "contain" }} />
            )}
          </View>
        ))}
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

export default MyDocument;
