"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, Upload, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";
import formatMoney from "@/utils/formatMoney";

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

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 10,
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

  cell: {},
});

type AnnexE1 = {
  _id: string;
  organization: {
    name: string;
    affiliation: string;
  };
  academicYear: string;
  isSubmitted: boolean;
  financialReport: FinancialReport;
  officerInCharge?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  treasurer?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  president?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  soccCorporateTreasurer?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  adviser?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  swdCoordinator?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  dean?: {
    name: string;
    position: string;
    signatureUrl: string;
    dateSigned: Date;
  };
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted?: Date;
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
  totalInflow: number;
  totalOutflow: number;
  startingBalance: number;
  endingBalance: number;
};

type AnnexE2 = {
  _id: string;
  organization: {
    name: string;
  };
  academicYear: string;
  isSubmitted: boolean;
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
};

type FinancialReport = {
  annexE1: { type: string; ref: string };
  academicYear: string;
  startingBalance: number;
  transactions: Array<{
    date: Date;
    amount: number;
    type: "inflow" | "outflow";
    category: string;
    description: string;
    establishment: string;
    items: Array<{
      category: string;
      description: string;
      cost: number;
      quantity: number;
      serialNumber: string;
    }>;
    payingParticipants: number;
    totalMembers: number;
    merchandiseSales: number;
  }>;
  june: MonthData;
  july: MonthData;
  august: MonthData;
  september: MonthData;
  october: MonthData;
  november: MonthData;
  december: MonthData;
  january: MonthData;
  february: MonthData;
  march: MonthData;
  april: MonthData;
  may: MonthData;
  totalIncome: number;
  totalExpenses: number;
  endingBalance: number;
};

type MonthData = {
  startingBalance: number;
  endingBalance: number;
  totalIncome: number;
  totalExpenses: number;
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

type SignaturePosition = "treasurer" | "president" | "soccCorporateTreasurer" | "adviser" | "swdCoordinator" | "dean";

const MyDocument: React.FC<{ annex: AnnexE1; annexE2: AnnexE2 }> = ({ annex, annexE2 }) => {
  const allInflows = [
    ...(annexE2.january?.inflows || []),
    ...(annexE2.february?.inflows || []),
    ...(annexE2.march?.inflows || []),
    ...(annexE2.april?.inflows || []),
    ...(annexE2.may?.inflows || []),
    ...(annexE2.june?.inflows || []),
    ...(annexE2.july?.inflows || []),
    ...(annexE2.august?.inflows || []),
    ...(annexE2.september?.inflows || []),
    ...(annexE2.october?.inflows || []),
    ...(annexE2.november?.inflows || []),
    ...(annexE2.december?.inflows || []),
  ];

  const inflowCategories = [
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
    "Interest Income",
  ];

  const membershipFees = allInflows.filter((inflow) => inflow?.category === "Membership Fee");
  const registrationFees = allInflows.filter((inflow) => inflow?.category === "Registration Fee");
  const merchandiseSelling = allInflows.filter((inflow) => inflow?.category === "Merchandise Selling");
  const subsidySAF = allInflows.filter(
    (inflow) => inflow?.category === "Subsidy: Student Activity Fund (For LSC & CBO Only)"
  );
  const subsidyCSF = allInflows.filter((inflow) => inflow?.category === "Subsidy: Community Service Fund");
  const subsidyUSOF = allInflows.filter(
    (inflow) => inflow?.category === "Subsidy: University-Wide Student Organization Fund (For USO Only)"
  );
  const subsidyCSCSOCC = allInflows.filter(
    (inflow) => inflow?.category === "Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)"
  );
  const subsidyLSC = allInflows.filter(
    (inflow) => inflow?.category === "Subsidy: Local Student Council Fund (For LSC Only)"
  );
  const cashSponsorships = allInflows.filter((inflow) => inflow?.category === "Cash Sponsorships");

  const totalCollections =
    (membershipFees || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (registrationFees || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (merchandiseSelling || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0);

  const totalSubsidies =
    (subsidySAF || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (subsidyCSF || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (subsidyUSOF || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (subsidyCSCSOCC || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0) +
    (subsidyLSC || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0);

  const totalSponsorships = (cashSponsorships || []).reduce((acc, curr) => acc + (curr?.amount || 0), 0);

  const totalInflows = allInflows.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
  const totalOutflows = [
    annexE2.january,
    annexE2.february,
    annexE2.march,
    annexE2.april,
    annexE2.may,
    annexE2.june,
    annexE2.july,
    annexE2.august,
    annexE2.september,
    annexE2.october,
    annexE2.november,
    annexE2.december,
  ].reduce((acc, month) => acc + (month?.totalOutflow || 0), 0);

  return (
    <Document>
      <Page size="LEGAL" orientation="landscape" style={styles.page}>
        {/* Header */}

        <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", backgroundColor: "yellow", fontSize: 20 }}>
          Financial Report
        </Text>

        <View style={{ flexDirection: "column" }}>
          <Image src="/assets/UST.png" style={{ width: 50, height: 50, position: "absolute" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 11, textAlign: "center" }}>
            UNIVERSITY OF SANTO TOMAS
          </Text>
          <Text style={{ textAlign: "center", fontSize: 14 }}>{annex.organization?.name}</Text>
        </View>

        <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 16, marginTop: 10, textAlign: "center" }}>
          Summary of Receipts and Disbursements
        </Text>

        {/* Table 1 */}
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>CASH RECEIPTS:</Text>
        </View>

        <View style={{ flexDirection: "column" }}>
          {/* FORMAT MONEY EXAMPLE */}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>
            BEGINNING BALANCE/STARTIING FUND: {formatMoney(annex.financialReport?.june?.startingBalance).toString()}
          </Text>
        </View>

        {/* {formatMoney().toString()} */}

        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>COLLECTIONS </Text>
        </View>

        {/* Mem Fee */}
        {membershipFees && membershipFees.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "gray",
                }}
              >
                <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                  MEMBERSHIP FEE (As reflected in Annex B / Student Affiliation Record)
                </Text>
              </View>
              {/* in annex e2 inflow map all the category Membership Fee */}
              <View style={{ width: "50%", flexDirection: "column" }}>
                {membershipFees.map((inflow: Inflow, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>{inflow.category}</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {formatMoney(inflow.amount).toString() || 0}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>Total Paying Members</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {inflow.totalMembers || 0}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%", backgroundColor: "gray" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Registration Fee */}
        {registrationFees && registrationFees.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#D3D3D3",
                }}
              >
                <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                  REGISTRATION FEE (Fee Collected from Activities)
                </Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {registrationFees.map((inflow: Inflow, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>{inflow.category}</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {" "}
                        {formatMoney(inflow.amount).toString() || 0}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>Total Paying Members</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {inflow.payingParticipants || 0}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%", backgroundColor: "#D3D3D3" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Merch Selling */}
        {merchandiseSelling && merchandiseSelling.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontFamily: "Arial Narrow Bold" }}>MERCHANDISE SELLING</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {merchandiseSelling.map((inflow: Inflow, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>{inflow.category}</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {" "}
                        {formatMoney(inflow.amount).toString() || 0}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>Total Paying Members</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        {inflow.merchandiseSales || 0}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%", backgroundColor: "yellow" }}> </Text>

                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}></Text>
              <Text style={{ width: "25%", textAlign: "right" }}>TOTAL COLLECTIONS</Text>
              <Text style={{ width: "18%", textAlign: "right", paddingRight: 1 }}>
                {formatMoney(totalCollections).toString()}
              </Text>
              <Text style={{ width: "17%" }}></Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SUBSIDIES </Text>
        </View>

        {/* Student Activity Fund (For CBO & LSC Only) */}
        {subsidySAF && subsidySAF.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#ececec",
                }}
              >
                <Text style={{}}>Student Activity Fund (For CBO & LSC Only)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {subsidySAF.map((inflow: Inflow, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ width: "40%" }}>{inflow.category}</Text>
                      <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                        ₱ {formatMoney(inflow.amount).toString() || 0}
                      </Text>
                      <Text style={{ width: "25%" }}> </Text>
                      <Text style={{ width: "10%" }}> </Text>
                    </View>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Community Service Fund (For Funds Requested from SCDO) */}
        {subsidyCSF && subsidyCSF.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#fef2cb",
                }}
              >
                <Text style={{}}>Community Service Fund (For Funds Requested from SCDO)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {subsidyCSF.map((inflow: Inflow, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <Text style={{ width: "40%" }}> {inflow.category}</Text>
                    <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                      {" "}
                      {formatMoney(inflow.amount).toString() || 0}
                    </Text>
                    <Text style={{ width: "25%" }}> </Text>
                    <Text style={{ width: "10%" }}> </Text>
                  </View>
                ))}

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* University-Wide Student Organization Fund (For USO ONLY) */}
        {subsidyUSOF && subsidyUSOF.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#deeaf6",
                }}
              >
                <Text style={{}}>University-Wide Student Organization Fund (For USO ONLY)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {subsidyUSOF.map((inflow: Inflow, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <Text style={{ width: "40%" }}> {inflow.category}</Text>
                    <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                      {" "}
                      {formatMoney(inflow.amount).toString()}
                    </Text>
                    <Text style={{ width: "25%" }}> </Text>
                    <Text style={{ width: "10%" }}> </Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* CSC/SOCC Fund (For CSC and SOCC ONLY) */}
        {subsidyCSCSOCC && subsidyCSCSOCC.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#d0cece",
                }}
              >
                <Text style={{}}>CSC/SOCC Fund (For CSC and SOCC ONLY)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {subsidyCSCSOCC.map((inflow: Inflow, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <Text style={{ width: "40%" }}> {inflow.category}</Text>
                    <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                      {" "}
                      {formatMoney(inflow.amount).toString() || 0}
                    </Text>
                    <Text style={{ width: "25%" }}> </Text>
                    <Text style={{ width: "10%" }}> </Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Local Student Council Fund (For LSC ONLY) */}
        {subsidyLSC && subsidyLSC.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "#e2efd9",
                }}
              >
                <Text style={{}}>Local Student Council Fund (For LSC ONLY)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {subsidyLSC.map((inflow: Inflow, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <Text style={{ width: "40%" }}>{inflow.category}</Text>
                    <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                      {" "}
                      {formatMoney(inflow.amount).toString() || 0}
                    </Text>
                    <Text style={{ width: "25%" }}> </Text>
                    <Text style={{ width: "10%" }}> </Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}></Text>
              <Text style={{ width: "25%", textAlign: "right" }}>TOTAL SUBSIDIES</Text>
              <Text style={{ width: "18%", border: 1, textAlign: "right", paddingRight: 1 }}>
                {" "}
                {formatMoney(totalSubsidies).toString()}
              </Text>
              <Text style={{ width: "17%" }}></Text>
            </View>
          </View>
        </View>

        {cashSponsorships && cashSponsorships.length > 0 && (
          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  backgroundColor: "white",
                }}
              >
                <Text style={{}}>CASH SPONSORSHIP (MONETARY)</Text>
              </View>
              <View style={{ width: "50%", flexDirection: "column" }}>
                {cashSponsorships.map((inflow: Inflow, index) => (
                  <View style={{ flexDirection: "row" }} key={index}>
                    <Text style={{ width: "40%" }}>{inflow.category}</Text>
                    <Text style={{ width: "25%", textAlign: "right", paddingRight: 1 }}>
                      {formatMoney(inflow.amount).toString() || 0}
                    </Text>
                    <Text style={{ width: "25%" }}> </Text>
                    <Text style={{ width: "10%" }}> </Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "40%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "25%" }}> </Text>
                  <Text style={{ width: "10%" }}> </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> TOTAL AMOUNT OF CASH SPONSORSHIP</Text>
          </View>
          <Text style={{ width: "12.50%", border: 1, textAlign: "right", paddingRight: 1 }}>
            {" "}
            {formatMoney(totalSponsorships).toString()}
          </Text>
          <Text style={{}}> </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "left" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Interest Income </Text>
          </View>
          <Text style={{ width: "12.50%", border: 1 }}></Text>
          <Text style={{}}> </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Total Cash Receipts </Text>
          </View>
          <Text style={{ width: "12.50%", border: 1 }}></Text>
          <Text style={{}}> </Text>
        </View>

        {/* Expenses */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>
            Less: CASH DISBURSEMENTS (As Reflected in Annex E-2: Liquidation Report){" "}
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Italic", width: "50%", textAlign: "center" }}>
            (Monthly Outflow of Money)
          </Text>

          <View>
            <Expenses month="JUNE" expenses={annexE2.june?.totalOutflow || 0} />
            <Expenses month="JULY" expenses={annexE2.july?.totalOutflow || 0} />
            <Expenses month="AUGUST" expenses={annexE2.august?.totalOutflow || 0} />
            <Expenses month="SEPTEMBER" expenses={annexE2.september?.totalOutflow || 0} />
            <Expenses month="OCTOBER" expenses={annexE2.october?.totalOutflow || 0} />
            <Expenses month="NOVEMBER" expenses={annexE2.november?.totalOutflow || 0} />
            <Expenses month="DECEMBER" expenses={annexE2.december?.totalOutflow || 0} />
            <Expenses month="JANUARY" expenses={annexE2.january?.totalOutflow || 0} />
            <Expenses month="FEBRUARY" expenses={annexE2.february?.totalOutflow || 0} />
            <Expenses month="MARCH" expenses={annexE2.march?.totalOutflow || 0} />
            <Expenses month="APRIL" expenses={annexE2.april?.totalOutflow || 0} />
            <Expenses month="MAY" expenses={annexE2.may?.totalOutflow || 0} />
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Total CASH DISBURSEMENTS </Text>
          </View>
          <Text style={{ width: "12.50%", border: 2, textAlign: "right", paddingRight: 1, paddingTop: 1 }}>
            {" "}
            {formatMoney(totalOutflows).toString()}
          </Text>
          <Text style={{}}> </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%", flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}> </Text>
              <Text style={{ width: "25%" }}> </Text>
              <Text style={{ width: "18%", textAlign: "right" }}>Net CASH FLOW </Text>
              <Text style={{ width: "17%", border: 2, textAlign: "right", paddingRight: 1, paddingTop: 1 }}>
                {" "}
                {formatMoney(totalInflows).toString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ width: "70%", textAlign: "center" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", backgroundColor: "yellow", fontSize: 18 }}>
              FINANCIAL STATEMENTS
            </Text>
          </View>
          {/* <Text style={{ width: "12.50%" }}></Text> */}

          <View
            style={{
              width: "30%",
              backgroundColor: "gray",
              fontSize: 12,
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Text> Activity Liquidation Reports </Text>
          </View>
        </View>

        {/* Financial Statements Table */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", flexDirection: "column", paddingHorizontal: 2 }}>
            <Text style={{ textAlign: "justify", fontSize: "9.5" }}>
              <EmphasizedText>Summary of Receipts and Disbursements Report</EmphasizedText> gives{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>an overview</Text> of the cash disbursements and
              receipts of the council/organization during the whole academic year. The disbursements (activity expenses)
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>
                must be accompanied by the activities' own liquidation report.
              </Text>
              <Br />
              <Br />
              <EmphasizedText>Liquidation Reports</EmphasizedText> present cash disbursements and receipts of the
              council/organization on a monthly basis. They enable the stakeholders to
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>examine the efficiency </Text> of the
              council/organization in managing their finances. They should be prepared two weeks after the duration of
              each project. The liquidation report must reflect{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>necessary information </Text>such as the payee,
              reference number of the receipts, net cash flow and others.
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Expense Report</Text> present the cash
              disbursements of organization per activity.
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Photocopies</Text> of the{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>OFFICIAL RECEIPTS</Text>{" "}
              must be attached together with the liquidation reports when submitting to the Office for Student Affairs
              (OSA).
            </Text>
          </View>
          <View style={{ width: "30%", flexDirection: "column", border: 1 }}>
            <View style={{ flexDirection: "row", fontFamily: "Arial Narrow Bold" }}>
              <Text style={{ width: "35%", borderRight: 1, backgroundColor: "#00b0f0", textAlign: "center" }}>
                {" "}
                Title of Activity{" "}
              </Text>
              <Text style={{ width: "32.5%", borderRight: 1, backgroundColor: "#00b0f0", textAlign: "center" }}>
                {" "}
                Beginning Balance{" "}
              </Text>
              <Text style={{ width: "32.5%", backgroundColor: "#00b0f0", textAlign: "center" }}> Ending Balance </Text>
            </View>
            <View style={{ fontSize: 10 }}>
              <LiquidationReport
                month="AUGUST"
                beginningBalance={formatMoney(annex.financialReport?.august?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.august?.endingBalance).toString()}
              />
              <LiquidationReport
                month="SEPTEMBER"
                beginningBalance={formatMoney(annex.financialReport?.september?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.september?.endingBalance).toString()}
              />
              <LiquidationReport
                month="OCTOBER"
                beginningBalance={formatMoney(annex.financialReport?.october?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.october?.endingBalance).toString()}
              />
              <LiquidationReport
                month="NOVEMBER"
                beginningBalance={formatMoney(annex.financialReport?.november?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.november?.endingBalance).toString()}
              />
              <LiquidationReport
                month="DECEMBER"
                beginningBalance={formatMoney(annex.financialReport?.december?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.december?.endingBalance).toString()}
              />
              <LiquidationReport
                month="JANUARY"
                beginningBalance={formatMoney(annex.financialReport?.january?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.january?.endingBalance).toString()}
              />
              <LiquidationReport
                month="FEBRUARY"
                beginningBalance={formatMoney(annex.financialReport?.february?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.february?.endingBalance).toString()}
              />
              <LiquidationReport
                month="MARCH"
                beginningBalance={formatMoney(annex.financialReport?.march?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.march?.endingBalance).toString()}
              />
              <LiquidationReport
                month="APRIL"
                beginningBalance={formatMoney(annex.financialReport?.april?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.april?.endingBalance).toString()}
              />
              <LiquidationReport
                month="MAY"
                beginningBalance={formatMoney(annex.financialReport?.may?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.may?.endingBalance).toString()}
              />
              <LiquidationReport
                month="JUNE"
                beginningBalance={formatMoney(annex.financialReport?.june?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.june?.endingBalance).toString()}
              />
              <LiquidationReport
                month="JULY"
                beginningBalance={formatMoney(annex.financialReport?.july?.startingBalance).toString()}
                endingBalance={formatMoney(annex.financialReport?.july?.endingBalance).toString()}
              />
            </View>
          </View>
        </View>

        {/* Signatories */}

        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Arial Narrow Bold",
            backgroundColor: "yellow",
            marginTop: 10,
          }}
        >
          Signatories
        </Text>

        <View style={{ fontSize: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Prepared By:</Text>
          {annex.treasurer ? (
            <>
              <Image src={annex.treasurer.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.treasurer.name}, {new Date(annex.treasurer.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Treasurer</Text>

          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Approved By:</Text>
          {annex.president ? (
            <>
              <Image src={annex.president.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.president.name}, {new Date(annex.president.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>President</Text>

          {annex.soccCorporateTreasurer ? (
            <>
              <Image src={annex.soccCorporateTreasurer.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.soccCorporateTreasurer.name},{" "}
                {new Date(annex.soccCorporateTreasurer.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SOCC Corporate Treasurer</Text>

          {annex.adviser ? (
            <>
              <Image src={annex.adviser.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.adviser.name}, {new Date(annex.adviser.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Adviser</Text>

          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Noted By:</Text>
          {annex.swdCoordinator ? (
            <>
              <Image src={annex.swdCoordinator.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.swdCoordinator.name}, {new Date(annex.swdCoordinator.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SWD Coordinator</Text>

          {annex.dean ? (
            <>
              <Image src={annex.dean.signatureUrl} style={{ width: 200, height: 50 }} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                {annex.dean.name}, {new Date(annex.dean.dateSigned).toLocaleDateString()}
              </Text>
            </>
          ) : (
            <Text style={{ paddingTop: 20 }}></Text>
          )}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Dean/Director</Text>
        </View>
      </Page>
    </Document>
  );
};

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const Expenses = ({ month, expenses }) => (
  <View style={{ flexDirection: "row" }}>
    <View style={{ width: "50%" }}></View>
    <View style={{ width: "50%", flexDirection: "row" }}>
      <Text style={{ width: "40%", textAlign: "right" }}>{month} EXPENSES </Text>
      <Text style={{ width: "25%", textAlign: "right" }}> {formatMoney(expenses).toString()} </Text>
      <Text style={{ width: "25%" }}> </Text>
      <Text style={{ width: "10%" }}> </Text>
    </View>
  </View>
);

const LiquidationReport = ({ month, beginningBalance, endingBalance }) => (
  <View style={{ flexDirection: "row" }}>
    <Text style={{ width: "35%", borderRight: 1, borderTop: 1, backgroundColor: "#00b0f0" }}>{month} EXPENSES </Text>
    <Text style={{ width: "32.5%", borderRight: 1, borderTop: 1, textAlign: "right" }}> {beginningBalance} </Text>
    <Text style={{ width: "32.5%", borderTop: 1, textAlign: "right" }}> {endingBalance} </Text>
  </View>
);

export default function AnnexE1Manager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexE1[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexE1 | null>(null);
  const [selectedAnnexE2, setSelectedAnnexE2] = useState<AnnexE2 | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [selectedUserRole, setSelectedUserRole] = useState<string>("");
  const router = useRouter();
  const currentPath = usePathname();
  const [currentAcademicYear, setCurrentAcademicYear] = useState<string>("");

  useEffect(() => {
    fetchAnnexes();
    fetchOrganizationCurrentAcademicYear();
  }, []);

  const fetchOrganizationCurrentAcademicYear = async () => {
    try {
      const response = await axios.get(`/api/${params.organizationId}/get-current-academic-year`);
      setCurrentAcademicYear(response.data.academicYear);
    } catch (error) {
      console.error("Error fetching current academic year:", error);
    }
  };

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e1`);
      setAnnexList(response.data.reverse());
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`${currentPath}/${id}`);
  };

  const generatePDFBlob = async (annex: AnnexE1, annexE2: AnnexE2): Promise<Blob> => {
    try {
      const blob = await pdf(<MyDocument annex={annex} annexE2={annexE2} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const openPDFInNewTab = async (annex: AnnexE1) => {
    try {
      setIsLoading(true);
      const { annexE1, annexE2 } = await fetchUpdatedAnnexData(annex._id);
      const blob = await generatePDFBlob(annexE1, annexE2);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnexData = async (annexId: string): Promise<{ annexE1: AnnexE1; annexE2: AnnexE2 }> => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e1/${annexId}`);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching updated annex data:", error);
      throw new Error("Failed to fetch updated annex data. Please try again.");
    }
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e1/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e1/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e1/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e1/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX E-1 Financial Report Summary of Receipts and Disbursements</h1>
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
              openPDFInNewTab={() => openPDFInNewTab(annex)}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
              currentAcademicYear={currentAcademicYear}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Financial Report Summary of Receipts and Disbursements Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexE1;
  editAnnex: (id: string) => void;
  openPDFInNewTab: () => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
  currentAcademicYear: string;
}

function AnnexCard({
  annex,
  editAnnex,
  openPDFInNewTab,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  session,
  currentAcademicYear,
}: AnnexCardProps) {
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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">
              Financial Report Summary of Receipts and Disbursements Annex for AY {annex.academicYear}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {currentAcademicYear === annex.academicYear && (
              <>
                {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
                  <button
                    className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                    onClick={() => editAnnex(annex._id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    View Financial Report
                  </button>
                )}
              </>
            )}
            {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
              <button className="btn btn-ghost btn-sm" onClick={openPDFInNewTab}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            )}
          </div>
        </div>
        {currentAcademicYear === annex.academicYear && (
          <div className="mt-4 space-y-4">
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
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => onUpdateRemarks(annex._id, "socc", soccRemarks)}
                  >
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
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => onUpdateRemarks(annex._id, "osa", osaRemarks)}
                  >
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
        )}
      </div>
    </div>
  );
}
