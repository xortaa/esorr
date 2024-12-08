"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, Image } from "@react-pdf/renderer";

// Register fonts
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

// Styles
const styles = StyleSheet.create({
  page: {
    position: "relative",
    // paddingTop: 40,
    // paddingBottom: 40, // Adjusted padding
    // paddingRight: 80,
    // paddingLeft: 80,
    fontSize: 11,
    fontFamily: "Arial Narrow",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // objectFit: "cover", // Ensures the image covers the entire page without stretching
    zIndex: -1, // Keeps the image in the background
  },
  section: {
    marginBottom: 15,
  },
  orgname: {
    position: "absolute",
    top: 450,
    // in the middle
    left: 0,
    right: 0,
    fontSize: 25,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    // paddingTop: 380,
  },
  accred: {
    position: "absolute",
    top: 550,
    right: 160,
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "right",
    // paddingTop: 5,
    // paddingRight: 95,
  },
  year: {
    position: "absolute",
    top: 760,
    right: 170,
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "right",
    // paddingTop: 165,
    // paddingRight: 92,
  },
  signature: {
    fontSize: 16,
    fontFamily: "Arial Narrow Bold",
    textAlign: "center",
    paddingTop: 2,
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: "left",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 5,
    fontSize: 11,
    flex: 1,
  },
});

type Organization = {
  levelOfRecognition: string;
  academicYear: string;
  name: string;
};

// Document Component
const MyDocument = ({ organization }: { organization: Organization }) => {
  const academicYear = organization.academicYear;
  const yearEnd = academicYear.split("-")[1];
  return (
    <Document>
      <Page style={styles.page} size="LEGAL" orientation="portrait">
        {/* Background Image */}
        <Image
          style={styles.backgroundImage}
          src="/images/certificate.jpg" // Path to the image in the public folder
        />
        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.orgname}>{organization.name}</Text>
        </View>

               <View style={styles.section}>
          <Text style={styles.accred}>
            {organization.levelOfRecognition.split('-').slice(1).join('-')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.year}>{yearEnd}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;