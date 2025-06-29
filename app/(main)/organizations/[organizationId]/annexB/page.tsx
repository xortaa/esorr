"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download, PenTool, X, Upload } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import dynamic from "next/dynamic";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";

type AnnexB = {
  _id: string;
  academicYear: string;
  organization: {
    name: string;
    affiliation: string;
  };
  numberOfOfficers: number;
  maleMembersBelow18: number;
  maleMembers18To20: number;
  maleMembers21AndAbove: number;
  femaleMembersBelow18: number;
  femaleMembers18To20: number;
  femaleMembers21AndAbove: number;
  memberDistribution: {
    [program: string]: {
      firstYear: { new: number; old: number };
      secondYear: { new: number; old: number };
      thirdYear: { new: number; old: number };
      fourthYear: { new: number; old: number };
      fifthYear: { new: number; old: number };
    };
  };
  totalMembers: number;
  totalOfficersAndMembers: number;
  members: Array<{
    lastName: string;
    firstName: string;
    middleName: string;
    studentNumber: string;
    program: string;
    isNewMember: boolean;
  }>;
  secretary?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  adviser?: {
    name: string;
    position: string;
    signatureUrl: string;
  };
  status: string;
  soccRemarks: string;
  osaRemarks: string;
  dateSubmitted: Date;
};

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

type SignaturePosition = "secretary" | "adviser";

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
    paddingHorizontal: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
  },
  header: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  headerLeft: {
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  headerRight: {
    fontSize: 8,
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 20,
  },
  organizationName: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontFamily: "Arial Narrow Bold",
    marginRight: 5,
  },
  value: {
    fontFamily: "Arial Narrow",
    textDecoration: "underline",
  },
  privacyNotice: {
    fontFamily: "Arial Narrow Bold",
    marginBottom: 5,
  },
  privacyText: {
    textAlign: "justify",
    marginBottom: 15,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellHeader: {
    backgroundColor: "#000",
    color: "#fff",
  },
  tableCellCenter: {
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 35,
    right: 35,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    width: "100%",
    marginBottom: 5,
  },
  memberDistributionTable: {
    borderWidth: 1,
    borderColor: "#000",
  },
  memberDistributionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  memberDistributionCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  memberDistributionHeaderCell: {
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontFamily: "Arial Narrow Bold",
  },
  yearLevelCell: {
    width: "13%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  newOldCell: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 2,
  },
});

const NumofOfficers = ({ indexNum, facInstName, yearData }) => {
  return (
    <View style={{ width: "100%", flexDirection: "row", borderTopWidth: 1 }}>
      <View style={{ flexDirection: "column", width: "35%" }}>
        <Text
          style={{
            fontSize: 10,
            paddingLeft: 2,
            paddingTop: 4,
            paddingHorizontal: 5,
          }}
        >
          {indexNum}.<Text style={{ textAlign: "left" }}> {facInstName}</Text>
        </Text>
      </View>
      <View style={{ flexDirection: "column", textAlign: "center", width: "65%", borderLeftWidth: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {["firstYear", "secondYear", "thirdYear", "fourthYear", "fifthYear"].map((year, index) => (
            <View key={year} style={{ width: "20%", borderRightWidth: index < 4 ? 1 : 0, flexDirection: "row" }}>
              <Text style={{ width: "50%", borderRightWidth: 1, paddingVertical: 10, textAlign: "center" }}>
                {yearData[year].new}
              </Text>
              <Text style={{ width: "50%", paddingVertical: 10, textAlign: "center" }}>{yearData[year].old}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const MyDocument: React.FC<{ annex: AnnexB }> = ({ annex }) => {
  return (
    <Document>
      <Page style={styles.page} size="LEGAL">
        <View fixed style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left", fontFamily: "Times-Roman" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text
            style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}
            render={({ pageNumber, totalPages }) => `Page | ${pageNumber}`}
          />

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>List of Members</Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
        </View>

        <Text style={styles.title}>LIST OF MEMBERS</Text>
        <Text style={styles.subtitle}>(as of AY {annex.academicYear})</Text>

        <View style={styles.organizationName}>
          <Text style={styles.label}>NAME OF ORGANIZATION</Text>
          <Text style={styles.value}>{annex.organization.name}</Text>
        </View>

        <Text style={styles.privacyNotice}>
          OSA's Privacy Notice on the Documentary Requirements for Recognition of Student Organizations
        </Text>
        <Text style={styles.privacyText}>
          The Office for Student Affairs (OSA) gathers personal data of bonafide students of the University through the
          documentary requirements on Application for Recognition of Student Organizations. The personal data, photos,
          and membership/officership information form part of the student organizations' data bank. Data is stored
          online in a secure and safe server of the OSA, while the equivalent hard copy is kept on file and properly
          secured in a filing cabinet. The OSA administrators, staff in charge of student organizations, and OSA
          reviewers are the persons permitted to access the files of student organizations. These documents are not
          shared with any party outside the University unless the disclosure of such information is compelled by
          operation of law or as requested by external auditors, i.e., PACUCOA, AUN-QA, ISO, etc. These online files and
          hard copies are retained at the OSA/University Archives facility.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "25%" }]}>
              <Text>Number of Officers</Text>
            </View>
            <View style={[styles.tableCell, { width: "75%", borderRightWidth: 0 }]}>
              <Text>{annex.numberOfOfficers}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: "25%",
                borderRightWidth: 1,
                display: "flex",
              }}
            >
              <Text
                style={{
                  paddingTop: 15,
                  paddingHorizontal: 5,
                  paddingBottom: 5,
                  fontSize: 10,
                }}
              >
                Age and Gender {"\n"}Distribution of Members
              </Text>
            </View>

            <View style={{ width: "75%", flexDirection: "column" }}>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center" }}>
                <Text style={{ width: "20%", borderRightWidth: 1 }}></Text>
                <Text style={{ width: "40%", borderRightWidth: 1 }}>Total No. of Male members</Text>
                <Text style={{ width: "40%" }}>Total No. of Female members</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  Below 18
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}>
                  {" "}
                  {annex.maleMembersBelow18}{" "}
                </Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}> {annex.femaleMembersBelow18} </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  18 to 20
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}>
                  {" "}
                  {annex.maleMembers18To20}{" "}
                </Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}> {annex.femaleMembersBelow18} </Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTop: 1 }}>
                <Text style={{ width: "20%", borderRightWidth: 1, paddingHorizontal: 5, textAlign: "left" }}>
                  21 and above
                </Text>
                <Text style={{ width: "40%", borderRightWidth: 1, paddingHorizontal: 5 }}>
                  {" "}
                  {annex.maleMembers21AndAbove}{" "}
                </Text>
                <Text style={{ width: "40%", paddingHorizontal: 5 }}> {annex.femaleMembersBelow18} </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "100%", borderTop: 1, textAlign: "left" }}>
            <View
              style={{
                width: "25%",
                borderRightWidth: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ padding: 5 }}>
                Distribution of Members According to Faculty / College / Institute / School and Year Level
              </Text>
            </View>

            <View style={{ width: "75%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", textAlign: "center" }}>
                <View style={{ flexDirection: "column", textAlign: "center", width: "35%" }}>
                  <Text
                    style={{
                      padding: 10,
                      borderRightWidth: 1,
                      fontFamily: "Arial Narrow Bold",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    INSTITUTE / SCHOOL
                  </Text>
                  {annex.organization.affiliation ? (
                    <Text style={{ textDecoration: "underline", padding: 6 }}>{annex.organization.affiliation}</Text>
                  ) : (
                    <Text style={{ textDecoration: "underline", fontSize: 7, padding: 6 }}>____________________</Text>
                  )}
                </View>
                <View style={{ flexDirection: "column", textAlign: "center", width: "65%", borderLeftWidth: 1 }}>
                  <Text style={{}}>YEAR LEVEL</Text>
                  <View style={{ flexDirection: "row", borderTopWidth: 1 }}>
                    <Text style={{ width: "20%", borderRightWidth: 1, padding: 16 }}>1</Text>
                    <Text style={{ width: "20%", borderRightWidth: 1, padding: 16 }}>2</Text>
                    <Text style={{ width: "20%", borderRightWidth: 1, padding: 16 }}>3</Text>
                    <Text style={{ width: "20%", borderRightWidth: 1, padding: 16 }}>4</Text>
                    <Text style={{ width: "20%", padding: 16 }}>5</Text>
                  </View>
                </View>
              </View>
              <View style={{ width: "100%", flexDirection: "row", textAlign: "center", borderTopWidth: 1 }}>
                <View style={{ flexDirection: "column", textAlign: "center", width: "35%" }}>
                  <Text
                    style={{
                      padding: 10,
                    }}
                  >
                    Write Program and Major
                  </Text>
                </View>
                <View style={{ flexDirection: "column", textAlign: "center", width: "65%", borderLeftWidth: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "20%", borderRightWidth: 1, flexDirection: "row" }}>
                      <Text style={{ width: "50%", borderRightWidth: 1 }}>
                        N{"\n"}e{"\n"}w
                      </Text>
                      <Text style={{ width: "50%" }}>
                        O{"\n"}l{"\n"}d
                      </Text>
                    </View>
                    <View style={{ width: "20%", borderRightWidth: 1, flexDirection: "row" }}>
                      <Text style={{ width: "50%", borderRightWidth: 1 }}>
                        N{"\n"}e{"\n"}w
                      </Text>
                      <Text style={{ width: "50%" }}>
                        O{"\n"}l{"\n"}d
                      </Text>
                    </View>
                    <View style={{ width: "20%", borderRightWidth: 1, flexDirection: "row" }}>
                      <Text style={{ width: "50%", borderRightWidth: 1 }}>
                        N{"\n"}e{"\n"}w
                      </Text>
                      <Text style={{ width: "50%" }}>
                        O{"\n"}l{"\n"}d
                      </Text>
                    </View>
                    <View style={{ width: "20%", borderRightWidth: 1, flexDirection: "row" }}>
                      <Text style={{ width: "50%", borderRightWidth: 1 }}>
                        N{"\n"}e{"\n"}w
                      </Text>
                      <Text style={{ width: "50%" }}>
                        O{"\n"}l{"\n"}d
                      </Text>
                    </View>
                    <View style={{ width: "20%", flexDirection: "row" }}>
                      <Text style={{ width: "50%", borderRightWidth: 1 }}>
                        N{"\n"}e{"\n"}w
                      </Text>
                      <Text style={{ width: "50%" }}>
                        O{"\n"}l{"\n"}d
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Inputs */}
              <View>
                {Object.entries(annex.memberDistribution).map(([program, years], index) => (
                  <NumofOfficers key={index} indexNum={`${index + 1}`} facInstName={program} yearData={years} />
                ))}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "100%", borderTop: 1 }}>
            <Text
              style={{
                padding: 5,
                width: "51.4%",
                borderRightWidth: 1,
                fontFamily: "Arial Narrow Bold",
                textAlign: "right",
              }}
            >
              Total Number of MEMBERS
            </Text>

            <View style={{ width: "48.6%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", textAlign: "center" }}>
                {["firstYear", "secondYear", "thirdYear", "fourthYear", "fifthYear"].map((year, index) => {
                  const totalNew = Object.values(annex.memberDistribution).reduce(
                    (sum, program) => sum + program[year].new,
                    0
                  );
                  const totalOld = Object.values(annex.memberDistribution).reduce(
                    (sum, program) => sum + program[year].old,
                    0
                  );
                  return (
                    <View
                      key={year}
                      style={{ width: "20%", borderRightWidth: index < 4 ? 1 : 0, flexDirection: "row" }}
                    >
                      <Text style={{ width: "50%", borderRightWidth: 1, paddingVertical: 10, textAlign: "center" }}>
                        {totalNew}
                      </Text>
                      <Text style={{ width: "50%", paddingVertical: 10, textAlign: "center" }}>{totalOld}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "100%", borderTop: 1, alignItems: "center" }}>
            <Text style={{ padding: 5, width: "50%" }}></Text>
            <Text style={{ textAlign: "right", padding: 5, width: "50%", fontFamily: "Arial Narrow Bold" }}>
              {" "}
              Total Number of Officers and Members:{" "}
              <Text style={{ textDecoration: "underline", fontFamily: "Arial Narrow" }}>
                {annex.totalOfficersAndMembers}
              </Text>{" "}
            </Text>
          </View>
        </View>

        {/* signatories */}
        <Text style={{ fontFamily: "Times-Bold", marginTop: 20 }}>Certified By:</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
          <View style={{ width: "45%" }}>
            {annex.secretary?.signatureUrl ? (
              <Image src={annex.secretary.signatureUrl} style={{ width: 200, height: 50 }} />
            ) : (
              <View style={{ borderTopWidth: 1, width: "100%" }} />
            )}
            {annex.secretary?.name ? (
              <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
                {annex.secretary.name.toUpperCase()}
              </Text>
            ) : (
              <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
                SIGNATURE OVER PRINTED NAME OF SECRETARY
              </Text>
            )}
          </View>

          <View style={{ width: "45%" }}>
            {annex.adviser?.signatureUrl ? (
              <Image src={annex.adviser.signatureUrl} style={{ width: 200, height: 50 }} />
            ) : (
              <View style={{ borderTopWidth: 1, width: "100%" }} />
            )}
            {annex.adviser?.name ? (
              <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>{annex.adviser.name.toUpperCase()}</Text>
            ) : (
              <Text style={{ fontFamily: "Arial Narrow Bold", marginTop: 5 }}>
                SIGNATURE OVER PRINTED NAME OF ADVISER
              </Text>
            )}
          </View>
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", marginBottom: 5 }}>UST:S030-00-FO105</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>

      <Page style={styles.page} size="LEGAL">
        <View style={styles.header}>
          <Text style={styles.headerLeft}>STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS</Text>
          <View>
            <Text style={{ fontSize: 11, textAlign: "right" }}>Page | 2</Text>
            <Text style={styles.headerRight}>List of Members</Text>
            <Text style={styles.headerRight}>AY {annex.academicYear}</Text>
          </View>
        </View>

        <Text style={{ marginBottom: 10 }}>LIST OF MEMBERS FOR AY {annex.academicYear}</Text>

        <View style={{ borderWidth: 1, textAlign: "center" }}>
          <View style={{ flexDirection: "row", width: "100%", fontFamily: "Arial Narrow Bold" }}>
            <Text style={{ borderRightWidth: 1, width: "5%", paddingVertical: 15 }}> </Text>
            <Text style={{ borderRightWidth: 1, width: "25%", paddingVertical: 15 }}> Name </Text>
            <Text style={{ borderRightWidth: 1, width: "20%", paddingVertical: 15 }}> Student Number</Text>
            <Text style={{ borderRightWidth: 1, width: "25%", paddingVertical: 15 }}> Program </Text>
            <Text style={{ width: "25%", paddingVertical: 15 }}>
              {" "}
              Membership Status as of A.Y. {annex.academicYear}{" "}
            </Text>
          </View>

          <View style={{ flexDirection: "row", width: "100%", borderTopWidth: 1 }}>
            <Text style={{ borderRightWidth: 1, width: "5%" }}> </Text>
            <Text style={{ borderRightWidth: 1, width: "25%" }}> </Text>
            <Text style={{ borderRightWidth: 1, width: "20%" }}> </Text>
            <Text style={{ borderRightWidth: 1, width: "25%" }}> </Text>
            <View style={{ width: "25%", flexDirection: "row" }}>
              <View style={{ width: "50%", borderRightWidth: 1 }}>
                <Text>
                  {" "}
                  <Text style={{ fontFamily: "Boxed" }}> 0 </Text> Old{" "}
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text>
                  <Text style={{ fontFamily: "Boxed" }}> 0 </Text> New{" "}
                </Text>
              </View>
            </View>
          </View>

          {annex.members.map((member, index) => (
            <View style={{ flexDirection: "row", width: "100%", borderTopWidth: 1 }}>
              <Text style={{ borderRightWidth: 1, width: "5%" }}>{index + 1}</Text>
              <Text style={{ borderRightWidth: 1, width: "25%", fontSize: 9, textAlign: "left", padding: 2 }}>
                {`${member.lastName}, ${member.firstName} ${member.middleName}`}{" "}
              </Text>
              <Text style={{ borderRightWidth: 1, width: "20%" }}>{member.studentNumber} </Text>
              <Text style={{ borderRightWidth: 1, width: "25%", fontFamily: "Arial Narrow Bold", fontSize: 8 }}>
                {member.program}{" "}
              </Text>
              <View style={{ width: "25%", flexDirection: "row" }}>
                <View style={{ width: "50%", borderRightWidth: 1 }}>
                  <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "O" : "0"}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "0" : "O"}</Text>
                </View>
              </View>
            </View>

            // <View key={index} style={styles.tableRow}>
            //   <View style={[styles.tableCell, { width: "5%", borderRightWidth: 1 }]}>
            //     <Text>{index + 1}</Text>
            //   </View>
            //   <View style={[styles.tableCell, { width: "35%", borderRightWidth: 1 }]}>
            //     <Text>{`${member.lastName}, ${member.firstName} ${member.middleName}`}</Text>
            //   </View>
            //   <View style={[styles.tableCell, { width: "20%", borderRightWidth: 1 }]}>
            //     <Text>{member.studentNumber}</Text>
            //   </View>
            //   <View style={[styles.tableCell, { width: "25%", borderRightWidth: 1 }]}>
            //     <Text>{member.program}</Text>
            //   </View>
            //   <View style={[styles.tableCell, { width: "15%" }]}>
            //     <Text>
            //       <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "0" : "O"}</Text> New{" "}
            //       <Text style={{ fontFamily: "Boxed" }}>{member.isNewMember ? "O" : "0"}</Text> Old
            //     </Text>
            //   </View>
            // </View>
          ))}
        </View>

        <View fixed style={styles.footer}>
          <Text style={{ textAlign: "right", marginBottom: 5 }}>UST:S030-00-FO105</Text>
          <Text>All rights reserved by the Office for Student Affairs</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function AnnexBManager({ params }: { params: { organizationId: string } }) {
  const { data: session } = useSession();
  const [annexList, setAnnexList] = useState<AnnexB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexB | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedSignaturePosition, setSelectedSignaturePosition] = useState<SignaturePosition | "">("");
  const [selectedUserPosition, setSelectedUserPosition] = useState<UserPosition | null>(null);
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
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-b`);
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

  const openSignatureModal = async (annex: AnnexB) => {
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

  const generatePDFBlob = async (annex: AnnexB): Promise<Blob> => {
    try {
      const blob = await pdf(<MyDocument annex={annex} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw error;
    }
  };

  const generatePDF = async (annex: AnnexB) => {
    try {
      setIsLoading(true);
      const updatedAnnex = await fetchUpdatedAnnex(annex._id);
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

  const fetchUpdatedAnnex = async (annexId: string): Promise<AnnexB> => {
    const response = await axios.get(`/api/annexes/${params.organizationId}/annex-b/${annexId}`);
    return response.data;
  };

  const handleSubmitAnnex = async (annexId: string) => {
    try {
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-b/${annexId}/submit`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-b/${annexId}/${type}-remarks`, {
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-b/${annexId}/approve`);
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
      const response = await axios.post(`/api/annexes/${params.organizationId}/annex-b/${annexId}/disapprove`);
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
      <h1 className="text-2xl font-bold mb-6">ANNEX B List of Members</h1>
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
              <p>No List of Members Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexB;
  editAnnex: (id: string) => void;
  generatePDF: (annex: AnnexB) => void;
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
            <h2 className="card-title">List of Members Annex for AY {annex.academicYear}</h2>
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
                    Edit Member List
                  </button>
                )}
              </>
            )}
            {(session?.user?.role === "RSO" || annex.status === "For Review" || annex.status === "Approved") && (
              <button className="btn btn-ghost btn-sm" onClick={() => generatePDF(annex)}>
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
        )}
      </div>
    </div>
  );
}
