"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, Upload, X, Trash2 } from "lucide-react";
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
  pdf?: string;
  status: string;
  soccRemarks: string;
  osaRemarks: string;
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
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.president?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>President</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>
          {annex.vicePresident?.name || "First name M.I. Last Name"}
        </Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Vice President</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.secretary?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Secretary</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.treasurer?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Treasurer</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
        <Text style={{ fontFamily: "Arial Narrow Bold" }}>{annex.auditor?.name || "First name M.I. Last Name"}</Text>
        <Text style={{}}>
          <Text style={{ fontFamily: "Arial Narrow Italic" }}>Auditor</Text> {annex.organization.name}{" "}
          {annex.academicYear}
        </Text>
      </View>
      <View style={{ textAlign: "center", flexDirection: "column" }}>
        <View style={{ width: 200, height: 50, marginHorizontal: "auto" }} />
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

      <View style={{ width: 200, height: 50 }} />
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

      <View style={{ width: 200, height: 50 }} />
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
    if (annex.pdf) {
      const response = await fetch(annex.pdf);
      return await response.blob();
    } else {
      const fullAnnex = await fetchSingleAnnex(annex._id);
      const doc = <MyDocument annex={fullAnnex} />;
      const asPdf = pdf(doc);
      return await asPdf.toBlob();
    }
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

  const handleUploadArticlesOfAssociation = async (id: string, file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const { url } = await uploadResponse.json();

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-c1/${id}`, {
        pdf: url,
      });

      if (updateResponse.data) {
        setAnnexList(annexList.map((annex) => (annex._id === id ? updateResponse.data : annex)));
        alert("Articles of Association PDF uploaded successfully");
      } else {
        throw new Error("Failed to update Annex C1");
      }
    } catch (error) {
      console.error("Error uploading Articles of Association:", error);
      alert(`Error uploading Articles of Association: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveArticlesOfAssociation = async (id: string) => {
    try {
      setIsLoading(true);
      const annex = annexList.find((a) => a._id === id);
      if (!annex || !annex.pdf) {
        throw new Error("No Articles of Association PDF found");
      }

      const fileName = annex.pdf.split("/").pop();
      if (!fileName) {
        throw new Error("Invalid file name");
      }

      await fetch("/api/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      });

      const updateResponse = await axios.patch(`/api/annexes/${params.organizationId}/annex-c1/${id}`, {
        pdf: null,
      });

      if (updateResponse.data) {
        setAnnexList(annexList.map((annex) => (annex._id === id ? updateResponse.data : annex)));
        alert("Articles of Association PDF removed successfully");
      } else {
        throw new Error("Failed to update Annex C1");
      }
    } catch (error) {
      console.error("Error removing Articles of Association:", error);
      alert(`Error removing Articles of Association: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-c1/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-c1/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-c1/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-c1/${annexId}/disapprove`);
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
              downloadPDF={downloadPDF}
              handleUploadArticlesOfAssociation={handleUploadArticlesOfAssociation}
              handleRemoveArticlesOfAssociation={handleRemoveArticlesOfAssociation}
              onSubmit={handleSubmitAnnex}
              onUpdateRemarks={handleUpdateRemarks}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              session={session}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexC1;
  editAnnex: (id: string) => void;
  downloadPDF: (id: string) => void;
  handleUploadArticlesOfAssociation: (id: string, file: File) => Promise<void>;
  handleRemoveArticlesOfAssociation: (id: string) => Promise<void>;
  onSubmit: (annexId: string) => void;
  onUpdateRemarks: (annexId: string, type: "socc" | "osa", remarks: string) => void;
  onApprove: (annexId: string) => void;
  onDisapprove: (annexId: string) => void;
  session: any;
}

function AnnexCard({
  annex,
  editAnnex,
  downloadPDF,
  handleUploadArticlesOfAssociation,
  handleRemoveArticlesOfAssociation,
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
            <h2 className="card-title">Articles of Association for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {session?.user?.role === "RSO" && annex.status !== "Approved" && annex.status !== "For Review" && (
              <button
                className={`btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200 ${annex.pdf ? "btn-disabled" : ""}`}
                onClick={() => editAnnex(annex._id)}
                disabled={!!annex.pdf}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Articles
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => downloadPDF(annex._id)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            {annex.pdf ? (
              session?.user?.role === "RSO" && (
                <button
                  className="btn btn-ghost btn-sm text-red-500"
                  onClick={() => handleRemoveArticlesOfAssociation(annex._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove PDF
                </button>
              )
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadArticlesOfAssociation(annex._id, file);
                    }
                  }}
                  className="hidden"
                  id={`upload-pdf-${annex._id}`}
                />
                <label htmlFor={`upload-pdf-${annex._id}`} className="btn btn-ghost btn-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </label>
              </div>
            )}
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
