"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Send, Download, PenTool, X, Upload } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
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
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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
    width: "15%",
    paddingRight: 10,
  },
  subsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%",
    textAlign: "justify",
  },
  subsubsectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: "25%",
    paddingRight: 10,
  },
  subsubsectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: "100%",
    textAlign: "justify",
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
  },
  tableLastCell: {
    padding: 5,
    fontSize: 11,
    textAlign: "left",
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
  },
  bodyText: {
    marginLeft: 20,
    marginBottom: 10,
    textAlign: "justify",
  },
  signatureSection: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 40,
    textAlign: "left",
    fontSize: 9,
  },
  signatureText: {
    flexDirection: "column",
    width: "50%",
    marginRight: 110,
  },
  signatureImage: {
    width: 125,
    height: 25,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 5,
    width: "100%",
  },
  signatureName: {
    marginTop: 5,
  },
});

type SignatureSchema = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned?: Date;
};

type Annex02 = {
  _id: string;
  organization: {
    name: string;
  };
  officialEmail: string;
  academicYear: string;
  levelOfRecognition: string;
  facebook: string;
  isWithCentralOrganization: boolean;
  isReligiousOrganization: boolean;
  affiliation: string;
  submissionDate?: Date;
  osaPetitionStatus: "GRANTED" | "GRANTED WITH OFFICE" | "DENIED" | "OTHER" | null;
  osaPetitionYears: number | null;
  osaOtherRemarks: string | null;
  osaDecisionDate: Date | null;
  president?: SignatureSchema;
  adviser?: SignatureSchema;
  coAdviser?: SignatureSchema;
  swdcCoordinator?: SignatureSchema;
  dean?: SignatureSchema;
  regent?: SignatureSchema;
  centralOrganizationPresident?: SignatureSchema;
  centralOrganizationAdviser?: SignatureSchema;
  director?: SignatureSchema;
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
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

const MyDocument: React.FC<{ annex: Annex02 }> = ({ annex }) => (
  <Document>
    <Page style={styles.page} size="LEGAL">
      {/* Header */}
      <View fixed style={styles.header}>
        <View fixed style={{ flexDirection: "row" }}>
          <View style={{ width: "80%" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
              STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
            </Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right", fontFamily: "Arial Narrow Bold" }}>
              ANNEX 02
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 8, textAlign: "right" }}
          render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
        />
        <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>Petition for Recognition</Text>
        <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
      </View>

      {/* Title Section */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "50%", borderBottomWidth: 1, borderRightWidth: 1 }]}>
            This petition is filed by {"\n"}
            {annex.organization?.name}
          </Text>
          <View
            style={[
              styles.tableCell,
              {
                width: "50%",
                flexDirection: "column",
                justifyContent: "center",
                borderBottomWidth: 1,
              },
            ]}
          >
            {annex.affiliation === "University Wide" ? (
              <Text>
                FOR RECOGNITION {"\n"}
                WITH APPLICATION FOR OFFICE SPACE
              </Text>
            ) : (
              <Text>FOR RECOGNITION {"\n"}</Text>
            )}
          </View>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "50%", borderBottomWidth: 1, borderRightWidth: 1 }]}>
            Level of Recognition A.Y. {annex.academicYear} {"\n"}
            {annex.levelOfRecognition}
          </Text>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { width: "50%" }]}>
              FOR Office for Student Affairs (OSA) USE ONLY {"\n"}
              The petition is:
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "50%", borderRightWidth: 1 }]}>
            Represented by: {annex.president?.name || "(NAME OF PRESIDENT)"}
          </Text>
          <View style={styles.tableCol}>
            {annex.osaPetitionStatus ? (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                  <Text style={{ paddingHorizontal: 8 }}>•</Text>
                  <Text>
                    {annex.osaPetitionStatus} for {annex.osaPetitionYears} years
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                  <Text style={{ paddingHorizontal: 8 }}>•</Text>
                  <Text>GRANTED WITH OFFICE for __ years</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                  <Text style={{ paddingHorizontal: 8 }}>•</Text>
                  <Text>DENIED</Text>
                </View>
              </View>
            )}
            {annex.osaOtherRemarks ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>OTHER REMARKS: {annex.osaOtherRemarks}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                <Text style={{ paddingHorizontal: 8 }}>•</Text>
                <Text>OTHER REMARKS: ____________</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <Text style={[styles.subheading, { textAlign: "center", paddingVertical: 10 }]}>PETITION FOR RECOGNITION</Text>
      <Text style={[{ marginBottom: 10 }]}>
        Petitioner, through {annex.president?.name || "(COMPLETE NAME OF THE REPRESENTATIVE)"}, respectfully states
        that:
      </Text>
      <Text style={styles.bodyText}>
        1. {annex.president?.name || "(NAME OF PRESIDENT)"} of the {annex.organization?.name || "(AFFILIATION)"},
        organized for the purpose as stated in its Article of Association.
      </Text>
      <Text style={styles.bodyText}>
        2. In support of the Petition for the recognition, attached to this Petition are the following documents:
      </Text>

      {/* Table for Annexes */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
          <Text
            style={[styles.tableCell, { width: "15%", textAlign: "center", borderRightWidth: 1, borderBottomWidth: 1 }]}
          >
            Annex
          </Text>
          <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}></Text>
        </View>
        <AnnexRow annexName="A" annexDescription="Student Organization's General Information Report" />
        <AnnexRow annexName="A-1" annexDescription="Officer's Information Sheet" />
        <AnnexRow
          annexName="B"
          annexDescription="List of Members (Membership of the current Academic Year of recognition)"
        />
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
          <Text
            style={[
              styles.tableCell,
              {
                width: "15%",
                textAlign: "left",
                borderRightWidth: 1,
                borderBottomWidth: 1,
                fontFamily: "Arial Narrow Bold",
              },
            ]}
          >
            C
          </Text>
          <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>
            A certification that the Articles of Association (AoA) was ratified by the student-members, issued by the
            organization's Secretary and President, reviewed by the Student Organization Coordinating Council Director
            (SOCC Director) and attested by the Student Welfare and Development Coordinator (SWDC)
            {"\n\n"}
            <Text style={{ fontFamily: "Boxed" }}>O</Text> {"    "}SOCC Director
            {"\n\n"}
            <Text style={{ fontFamily: "Boxed" }}>0</Text> {"    "}Organization Secretary and President attested by the
            SWDC
          </Text>
        </View>
        <AnnexRow
          annexName="C-1"
          annexDescription="An updated/revised copy of the organization's AoA guided by the Quality Review Form (14 February 2020)."
        />
        <AnnexRow
          annexName="D"
          annexDescription="Organization's Logo and Letterhead (Must follow the UST Visual Identity Guidelines)"
        />
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
          <Text
            style={[
              styles.tableCell,
              {
                width: "15%",
                textAlign: "left",
                borderRightWidth: 1,
                borderBottomWidth: 1,
                fontFamily: "Arial Narrow Bold",
              },
            ]}
          >
            E
          </Text>
          <View style={[{ width: "80%", borderBottomWidth: 1, flexDirection: "column" }]}>
            <Text style={[styles.tableLastCell]}>
              {"\u2022"} Accomplishment Report {"\n"}
              {"\u2022"} Evaluation Reports Financial {"\n"}
              {"\u2022"} Report consisting of:
            </Text>
            <View style={[styles.tableLastCell, { marginLeft: 10 }]}>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text> {"a)"} </Text>
                  <Text> Summary of receipts and disbursements marked as Annex "E-1" </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text> {"b)"} </Text>
                  <Text> Liquidation reports marked as Annex "E- 2" </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text> {"c)"} </Text>
                  <Text>
                    {" "}
                    Accomplished Performance Assessment of Student Organizations/Councils (PASOC) Forms marked as Annex
                    "E-3"{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <AnnexRow
          annexName="F"
          annexDescription="The organization's Activities' Monitoring Form Prepared by the Executive Board and Approved by the Organization Adviser"
        />
        <AnnexRow annexName="G" annexDescription="Accomplishment Report and Evaluation Reports Financial" />
        <AnnexRow annexName="H" annexDescription="Commitment to Anti-Hazing Law" />
        <AnnexRow annexName="I" annexDescription="Commitment to Responsible use of Social Media" />
        <AnnexRow
          annexName="J"
          annexDescription="Commitment of Active Participation in all OSA and University-initiated activities"
        />
        <AnnexRow annexName="K" annexDescription="Commitment to Care for the Environment" />
        <AnnexRow
          annexName="L"
          annexDescription="Commitment to Submit the Post Event Evaluation of Each Completed Activity on Time"
        />
      </View>

      <Text style={[styles.bodyText, { paddingTop: 10 }]}>
        3. Petitioner commits to send the{" "}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>
          {" "}
          President (01 Rules and Procedure for Recognition Section 9){" "}
        </Text>{" "}
        to the leadership training summit to be conducted by the Office for Student Affairs.
      </Text>
      <Text style={styles.bodyText}>
        4. Petitioner has opened an e-mail address at {annex.officialEmail || "(OFFICIAL E-MAIL ADDRESS)"} for which
        petitioner may be served with notices and other official communication.
      </Text>
      <Text style={styles.bodyText}>
        5. Petitioner has also opened a Facebook page under the name {annex.facebook || "(FACEBOOK NAME)"}, with 75% of
        their members having linked to said page. The list of names of student-members who have linked to our official
        Facebook page and their Facebook account names is hereto attached as Annex "B".
      </Text>
      <Text style={styles.bodyText}>
        6. Petitioner has never been found in violation of the University rules and regulations, and further, commits to
        faithfully abide by its rules and regulations, to cooperate and participate, to the best of its ability, all
        University-sponsored activities, and programs.
      </Text>
      <Text style={styles.bodyText}>
        7. Petitioner is a recognized student organization having been continually recognized for the past two (2)
        consecutive academic years.{" "}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>(for university–wide student organizations only)</Text>
      </Text>

      <Text style={[{ marginBottom: 10, marginLeft: 41 }]}> WHEREFORE, petitioner prays that</Text>

      <View style={styles.sectionTableRow}>
        <Text style={[styles.bodyText, { width: "1%" }]}>{"a) "}</Text>
        <Text style={[styles.bodyText, { width: "99%" }]}>
          The {annex.organization?.name || "(NAME OF ORGANIZATION)"} be granted recognition by the Office for Student
          Affairs.
        </Text>
      </View>
      <View style={styles.sectionTableRow}>
        <Text style={[styles.bodyText, { width: "1%" }]}>{"b) "}</Text>
        <Text style={[styles.bodyText, { width: "99%" }]}>
          It be allowed to use an office space at UST Tan Yan Kee Student Center:{" "}
          <Text style={{ fontFamily: "Arial Narrow Bold" }}> (for university–wide student organizations only)</Text>
        </Text>
      </View>
      <View style={styles.sectionTableRow}>
        <Text style={[styles.bodyText, { width: "1%" }]}>{"c) "}</Text>
        <Text style={[styles.bodyText, { width: "99%" }]}>A faculty adviser will be appointed.</Text>
      </View>

      <Text style={[styles.bodyText]}>
        Date: {annex.submissionDate ? new Date(annex.submissionDate).toLocaleDateString() : "_____________"} {"\n"}
      </Text>

      {/* Signatory */}
      <View style={{ flexDirection: "row", marginTop: 40 }}>
        <Text style={[styles.bodyText, { width: "50%" }]}> </Text>
        <View style={[styles.bodyText, { width: "50%", fontSize: 7, textAlign: "center" }]}>
          {annex.president?.signatureUrl ? (
            <View>
              <Image src={annex.president.signatureUrl} style={styles.signatureImage} />
              <View style={styles.signatureLine} />
              <Text style={{ textAlign: "left", fontSize: 9 }}>
                {annex.president.name}
                {"\n"}
                {annex.organization.name}
                {"\n"}
                {annex.affiliation}
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.signatureLine} />
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>SIGNATURE OVER PRINTED NAME OF THE PRESIDENT</Text>
              <Text style={{ textAlign: "left", fontSize: 9 }}>
                Name of Organization with Suffix
                {"\n"}
                Faculty/College/Institute/School Affiliation
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>With our favorable endorsement:</Text>

      {/* FOR COLLEGE-BASED STUDENT ORGANIZATION */}
      {annex.affiliation !== "University Wide" && (
        <View>
          <View style={styles.signatureSection}>
            <View style={styles.signatureText}>
              {annex.adviser?.signatureUrl && <Image src={annex.adviser.signatureUrl} style={styles.signatureImage} />}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {annex.adviser?.name || "Signature over Printed Name of Adviser"}
                {"\n"}
                {annex.adviser?.position || "Adviser"}
              </Text>
            </View>
            <View style={styles.signatureText}>
              {annex.coAdviser?.signatureUrl && (
                <Image src={annex.coAdviser.signatureUrl} style={styles.signatureImage} />
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {annex.coAdviser?.name || "Signature over Printed Name of Co-Adviser"}
                {"\n"}
                {annex.coAdviser?.position || "coAdviser"}
              </Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureText}>
              {annex.swdcCoordinator?.signatureUrl && (
                <Image src={annex.swdcCoordinator.signatureUrl} style={styles.signatureImage} />
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {annex.swdcCoordinator?.name || "Signature over Printed Name"}
                {"\n"}
                {annex.swdcCoordinator?.position || "SWDC Coordinator"}
              </Text>
            </View>
            <View style={styles.signatureText}></View>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureText}>
              {annex.dean?.signatureUrl && <Image src={annex.dean.signatureUrl} style={styles.signatureImage} />}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {annex.dean?.name || "Signature over Printed Name"}
                {"\n"}
                {annex.dean?.position || "Dean/Director"}
              </Text>
            </View>
            <View style={styles.signatureText}>
              {annex.regent?.signatureUrl && <Image src={annex.regent.signatureUrl} style={styles.signatureImage} />}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {annex.regent?.name || "Signature over Printed Name"}
                {"\n"}
                {annex.regent?.position || "Regent"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* FOR UNIVERSITY-WIDE STUDENT ORGANIZATION */}
      {annex.affiliation === "University Wide" && (
        <View style={styles.signatureSection}>
          <View style={styles.signatureText}>
            {annex.adviser?.signatureUrl && <Image src={annex.adviser.signatureUrl} style={styles.signatureImage} />}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {annex.adviser?.name || "Signature over Printed Name of Adviser"}
              <Br />
              {annex.adviser?.position || ""}
            </Text>
          </View>
          <View style={styles.signatureText}>
            {annex.coAdviser?.signatureUrl && (
              <Image src={annex.coAdviser.signatureUrl} style={styles.signatureImage} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {annex.coAdviser?.name || "Signature over Printed Name of Co-Adviser"}
              <Br />
              {annex.coAdviser?.position || ""}
            </Text>
          </View>
        </View>
      )}

      {/* FOR STUDENT RELIGIOUS ORGANIZATION */}
      {annex.isReligiousOrganization && (
        <View style={styles.signatureSection}>
          <View style={styles.signatureText}>
            {annex.dean?.signatureUrl && <Image src={annex.dean.signatureUrl} style={styles.signatureImage} />}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {annex.dean?.name || "Signature over Printed Name of Dean"}
              <Br />
              {annex.dean?.position || ""}
            </Text>
          </View>
          <View style={styles.signatureText}>
            {annex.regent?.signatureUrl && <Image src={annex.regent.signatureUrl} style={styles.signatureImage} />}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{annex.regent?.name || "Signature over Printed Name of Regent"}</Text>
          </View>
        </View>
      )}

      {/* FOR CENTRAL ORGANIZATION */}
      {annex.isWithCentralOrganization && (
        <View style={styles.signatureSection}>
          <View style={styles.signatureText}>
            {annex.centralOrganizationPresident?.signatureUrl && (
              <Image src={annex.centralOrganizationPresident.signatureUrl} style={styles.signatureImage} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {annex.centralOrganizationPresident?.name ||
                "Signature over Printed Name of Central Organization President"}{" "}
              <Br />
              {annex.centralOrganizationPresident?.position || ""}
            </Text>
          </View>
          <View style={styles.signatureText}>
            {annex.centralOrganizationAdviser?.signatureUrl && (
              <Image src={annex.centralOrganizationAdviser.signatureUrl} style={styles.signatureImage} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {annex.centralOrganizationAdviser?.name || "Signature over Printed Name of Central Organization Adviser"}{" "}
              <Br />
              {annex.centralOrganizationAdviser?.position || ""}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.signatureSection}>
        <View style={styles.signatureText}>
          {annex.director?.signatureUrl && <Image src={annex.director.signatureUrl} style={styles.signatureImage} />}
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{annex.director?.name || "Director, Center for Campus Ministry"}</Text>
        </View>
        <View style={styles.signatureText}></View>
      </View>

      <Footer />
    </Page>
  </Document>
);

const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
  </View>
);

const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const AnnexRow = ({ annexName, annexDescription }) => {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: "5%", borderRightWidth: 1, borderBottomWidth: 1 }]}></Text>
      <Text
        style={[
          styles.tableCell,
          {
            width: "15%",
            textAlign: "left",
            borderRightWidth: 1,
            borderBottomWidth: 1,
            fontFamily: "Arial Narrow Bold",
          },
        ]}
      >
        {annexName}
      </Text>
      <Text style={[styles.tableLastCell, { width: "80%", borderBottomWidth: 1 }]}>{annexDescription}</Text>
    </View>
  );
};

export default function Annex02Manager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<Annex02[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<Annex02 | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<string>("");
  const [selectedUserRole, setSelectedUserRole] = useState<string>("");

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-02`);
      setAnnexList(response.data);
    } catch (error) {
      console.error("Error fetching annexes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnnexForReview = async (id: string) => {
    try {
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-02/${id}`, {
        isSubmitted: true,
        submissionDate: new Date(),
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const generatePDFBlob = async (annex: Annex02): Promise<Blob> => {
    try {
      console.log(annex);
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: Annex02) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      console.log("Updated annex before generating PDF:", updatedAnnex); // Add this log
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<Annex02> => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-02/${annexId}`);
      console.log("Fetched updated annex:", response.data); // Add this log
      return response.data;
    } catch (error) {
      console.error("Error fetching updated annex:", error);
      throw error;
    }
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-02/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-02/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-02/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-02/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX 02 Petition for Recognition</h1>
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
              generatePDF={() => generatePDF(annex)}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Petition for Recognition Annex created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex 02</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: Annex02;
  generatePDF: () => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
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
            <h2 className="card-title">Petition for Recognition Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-sm" onClick={generatePDF}>
              <Download className="h-4 w-4 mr-2" />
              Generate PDF
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
              {session?.user?.role === "SOCC" && (
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
              {session?.user?.role === "OSA" && (
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
