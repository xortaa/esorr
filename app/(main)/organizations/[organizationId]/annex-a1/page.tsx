"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Edit, Send, Download } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import { Document, Page, Text, View, StyleSheet, Font, Image, pdf } from "@react-pdf/renderer";
import BackButton from "@/components/BackButton";

// Font registrations
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
  family: "Boxed",
  src: "/fonts/Boxed-2OZGl.ttf",
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

// Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingRight: 80,
    paddingLeft: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
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
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellHeader: {
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial Narrow Bold",
  },
  signatureSection: {
    marginTop: 30,
    alignItems: "center",
  },
});

// Types
type EducationalBackground = {
  level: "Secondary" | "College" | "Special Training";
  nameAndLocation: string;
  yearOfGraduation: string;
  organization: string; 
  position: string;
};

type ExtraCurricularActivity = {
  nameOfOrganization: string;
  position: string;
  inclusiveDates: string;
};

type Officer = {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  affiliation: string;
  program: string;
  mobileNumber: string;
  residence: string;
  email: string;
  facebook: string;
  educationalBackground: EducationalBackground[];
  recordOfExtraCurricularActivities: ExtraCurricularActivity[];
  religion: string;
  citizenship: string;
  gender: string;
  image: string;
  signature: string;
};

type AnnexA1 = {
  _id: string;
  academicYear: string;
  isSubmitted: boolean;
  organization: {
    name: string;
    affiliation: string;
  };
  officers: Officer[];
};

// Components
const OfficerPage: React.FC<{ officer: Officer; annex: AnnexA1; pageNumber: number; totalPages: number }> = ({
  officer,
  annex,
  pageNumber,
  totalPages,
}) => (
  <Page size="LEGAL" style={styles.page}>
    <View fixed style={styles.header}>
      <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
        STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
      </Text>
      <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}>
        Page | {pageNumber} of {totalPages}
      </Text>
      <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right" }}>
        Organization Officer's Information Sheet
      </Text>
      <Text style={{ fontSize: 8, textAlign: "right" }}>AY {annex.academicYear}</Text>
    </View>

    <View style={{ flexDirection: "row", width: "100%", marginBottom: 20 }}>
      <View style={{ width: "80%", flexDirection: "column", textAlign: "center" }}>
        <Text style={styles.heading}>Organization Officer's Information Sheet</Text>
        <Text style={styles.text}>Academic Year {annex.academicYear}</Text>
      </View>
      <View style={{ width: "20%", height: 75, borderWidth: 1 }}>
        {officer.image && <Image src={officer.image} style={{ width: "100%", height: "100%" }} />}
      </View>
    </View>

    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <Text style={styles.text}>NAME OF ORGANIZATION: {annex.organization.name}</Text>
      <Text style={{ marginLeft: 10 }}>
        <Text style={{ fontFamily: "Boxed" }}>{annex.organization.affiliation === "University Wide" ? "0" : "O"}</Text>
        USO
      </Text>
      <Text style={{ marginLeft: 10 }}>
        <Text style={{ fontFamily: "Boxed" }}>{annex.organization.affiliation !== "University Wide" ? "0" : " O"}</Text>
        CBO: <Text style={{ textDecoration: "underline" }}>{annex.organization.affiliation}</Text>
      </Text>
    </View>

    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>SURNAME</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>FIRST NAME</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "34%" }]}>
          <Text>MIDDLE NAME</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.lastName}</Text>
        </View>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.firstName}</Text>
        </View>
        <View style={[styles.tableCell, { width: "34%" }]}>
          <Text>{officer.middleName}</Text>
        </View>
      </View>
    </View>

    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>POSITION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>COLLEGE / FACULTY</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "34%" }]}>
          <Text>PROGRAM / MAJOR</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.position}</Text>
        </View>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.affiliation}</Text>
        </View>
        <View style={[styles.tableCell, { width: "34%" }]}>
          <Text>{officer.program}</Text>
        </View>
      </View>
    </View>

    <Text style={styles.subheading}>CONTACT DETAILS:</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "25%" }]}>
          <Text>MOBILE #</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "25%" }]}>
          <Text>RESIDENCE/HOME #</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "25%" }]}>
          <Text>E-MAIL</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "25%" }]}>
          <Text>FACEBOOK</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, { width: "25%" }]}>
          <Text>{officer.mobileNumber}</Text>
        </View>
        <View style={[styles.tableCell, { width: "25%" }]}>
          <Text>{officer.residence}</Text>
        </View>
        <View style={[styles.tableCell, { width: "25%" }]}>
          <Text>{officer.email}</Text>
        </View>
        <View style={[styles.tableCell, { width: "25%" }]}>
          <Text>{officer.facebook}</Text>
        </View>
      </View>
    </View>

    <Text style={styles.subheading}>EDUCATIONAL BACKGROUND:</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "20%" }]}>
          <Text>EDUCATIONAL ATTAINMENT</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "20%" }]}>
          <Text>NAME AND LOCATION OF INSTITUTION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "20%" }]}>
          <Text>YEAR OF GRADUATION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "20%" }]}>
          <Text>ORGANIZATION / CLUB / SOCIETY</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "20%" }]}>
          <Text>POSITION</Text>
        </View>
      </View>
      {(officer.educationalBackground || []).map((edu, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCell, { width: "20%" }]}>
            <Text>{edu.level}</Text>
          </View>
          <View style={[styles.tableCell, { width: "20%" }]}>
            <Text>{edu.nameAndLocation && edu.nameAndLocation}</Text>
          </View>
          <View style={[styles.tableCell, { width: "20%" }]}>
            <Text>{edu.yearOfGraduation && edu.yearOfGraduation}</Text>
          </View>
          <View style={[styles.tableCell, { width: "20%" }]}>
            <Text>{edu.organization && edu.organization}</Text>
          </View>
          <View style={[styles.tableCell, { width: "20%" }]}>
            <Text>{edu.position && edu.position}</Text>
          </View>
        </View>
      ))}
    </View>

    <Text style={styles.subheading}>OTHER INFORMATION:</Text>
    <Text style={[styles.text, { backgroundColor: "yellow" }]}>
      RECORD OF EXTRA-CURRICULAR ACTIVITIES (Inside and Outside of the University)
    </Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>NAME OF ORGANIZATION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>POSITION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "34%" }]}>
          <Text>INCLUSIVE DATES</Text>
        </View>
      </View>
      {(officer.recordOfExtraCurricularActivities || []).map((activity, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCell, { width: "33%" }]}>
            <Text>{activity.nameOfOrganization}</Text>
          </View>
          <View style={[styles.tableCell, { width: "33%" }]}>
            <Text>{activity.position}</Text>
          </View>
          <View style={[styles.tableCell, { width: "34%" }]}>
            <Text>{activity.inclusiveDates}</Text>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>RELIGION</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "33%" }]}>
          <Text>CITIZENSHIP</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellHeader, { width: "34%" }]}>
          <Text>GENDER</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.religion}</Text>
        </View>
        <View style={[styles.tableCell, { width: "33%" }]}>
          <Text>{officer.citizenship}</Text>
        </View>
        <View style={[styles.tableCell, { width: "34%" }]}>
          <Text>
            <Text style={{ fontFamily: "Boxed" }}>{officer.gender === "MALE" ? "0" : "O"}</Text> Male{" "}
            <Text style={{ fontFamily: "Boxed" }}>{officer.gender === "FEMALE" ? "0" : "O "}</Text> Female
          </Text>
        </View>
      </View>
    </View>

    <Text style={[styles.text, { marginTop: 5 }]}>
      To the best of my knowledge, the above-stated information is true and correct. Furthermore, the information stated
      herein will be subject to UST's policies on Privacy and Disclosure of Information.
    </Text>

    <View style={styles.signatureSection}>
      {officer.signature ? (
        <Image src={officer.signature} style={{ width: 100, height: 50 }} />
      ) : (
        <Text style={{ textDecoration: "underline", width: 200 }}>{"                              "}</Text>
      )}
      <Text>SIGNATURE OF OFFICER</Text>
    </View>

    <View fixed style={styles.footer}>
      <Text>All rights reserved by the Office for Student Affairs</Text>
    </View>
  </Page>
);

const MyDocument: React.FC<{ annex: AnnexA1 }> = ({ annex }) => (
  <Document>
    {annex.officers.map((officer, index) => (
      <OfficerPage
        key={officer._id}
        officer={officer}
        annex={annex}
        pageNumber={index + 1}
        totalPages={annex.officers.length}
      />
    ))}
  </Document>
);

export default function AnnexA1Manager({ params }: { params: { organizationId: string } }) {
  const [annexList, setAnnexList] = useState<AnnexA1[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    fetchAnnexes();
  }, []);

  const fetchAnnexes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/annexes/${params.organizationId}/annex-a1`);
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
      const response = await axios.patch(`/api/annexes/${params.organizationId}/annex-a1/${id}`, {
        isSubmitted: true,
      });
      setAnnexList(annexList.map((annex) => (annex._id === id ? response.data : annex)));
    } catch (error) {
      console.error("Error submitting annex:", error);
    }
  };

  const generatePDFBlob = async (organizationId: string, annexId: string) => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-a1/${annexId}`);
      const annex = response.data;

      if (!annex || !annex.officers || annex.officers.length === 0) {
        throw new Error("Invalid annex data");
      }

      const doc = <MyDocument annex={annex} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const downloadPDF = async (id: string) => {
    const annex = annexList.find((a) => a._id === id);
    if (!annex) {
      console.error("Annex not found");
      return;
    }

    try {
      setIsLoading(true);
      const blob = await generatePDFBlob(params.organizationId, id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">ANNEX A-1 Officer's Information Sheet</h1>
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
              downloadPDF={downloadPDF}
            />
          ))}
          {annexList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>No Officer's Information Sheet Annex created yet.</p>
              <p>Click the button above to create one.</p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface AnnexCardProps {
  annex: AnnexA1;
  editAnnex: (id: string) => void;
  submitAnnexForReview: (id: string) => void;
  downloadPDF: (id: string) => void;
}

function AnnexCard({ annex, editAnnex, submitAnnexForReview, downloadPDF }: AnnexCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            <h2 className="card-title">Officer's Information Sheet Annex for AY {annex.academicYear}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn bg-blue-100 text-blue-800 btn-sm hover:bg-blue-200"
              onClick={() => editAnnex(annex._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Officer Details
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
