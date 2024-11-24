"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, Upload, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, pdf, Image } from "@react-pdf/renderer";
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
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 10,

    marginBottom: 5,
    textAlign: "center",
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
  boldItalic: {
    fontFamily: "Arial Narrow Bold Italic",
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
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 10,
    width: "40%",
    alignSelf: "center",
  },
  signatureText: {
    textAlign: "left",
  },
  signatureDetails: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

type SignatureSchema = {
  name: string;
  position: string;
  signatureUrl: string;
  dateSigned: Date;
};

type AnnexE3 = {
  _id: string;
  organization: {
    name: string;
    affiliation: string;
  };
  academicYear: string;
  isSubmitted: boolean;
  pasoc: Pasoc;
  secretary: SignatureSchema;
  president: SignatureSchema;
  adviser: SignatureSchema;
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
};

type RatingSchema = {
  rating: number;
  comment: string;
};

type Pasoc = {
  _id: string;
  servantLeadership: {
    "1": RatingSchema;
    "2": RatingSchema;
    "3": RatingSchema;
  };
  operationalPlan: {
    "1": RatingSchema;
    "2": RatingSchema;
  };
  constituentFocus: {
    "1": RatingSchema;
    "2": RatingSchema;
  };
  monitoringAndEvaluation: {
    "1": RatingSchema;
    "2": RatingSchema;
    "3": RatingSchema;
  };
  membershipAndOrganizationClimate: {
    "1": RatingSchema;
    "2": RatingSchema;
    "3": RatingSchema;
  };
  personalAndSocialAndCommunityService: {
    "1": RatingSchema;
    "2": RatingSchema;
  };
  outcomesAndAchievements: {
    "1": RatingSchema;
    "2": RatingSchema;
    "3": RatingSchema;
    "4": RatingSchema;
    "5": RatingSchema;
    "6": RatingSchema;
  };
  furtherComments: string;
};

type SignaturePosition = "secretary" | "president" | "adviser";
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

const formatDescription = (description) => {
  const words = description.split(" ");
  return (
    <>
      <Text style={styles.boldItalic}>{words[0]}</Text>
      <Text style={{}}> {words.slice(1).join(" ")}</Text>
    </>
  );
};

const CriteriaSection = ({ criteriaNum, criteria, subcriteria }) => (
  <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, fontSize: 9 }}>
    <View style={{ flexDirection: "row", width: "20%", borderRightWidth: 1 }}>
      <Text style={{ width: "20%" }}> {criteriaNum}. </Text>
      <Text style={{ width: "80%" }}>{criteria}</Text>
    </View>

    {/* Subcriteria */}
    <View style={{ flexDirection: "column", width: "80%", fontSize: 7, textAlign: "justify" }}>
      {subcriteria.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", borderBottomWidth: index === subcriteria.length - 1 ? 0 : 1 }}>
          <View style={{ borderBottomWidth: 1 }}> </View>
          <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
            <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2 }}>{item.id}</Text>
            <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginRight: 4 }}>
              {formatDescription(item.description)}
            </Text>
          </View>

          {/* Current Officer */}
          <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>{item.name}</Text>
          {/* Remarks */}
          <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>{item.remarks}</Text>
        </View>
      ))}
    </View>
  </View>
);

const MyDocument: React.FC<{ annex: AnnexE3 }> = ({ annex }) => (
  <Document>
    <Page style={[styles.page]}>
      {/* Header */}
      <View fixed style={styles.header}>
        <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
          STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
        </Text>
        <Text
          style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
          render={({ pageNumber, totalPages }) => `Page | ${pageNumber} / ${totalPages}`}
        />
        <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          PERFORMANCE ASSESSMENT OF STUDENT ORGANIZATIONS/COUNCILS (PASOC) FORM
        </Text>
        <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
      </View>
      {/* Title Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>PERFORMANCE ASSESSMENT OF STUDENT ORGANIZATIONS/COUNCILS (PASOC) FORM</Text>
        <Text style={styles.subheading}>Accomplished by the Current Officers</Text>
      </View>
      {/* Section */}
      <View style={{ flexDirection: "row", width: "100%", marginBottom: 10, fontSize: 9 }}>
        <Text style={{ width: "50%" }}>NAME OF ORGANIZATION</Text>
        <Text style={{ width: "50%", borderBottomWidth: 1 }}>{annex.organization.name}</Text>
      </View>
      <View style={{ flexDirection: "row", width: "100%", marginBottom: 20, fontSize: 9 }}>
        <Text style={{ width: "50%" }}>FACULTY/COLLEGE/INSTITUTE/SCHOOL</Text>
        <Text style={{ width: "50%", borderBottomWidth: 1 }}>{annex.organization.affiliation}</Text>
      </View>
      <Text style={{ fontSize: "9" }}>
        Assess this organization using the likert scale performance score guide below
      </Text>
      <Text style={{ fontSize: "7" }}>
        (Refer to the attached SUMMARY OF PROJECT/ACTIVITIES for your reference. Use blue ink in marking/writing on this
        form)
      </Text>
      {/* Content */}
      <View style={{ borderWidth: 1, width: "100%", flexDirection: "row", fontSize: 8, marginTop: 10 }}>
        <Text style={{ width: "40%", borderRightWidth: 1, textAlign: "center", paddingTop: 5 }}>
          Performance Assessment of Student Organizations/Councils (PASOC)
        </Text>
        <Text style={{ width: "10%", borderRightWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 5 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>(Outstanding)</Text>
        </Text>
        <Text style={{ width: "10%", borderRightWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 4 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>(Very Good)</Text>
        </Text>
        <Text style={{ width: "10%", borderRightWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 3 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>(Good)</Text>
        </Text>
        <Text style={{ width: "10%", borderRightWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 2 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>(Fair)</Text>
        </Text>
        <Text style={{ width: "10%", borderRightWidth: 1 }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 1 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>(Poor)</Text>
        </Text>
        <Text style={{ width: "10%" }}>
          <Text style={{ fontSize: 9, textAlign: "center" }}> 0 </Text> {"\n"}
          <Text style={{ fontSize: 7, textAlign: "center" }}>Missing or Write Comments</Text>
        </Text>
      </View>
      <View style={{ flexDirection: "row", width: "100%", marginTop: 10, borderWidth: 1 }}>
        <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "60%" }}>
          Performance Assessment of Student Organizations/Councils (PASOC)
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "10%" }}>
          {" "}
          Current {"\n"} Officer{" "}
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", width: "30%" }}>Remarks/Comments</Text>
      </View>
      {/* PASOC 1 */}
      <CriteriaSection
        criteriaNum="1"
        criteria={"Leadership and Governance"}
        subcriteria={[
          {
            id: "1.1",
            description: "Exhibited responsible decision-making and personal accountability.",
            name: annex.pasoc.servantLeadership["1"].rating.toString(),
            remarks: annex.pasoc.servantLeadership["1"].comment,
          },
          {
            id: "1.2",
            description: "Modeled a wide range of Christian leadership skills and abilities.",
            name: annex.pasoc.servantLeadership["2"].rating.toString(),
            remarks: annex.pasoc.servantLeadership["2"].comment,
          },
          {
            id: "1.3",
            description: "Conducted respectful dialogue with adviser/s and members.",
            name: annex.pasoc.servantLeadership["3"].rating.toString(),
            remarks: annex.pasoc.servantLeadership["3"].comment,
          },
        ]}
      />
      {/* PASOC 2 */}
      <CriteriaSection
        criteriaNum="2"
        criteria={"Operational Assessment"}
        subcriteria={[
          {
            id: "2.1",
            description: "Adhered to the operational plan.",
            name: annex.pasoc.operationalPlan["1"].rating.toString(),
            remarks: annex.pasoc.operationalPlan["1"].comment,
          },
          {
            id: "2.2",
            description: "Demonstrated commitment to best practices in/off campus programming.",
            name: annex.pasoc.operationalPlan["2"].rating.toString(),
            remarks: annex.pasoc.operationalPlan["2"].comment,
          },
        ]}
      />
      {/* PASOC 3 */}
      <CriteriaSection
        criteriaNum="3"
        criteria={"Constituent Focus"}
        subcriteria={[
          {
            id: "3.1",
            description: "Committed  to support the UST Strategic Plan  and the Sustainable Development Goals.",
            name: annex.pasoc.constituentFocus["1"].rating.toString(),
            remarks: annex.pasoc.constituentFocus["1"].comment,
          },
          {
            id: "3.2",
            description: "Demonstrated understanding of knowledge for  campus programming and University policies.",
            name: annex.pasoc.constituentFocus["2"].rating.toString(),
            remarks: annex.pasoc.constituentFocus["2"].comment,
          },
        ]}
      />
      {/* PASOC 4 */}
      <CriteriaSection
        criteriaNum="4"
        criteria={"Monitoring and Evaluation"}
        subcriteria={[
          {
            id: "4.1",
            description: "Used  appropriate evaluation/assessment tools for every project/activity conducted.",
            name: annex.pasoc.monitoringAndEvaluation["1"].rating.toString(),
            remarks: annex.pasoc.monitoringAndEvaluation["1"].comment,
          },
          {
            id: "4.2",
            description:
              "Disseminated/utilized evaluation/assessment results for continuous improvement and/or research activity/ies.",
            name: annex.pasoc.monitoringAndEvaluation["2"].rating.toString(),
            remarks: annex.pasoc.monitoringAndEvaluation["2"].comment,
          },

          {
            id: "4.3",
            description:
              "Complied with pre and post activity requirements within reasonable time (Approval of SAAF, liquidations, post evaluation, etc.) ",
            name: annex.pasoc.monitoringAndEvaluation["3"].rating.toString(),
            remarks: annex.pasoc.monitoringAndEvaluation["3"].comment,
          },
        ]}
      />
      {/* PASOC 5 */}
      <CriteriaSection
        criteriaNum="5"
        criteria={"Membership and Organization Climate"}
        subcriteria={[
          {
            id: "5.1",
            description: "Modeled the Thomasian Identity when serving as an organization representative",
            name: annex.pasoc.membershipAndOrganizationClimate["1"].rating.toString(),
            remarks: annex.pasoc.membershipAndOrganizationClimate["1"].comment,
          },
          {
            id: "5.2",
            description: "Built group dynamics and effective teamwork.",
            name: annex.pasoc.membershipAndOrganizationClimate["2"].rating.toString(),
            remarks: annex.pasoc.membershipAndOrganizationClimate["2"].comment,
          },

          {
            id: "5.3",
            description: "Demonstrated obedience to the student code of conduct and discipline (PPS 1027).",
            name: annex.pasoc.membershipAndOrganizationClimate["3"].rating.toString(),
            remarks: annex.pasoc.membershipAndOrganizationClimate["3"].comment,
          },
        ]}
      />
      {/* PASOC 6 */}
      <CriteriaSection
        criteriaNum="6"
        criteria={"Program Activities and Community Service"}
        subcriteria={[
          {
            id: "6.1",
            description:
              "Worked on creative marketing and promotional ventures in order to reach the student body in unique ways.",
            name: annex.pasoc.personalAndSocialAndCommunityService["1"].rating.toString(),
            remarks: annex.pasoc.personalAndSocialAndCommunityService["1"].comment,
          },
          {
            id: "6.2",
            description:
              "Assisted in positively impacting the UST campus community by creating experiences that foster safe, quality programs/  projects/activities that build community.",
            name: annex.pasoc.personalAndSocialAndCommunityService["2"].rating.toString(),
            remarks: annex.pasoc.personalAndSocialAndCommunityService["2"].comment,
          },
        ]}
      />
      {/* PASOC 7 */}
      <View style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, fontSize: 9 }}>
        <View style={{ flexDirection: "row", width: "20%", borderRightWidth: 1 }}>
          <Text style={{ width: "20%" }}> 7. </Text>
          <Text style={{ width: "80%" }}>Outcomes and Achievements</Text>
        </View>

        {/* Subcriteria */}
        <View style={{ flexDirection: "column", width: "80%", fontSize: 8 }}>
          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 4 }}>7.1</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 4 }}>
                <Text style={styles.boldItalic}>Conducted </Text>activities that developed the Thomasian Graduate
                Attributes (21st century skills) such as, but not limited to:
              </Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements["1"].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements["1"].comment}
            </Text>
          </View>

          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.1</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>Servant Leadership</Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements["2"].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements["2"].comment}
            </Text>
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.2</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>
                Effective Communicator and Collaborator
              </Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements["3"].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements["3"].comment}
            </Text>
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.3</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>
                Analytical and Creative Thinker
              </Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements[4].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements[4].comment}
            </Text>
          </View>
          <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2, marginLeft: 20 }}>7.1.4</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2, marginLeft: 5 }}>Lifelong Learner</Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements[5].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements[5].comment}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", width: "50%", borderRightWidth: 1 }}>
              <Text style={{ width: "10%", paddingLeft: 4, marginVertical: 2 }}>7.2</Text>
              <Text style={{ width: "90%", paddingLeft: 4, marginVertical: 2 }}>
                {" "}
                <Text style={styles.boldItalic}> Recipients </Text>of award-giving body
              </Text>
            </View>
            {/* Current Officer */}
            <Text style={{ fontSize: 9, textAlign: "center", borderRightWidth: 1, width: "12.5%" }}>
              {annex.pasoc.outcomesAndAchievements["6"].rating}
            </Text>
            {/* Remarks */}
            <Text style={{ fontSize: 9, textAlign: "justify", width: "32.5%", marginLeft: 1 }}>
              {annex.pasoc.outcomesAndAchievements["6"].comment}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ borderWidth: 1, borderTop: 0, flexDirection: "column" }}>
        <Text style={{ borderBottomWidth: 1 }}> FURTHER COMMENTS </Text>
        <Text style={{ marginHorizontal: 10, textAlign: "justify" }}>{annex.pasoc.furtherComments}</Text>
      </View>{" "}
      {/* signatures */}
      <View style={{ fontSize: 8 }}>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
          <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
            <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Prepared by:</Text>
            {annex.secretary && annex.secretary.signatureUrl ? (
              <View>
                <Image src={annex.secretary.signatureUrl} style={{ width: 150, height: 50, textAlign: "center" }} />
                <Text style={{ textAlign: "center" }}>{annex.secretary.name}</Text>
                <Text style={{ textAlign: "center" }}>{annex.secretary.position}</Text>
                <Text style={{ textAlign: "center" }}>
                  Date Signed:{" "}
                  {annex.secretary.dateSigned
                    ? new Date(annex.secretary.dateSigned).toDateString()
                    : "________________"}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of Secretary</Text>
                <Text>Date Signed: __________________ </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
            <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Endorsed:</Text>
            {annex.president && annex.president.signatureUrl ? (
              <View>
                <Image src={annex.president.signatureUrl} style={{ width: 150, height: 50, textAlign: "center" }} />
                <Text style={{ textAlign: "center" }}>{annex.president.name}</Text>
                <Text style={{ textAlign: "center" }}>{annex.president.position}</Text>
                <Text style={{ textAlign: "center" }}>
                  Date Signed:{" "}
                  {annex.president.dateSigned
                    ? new Date(annex.president.dateSigned).toDateString()
                    : "________________"}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of President</Text>
                <Text>Date Signed: __________________ </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "column", width: "33%", marginHorizontal: 10, marginBottom: 20 }}>
            <Text style={{ marginHorizontal: 10, marginBottom: 20 }}>Noted:</Text>
            {annex.adviser && annex.adviser.signatureUrl ? (
              <View>
                <Image src={annex.adviser.signatureUrl} style={{ width: 150, height: 50, textAlign: "center" }} />
                <Text style={{ textAlign: "center" }}>{annex.adviser.name}</Text>
                <Text style={{ textAlign: "center" }}>{annex.adviser.position}</Text>
                <Text style={{ textAlign: "center" }}>
                  Date Signed:{" "}
                  {annex.adviser.dateSigned ? new Date(annex.adviser.dateSigned).toDateString() : "________________"}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ borderTopWidth: 1, textAlign: "center" }}>Signature over Printed Name of Adviser</Text>
                <Text>Date Signed: __________________ </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 7, textAlign: "left" }}>
        In compliance with CHEd Memo #09 s. 2013 Art. X RESEARCH and Art. XI MONITORING AND EVALUATION. Results and
        outputs shall be disseminated and utilized for the purpose of continuous improvement and measure of OSA’s Key
        Performance Indicators (KPIs) concerning Student Organizations.
      </Text>
      <View fixed style={styles.footer}>
        <Text>All rights reserved by the Office for Student Affairs</Text>
      </View>
    </Page>
  </Document>
);

export default function AnnexE3Manager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexE3[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexE3 | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e3`);
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
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-e3/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const openSignatureModal = async (annex: AnnexE3) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      setSelectedAnnex(updatedAnnex);
      setIsModalOpen(true);
      const blob = await generatePDFBlob(updatedAnnex);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error opening signature modal:", error);
      alert("Failed to open signature modal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDFBlob = async (annex: AnnexE3): Promise<Blob> => {
    try {
      console.log("Preparing annex data with signatures...");
      console.log("Generating PDF for annex:", annex);
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      console.log("PDF blob generated successfully");
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexE3) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
      const blob = await generatePDFBlob(updatedAnnex);
      const url = URL.createObjectURL(blob);
      console.log("PDF URL created:", url);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexE3> => {
    const response = await axios.get(`/api/annexes/${params.organizationId}/annex-e3/${annexId}`);
    return response.data;
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
    if (!selectedUserPosition || !selectedAnnex || !selectedSignaturePosition) {
      alert("Please select a role, an annex, and a signature position");
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

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-e3/${selectedAnnex._id}`, {
        [selectedSignaturePosition]: {
          name: session?.user?.fullName || "",
          position: selectedUserPosition.role,
          signatureUrl: url,
          dateSigned: new Date().toISOString(),
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
        throw new Error("Failed to update Annex E-3");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
      alert(`Error adding signature: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }

    setSignatureFile(null);
    setSignaturePreview(null);
    setSelectedSignaturePosition("");
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const clearUploadedSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e3/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e3/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e3/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-e3/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX E-3 PASOC Forms</h1>
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
              openSignatureModal={openSignatureModal}
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
              <p>No PASOC Forms Annex created yet.</p>
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
                <h3 className="text-2xl font-semibold">Add Signature to Annex E-3</h3>
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
                      {session?.user?.positions?.map((userPosition: Positions, index: number) => {
                        const name = userPosition.organization?.name || userPosition.affiliation;
                        return (
                          <option key={index} value={`${userPosition.position}-${name}`}>
                            {userPosition.position} - {name}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      className="select select-bordered w-full"
                      value={selectedSignaturePosition}
                      onChange={(e) => setSelectedSignaturePosition(e.target.value as SignaturePosition)}
                    >
                      <option value="">Select signature position</option>
                      <option value="secretary">Secretary</option>
                      <option value="president">President</option>
                      <option value="adviser">Adviser</option>
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
                            onClick={clearUploadedSignature}
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
  annex: AnnexE3;
  editAnnex: (id: string) => void;
  openSignatureModal: (annex: AnnexE3) => void;
  generatePDF: (annex: AnnexE3) => void;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  editAnnex,
  openSignatureModal,
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
            <h2 className="card-title">PASOC Forms Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && (
              <button
                className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
                onClick={() => editAnnex(annex._id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit PASOC Forms
              </button>
            )}
            {/* <button className="btn btn-outline btn-sm" onClick={() => openSignatureModal(annex)}>
              <PenTool className="h-4 w-4 mr-2" />
              Add Signature
            </button> */}
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
            {session?.user?.role === "OSA" && (
              <>
                <button className="btn btn-success" onClick={() => onApprove(annex._id)}>
                  Approve
                </button>
                <button className="btn btn-error" onClick={() => onDisapprove(annex._id)}>
                  Disapprove
                </button>
              </>
            )}
            {(session?.user?.role === "RSO" ||
              session?.user?.role === "RSO-SIGNATORY" ||
              session?.user?.role === "AU") && (
              <button
                className="btn btn-primary"
                onClick={() => onSubmit(annex._id)}
                disabled={!submissionsStatus.submissionAllowed}
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
