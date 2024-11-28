"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FileText, Edit, Send, Download, PenTool, Upload, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import axios from "axios";
import BackButton from "@/components/BackButton";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

type FinancialReport = {
  endingBalance: number;
};

type Outflow = {
  _id: string;
  establishment: string;
  date: Date;
  totalCost: number;
  image: string;
  event: {
    title: string;
  };
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

type Signature = {
  name: string;
  signatureUrl: string;
};

type Adviser = {
  name: string;
  faculty: string;
  email: string;
  mobile: string;
  cv?: string;
  officeAddress1?: string;
  officeAddress2?: string;
  signature: string;
};

type Officer = {
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  affiliation: string;
  mobileNumber: string;
  email: string;
  gwa: string;
  signature: string;
};

type AnnexA = {
  _id: string;
  academicYear: string;
  academicYearOfLastRecognition: string;
  affiliation: string;
  officialEmail: string;
  officialWebsite: string;
  organizationSocials: string[];
  category: string;
  strategicDirectionalAreas: string[];
  mission: string;
  vision: string;
  description: string;
  objectives: string[];
  startingBalance: number;
  advisers: Adviser[];
  officers: Officer[];
  outgoingSecretary: Signature;
  incomingSecretary: Signature;
  outgoingTreasurer: Signature;
  incomingTreasurer: Signature;
  outgoingPresident: Signature;
  incomingPresident: Signature;
  organization: {
    name: string;
  };
  members: string[];
  outflows: Outflow[];
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
};

type UserPosition = {
  role: string;
  organizationName: string;
};

type SignaturePosition =
  | "outgoingSecretary"
  | "incomingSecretary"
  | "outgoingTreasurer"
  | "incomingTreasurer"
  | "outgoingPresident"
  | "incomingPresident";

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
    borderWidth: 1,
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

  bannerlogo: {
    fontFamily: "Arial Narrow Bold",
    backgroundColor: "#FFFFFF",
    //borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 15,
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    position: "relative",
    marginTop: 10,
    flexDirection: "row",
    //justifyContent: "space-between",
  },
});

const MyDocument: React.FC<{ annex: AnnexA; inflows: Inflow[]; financialReport: FinancialReport }> = ({
  annex,
  inflows,
  financialReport,
}) => {
  const membershipFeeInflow = inflows.find((inflow) => inflow.category === "Membership Fee");
  const membershipFeeAmount = membershipFeeInflow ? membershipFeeInflow.amount : 0;
  const membershipFeePaidMembers = membershipFeeInflow ? membershipFeeInflow.totalMembers : 0;
  const membershipFeePerMember = membershipFeePaidMembers > 0 ? membershipFeeAmount / membershipFeePaidMembers : 0;

  const otherFundsRaised = inflows.filter((inflow) => inflow.category !== "Membership Fee");

  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="portrait">
        {/* Header */}
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>ANNEX A</Text>
          <Text
            style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          ></Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Student Organization General Information Report
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
            {"\n"}
            {"\n"}
            <EmphasizedText> UNIVERSITY OF SANTO TOMAS </EmphasizedText>
            {"\n"}
            Office for Student Affairs
            {"\n"}
            {"\n"}
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
            <Text style={[styles.tableCell, { flex: 2.15, fontSize: 8 }]}>
              {annex.affiliation === "University Wide"
                ? "Name of the Organization: [ x ] UNIV-WIDE [ ] COLLEGE-BASED"
                : "Name of the Organization: [ ] UNIV-WIDE [ x ] COLLEGE-BASED"}
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.organization.name}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 1.7, fontSize: 8 }]}>
              Academic Year of last Recognition:
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.academicYearOfLastRecognition}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 0.75, fontSize: 8, borderBottom: 0 }]}>
              Starting Fund for AY 2024-2025:{"\n"}
              <Text style={[{ fontSize: 7 }]}>As reflected on the ending balance of Annex E1</Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2.15, fontSize: 8 }]}>
              Faculty / College / Institute / School Affiliation:
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.affiliation}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 1.7, fontSize: 8 }]}>
              Official Email address of the Organization:
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.officialEmail}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 0.75, fontSize: 8, borderTop: 0, borderBottom: 0 }]}>PhP</Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2.15, fontSize: 8 }]}>
              Official Organization Website:
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.officialWebsite}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 1.7, fontSize: 8 }]}>
              Organization’s Social Networking Pages/Sites:
              <Br />{" "}
              {annex.organizationSocials && annex.organizationSocials.length > 0 ? (
                annex.organizationSocials.map((social, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 12,
                      borderTop: 0,
                      borderBottom: 0,
                      fontFamily: "Arial Narrow Bold",
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    {social}{" "}
                  </Text>
                ))
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    borderTop: 0,
                    borderBottom: 0,
                    fontFamily: "Arial Narrow Bold",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Twtur{" "}
                </Text>
              )}
            </Text>
            <Text
              style={[
                styles.tableCell,
                {
                  display: "flex",
                  flex: 0.75,
                  fontSize: 15,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                },
              ]}
            >
              {annex.startingBalance.toFixed(2)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2.15, fontSize: 8 }]}>
              Student Organization Category:
              <Br />{" "}
              <Text
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                }}
              >
                {" "}
                {annex.category}{" "}
              </Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 1.7, fontSize: 8 }]}>
              Strategic Directional Areas (SDAs):
              <Br />{" "}
              <View
                style={{
                  fontSize: 12,
                  borderTop: 0,
                  borderBottom: 0,
                  fontFamily: "Arial Narrow Bold",
                  textAlign: "center",
                  flexDirection: "column", // Set flexDirection to column
                  display: "flex", // Ensure display is set to flex
                }}
              >
                {annex.strategicDirectionalAreas && annex.strategicDirectionalAreas.length > 0 ? (
                  annex.strategicDirectionalAreas.map((area, index) => (
                    <Text key={index} style={{ marginBottom: 4 }}>
                      {" "}
                      {area}{" "}
                    </Text> // Add marginBottom for spacing
                  ))
                ) : (
                  <Text> </Text>
                )}
              </View>
            </Text>
            <Text style={[styles.tableCell, { flex: 0.75, fontSize: 8, borderTop: 0 }]}></Text>
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
            <Text style={[{ color: "#808080" }]}>Mission:</Text>
            <Text>{annex.mission || "No mission statement provided."}</Text>
            {"\n"}
            {"\n"} <Br />
          </View>

          <View style={styles.section}>
            <Text style={[{ color: "#808080" }]}>Vision:</Text>
            <Text>{annex.vision || "No vision statement provided."}</Text>
            {"\n"}
            {"\n"}
          </View>

          <View style={styles.section}>
            <Text style={[{ color: "#808080" }]}>Brief Description of the Organization:</Text>
            <Text>{annex.description || "No description provided."}</Text>
            {"\n"}
            {"\n"}
          </View>

          <View style={styles.section}>
            <Text style={[{ color: "#808080" }]}>
              Objectives for AY {annex.academicYear || "N/A"} - SMART (Specific, Measurable, Attainable, Realistic,
              Time-bound):
            </Text>
            {annex.objectives && annex.objectives.length > 0 ? (
              annex.objectives.map((objective, index) => (
                <Text key={index}>
                  {index + 1}. {objective}
                  {"\n"}
                </Text>
              ))
            ) : (
              <Text>No objectives provided.</Text>
            )}
            {/* Add extra line breaks to maintain spacing */}
            {annex.objectives &&
              [...Array(Math.max(0, 29 - annex.objectives.length))].map((_, index) => (
                <Text key={`empty-${index}`}>{"\n"}</Text>
              ))}
          </View>
        </View>

        <View>
          <Text>Officer's Information</Text>
        </View>

        <View style={[styles.table, {}]}>
          {/* Header Row */}
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, { flex: 0.5, fontSize: 8, textAlign: "center" }]}>Annex</Text>
            <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>Name of Officer</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Position</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>
              Faculty / College / Institute and Student Number (ex. ICS - 2012081820)
            </Text>
            <Text style={[styles.tableCell, { flex: 0.75, fontSize: 8, textAlign: "center" }]}>Contact No.</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Email Address</Text>
            <Text style={[styles.tableCell, { flex: 0.5, fontSize: 8, textAlign: "center" }]}>GWA</Text>
          </View>

          {/* Officer Rows */}
          {annex.officers && annex.officers.length > 0 ? (
            annex.officers.map((officer, index) => (
              <View key={index} style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 0.5, fontSize: 8, textAlign: "center" }]}>A - {index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>
                  {`${officer.firstName} ${officer.middleName ? officer.middleName.charAt(0) + "." : ""} ${
                    officer.lastName
                  }`}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>
                  {officer.position}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>
                  {officer.affiliation}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.75, fontSize: 8, textAlign: "center" }]}>
                  {officer.mobileNumber}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>
                  {officer.email}
                </Text>
                <Text style={[styles.tableCell, { flex: 0.5, fontSize: 8, textAlign: "center" }]}>{officer.gwa}</Text>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, {}]}>
              <Text style={[styles.tableCell, { flex: 7.25, fontSize: 8, textAlign: "center" }]}>
                No officers information available
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text>{"\n"}Organization Adviser</Text>
        </View>

        {annex.advisers && annex.advisers.length > 0 ? (
          annex.advisers.map((adviser, index) => (
            <View key={index} style={[styles.table, { marginBottom: 10 }]}>
              <View style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>Name: {adviser.name}</Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>Cell no: {adviser.mobile}</Text>
              </View>

              <View style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>E-mail Address: {adviser.email}</Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>
                  Address 1: {adviser.officeAddress1 || ""}
                </Text>
              </View>

              <View style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>
                  Faculty / College / Institute / School: {adviser.faculty}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8 }]}>
                  Address 2: {adviser.officeAddress2 || ""}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.table, {}]}>
            <View style={[styles.tableRow, {}]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                No adviser information available
              </Text>
            </View>
          </View>
        )}

        <View>
          <Text>{"\n"}Specimen Signatures</Text>
        </View>

        <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, { flex: 0.35, fontSize: 8, textAlign: "center" }]}>Annex</Text>
            <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>Name of Officer</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
          </View>

          {annex.officers && annex.officers.length > 0 ? (
            annex.officers.map((officer, index) => (
              <View key={index} style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 0.35, fontSize: 8, textAlign: "center" }]}>
                  A - {index + 1}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>
                  {`${officer.firstName} ${officer.middleName ? officer.middleName.charAt(0) + "." : ""} ${
                    officer.lastName
                  }`}
                </Text>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {officer.signature && <Image src={officer.signature} style={{ width: 50, height: 25 }} />}
                </View>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {officer.signature && <Image src={officer.signature} style={{ width: 50, height: 25 }} />}
                </View>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {officer.signature && <Image src={officer.signature} style={{ width: 50, height: 25 }} />}
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, {}]}>
              <Text style={[styles.tableCell, { flex: 5.85, fontSize: 8, textAlign: "center" }]}>
                No officers information available
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text>
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}
          </Text>
        </View>

        <View style={[styles.table, {}]}>
          <View style={[styles.tableRow, {}]}>
            <Text style={[styles.tableCell, { flex: 0.35, fontSize: 8, textAlign: "center" }]}> </Text>
            <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>Name of Adviser</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
            <Text style={[styles.tableCell, { flex: 1.25, fontSize: 8, textAlign: "center" }]}>Signature</Text>
          </View>

          {annex.advisers && annex.advisers.length > 0 ? (
            annex.advisers.map((adviser, index) => (
              <View key={index} style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 0.35, fontSize: 8, textAlign: "center" }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 1.75, fontSize: 8, textAlign: "center" }]}>{adviser.name}</Text>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {adviser.signature && <Image src={adviser.signature} style={{ width: 50, height: 25 }} />}
                </View>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {adviser.signature && <Image src={adviser.signature} style={{ width: 50, height: 25 }} />}
                </View>
                <View style={[styles.tableCell, { flex: 1.25, justifyContent: "center", alignItems: "center" }]}>
                  {adviser.signature && <Image src={adviser.signature} style={{ width: 50, height: 25 }} />}
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, {}]}>
              <Text style={[styles.tableCell, { flex: 5.85, fontSize: 8, textAlign: "center" }]}>
                No adviser information available
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text style={[{ fontSize: 10 }]}>
            {"\n"}Total number of members as of filing of the Petition is {annex.members.length} as evidence by the list
            of members attached as Annex B.{"\n"}
          </Text>
        </View>

        <View>
          <Text>
            {"\n"}
            <EmphasizedText>Financial Status</EmphasizedText> (Summary of Financial status){"\n"}
          </Text>
        </View>

        <View>
          <Text style={{ paddingLeft: 25 }}>
            {"\n"}
            <EmphasizedText>
              A. Starting fund (as reflected in the application for recognition AY 2023 - 2024)
            </EmphasizedText>
            {"\n"}
          </Text>
          <Text style={{ paddingLeft: 70 }}>
            {"\n"}
            <EmphasizedText>PhP {annex.startingBalance}</EmphasizedText>
            {"\n"}
          </Text>
        </View>

        <View>
          <Text style={{ paddingLeft: 25 }}>
            {"\n"}
            <EmphasizedText>B. Membership fees (indicate amount per member X no. of members)</EmphasizedText>
            {"\n"}
          </Text>
          <Text style={{ paddingLeft: 70 }}>
            {"\n"}
            <EmphasizedText>
              PhP {membershipFeePerMember.toFixed(2)} X {membershipFeePaidMembers}
            </EmphasizedText>
            {"\n"}
          </Text>
          <Text style={{ paddingLeft: 100, paddingTop: -10 }}>
            {"\n"}(Amount of Membership Fee) (No. of Members Paid){"\n"}
          </Text>
        </View>

        <View>
          <Text style={{ paddingLeft: 70 }}>
            {"\n"}
            <EmphasizedText>TOTAL AMOUNT COLLECTED</EmphasizedText>
            {"\n"}
          </Text>
          <Text style={{ paddingLeft: 70 }}>
            {"\n"}
            <EmphasizedText>FROM THE MEMBERSHIP FEE: PhP {membershipFeeAmount.toFixed(2)}</EmphasizedText>
            {"\n"}
          </Text>

          <View>
            <Text style={{ paddingLeft: 25 }}>
              {"\n"}
              <EmphasizedText>C. Other funds raised</EmphasizedText>
              {"\n"}
            </Text>

            <View style={[styles.table, {}]}>
              <View style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                  <EmphasizedText>Title of Activity</EmphasizedText>
                </Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                  <EmphasizedText>Total Amount Raised</EmphasizedText>
                </Text>
              </View>
              {otherFundsRaised.map((inflow, index) => (
                <View key={index} style={[styles.tableRow, {}]}>
                  <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                    {inflow.category}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                    {inflow.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
              {otherFundsRaised.length === 0 && (
                <View style={[styles.tableRow, {}]}>
                  <Text style={[styles.tableCell, { flex: 2, fontSize: 8, textAlign: "center" }]}>
                    No other funds raised
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text style={{ paddingLeft: 25 }}>
                {"\n"}
                <EmphasizedText>D. Expenditures </EmphasizedText> (indicate the activity for which the amount was
                utilized){"\n"}
              </Text>
            </View>
            <View style={[styles.table, {}]}>
              <View style={[styles.tableRow, {}]}>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                  <EmphasizedText>Title of Activity</EmphasizedText>
                </Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                  <EmphasizedText>Cost/Expenses</EmphasizedText>
                </Text>
              </View>
              {annex.outflows && annex.outflows.length > 0 ? (
                annex.outflows.map((outflow, index) => (
                  <View key={index} style={[styles.tableRow, {}]}>
                    <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                      {outflow.event.title}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "center" }]}>
                      {outflow.totalCost.toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={[styles.tableRow, {}]}>
                  <Text style={[styles.tableCell, { flex: 2, fontSize: 8, textAlign: "center" }]}>
                    No expenditures recorded
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View>
            <Text style={{ paddingLeft: 25 }}>
              {"\n"}
              <EmphasizedText>E. Total Cash PhP {financialReport.endingBalance ?? ""}</EmphasizedText>
              {"\n"}
            </Text>
            <Text style={{ paddingLeft: 50, paddingTop: -10 }}>
              {"\n"}
              <EmphasizedText>On Hand PhP {financialReport.endingBalance ?? ""}</EmphasizedText>
              {"\n"}
            </Text>
            <Text style={{ paddingLeft: 50, paddingTop: -20 }}>
              {"\n"}
              <EmphasizedText>On Bank PhP _____________________________</EmphasizedText>
              {"\n"}
            </Text>
          </View>

          <View>
            <Text style={{ paddingLeft: 30, paddingTop: -20 }}>
              {"\n"}
              <EmphasizedText>o Name of Bank ____________________ Location of Bank ___________________</EmphasizedText>
              {"\n"}
            </Text>
            <Text style={{ paddingLeft: 50, paddingTop: -30 }}>
              {"\n"}
              <EmphasizedText>Account Name ____________________ Account Number ___________________</EmphasizedText>
              {"\n"}
            </Text>
            <Text style={{ paddingLeft: 30, paddingTop: -15 }}>
              {"\n"}
              <EmphasizedText>o No Bank Account</EmphasizedText>
              {"\n"}
              {"\n"}
            </Text>
          </View>

          <View style={[styles.table, {}]}>
            <View style={[styles.tableRow, {}]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "left" }]}>
                Prepared by: (Secretary)
              </Text>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "left" }]}>Noted by: (Treasurer)</Text>
              <Text style={[styles.tableCell, { flex: 1, fontSize: 8, textAlign: "left" }]}>
                Approved by: (President)
              </Text>
            </View>

            <View style={[styles.tableRow, {}]}>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Outgoing:</Text>
                {annex.outgoingSecretary?.signatureUrl && (
                  <Image
                    src={annex.outgoingSecretary.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.outgoingSecretary?.name || ""}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Outgoing:</Text>
                {annex.outgoingTreasurer?.signatureUrl && (
                  <Image
                    src={annex.outgoingTreasurer.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.outgoingTreasurer?.name || ""}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Outgoing:</Text>
                {annex.outgoingPresident?.signatureUrl && (
                  <Image
                    src={annex.outgoingPresident.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.outgoingPresident?.name || ""}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRow, {}]}>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Incoming:</Text>
                {annex.incomingSecretary?.signatureUrl && (
                  <Image
                    src={annex.incomingSecretary.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.incomingSecretary?.name || ""}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Incoming:</Text>
                {annex.incomingTreasurer?.signatureUrl && (
                  <Image
                    src={annex.incomingTreasurer.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.incomingTreasurer?.name || ""}
                </Text>
              </View>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={{ fontSize: 8, textAlign: "left" }}>Incoming:</Text>
                {annex.incomingPresident?.signatureUrl && (
                  <Image
                    src={annex.incomingPresident.signatureUrl}
                    style={{ width: 50, height: 25, alignSelf: "center", marginTop: 5 }}
                  />
                )}
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 5 }}>
                  {annex.incomingPresident?.name || ""}
                </Text>
              </View>
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
    <Text style={{ textAlign: "right", color: "#000" }}>UST:S030-00-FO103</Text>
    <Text>All rights reserved by the Office for Student Affairs</Text>
  </View>
);

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

export default function AnnexAManager() {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { organizationId } = useParams();
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexA | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [inflows, setInflows] = useState<Inflow[]>([]);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);

  useEffect(() => {
    if (organizationId) {
      fetchAnnexes();
    }
  }, [organizationId]);

  const fetchInflows = useCallback(
    async (annexId: string) => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-a/${annexId}/fetch-inflows`);
        setInflows(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching inflows:", error);
        return [];
      }
    },
    [organizationId]
  );

  const fetchFinancialReport = useCallback(
    async (annexId: string) => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-a/${annexId}/fetch-financial-report`);
        setFinancialReport(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching financial report:", error);
        return null;
      }
    },
    [organizationId]
  );

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-a`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editAnnex = (id: string) => {
    router.push(`/organizations/${organizationId}/annexA/${id}`);
  };

  const generatePDFBlob = async (
    annex: AnnexA,
    inflowsData: Inflow[],
    financialReportData: FinancialReport
  ): Promise<Blob> => {
    try {
      console.log("Generating PDF for Annex A:", annex._id);
      console.log("Inflows:", inflowsData);
      console.log("Financial Report:", financialReportData);
      const annexPdf = pdf(<MyDocument annex={annex} inflows={inflowsData} financialReport={financialReportData} />);
      const annexBlob = await annexPdf.toBlob();
      console.log("Annex A PDF blob generated. Size:", annexBlob.size, "bytes");
      return annexBlob;
    } catch (error) {
      console.error("Error generating Annex A PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexA) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const fetchedInflows = await fetchInflows(annex._id);
      const fetchedFinancialReport = await fetchFinancialReport(annex._id);
      const blob = await generatePDFBlob(updatedAnnex, fetchedInflows, fetchedFinancialReport);
      const url = URL.createObjectURL(blob);
      console.log("PDF URL:", url);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexA> => {
    const response = await axios.get(`/api/annexes/${organizationId}/annex-a/${annexId}`);
    console.log("Fetched annex data:", response.data);
    return response.data;
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-a/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-a/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-a/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-a/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX A Student Organizations General Information Report</h1>
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
              generatePDF={generatePDF}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Student Organizations General Information Report Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexA;
  editAnnex: (id: string) => void;
  generatePDF: (annex: AnnexA) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  editAnnex,
  generatePDF,
  onSubmit,
  onUpdateRemarks,
  onApprove,
  onDisapprove,
  session,
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
              Student Organizations General Information Report Annex for AY {annex.academicYear}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
              <button
                className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                onClick={() => editAnnex(annex._id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Annex Details
              </button>
            )}

            <button className="btn btn-outline btn-sm" onClick={() => generatePDF(annex)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
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
    </div>
  );
}
