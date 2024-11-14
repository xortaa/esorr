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
});

type LetteredParagraph = {
  letter: string;
  paragraph: string;
};

type Subsection = {
  number: string;
  title: string;
  paragraph: string;
  letteredParagraphs: LetteredParagraph[];
};

type Section = {
  number: string;
  title: string;
  paragraph: string;
  image: string;
  letteredParagraphs: LetteredParagraph[];
  subsections: Subsection[];
};

type Article = {
  order: string;
  title: string;
  sections: Section[];
};

type ArticlesOfAssociation = {
  articles: Article[];
};

type AnnexC1 = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  organization: {
    name: string;
  };
  articlesOfAssociation: ArticlesOfAssociation;
  president?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  vicePresident?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  secretary?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  treasurer?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  auditor?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  peaceRelationsOfficer?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  adviser?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  comelecRepresentative?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  dateSubmitted: Date;
};

type SignaturePosition =
  | "president"
  | "vicePresident"
  | "secretary"
  | "treasurer"
  | "auditor"
  | "peaceRelationsOfficer"
  | "adviser"
  | "comelecRepresentative";

type UserPosition = {
  role: string;
  organizationName: string;
};

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

const MyDocument: React.FC<{ annex: AnnexC1 }> = ({ annex }) => (
  <Document>
    <Page size="LEGAL" style={styles.page}>
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
              ANNEX C-1
            </Text>
          </View>
        </View>

        <Text
          style={{ fontSize: 8, textAlign: "right" }}
          render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
        />

        <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
          Articles of Association (Constitution and By-Laws)
        </Text>

        <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
      </View>
      <Text style={{ fontSize: "14" }}>UNIVERSITY OF SANTO TOMAS</Text>
      <Text style={{ fontSize: "12" }}>{annex.organization.name}</Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: "Arial Narrow Bold",
          textDecoration: "underline",
          marginTop: 20,
          fontSize: 16,
        }}
      >
        Articles of Association
      </Text>
      <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 14 }}>
        Constitution and By-Laws of the Organization
      </Text>
      <Text style={{ marginTop: 20, fontSize: 11 }}>
        Student organizations are enjoined to reflect the minimum requirements for their Articles of
        Association/Constitution:
      </Text>
      <View style={{ border: 1, marginTop: 10, fontSize: 9 }}>
        <View style={{ flexDirection: "row", textAlign: "center" }}>
          <Text style={{ width: "20%", borderRight: 1 }}>PARTS</Text>
          <Text style={{ width: "80%" }}>The Organization’s Article of Association</Text>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Name of Organization</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Contains the name of the University. (Ex. EARTH-UST) for University-wide Student Organizations (USO).
            </Text>
            <Text style={{ borderTop: 1 }}>
              Contains the name of their faculty, college, institute, or school. (Ex. Guild of Thomasian
              Speducators-EDUC) for College-Based Organizations (CBO)
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Logo/Seal</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Adopts a logo/seal within the norms of the Thomasian Core Values and the Seal of Thomasian Education
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Vision</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Includes the following keywords: Catholic institution, professional and moral formation, social
              transformation (discussed during the SOCC LTS- 16 July 2019)
            </Text>
            <Text style={{ borderTop: 1 }}>
              States the reason for theof the organization’s existence which must be consistent with the mission-vision
              of the University of Santo Tomas.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Purpose/Mission</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Includes the following keywords: recognized organization, 3Cs, Church, community (discussed during the
              SOCC LTS- 16 July 2019)
            </Text>
            <Text style={{ borderTop: 1 }}>
              Designates organization as “Recognized” not “Official” organization of the University. (discussed during
              the SOCC LTS- 16 July 2019)
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Membership Qualifications</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>Admits for membership only bona fide students of University of Santo Tomas (Student Handbook).</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Membership Fee</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Charges membership fees in the amount as may be deemed sufficient to support the needs of the organization
              and must not exceed the amount of P250.00 annually.
            </Text>
            <Text style={{ borderTop: 1 }}>
              Designates organization as “Recognized” not “Official” organization of the University. (discussed during
              the SOCC LTS- 16 July 2019)
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Code of Conduct of Members and Officers</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              States that members and officers must abide by the code of conduct formulated by the University (PPS 1027)
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Election Procedures</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              States that the Election of Officers must be held within the Month of April of the current Academic Year.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Resignation</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>States the ethical guidelines in resignation.</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Removal from Office/Impeachment</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              States ethical policies, procedures and guidelines in removing an officer from his/her position.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Vacancies</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>States clearly the rules of procedure in vacancies.</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>General Assemblies/Meetings</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>States the (1) schedule, (2) quorum and (3) power of the General Assembly/Meetings</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Committees</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>Includes the following Committees but not limited to : Evaluation, Research, Environment</Text>
            <Text style={{ borderTop: 1 }}>
              Specifies the created committees, their functions and responsibilities.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Advisers/Co-Advisers</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              States that University-wide Student Organization Adviser(s)/Co-Adviser(s) shall be appointed by the
              Director of the Office for Student Affairs.
            </Text>
            <Text style={{ borderTop: 1 }}>
              States that College-Based Student Organization Adviser(s)/Co-Adviser(s) shall be appointed by the
              Dean/Director of its Faculty/College/Institute/School.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Funds</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Authority. Contains the list of authorities that must sign every report or document related to financial
              management. .
            </Text>
            <Text style={{ borderTop: 1 }}>
              Reports. Contains the terms by which an organization should submit or declare its cash flows/financial
              report.
            </Text>
            <Text style={{ borderTop: 1 }}>Classification. Contains the types of fund that the organization has.</Text>
            <Text style={{ borderTop: 1 }}>
              Fund Raising. Mentions PPS 1030 of the Student Handbook 2018, pages 91-92.
            </Text>
            <Text style={{ borderTop: 1 }}>Bank Account. Declares policies on the money in custody of a bank.</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Funds</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              States the following” fixed” minimum content:{"\n"}
              Section 1. The Executive Board may draft the proposed amendment or revision of these Articles.
              {"\n"}
              Section 2. Any proposed amendment / revision to this Articles of Association shall be submitted to the
              Director of the Office for Student Affairs (OSA Director) for his/her approval.{"\n"}
              Section 3. Upon approval of the proposed amendments/ revision by the OSA Director, it shall be submitted
              to the General Assembly for ratification by a vote of the majority of all the members of the General
              Assembly.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Effectivity</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>States that the Articles of Association shall take effect immediately upon ratification.</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", textAlign: "justify", borderTop: 1 }}>
          <Text style={{ width: "20%", borderRight: 1 }}>Certificate of Ratification</Text>
          <View style={{ width: "80%", flexDirection: "column" }}>
            <Text>
              Includes the certificate of ratification following the template provided by the Office for Student
              Affairs.
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ marginTop: 30 }}>
        The standardization is aimed to eliminate confusion among organizations and to easily resolve issues in case of
        intra-organization or inter-organization disputes.
      </Text>
      <Text
        break
        style={{ textAlign: "center", textDecoration: "underline", fontFamily: "Arial Narrow Bold", fontSize: 10 }}
      >
        UNIVERSITY OF SANTO TOMAS
      </Text>
      <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 10 }}>ORG NAME</Text>
      <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", fontSize: 10 }}>
        ARTICLES OF ASSOCIATION
      </Text>

      {/* AOA proper */}

      {annex.articlesOfAssociation && annex.articlesOfAssociation.articles ? (
        annex.articlesOfAssociation.articles.map((article) => (
          <View key={article.order} style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", textAlign: "center" }}>
              ARTICLE {article.order} - {article.title}
            </Text>
            {article.sections.map((section) => (
              <View key={section.number} style={{ flexDirection: "row", marginTop: 10, lineHeight: 2 }}>
                <Text style={{ width: "15%", fontFamily: "Arial Narrow Bold" }}>Section {section.number}.</Text>
                <View style={{ width: "85%", flexDirection: "column" }}>
                  <Text>
                    {section.title}. {section.paragraph}
                  </Text>
                  {section.letteredParagraphs &&
                    section.letteredParagraphs.map((lp) => (
                      <View key={lp.letter} style={{ flexDirection: "row" }}>
                        <Text style={{ width: "10%" }}>{lp.letter}</Text>
                        <Text style={{ width: "90%", textAlign: "justify" }}>{lp.paragraph}</Text>
                      </View>
                    ))}
                  {section.subsections &&
                    section.subsections.map((subsection) => (
                      <View key={subsection.number} style={{ flexDirection: "row" }}>
                        <Text style={{ width: "10%" }}>{subsection.number}</Text>
                        <View style={{ width: "90%", textAlign: "justify", flexDirection: "column" }}>
                          <Text>{subsection.title}</Text>
                          {subsection.letteredParagraphs &&
                            subsection.letteredParagraphs.map((lp) => (
                              <View key={lp.letter} style={{ flexDirection: "row" }}>
                                <Text style={{ width: "10%" }}>{lp.letter}</Text>
                                <Text style={{ width: "90%" }}>{lp.paragraph}</Text>
                              </View>
                            ))}
                        </View>
                      </View>
                    ))}
                  {section.image && (
                    <View style={{ marginHorizontal: "auto" }}>
                      <Image src={section.image} style={{ height: 100, width: 100 }} />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.text}>No Articles of Association data available.</Text>
      )}

      {/* Signatories */}

      <Text style={{ fontFamily: "Arial Narrow Bold" }}>
        Wherefore, we resolved to approve the {annex.organization.name} Articles of Association and submit the same to
        the Director of the Office for Student Affairs for approval and the General Assembly for its ratification.
      </Text>

      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <Image
          src={annex.president?.signatureUrl || "/assets/signature.png"}
          style={{ width: 200, height: 50, marginHorizontal: "auto" }}
        />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.president?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>President</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <Image
          src={annex.vicePresident?.signatureUrl || "/assets/signature.png"}
          style={{ width: 200, height: 50, marginHorizontal: "auto" }}
        />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>
          {annex.vicePresident?.name || "First name M.I. Last Name"}
        </Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Vice President</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        {annex.secretary?.signatureUrl ? (
          <Image src={annex.secretary.signatureUrl} style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        ) : (
          <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        )}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.secretary?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Secretary</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        {annex.treasurer?.signatureUrl ? (
          <Image src={annex.treasurer.signatureUrl} style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        ) : (
          <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        )}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.treasurer?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Treasurer</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        {annex.auditor?.signatureUrl ? (
          <Image src={annex.auditor.signatureUrl} style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        ) : (
          <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        )}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.auditor?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Auditor</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        {annex.peaceRelationsOfficer?.signatureUrl ? (
          <Image
            src={annex.peaceRelationsOfficer.signatureUrl}
            style={{ width: 200, height: 50, marginHorizontal: "auto" }}
          />
        ) : (
          <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        )}
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>
          {annex.peaceRelationsOfficer?.name || "First name M.I. Last Name"}
        </Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Peace Relations Officer</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>

      <Text style={{ marginTop: 10 }}>
        Done in the University of Santo Tomas, Philippines, {formatDate(annex.dateSubmitted)}
      </Text>

      <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Attested by:</Text>

      {annex.adviser?.signatureUrl ? (
        <Image src={annex.adviser.signatureUrl} style={{ width: 200, height: 50 }} />
      ) : (
        <View style={{ width: 200, height: 50 }} />
      )}
      <Text style={{ fontFamily: "Arial Narrow Bold" }}>
        {annex.adviser?.name || "Complete Name of Organization Adviser"}
      </Text>
      <Text style={{}}>
        <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Adviser, </Text>
        {annex.organization.name || "Name of Org"}
      </Text>
      <Text style={{}}>
        <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>A.Y. </Text>
        {annex.academicYear || "2021-2024"}
      </Text>
      <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 20 }}>Certified by:</Text>
      {annex.comelecRepresentative?.signatureUrl ? (
        <Image src={annex.comelecRepresentative.signatureUrl} style={{ width: 200, height: 50 }} />
      ) : (
        <View style={{ width: 200, height: 50 }} />
      )}
      <Text style={{ fontFamily: "Arial Narrow Bold" }}>
        {annex.comelecRepresentative?.name || "Name of Local COMELEC representative"}
      </Text>
      <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>
        {annex.comelecRepresentative?.position || "Position"}
      </Text>

      {/* Annex Title */}
      <View fixed style={styles.footer}>
        <Text>All rights reserved by the Office for Student Affairs</Text>
      </View>
    </Page>
  </Document>
);

export default function AnnexC1Manager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexC1[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexC1 | null>(null);
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
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-c1`);
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
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-c1/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const fetchSingleAnnex = async (id: string) => {
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-c1/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching single annex:", error);
      throw error;
    }
  };

  const generatePDFBlob = async (annex: AnnexC1) => {
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

  const openSignatureModal = async (annex: AnnexC1) => {
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

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-c1/${selectedAnnex._id}`, {
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
        throw new Error("Failed to update Annex C1");
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
      <h1 className="text-2xl font-bold mb-6">ANNEX C-1 Articles of Association</h1>
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
        </div>
      )}

      {isModalOpen && selectedAnnex && pdfBlob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-7xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                <h3 className="text-2xl font-semibold">Add Signature to Annex C-1</h3>
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
                      <option value="president">President</option>
                      <option value="vicePresident">Vice President</option>
                      <option value="secretary">Secretary</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="auditor">Auditor</option>
                      <option value="peaceRelationsOfficer">Peace Relations Officer</option>
                      <option value="adviser">Adviser</option>
                      <option value="comelecRepresentative">COMELEC Representative</option>
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
  annex: AnnexC1;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  openSignatureModal: (annex: AnnexC1) => void;
  downloadPDF: (id: string) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, openSignatureModal, downloadPDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Articles of Association for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Articles
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
          <div className="flex items-center space-x-4">
            <label className="font-medium">Annex ID:</label>
            <span>{annex._id}</span>
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
