"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, X, Upload } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import PDFMerger from "pdf-merger-js";
import ExpenseReport from "@/components/ExpenseReport";
import BackButton from "@/components/BackButton";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface Signature {
  name: string;
  position: string;
  signatureUrl: string;
}

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

type SponsorshipType = "Cash" | "Deals" | "Booth" | "Product Launching" | "Flyers" | "Discount Coupon";

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
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
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

Font.register({
  family: "Times-Roman",
  src: "/fonts/Times-Roman.ttf",
});

Font.register({
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>,
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
  table: {
    // @ts-ignore
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "30%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    textAlign: "center",
  },
  signaturePosition: {
    fontSize: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  pdfContainer: {
    marginTop: 10,
    border: 1,
    padding: 5,
  },
  pdfTitle: {
    fontSize: 10,
    fontFamily: "Arial Narrow Bold",
    marginBottom: 5,
  },
  pdfPreview: {
    width: "100%",
    height: 200,
    objectFit: "contain",
  },
});

const MyDocument: React.FC<MyDocumentProps> = ({ annex }) => {
  const getUniqueEvents = () => {
    const eventsMap = new Map<string, Event>();
    Object.entries(annex.operationalAssessment).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item: OperationalAssessmentCategory) => {
          if (item.event) {
            eventsMap.set(item.event._id, item.event);
          }
        });
      }
    });
    return Array.from(eventsMap.values());
  };

  const uniqueEvents = getUniqueEvents();

  //  const evaluationSummary = event.evaluationSummary || {};
  //  const criteria = Object.keys(evaluationSummary);

  return (
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
                ANNEX E
              </Text>
            </View>
          </View>

          <Text
            style={{ fontSize: 8, textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
            Organization Operational Assessment Form
          </Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>
        {/* Title Section */}
        <Text style={{ textDecoration: "underline", fontSize: 14, fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
          Organizational Operational Assessment Form
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 9 }}>
          Align all event/projects hosted by the organization to the Strategic Directional Areas, SEAL of Thomasian
          Education, and Project Direction. (Include event title and e-ReSERVe No. in all segments applicable)
        </Text>
        {/* Table 1 */}
        <View>
          <View style={{ border: 1, marginTop: 10 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                textAlign: "center",
                backgroundColor: "black",
                color: "white",
                borderColor: "black",
                fontSize: 6,
              }}
            >
              <Text style={{ width: "35%", padding: 2 }}>
                STRATEGIC DIRECTIONAL AREAS (SDAs) SUPPORTED BY THE PROJECT OUTCOMES
              </Text>
              <Text style={{ width: "50%", padding: 2 }}>
                TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SDAs <Br /> (ex. HYPE: Mitolohiya – e-ReSERVe Number:
                72637)
              </Text>
              <Text style={{ width: "15%", padding: 2 }}>
                TOTAL NUMBER OF <Br /> EVENTS
              </Text>
            </View>
            {/* Contents */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold Italic" }}>VO1</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Thomasian Identity.</Text> To form servant
                  leaders who espouse Thomasian ideals and values as they collaborate with the University in the
                  fulfillment of her mission and actively take part in nation building
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v01.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v01.length}</Text>
              </View>
            </View>

            {/* VO2 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO2</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Leadership and Governance.</Text> To form
                  servant leaders who espouse Thomasian ideals and values as they collaborate with the University in the
                  fulfillment of her mission and actively take part in nation building
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v02.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v02.length}</Text>
              </View>
            </View>

            {/* VO3 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO3</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Teaching and Learning.</Text> To be a
                  world-class institution of higher learning.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v03.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v03.length}</Text>
              </View>
            </View>

            {/* VO4 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO4</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Research and Innovation.</Text>
                  To become an internationally acknowledged expert in pioneering and innovative research in the arts and
                  humanities, social science, business management and education, health and allied sciences, science and
                  technology, and the sacred sciences.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v04.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v04.length}</Text>
              </View>
            </View>

            {/* VO5 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO5</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Community Development and Advocacy.</Text>
                  To become a vibrant community of evangelizers actively engaged in social transformation through
                  advocacy and ministry.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v05.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v05.length}</Text>
              </View>
            </View>

            {/* VO6 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO6</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Student Welfare and Services.</Text>
                  To promote and ensure student academic achievement and life success through responsive and
                  empirical-based services of global standards.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v06.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v06.length}</Text>
              </View>
            </View>

            {/* VO7 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO7</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Public Presence.</Text> To be an institution
                  of preeminent influence in the global community by taking a proactive stance in social, cultural, and
                  moral advocacies and assuming a lead role in national and international policy formulation
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v07.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v07.length}</Text>
              </View>
            </View>

            {/* VO8 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO8</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Resource Management.</Text> To provide a
                  conducive learning and working environment with state-of-the-art facilities and resources in a
                  self-sustainable University through the engagement of a professional Thomasian workforce who meets
                  international standards and adapts to global change.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v08.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v08.length}</Text>
              </View>
            </View>

            {/* VO9 */}
            <View style={{ flexDirection: "row", textAlign: "center", fontSize: 8, borderTop: 1 }}>
              <View style={{ width: "5%", borderRight: 1 }}>
                <Text style={{ padding: 2, fontFamily: "Arial Narrow Bold" }}>VO9</Text>
              </View>
              <View style={{ width: "30%", borderRight: 1, textAlign: "justify", padding: 2 }}>
                <Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Internationalization.</Text> To promote
                  internationalization and integrate it into the institution's strategic plans and initiatives for the
                  purpose of preparing students for a productive engagement in the global arena of ideas and work.
                </Text>
              </View>
              <View style={{ width: "50%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                {annex.operationalAssessment.v09.map((item, index) => (
                  <Text key={index} style={{ marginBottom: 2 }}>
                    {item.event.title} - {item.event.eReserveNumber}
                  </Text>
                ))}
              </View>
              <View style={{ width: "15%" }}>
                <Text style={{ padding: 2 }}>{annex.operationalAssessment.v09.length}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Table 2 */}
        <View break style={{ border: 1 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "black",
              color: "white",
              fontSize: "6",
              textAlign: "center",
            }}
          >
            <Text style={{ width: "15%", padding: 2 }}>THE SEAL OF THOMASIAN EDUCATION</Text>
            <Text style={{ width: "30%", padding: 2 }}>
              SEAL OF THOMASIAN EDUCATION PERFORMANCE INDICATORS (SEAL-PI)
            </Text>
            <Text style={{ width: "40%", padding: 2 }}>TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SEAL-PI</Text>
            <Text style={{ width: "15%", padding: 2 }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Servant Leader
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S1: Show leadership abilities to promote advocacies for life, freedom, justice, and solidarity in the
                  service of the family, the local and global communities, the Church and the environment.{" "}
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.s1.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.s1.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S2: Implement relevant projects and activities that speak of Christian compassion to the poor and the
                  marginalized in order to raise their quality of life
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.s2.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.s2.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  S3: Show respect for the human person, regardless of race, religion, age, and gender.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.s3.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.s3.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Effective communicator and collaborator
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E1: Express myself clearly, correctly, and confidently in various environments, contexts, and
                  technologies of human interaction.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.e1.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.e1.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E2: Work productively with individuals or groups from diverse cultures and demographics.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.e2.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.e2.length}
                </Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  E3: Show profound respect for individual differences and/or uniqueness as members of God's creation
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.e3.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.e3.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              Analytical and creative thinker
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A1: Show judiciousness and resourcefulness in making personal and professional decisions.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.a1.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.a1.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A2: Engage in research undertakings that respond to societal issues.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.a2.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.a2.length}
                </Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  A3: Express personal and professional insights through an ethical and evidence-based approach.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.a3.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.a3.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "15%", borderRight: 1, textAlign: "center" }}>
              <Br />
              <Br />
              <Br />
              <Br />
              <Br />
              Lifelong learner
            </Text>
            <View style={{ width: "85%", borderRight: 1, flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L1: Engage in reflective practice to ensure disciplinal relevance and professional development.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.l1.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.l1.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L2: Exhibit preparedness and interest for continuous upgrading of competencies required by the
                  profession or area of specialization.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.l2.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.l2.length}
                </Text>
              </View>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ padding: 2, width: "36.5%", textAlign: "justify", borderRight: 1 }}>
                  L3: Manifest fidelity to the teachings of Christ, mediated by the Catholic Church, in the continuous
                  deepening of faith and spirituality in dealing with new life situations and challenges.
                </Text>
                <View style={{ width: "47.5%", borderRight: 1, padding: 2, flexDirection: "column" }}>
                  {annex.operationalAssessment.l3.map((item, index) => (
                    <Text key={index} style={{ marginBottom: 2 }}>
                      {item.event.title} - {item.event.eReserveNumber}
                    </Text>
                  ))}
                </View>
                <Text style={{ textAlign: "center", width: "16%", padding: 2 }}>
                  {annex.operationalAssessment.l3.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Table 3 */}
        <View break style={{ border: 1 }}>
          <View
            style={{ flexDirection: "row", backgroundColor: "black", color: "white", textAlign: "center", fontSize: 7 }}
          >
            <Text style={{ width: "25%" }}>PROJECT DIRECTION</Text>
            <Text style={{ width: "60%" }}>TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE PROJECT DIRECTION </Text>
            <Text style={{ width: "15%" }}>TOTAL NUMBER OF EVENTS</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 1 <Br />
              </Text>
              End Poverty
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg1.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg1.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 2 <Br />
              </Text>
              End Hunger
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg2.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg2.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 3 <Br />
              </Text>
              Well-Being
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg3.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg3.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 4 <Br />
              </Text>
              Quality Education
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg4.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg4.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 5 <Br />
              </Text>
              Gender Equality
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg5.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg5.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 6 <Br />
              </Text>
              Water and Sanitation for All
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg6.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg6.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 7 <Br />
              </Text>
              Affordable and Sustainable Energy
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg7.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg7.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 8 <Br />
              </Text>
              Decent Work for All
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg8.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg8.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 9 <Br />
              </Text>
              Technology to Benefit All
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg9.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg9.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 10 <Br />
              </Text>
              Reduce Inequality
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg10.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg10.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 11 <Br />
              </Text>
              Safe Cities and Communities
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg11.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg11.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 12 <Br />
              </Text>
              Responsible Consumption by All
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg12.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg12.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 13 <Br />
              </Text>
              Stop Climate Change
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg13.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg13.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 14 <Br />
              </Text>
              Protect the Ocean
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg14.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg14.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 15 <Br />
              </Text>
              Take Care of the Earth
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg15.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg15.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 16 <Br />
              </Text>
              Live in Peace
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg16.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg16.length}</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 8, borderTop: 1 }}>
            <Text style={{ width: "25%", borderRight: 1, padding: 2 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                SDG 17 <Br />
              </Text>
              Mechanisms and Partnerships to Reach the Goal
            </Text>
            <View style={{ width: "60%", flexDirection: "column", borderRight: 1, textAlign: "center" }}>
              {annex.operationalAssessment.sdg17.map((item, index) => (
                <Text key={index}>
                  {item.event.title} - {item.event.eReserveNumber}
                </Text>
              ))}
            </View>
            <Text style={{ width: "15%", padding: 2 }}>{annex.operationalAssessment.sdg17.length}</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>(Attach Evaluation Report of all Events)</Text>
        {/* start of event */}
        {uniqueEvents.map((event: Event, index: number) => (
          <View break key={index}>
            <View>
              <View style={{ flexDirection: "column", textAlign: "center" }}>
                <Text>UNIVERSITY OF SANTO TOMAS</Text>
                <Text>A.Y. 2024-2025</Text>
                <Text>Evaluation Report</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>A. TITLE OF EVENT.</Text>
                <Text style={{ width: "40%" }}>{event.title}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>B. DATE</Text>
                <Text style={{ width: "40%" }}>{new Date(event.date).toDateString()}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>C. VENUE:</Text>
                <Text style={{ width: "40%" }}>{event.venue}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>D. NAME OF ADVISER/S</Text>
                <View style={{ fontFamily: "Arial Narrow Bold", width: "40%", flexDirection: "column" }}>
                  <Text> {event.adviser}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>
                  a) TIME ATTENDED:
                </Text>
                <Text style={{ width: "40%" }}>
                  from:{event?.timeAttended?.from} to:{event?.timeAttended?.to}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%" }}>E. SPEAKER'S NAME:</Text>
                <Text style={{ width: "40%" }}>{event.speakerName}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>a) TOPIC:</Text>
                <Text style={{ width: "40%" }}>{event.speakerTopic}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>
                  b) AFFILIATION/S:
                </Text>
                <Text style={{ width: "40%" }}>{event.speakerAffiliation}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "30%", paddingLeft: 20 }}>c) POSITION:</Text>
                <Text style={{ width: "40%" }}>{event.speakerPosition}</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ fontFamily: "Arial Narrow Bold", width: "40%" }}>F. RESPONDENTS DEMOGRAPHICS</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ width: "30%", paddingLeft: 10 }}>Total number of participants</Text>
                <Text style={{ width: "40%" }}>{event.totalParticipants}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ width: "30%", paddingLeft: 10 }}>Total number of respondents</Text>
                <Text style={{ width: "40%" }}>{event.totalRespondents}</Text>
              </View>
            </View>
            {/* Table 4 */}
            <View>
              <View style={{ marginTop: 10, border: 1, fontSize: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  <Text style={{ width: "30%", borderRight: 1, paddingTop: 5 }}>Criteria</Text>
                  <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>Excellent {"\n"} (5)</Text>
                  <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>Very Good {"\n"} (4)</Text>
                  <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>Good {"\n"} (3)</Text>
                  <Text style={{ width: "14%", borderRight: 1, padding: 2 }}>Fair {"\n"} (2)</Text>
                  <Text style={{ width: "14%", padding: 2 }}>
                    Needs {"\n"}
                    Improvement {"\n"} (1)
                  </Text>
                </View>

                {event.evaluationSummary && Object.keys(event.evaluationSummary).length > 0 ? (
                  Object.entries(event.evaluationSummary).map(([criteria, rating], index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", textAlign: "center", borderTop: index > 0 ? 1 : 0 }}
                    >
                      <Text style={{ width: "30%", borderRight: 1, paddingVertical: 10 }}>{criteria}</Text>
                      <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}>{rating["5"]}</Text>
                      <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}>{rating["4"]}</Text>
                      <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}>{rating["3"]}</Text>
                      <Text style={{ width: "14%", borderRight: 1, paddingVertical: 10 }}>{rating["2"]}</Text>
                      <Text style={{ width: "14%", paddingVertical: 10 }}>{rating["1"]}</Text>
                    </View>
                  ))
                ) : (
                  <View style={{ flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                    <Text style={{ width: "100%", paddingVertical: 10 }}>
                      No evaluation summary available for this event.
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* Table 5 */}
            <View>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>G. ASSESSMENT OF THE EVENT</Text>
              <View style={{ border: 1, marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    fontSize: 10,
                    textAlign: "center",
                    color: "white",
                    backgroundColor: "black",
                  }}
                >
                  <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "35%" }}>CRITERIA</Text>
                  <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "15%" }}>
                    RATING {"\n"}
                    <Text style={{ fontSize: 8 }}>(5= HIGHEST {"\n"} 1=LOWEST)</Text>
                  </Text>
                  <Text style={{ borderRight: 1, fontFamily: "Arial Narrow Bold", width: "25%" }}>ANALYSIS</Text>
                  <Text style={{ fontFamily: "Arial Narrow Bold", width: "25%" }}>RECOMMENDATION</Text>
                </View>
                {event.assessment && event.assessment.criteria ? (
                  Object.entries(event.assessment.criteria).map(([criterion, data], index) => (
                    <View key={index} style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
                      <Text style={{ borderRight: 1, width: "35%", textAlign: "center", padding: 2 }}>{criterion}</Text>
                      <Text style={{ borderRight: 1, width: "15%", padding: 2, textAlign: "center" }}>
                        {data.rating || ""}
                      </Text>
                      <Text
                        style={{
                          borderRight: 1,
                          width: "25%",
                          padding: 2,
                          textAlign: "justify",
                        }}
                      >
                        {data.analysis || ""}
                      </Text>
                      <Text style={{ width: "25%", padding: 2, textAlign: "justify" }}>
                        {data.recommendation || ""}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={{ flexDirection: "row", fontSize: 10, borderTop: 1 }}>
                    <Text style={{ width: "100%", textAlign: "center", padding: 2 }}>
                      No assessment criteria available
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ flexDirection: "column", marginTop: 10, border: 1 }}>
              <Text
                style={{
                  border: 1,
                  color: "white",
                  backgroundColor: "black",
                  padding: 5,
                  fontSize: 10,
                }}
              >
                Comments and Suggestions of Participants, Members, and Attendees (Verbatim)
              </Text>
              {event.comments && event.comments.length > 0 ? (
                event.comments.map((comment, index) => (
                  <Text
                    key={comment.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "lightgray",
                      padding: 5,
                      fontSize: 9,
                    }}
                  >
                    {comment.text}
                  </Text>
                ))
              ) : (
                <Text
                  style={{
                    backgroundColor: "white",
                    padding: 5,
                    fontSize: 9,
                  }}
                >
                  No comments available for this event.
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>H. SPONSOR/S NAME:</Text>
              <View style={{ fontFamily: "Arial Narrow Bold", width: "40%", flexDirection: "column" }}>
                <Text> {event.sponsorName}</Text>
                {/* <Text style={{ paddingTop: 10 }}> __________________</Text> */}
              </View>
            </View>

            <View style={{ fontFamily: "Arial Narrow Bold" }}>
              <Text style={{ paddingLeft: 10, paddingTop: 10 }}>Type of Sponsorship</Text>
              <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
                <View style={{ flexDirection: "column", width: "20%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>{event.sponsorshipTypes.includes("Cash") ? "0" : "O"}</Text>{" "}
                    Cash
                  </Text>
                </View>
                <View style={{ flexDirection: "column", width: "40%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>
                      {event.sponsorshipTypes.includes("Product Launching") ? "0" : "O"}
                    </Text>{" "}
                    Product Launching
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
                <View style={{ flexDirection: "column", width: "20%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>{event.sponsorshipTypes.includes("Deals") ? "0" : "O"}</Text>{" "}
                    Deals
                  </Text>
                </View>
                <View style={{ flexDirection: "column", width: "40%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>{event.sponsorshipTypes.includes("Flyers") ? "0" : "O"}</Text>{" "}
                    Flyers
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", paddingLeft: 10, marginLeft: 40, paddingTop: 10 }}>
                <View style={{ flexDirection: "column", width: "20%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>{event.sponsorshipTypes.includes("Booth") ? "0" : "O"}</Text>{" "}
                    Booth
                  </Text>
                </View>
                <View style={{ flexDirection: "column", width: "40%" }}>
                  <Text>
                    <Text style={{ fontFamily: "Boxed" }}>
                      {event.sponsorshipTypes.includes("Discount Coupon") ? "0" : "O"}
                    </Text>{" "}
                    Discount
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>I. Please attach the following:</Text>
            </View>
            <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
              <Text>•</Text>
              <Text style={{ paddingLeft: 10 }}>Project Proposal Form (PPF)</Text>
            </View>
            <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
              <Text>•</Text>
              <Text style={{ paddingLeft: 10 }}>Actual answered Evaluation Forms</Text>
            </View>
            <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
              <Text>•</Text>
              <View style={{ paddingLeft: 10, flexDirection: "column" }}>
                <Text>Liquidation Report and PHOTOCOPY of Original Receipts</Text>
                <Text>(Please follow standard format)</Text>
              </View>
            </View>
            <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
              <Text>•</Text>
              <Text style={{ paddingLeft: 10 }}>Short write-up of the event for publication.</Text>
            </View>
            <View style={{ fontFamily: "Arial Narrow Bold", paddingLeft: 20, paddingTop: 10, flexDirection: "row" }}>
              <Text>•</Text>
              <Text style={{ paddingLeft: 10 }}>Pictures of Event with Description</Text>
            </View>

            {/* MAP OVER ALL THE EVENT.FILES FILE IN THE EVENT AND CONCATENATE THE PDF HERE */}
          </View>
        ))}
        {/* end of event} */}

        <Text break style={{}}>
          Recognition of Organizational Excellence
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Italic", paddingTop: 10 }}>
          (Did your organization receive any recognition from award-giving entities inside and outside the university?
          Did your organization represent the University or country, with distinction, in international conferences or
          congresses, of major religious, socio-cultural, educational or athletic importance?){" "}
        </Text>
        <Text style={{ fontFamily: "Arial Narrow Bold Italic", paddingTop: 10, textDecoration: "underline" }}>
          Enumerate and give frequency.
        </Text>
        <View style={{ border: 1, margin: 10 }}>
          <View style={{ flexDirection: "row", fontSize: 8, fontFamily: "Arial Narrow Bold", textAlign: "center" }}>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Title of Award</Text>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Award Giving Body</Text>
            <Text style={{ padding: 5, width: "17%", borderRight: 1 }}>Date of Conferment</Text>
            <View style={{ width: "49%", flexDirection: "column" }}>
              <Text>Recognition from 2019 to 2023</Text>
              <View style={{ flexDirection: "row", borderTop: 1 }}>
                <Text style={{ borderRight: 1, width: "25%" }}>
                  Student
                  <Br />
                  Awards
                </Text>
                <Text style={{ borderRight: 1, width: "25%" }}>Regional</Text>
                <Text style={{ borderRight: 1, width: "25%" }}>National</Text>
                <Text style={{ width: "25%" }}>International</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              fontSize: 8,
              fontFamily: "Arial Narrow Bold",
              textAlign: "center",
              borderTop: 1,
            }}
          >
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}> </Text>
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}></Text>
            <Text style={{ padding: 2, width: "17%", borderRight: 1 }}></Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}>
              <Text style={{ fontFamily: "Boxed" }}></Text>
            </Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}></Text>
            <Text style={{ borderRight: 1, width: "12.25%", padding: 2 }}></Text>
            <Text style={{ width: "12.25%", padding: 2 }}></Text>
          </View>
        </View>
        {/* Signature Section */}
        <View style={{ fontSize: 8 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 10 }}>Prepared By:</Text>
          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}>OUTGOING OFFICERS:</Text>
          </Text>
          <View style={{ flexDirection: "column" }}>
            <View style={{ width: "50%", paddingTop: 30 }}>
              {annex.outgoingSecretary && (
                <Image src={annex.outgoingSecretary.signatureUrl} style={{ width: 100, height: 50 }} />
              )}
              <Text style={{ fontFamily: "Arial Narrow Bold", borderTop: 1 }}>
                {annex.outgoingSecretary ? annex.outgoingSecretary.name : "SIGNATURE OVER PRINTED NAME OF SECRETARY"}
              </Text>
              <Text>{annex.outgoingSecretary && annex.outgoingSecretary.position}</Text>
            </View>
            <View style={{ width: "50%", paddingTop: 30 }}>
              {annex.outgoingPresident && (
                <Image src={annex.outgoingPresident.signatureUrl} style={{ width: 100, height: 50 }} />
              )}
              <Text style={{ fontFamily: "Arial Narrow Bold", borderTop: 1 }}>
                {annex.outgoingPresident ? annex.outgoingPresident.name : "SIGNATURE OVER PRINTED NAME OF PRESIDENT"}
              </Text>
              <Text>{annex.outgoingPresident && annex.outgoingPresident.position}</Text>
            </View>
          </View>

          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}>INCOMING OFFICERS:</Text>
          </Text>

          <View style={{ flexDirection: "column" }}>
            <View style={{ width: "50%", paddingTop: 30 }}>
              {annex.incomingSecretary && (
                <Image src={annex.incomingSecretary.signatureUrl} style={{ width: 100, height: 50 }} />
              )}
              <Text style={{ fontFamily: "Arial Narrow Bold", borderTop: 1 }}>
                {annex.incomingSecretary ? annex.incomingSecretary.name : "SIGNATURE OVER PRINTED NAME OF SECRETARY"}
              </Text>
              <Text>{annex.incomingSecretary && annex.incomingSecretary.position}</Text>
            </View>
            <View style={{ width: "50%", paddingTop: 30 }}>
              {annex.incomingPresident && (
                <Image src={annex.incomingPresident.signatureUrl} style={{ width: 100, height: 50 }} />
              )}
              <Text style={{ fontFamily: "Arial Narrow Bold", borderTop: 1 }}>
                {annex.incomingPresident ? annex.incomingPresident.name : "SIGNATURE OVER PRINTED NAME OF PRESIDENT"}
              </Text>
              <Text>{annex.incomingPresident && annex.incomingPresident.position}</Text>
            </View>
          </View>

          <Text style={{ fontFamily: "Arial Narrow Bold Italic", marginTop: 10 }}>
            <Text style={{ backgroundColor: "black", color: "white" }}> Certified by:</Text>
          </Text>

          <View style={{ paddingTop: 30 }}>
            {annex.adviser && <Image src={annex.adviser.signatureUrl} style={{ width: 100, height: 50 }} />}
            <Text style={{ fontFamily: "Arial Narrow Bold", width: "50%", borderTop: 1 }}>
              {annex.adviser ? annex.adviser.name : "SIGNATURE OVER PRINTED NAME OF ADVISER"}
            </Text>
            <Text>{annex.adviser && annex.adviser.position}</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
  </View>
);

const Br = () => "\n";

const AnnexEManager: React.FC = () => {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexE | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { organizationId } = useParams();
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [inflowsMap, setInflowsMap] = useState<Map<string, Inflow[]>>(new Map());
  const [currentAcademicYear, setCurrentAcademicYear] = useState<string>("");

  useEffect(() => {
    if (organizationId) {
      fetchAnnexes();
      fetchOrganizationCurrentAcademicYear();
    }
  }, [organizationId]);

  const fetchOrganizationCurrentAcademicYear = async () => {
    try {
      const response = await axios.get(`/api/${organizationId}/get-current-academic-year`);
      setCurrentAcademicYear(response.data.academicYear);
    } catch (error) {
      console.error("Error fetching current academic year:", error);
    }
  };

  const fetchInflows = async (annexId: string): Promise<Inflow[]> => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-e/${annexId}/fetch-inflows`);
      const fetchedInflows = response.data;
      setInflowsMap(new Map(inflowsMap.set(annexId, fetchedInflows)));
      return fetchedInflows;
    } catch (error) {
      console.error("Error fetching inflows:", error);
      return [];
    }
  };

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-e`);
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

  const generatePDFBlob = async (annex: AnnexE): Promise<Blob> => {
    try {
      console.log("Generating PDF for Annex E:", annex._id);

      const annexInflows = inflowsMap.get(annex._id) || [];

      const annexPdf = pdf(<MyDocument annex={annex} />);
      const annexBlob = await annexPdf.toBlob();

      let merger = new PDFMerger();
      await merger.add(annexBlob);

      const uniqueEvents = getUniqueEvents(annex.operationalAssessment);
      await mergeUniqueEventFiles(uniqueEvents, merger, annex, annexInflows);

      const mergedPdfBuffer = await merger.saveAsBuffer();
      const mergedPdf = new Blob([mergedPdfBuffer], { type: "application/pdf" });
      console.log("Merged Annex E PDF blob generated. Size:", mergedPdf.size, "bytes");
      return mergedPdf;
    } catch (error) {
      console.error("Error generating Annex E PDF blob:", error);
      throw error;
    }
  };

  const getUniqueEvents = (operationalAssessment: OperationalAssessment): Event[] => {
    const uniqueEventsMap = new Map<string, Event>();

    Object.values(operationalAssessment).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((item) => {
          if (item.event && !uniqueEventsMap.has(item.event._id)) {
            uniqueEventsMap.set(item.event._id, item.event);
          }
        });
      }
    });

    return Array.from(uniqueEventsMap.values());
  };

  const mergeUniqueEventFiles = async (
    events: Event[],
    merger: PDFMerger,
    annex: AnnexE,
    inflows: Inflow[]
  ): Promise<void> => {
    for (const event of events) {
      await mergeFiles(event.projectProposalForm, merger, "Project Proposal Form");

      const expenseReportPdf = pdf(<ExpenseReport event={event} inflows={inflows} annex={annex} />);
      const expenseReportBlob = await expenseReportPdf.toBlob();
      await merger.add(expenseReportBlob);

      await mergeFiles(event.actualAnsweredEvaluationForms, merger, "Actual Answered Evaluation Forms");
      await mergeFiles(event.shortWriteUp, merger, "Short Write-up");
      await mergeFiles(event.picturesOfEvent, merger, "Pictures of Event");
    }
  };

  const mergeFiles = async (files: string[], merger: PDFMerger, category: string): Promise<void> => {
    if (files && files.length > 0) {
      console.log(`Processing ${category} for event`);
      for (const fileUrl of files) {
        const fileBlob = await fetchPDF(fileUrl);
        if (fileBlob) {
          await merger.add(fileBlob);
          console.log(`Added ${category} file: ${fileUrl}`);
        } else {
          console.warn(`Failed to fetch ${category} file: ${fileUrl}`);
        }
      }
    } else {
      console.log(`No ${category} files found for event`);
    }
  };

  const fetchPDF = async (url: string): Promise<Blob | null> => {
    try {
      console.log("Fetching PDF from URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch PDF. Status:", response.status);
        throw new Error("Failed to fetch PDF");
      }
      const blob = await response.blob();
      console.log("PDF fetched successfully. Size:", blob.size, "bytes");
      return blob;
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return null;
    }
  };

  const generatePDF = async (annex: AnnexE) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);

      if (!inflowsMap.has(updatedAnnex._id)) {
        await fetchInflows(updatedAnnex._id);
      }

      const blob = await generatePDFBlob(updatedAnnex);
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

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexE> => {
    const response = await axios.get(`/api/annexes/${organizationId}/annex-e/${annexId}`);
    console.log("Fetched annex data:", response.data);
    return response.data;
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${organizationId}/annex-e/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-e/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-e/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${organizationId}/annex-e/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX E Organization Operational Assessment Form</h1>
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
              currentAcademicYear={currentAcademicYear}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Organization Operational Assessment Form Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

interface AnnexCardProps {
  annex: AnnexE;
  editAnnex: (id: string) => void;
  generatePDF: (annex: AnnexE) => void;
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
  generatePDF,
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
            <h2 className="card-title">Organization Operational Assessment Form Annex for AY {annex.academicYear}</h2>
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
                    Edit Assessment
                  </button>
                )}
              </>
            )}

            {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
              <button className="btn btn-outline btn-sm" onClick={() => generatePDF(annex)}>
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

export default AnnexEManager;
