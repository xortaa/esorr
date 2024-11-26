"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Page, Text, View, Document, StyleSheet, pdf, Font, Image } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
});

type Organization = {
  name: string;
  affiliation: string;
  levelOfRecognition: string;
  academicYearOfLastRecognition: string;
};

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
    backgroundColor: "#FFFFCC",
  },
  header: {
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    marginBottom: 15,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "right",
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
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tablelegend: {
    display: "flex",
    width: 350,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tablereso: {
    display: "flex",
    width: 450,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tablelist: {
    display: "flex",
    width: 500,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000", // Black underline color
    marginBottom: 10,
    width: "100%",
  },
  signatureText: {
    textAlign: "left",
    marginBottom: 10,
  },
  signatureSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    marginTop: 10,
    width: "100%",
    textAlign: "left",
  },
  signatureDetails: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

const MyDocument: React.FC<{ organizations: Organization[] }> = ({ organizations }) => {
  const currentYear = new Date().getFullYear();
  const currentAcademicYear = `${currentYear}-${currentYear + 1}`;
  const previousAcademicYear = `${currentYear - 1}-${currentYear}`;

  // Helper function to group organizations by affiliation
  const groupByAffiliation = (orgs: Organization[]) => {
    return orgs.reduce((acc, org) => {
      const key = org.affiliation;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(org);
      return acc;
    }, {} as Record<string, Organization[]>);
  };

  const groupedOrganizations = groupByAffiliation(organizations);

  // Helper function to render organization rows
  const renderOrganizationRows = (orgs: Organization[]) => {
    return orgs.map((org, index) => (
      <View key={index} style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 0.2 }]}>
          <Text style={{ fontSize: 11, textAlign: "center" }}>{index + 1}.</Text>
        </Text>
        <Text style={[styles.tableCell, { flex: 2.5 }]}>
          <Text style={{ fontSize: 11, textAlign: "center" }}>{org.name}</Text>
        </Text>
        <Text style={[styles.tableCell, {}]}>
          <Text style={{ fontSize: 11, textAlign: "left" }}>{org.levelOfRecognition}</Text>
        </Text>
      </View>
    ));
  };

  // Helper function to render affiliation section
  const renderAffiliationSection = (title: string, affiliationKey: string) => {
    const orgs = groupedOrganizations[affiliationKey];
    if (!orgs || orgs.length === 0) return null;

    const filteredOrgs = orgs.filter((org) => org.academicYearOfLastRecognition !== previousAcademicYear);

    if (filteredOrgs.length === 0) return null;

    return (
      <>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 0.2, backgroundColor: "gray" }]}>
            <Text style={{ fontSize: 11, textAlign: "center" }}></Text>
          </Text>
          <Text style={[styles.tableCell, { flex: 2.5, backgroundColor: "gray" }]}>
            <Text style={{ fontSize: 11, textAlign: "center" }}>{title}</Text>
          </Text>
          <Text style={[styles.tableCell, { backgroundColor: "gray" }]}>
            <Text style={{ fontSize: 11, textAlign: "left" }}></Text>
          </Text>
        </View>
        {renderOrganizationRows(filteredOrgs)}
      </>
    );
  };

  // Filter organizations for Petitioning New Organizations section
  const petitioningNewOrgs = organizations.filter((org) => org.academicYearOfLastRecognition === previousAcademicYear);
  return (
    <Document>
      <Page style={[styles.page, { fontFamily: "Times-Roman" }]} size="LEGAL" orientation="portrait">
        {/* Header */}
        <Image src="/assets/UST.png" style={{ width: 75, height: 75, marginHorizontal: "auto" }} />
        <View style={[styles.header, { textAlign: "center", fontFamily: "Times-Bold" }]}>
          <Text>UNIVERSITY OF SANTO TOMAS</Text>
          <Text>Office for Student Affairs</Text>
          <Text>Espana Boulevard, Manila</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "left",
              fontFamily: "Times-Bold",
            }}
          >
            IN THE MATTER OF ACCREDITATION{"\n"}
            OF UNIVERSITY-WIDE AND COLLEGE-BASED{"\n"}
            STUDENT ORGANIZATIONS{"\n"}
            FOR THE ACADEMIC YEAR {currentAcademicYear}
            {"\n"}X --------------------------------------------------------------------------X
          </Text>
        </View>

        <View style={[styles.section, { fontFamily: "Times-Bold" }]}>
          <Text style={{ textAlign: "center", textDecoration: "underline" }}>
            Accreditation Control Number{"\n"}
            Inaugural Effectivity: last AY 2019-2020
          </Text>
          <Text style={{ textAlign: "left" }}>Legend:</Text>
        </View>

        <View style={[styles.tablelegend, { marginHorizontal: "auto" }]}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                <Text style={{ fontFamily: "Times-Bold" }}>RSO</Text>-A-24-25-01
              </Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                RSO stands for <Text style={{ fontFamily: "Times-Bold" }}>R</Text>ecognized{" "}
                <Text style={{ fontFamily: "Times-Bold" }}>S</Text>tudent{" "}
                <Text style={{ fontFamily: "Times-Bold" }}>O</Text>rganization
              </Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <View style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                RSO-<Text style={{ fontFamily: "Times-Bold" }}>A</Text>-24-25-01{"\n"}
                RSO-<Text style={{ fontFamily: "Times-Bold" }}>B</Text>-24-25-01{"\n"}
                RSO-<Text style={{ fontFamily: "Times-Bold" }}>C</Text>-24-25-01
              </Text>
            </View>

            {/* Column 2 */}
            <View style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                A, B, C, D refers to the Accreditation Status of the Student{"\n"}
                Organization described in this Resolution{"\n"}
              </Text>
              <Text style={{ fontSize: 11, textAlign: "left", paddingLeft: 10 }}>
                A- Full Accreditation for 3 years{"\n"}
                B- Full Accreditation for 2 years{"\n"}
                C- Full Accreditation for 1 year (Probationary)
              </Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                RSO-A-<Text style={{ fontFamily: "Times-Bold" }}>24-25</Text>-01{"\n"}
              </Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                <Text style={{ fontFamily: "Times-Bold" }}>24-25</Text> indicates the coverage academic year of
                recognition{"\n"}
                i.e. Academic Year 20<Text style={{ fontFamily: "Times-Bold" }}>24</Text>-20
                <Text style={{ fontFamily: "Times-Bold" }}>25</Text>
              </Text>
            </Text>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                RSO-A-24-25-<Text style={{ fontFamily: "Times-Bold" }}>01</Text>
                {"\n"}
              </Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "justify" }}>
                <Text style={{ fontFamily: "Times-Bold" }}>01</Text> refers to the identification number (ID number) of
                the student organization who submitted the documentary requirements for recognition for this AY
                2024-2025
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ textAlign: "center", fontFamily: "Times-Bold" }}>
            <Text style={{ fontSize: 20 }}>RESOLUTION</Text>
            {"\n"}
            (as of 30 September 2024){"\n"}
            {"\n"}
          </Text>
          <Text style={{ textAlign: "justify" }}>
            Before this Office are petitions filed by thirty-one (31) University-wide Organization (USO)and one hundred
            and twenty-four (124) College-based Student Organizations (CBO) requesting that they be granted recognition
            pursuant to the provisions of the Rules and Procedures for Recognition of Student Organizations issued by
            this Office. After considering all the documents submitted and their active participation in the 2024
            Student Organizations’ Coordinating Council’s Leadership Training Seminar, this Office determined the
            following Accreditation Status:
          </Text>
        </View>

        <View style={styles.tablereso}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center", fontFamily: "Times-Bold" }}>ACCREDITATION STATUS</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center", fontFamily: "Times-Bold" }}>DESCRIPTION</Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={[styles.tableRow, { fontSize: 9 }]}>
            {/* Column 1 */}
            <View style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center", fontFamily: "Times-Bold" }}>A</Text>
            </View>

            {/* Column 2 */}
            <View style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left", fontFamily: "Times-Bold" }}>
                Full Accreditation for 3 years
              </Text>
            </View>

            <View style={[styles.tableCell, { flex: 1.275, textAlign: "justify" }]}>
              <Text style={{ fontSize: 11 }}>
                Student organizations that complied with the Rules and Procedures for Recognition of Student
                Organizations. They need to accomplish activities (OSG-approved), including but not limited to:
              </Text>
              {"\n"}
              <View style={{ paddingLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    1 General Assembly{" "}
                    <Text style={{ fontFamily: "Times-BoldItalic", fontSize: 8 }}>
                      (during the 1st Term - OSG C189)
                    </Text>{" "}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Year-end Assembly and Report</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>2 Major Activities as main organizers</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Community Service (complete phases)</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>Proof of Participation during the recruitment period</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    Active Involvement in OSA-initiated or University-wide activities
                  </Text>
                </View>
              </View>
              <Text>
                {"\n"}
                The organization will be granted 3 years of full accreditation, provided that they will need to submit a
                Financial Liquidation Report for every activity, a Summary of Receipts and Disbursements (Annex
                E-1/E-2), and an Activities’ Monitoring Form (Annex F) at the end of the academic year. This will be
                closely monitored and administered by the following offices:
              </Text>
              <View style={{ marginLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row", marginRight: 2 }}>
                  <Text>1.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for University-wide Organizations - {"\n"}Office for Student Affairs
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>2.</Text>
                  <Text style={{ paddingLeft: 7 }}>for College-based Organizations - {"\n"}Office of the Dean</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>3.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are College-based - {"\n"}Dean’s office in coordination
                    with Center for Campus Ministry
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>4.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are University-wide Organizations - {"\n"}Center for
                    Campus Ministry for submission to OSA
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <View style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center", fontFamily: "Times-Bold" }}>B</Text>
            </View>

            {/* Column 2 */}
            <View style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left", fontFamily: "Times-Bold" }}>
                Full Accreditation for 2 years
              </Text>
            </View>

            <View style={[styles.tableCell, { flex: 1.275, textAlign: "justify" }]}>
              <Text style={{ fontSize: 11 }}>
                Student organizations that complied with the Rules and Procedures for Recognition of Student
                Organizations. They need to accomplish activities (OSG-approved), including but not limited to:
              </Text>
              {"\n"}
              <View style={{ paddingLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    1 General Assembly{" "}
                    <Text style={{ fontFamily: "Times-BoldItalic", fontSize: 8 }}>
                      (during the 1st Term - OSG C189)
                    </Text>{" "}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Year-end Assembly and Report</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>3 Major Activities as main organizers</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Community Service (complete phases)</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>Proof of Participation during the recruitment period</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    Active Involvement in OSA-initiated or University-wide activities
                  </Text>
                </View>
              </View>
              <Text>
                {"\n"}
                The organization will be granted 3 years of full accreditation, provided that they will need to submit a
                Financial Liquidation Report for every activity, a Summary of Receipts and Disbursements (Annex
                E-1/E-2), and an Activities’ Monitoring Form (Annex F) at the end of the academic year. This will be
                closely monitored and administered by the following offices:
              </Text>
              <View style={{ marginLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row", marginRight: 2 }}>
                  <Text>1.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for University-wide Organizations - {"\n"}Office for Student Affairs
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>2.</Text>
                  <Text style={{ paddingLeft: 7 }}>for College-based Organizations - {"\n"}Office of the Dean</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>3.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are College-based - {"\n"}Dean’s office in coordination
                    with Center for Campus Ministry
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>4.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are University-wide Organizations - {"\n"}Center for
                    Campus Ministry for submission to OSA
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center", fontFamily: "Times-Bold" }}>C</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left", fontFamily: "Times-Bold" }}>
                Full Accreditation For 1 year {"\n"} (Probationary)
              </Text>
            </Text>

            <View style={[styles.tableCell, { flex: 1.275, textAlign: "justify" }]}>
              <Text style={{ fontSize: 11 }}>This applies to the following:</Text>
              <View style={{ paddingLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    Returning Student Organization(s) whose status was/were suspended/denied and/or remained inactive
                    for 1 to 4 years.
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    New Student Organizations that successfully passed the preliminary screening and evaluation of its
                    Articles of Association conducted by the OSA Panel of Coordinators/Evaluators
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    Student Organizations who failed to accomplish all required activities.
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 11 }}>
                Student organizations that complied with the Rules and Procedures for Recognition of Student
                Organizations. They need to accomplish activities (OSG-approved), including but not limited to:
              </Text>
              {"\n"}
              <View style={{ paddingLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    1 General Assembly{" "}
                    <Text style={{ fontFamily: "Times-BoldItalic", fontSize: 8 }}>
                      (during the 1st Term - OSG C189)
                    </Text>{" "}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Year-end Assembly and Report</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>2 Major Activities as main organizers</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>1 Community Service (complete phases)</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>Proof of Participation during the recruitment period</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>•</Text>
                  <Text style={{ paddingLeft: 10 }}>
                    Active Involvement in OSA-initiated or University-wide activities
                  </Text>
                </View>
              </View>
              <Text>
                {"\n"}
                The organization will be granted 3 years of full accreditation, provided that they will need to submit a
                Financial Liquidation Report for every activity, a Summary of Receipts and Disbursements (Annex
                E-1/E-2), and an Activities’ Monitoring Form (Annex F) at the end of the academic year. This will be
                closely monitored and administered by the following offices:
              </Text>
              <View style={{ marginLeft: 10, width: "90%", paddingTop: 10 }}>
                <View style={{ flexDirection: "row", marginRight: 2 }}>
                  <Text>1.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for University-wide Organizations - {"\n"}Office for Student Affairs
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>2.</Text>
                  <Text style={{ paddingLeft: 7 }}>for College-based Organizations - {"\n"}Office of the Dean</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>3.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are College-based - {"\n"}Dean’s office in coordination
                    with Center for Campus Ministry
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>4.</Text>
                  <Text style={{ paddingLeft: 7 }}>
                    for Student Religious Organizations which are University-wide Organizations - {"\n"}Center for
                    Campus Ministry for submission to OSA
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}></Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>Pending Accreditation</Text>
            </Text>

            <Text style={[styles.tableCell, { flex: 1.275 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                Student Organizations that have either:{"\n"}
                {"\n"}
                <Text style={{ fontFamily: "Times-Bold" }}>[#1] FAILED</Text> to attend the Office for Student Affairs’
                {"\n"}
                initiated activities as required by the Rules and{"\n"}
                Procedures for Recognition of Student Organizations{"\n"}
                for AY 2024-2025.{"\n"}
                {"\n"}
                <Text style={{ fontFamily: "Times-Bold" }}>[#2] FAILED</Text> to send representatives to the{"\n"}
                Leadership Training Seminar (LTS) as required by the{"\n"}
                Rules and Procedures for Recognition of Student{"\n"}
                Organizations for AY 2024-2025.{"\n"}
                {"\n"}
                <Text style={{ fontFamily: "Times-Bold" }}>[#3] FAILED </Text>to file the complete sets of documents.
              </Text>
            </Text>
          </View>
        </View>

        <View break style={styles.tablelist}>
          {renderAffiliationSection("University Wide Organizations", "University Wide")}
          {renderAffiliationSection("AMV - College of Accountancy", "College of Accountancy (ACCT)")}
          {renderAffiliationSection("Architecture", "College of Architecture (ARCHI)")}
          {renderAffiliationSection("Arts and Letters", "Faculty of Arts and Letters (AB)")}
          {renderAffiliationSection(
            "Commerce and Business Administration",
            "College of Commerce and Business Administration (COMM)"
          )}
          {renderAffiliationSection("CTHM", "College of Tourism and Hospitality Management (CTHM)")}
          {renderAffiliationSection("Education", "College of Education (EDUC)")}
          {renderAffiliationSection("Engineering", "Faculty of Engineering (ENGG)")}
          {renderAffiliationSection("Fine Arts & Design", "College of Fine Arts and Design (CFAD)")}
          {renderAffiliationSection("CICS", "College of Information and Computing Sciences (CICS)")}
          {renderAffiliationSection("Medicine & Surgery", "Faculty of Medicine and Surgery (MED)")}
          {renderAffiliationSection("Nursing", "College of Nursing (NUR)")}
          {renderAffiliationSection("Pharmacy", "Faculty of Pharmacy (PHARMA)")}
          {renderAffiliationSection("Rehabilitation Sciences", "College of Rehabilitation Sciences (CRS)")}
          {renderAffiliationSection("Science", "College of Science (SCI)")}
        </View>

        {petitioningNewOrgs.length > 0 && (
          <View style={styles.tablelist}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.2, backgroundColor: "gray" }]}>
                <Text style={{ fontSize: 11, textAlign: "center" }}></Text>
              </Text>
              <Text style={[styles.tableCell, { flex: 2.5, backgroundColor: "gray" }]}>
                <Text style={{ fontSize: 11, textAlign: "center" }}>Petitioning New Organizations</Text>
              </Text>
              <Text style={[styles.tableCell, { backgroundColor: "gray" }]}>
                <Text style={{ fontSize: 11, textAlign: "left" }}></Text>
              </Text>
            </View>
            {petitioningNewOrgs.map((org, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.2 }]}>
                  <Text style={{ fontSize: 11, textAlign: "center" }}>{index + 1}.</Text>
                </Text>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>
                  <Text style={{ fontSize: 11, textAlign: "center" }}>{org.name}</Text>
                </Text>
                <Text style={[styles.tableCell, {}]}>
                  <Text style={{ fontSize: 11, textAlign: "left" }}>{org.levelOfRecognition}</Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "justify",
            }}
          >
            WHEREFORE, the petition for recognition of<Text style={{ fontFamily: "Times-Bold" }}> eight (8)</Text>{" "}
            student organizations listed under <Text style={{ fontFamily: "Times-Bold" }}>Group A</Text>, pursuant to
            the provisions of the Rules and Procedures for Recognition of Student Organizations, is hereby granted{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>FULL ACCREDITATION for 3 years</Text>. The petition for
            recognition of one hundred twenty-six (126) student organizations listed under{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>Group B</Text> is hereby granted{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>FULL ACCREDITATION for 2 years</Text>; the petition for
            recognition of twenty-one (21) student organizations listed under Group C is hereby granted{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>Probationary for 1 year</Text>
            {"\n"}
            {"\n"}
            WHEREFORE, the petitioning New Organizations listed under{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>Group C</Text> is hereby granted{" "}
            <Text style={{ fontFamily: "Times-Bold" }}>Probationary for 1 year</Text>
            {"\n"}
            {"\n"}
            WHEREFORE, all recognized student organizations, pursuant to the provisions in the Rules and Procedures for
            Recognition of Student Organizations, must comply with the Implementing Rules and Regulations for
            Accreditation status of the Office for Student Affairs (Annex A).{"\n"}
            {"\n"}
            So Ordered.{"\n"}
            {"\n"}
            30 September 2024
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Prepared by:{"\n"}
            {"\n"}
            Mr. Harold E. Ilano{"\n"}
            Mr. Alejandro Chrys V. Lopez{"\n"}
            Mr. Kennard A. Marteja{"\n"}
            {"\n"}
            Approved:
            {"\n"}
            {"\n"}
            {"\n"}
            Asst. Prof. Jaezamie V. Ong, MA{"\n"}
            Officer-In-Charge
            {"\n"}
            Copy furnished:{"\n"}
            {"\n"}
            Office of the Dean/Director{"\n"}
            Coordinator, Student Welfare and Development Committee{"\n"}
            Center for Campus Ministry{"\n"}
            Simbahayan Community Development Office{"\n"}
            Student Organizations Coordinating Council (SOCC){"\n"}
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>Page PAGENUM of TOTALNUM</Text>
    <Text>RESOLUTION ver. 01</Text>
  </View>
);

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState("");
  const [affiliationType, setAffiliationType] = useState("All");
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [submissionsStatus, setSubmissionsStatus] = useState({ submissionAllowed: true });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orgsResponse, affiliationsResponse, submissionStatusResponse] = await Promise.all([
        axios.get("/api/organizations"),
        axios.get("/api/affiliations"),
        axios.get("/api/organizations/fetch-submission-status"),
      ]);
      setOrganizations(orgsResponse.data);
      setAffiliations(affiliationsResponse.data);
      setSubmissionsStatus(submissionStatusResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      fetchData();
    }
  }, [status, session]);

  const filteredAffiliations = affiliations.filter((affiliation) =>
    affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
  );

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (affiliationType === "All" ||
        (affiliationType === "University Wide" && org.affiliation === "University Wide") ||
        (affiliationType === "Other" &&
          org.affiliation !== "University Wide" &&
          (selectedAffiliation === "" || org.affiliation === selectedAffiliation)))
  );

  const toggleSubmission = async () => {
    axios.post("/api/organizations/toggle-submissions").then(() => {
      const isAllowed = submissionsStatus.submissionAllowed;
      setSubmissionsStatus({ submissionAllowed: !isAllowed });
    });
  };

  if (status === "loading") {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </PageWrapper>
    );
  }

  if (status === "unauthenticated") {
    return (
      <PageWrapper>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please sign in to view organizations.</p>
          <Link href="/" className="btn btn-neutral">
            Back to Sign In Page
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const generatePDFBlob = async (accreditedOrgs) => {
    try {
      console.log("Generating PDF...", accreditedOrgs);
      const blob = await pdf(<MyDocument organizations={accreditedOrgs} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const generatePDF = async () => {
    try {
      setIsLoading(true);
      const accreditedOrgs = await fetchAccreditedOrgs();

      // Dynamically import the pdf function
      const { pdf } = await import("@react-pdf/renderer");

      const blob = await pdf(<MyDocument organizations={accreditedOrgs} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccreditedOrgs = async () => {
    const response = await axios.get("/api/organizations/fetch-accredited-orgs");
    return response.data;
  };

  return (
    <PageWrapper>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Organizations</h1>
          <p className="text-lg text-gray-600 mt-2">Browse all student organizations</p>
        </div>
        <button onClick={fetchData} className="btn btn-ghost btn-circle" aria-label="Refresh organizations">
          <RefreshCw size={20} />
        </button>
      </div>

      {session.user.role === "OSA" && !isLoading && (
        <div className="flex items-center justify-start gap-2">
          <button onClick={toggleSubmission} className="btn btn-primary" aria-label="Toggle submissions">
            {submissionsStatus.submissionAllowed ? "Disable" : "Enable"} Submissions
          </button>
          <button className="btn btn-outline" onClick={() => generatePDF()}>
            Download List of Accredited Organizations
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-between mb-8 gap-6">
        <div className="form-control w-full lg:w-1/3">
          <label className="label">
            <span className="label-text">Search organizations</span>
          </label>
          <label className="input-group">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-2/3">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Filter by type</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "University Wide", "Other"].map((type) => (
                <label key={type} className="label cursor-pointer">
                  <input
                    type="radio"
                    name="affiliation-type"
                    className="radio radio-primary mr-2"
                    checked={affiliationType === type}
                    onChange={() => setAffiliationType(type)}
                  />
                  <span className="label-text">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {affiliationType === "Other" && (
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Select affiliation</span>
              </label>
              <div className="dropdown w-full">
                <label tabIndex={0} className="btn btn-outline w-full justify-between">
                  {selectedAffiliation || "Select affiliation"}
                  <ChevronDown size={20} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-[1]"
                >
                  <li className="menu-title">
                    <span>Affiliations</span>
                  </li>
                  <li>
                    <input
                      type="text"
                      placeholder="Search affiliations"
                      className="input input-bordered w-full"
                      value={affiliationSearchTerm}
                      onChange={(e) => setAffiliationSearchTerm(e.target.value)}
                    />
                  </li>
                  {filteredAffiliations.map((affiliation) => (
                    <li key={affiliation._id}>
                      <a onClick={() => setSelectedAffiliation(affiliation.name)}>{affiliation.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard key={org._id} organization={org} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function OrganizationCard({ organization }) {
  const router = useRouter();
  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      onClick={() => router.push(`/organizations/${organization._id}`)}
    >
      <figure className="px-4 pt-4">
        <img
          src={organization.logo || "/placeholder.svg?height=192&width=256"}
          alt={organization.name}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{organization.name}</h2>
        <p className="text-sm text-gray-600">{organization.affiliation}</p>
        <div className="flex items-center text-sm">
          <span
            className={`badge ${
              organization.calculatedStatus === "Completed"
                ? "badge-primary"
                : organization.calculatedStatus === "Incomplete"
                ? "badge-ghost"
                : organization.calculatedStatus === "For Review"
                ? "badge-warning"
                : "badge-neutral"
            }`}
          >
            {organization.calculatedStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
