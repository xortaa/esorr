"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font } from "@react-pdf/renderer";

type Organization = {
  name: string;
  affiliation: string;
  levelOfRecognition: string;
  academicYearOfLastRecognition: string;
};

// Register Times New Roman and Arial Narrow fonts
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

// Create Document Component
const MyDocument: React.FC<{ organizations: Organization[]}> = ({ organizations }) => {
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
      <Page style={styles.page} size="LEGAL" orientation="portrait">
        {/* Header */}
        <View style={[styles.header, { textAlign: "center" }]}>
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
            }}
          >
            IN THE MATTER OF ACCREDITATION{"\n"}
            OF UNIVERSITY-WIDE AND COLLEGE-BASED{"\n"}
            STUDENT ORGANIZATIONS{"\n"}
            FOR THE ACADEMIC YEAR {currentAcademicYear}
            {"\n"}X --------------------------------------------------------------------------X
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ textAlign: "center", textDecoration: "underline" }}>
            Accreditation Control Number{"\n"}
            Inaugural Effectivity: last AY 2019-2020
          </Text>
          <Text style={{ textAlign: "left" }}>Legend:</Text>
        </View>

        <View style={styles.tablelegend}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>RSO-A-24-25-01</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>RSO stands for Recognized Student Organization</Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                RSO-A-24-25-01{"\n"}
                RSO-B-24-25-01{"\n"}
                RSO-C-24-25-01
              </Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                A, B, C, D refers to the Accreditation Status of the Student{"\n"}
                Organization described in this Resolution{"\n"}
                A- Full Accreditation for 3 years{"\n"}
                B- Full Accreditation for 2 years{"\n"}
                C- Full Accreditation for 1 year (Probationary)
              </Text>
            </Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>RSO-A-24-25-01{"\n"}</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                24-25 indicates the coverage academic year of recognition{"\n"}
                i.e. Academic Year 2024-2025
              </Text>
            </Text>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.5 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>RSO-A-24-25-01{"\n"}</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                01 refers to the identification number (ID number) of the student {"\n"}
                organization who submitted the documentary requirements for {"\n"}
                recognition for this AY 2024-2025
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ textAlign: "center", textDecoration: "underline" }}>
            RESOLUTION{"\n"}
            (as of 30 September 2024){"\n"}
            {"\n"}
          </Text>
          <Text style={{ textAlign: "justify" }}>
            Before this Office are petitions filed by thirty-one (31) University-wide Organization (USO){"\n"}
            and one hundred and twenty-four (124) College-based Student Organizations (CBO){"\n"}
            requesting that they be granted recognition pursuant to the provisions of the Rules and{"\n"}
            Procedures for Recognition of Student Organizations issued by this Office. After considering all{"\n"}
            the documents submitted and their active participation in the 2024 Student Organizations’{"\n"}
            Coordinating Council’s Leadership Training Seminar, this Office determined the following{"\n"}
            Accreditation Status:
          </Text>
        </View>

        <View style={styles.tablereso}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>ACCREDITATION STATUS</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>DESCRIPTION</Text>
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>A</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>
                Full Accreditation for 3{"\n"}
                years
              </Text>
            </Text>

            <Text style={[styles.tableCell, { flex: 1.275 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                Student organizations that complied with the Rules{"\n"}
                and Procedures for Recognition of Student{"\n"}
                Organizations. They need to accomplish activities{"\n"}
                (OSG-approved), including but not limited to:{"\n"}
                {"\n"}● 1 General Assembly (during the 1st Term - OSG C189){"\n"}● 1 Year-end Assembly and Report{"\n"}●
                2 Major Activities as main organizers{"\n"}● 1 Community Service (complete phases){"\n"}● Proof of
                Participation during the recruitment{"\n"}
                period{"\n"}● Active Involvement in OSA-initiated or{"\n"}
                University-wide activities{"\n"}
                The organization will be granted 3 years of full{"\n"}
                accreditation, provided that they will need to submit a{"\n"}
                Financial Liquidation Report for every activity, a{"\n"}
                Summary of Receipts and Disbursements (Annex{"\n"}
                E-1/E-2), and an Activities’ Monitoring Form (Annex{"\n"}
                F) at the end of the academic year. This will be closely{"\n"}
                monitored and administered by the following offices:{"\n"}
                1. for University-wide Organizations - Office for{"\n"}
                Student Affairs{"\n"}
                2. for College-based Organizations - Office of the{"\n"}
                Dean{"\n"}
                3. for Student Religious Organizations which are{"\n"}
                College-based - Dean’s office in coordination{"\n"}
                with Center for Campus Ministry{"\n"}
                4. for Student Religious Organizations which are{"\n"}
                University-wide Organizations - Center for{"\n"}
                Campus Ministry for submission to OSA{"\n"}
              </Text>
            </Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>B</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>
                Full Accreditation for 2{"\n"}
                years
              </Text>
            </Text>

            <Text style={[styles.tableCell, { flex: 1.275 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                Student organizations that complied with the Rules{"\n"}
                and Procedures for Recognition of Student{"\n"}
                Organizations for AY 2024-2025 but failed to comply{"\n"}
                and conduct required activities based on e-ReSERVe.{"\n"}
                They need to accomplish activities (OSG-approved),{"\n"}
                including but not limited to:{"\n"}● 1 General Assembly (during the 1st Term - OSG C189){"\n"}● 1
                Year-end Assembly and Report{"\n"}● 3 Major Activities as main organizers{"\n"}● 1 Community Service
                (complete phases){"\n"}● Proof of Participation during the recruitment{"\n"}
                period{"\n"}● Active Involvement in OSA-initiated or{"\n"}
                University-wide activities{"\n"}
                The organization will be granted 2 years of full{"\n"}
                accreditation, provided that they will need to submit a{"\n"}
                Financial Liquidation Report for every activity, a{"\n"}
                Summary of Receipts and Disbursements (Annex {"\n"}
                E-1/E-2), and an Activities’ Monitoring Form (Annex{"\n"}
                F) at the end of the academic year. This will be closely{"\n"}
                monitored and administered by the following offices:{"\n"}
                1. for University-wide Organizations - Office for{"\n"}
                Student Affairs{"\n"}
                2. for College-based Organizations - Office of the{"\n"}
                Dean{"\n"}
                3. for Student Religious Organizations which are{"\n"}
                College-Based - Dean’s office in coordination{"\n"}
                with Center for Campus Ministry{"\n"}
                4. for Student Religious Organizations which are{"\n"}
                University-wide Organizations - Center for{"\n"}
                Campus Ministry for submission to OSA
              </Text>
            </Text>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            {/* Column 1 */}
            <Text style={[styles.tableCell, { flex: 0.2 }]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>C</Text>
            </Text>

            {/* Column 2 */}
            <Text style={[styles.tableCell, {}]}>
              <Text style={{ fontSize: 11, textAlign: "center" }}>
                Full Accreditation {"\n"}
                For 1 year (Probationary)
              </Text>
            </Text>

            <Text style={[styles.tableCell, { flex: 1.275 }]}>
              <Text style={{ fontSize: 11, textAlign: "left" }}>
                This applies to the following:{"\n"}● Returning Student Organization(s) whose{"\n"}
                status was/were suspended/denied and/or{"\n"}
                remained inactive for 1 to 4 years.{"\n"}● New Student Organizations that successfully{"\n"}
                passed the preliminary screening and{"\n"}
                evaluation of its Articles of Association{"\n"}
                conducted by the OSA Panel of{"\n"}
                Coordinators/Evaluators.{"\n"}● Student Organizations who failed to{"\n"}
                accomplish all required activities.{"\n"}
                Student organizations that complied with the Rules{"\n"}
                and Procedures for Recognition of Student{"\n"}
                Organizations for AY 2024-2025. They need to strictly{"\n"}
                accomplish activities (OSG-approved), including but{"\n"}
                not limited to:{"\n"}● 1 General Assembly (during the 1st Term - OSG C189){"\n"}● 1 Year-end Assembly
                and Report{"\n"}● 2 Major Activities as main organizers{"\n"}● 1 Community Service (complete phases)
                {"\n"}● Proof of Participation during the recruitment{"\n"}
                period{"\n"}● Active Involvement in OSA-initiated or{"\n"}
                University-wide activities{"\n"}
                For Academic Year 2024-2025 only, organizations{"\n"}
                who were not able to fully comply with all the{"\n"}
                required activity during the AY 2023-2024, are to be{"\n"}
                monitored and put under PROBATIONARY period for{"\n"}a maximum of two (2) academic years.{"\n"}
              </Text>
            </Text>
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
                [#1] FAILED to attend the Office for Student Affairs’{"\n"}
                initiated activities as required by the Rules and{"\n"}
                Procedures for Recognition of Student Organizations{"\n"}
                for AY 2024-2025.{"\n"}
                {"\n"}
                [#2] FAILED to send representatives to the{"\n"}
                Leadership Training Seminar (LTS) as required by the{"\n"}
                Rules and Procedures for Recognition of Student{"\n"}
                Organizations for AY 2024-2025.{"\n"}
                {"\n"}
                [#3] FAILED to file the complete sets of documents.
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.tablelist}>
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
              textAlign: "left",
            }}
          >
            WHEREFORE, the petition for recognition of eight (8) student organizations listed under Group A, pursuant to
            the provisions of the Rules and Procedures for Recognition of Student Organizations, is hereby granted FULL
            ACCREDITATION for 3 years. The petition for recognition of one hundred twenty-six (126) student
            organizations listed under Group B is hereby granted FULL ACCREDITATION for 2 years; the petition for
            recognition of twenty-one (21) student organizations listed under Group C is hereby granted Probationary for
            1 year. {"\n"}
            WHEREFORE, the petitioning New Organizations listed under Group C is hereby granted Probationary for 1 year.
            {"\n"}
            WHEREFORE, all recognized student organizations, pursuant to the provisions in the Rules and Procedures for
            Recognition of Student Organizations, must comply with the Implementing Rules and Regulations for
            Accreditation status of the Office for Student Affairs (Annex A).{"\n"}
            So Ordered.{"\n"}
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

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>Page PAGENUM of TOTALNUM</Text>
    <Text>RESOLUTION ver. 01</Text>
  </View>
);

export default MyDocument;
