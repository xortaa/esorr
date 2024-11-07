"use client";

// Update the path to the correct location of the fonts module
import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer, render, Image } from "@react-pdf/renderer";
import { Underline } from "lucide-react";
import { Rowdies } from "next/font/google";

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
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 10,
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

  cell: {},
});

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page size="LEGAL" orientation="landscape" style={styles.page}>
        {/* Header */}

        <Text style={{ textAlign: "center", fontFamily: "Arial Narrow Bold", backgroundColor: "yellow", fontSize: 20 }}>
          Financial Report
        </Text>

        <View style={{ flexDirection: "column" }}>
          <Image src="/assets/UST.png" style={{ width: 50, height: 50, position: "absolute" }} />
          <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 11, textAlign: "center" }}>
            UNIVERSITY OF SANTO TOMAS
          </Text>
          <Text style={{ textAlign: "center", fontSize: 14 }}>Name of Organization/Council</Text>
        </View>

        <Text style={{ fontFamily: "Arial Narrow Bold", fontSize: 16, marginTop: 10, textAlign: "center" }}>
          Summary of Receipts and Disbursements
        </Text>

        {/* Table 1 */}
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>CASH RECEIPTS:</Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>BEGINNING BALANCE/STARTIING FUND: </Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>COLLECTIONS </Text>
        </View>

        {/* Mem Fee */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "gray",
              }}
            >
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>
                MEMBERSHIP FEE (As reflected in Annex B / Student Affiliation Record)
              </Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%", backgroundColor: "gray" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Registration Fee */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#D3D3D3",
              }}
            >
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>REGISTRATION FEE (Fee Collected from Activities)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%", backgroundColor: "#D3D3D3" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Merch Selling */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "yellow",
              }}
            >
              <Text style={{ fontFamily: "Arial Narrow Bold" }}>MERCHANDISE SELLING</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%", backgroundColor: "yellow" }}> </Text>

                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}></Text>
              <Text style={{ width: "25%", textAlign: "right" }}>TOTAL COLLECTIONS</Text>
              <Text style={{ width: "18%" }}>1234</Text>
              <Text style={{ width: "17%" }}></Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SUBSIDIES </Text>
        </View>

        {/* Student Activity Fund (For CBO & LSC Only) */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#ececec",
              }}
            >
              <Text style={{}}>Student Activity Fund (For CBO & LSC Only)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Community Service Fund (For Funds Requested from SCDO) */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#fef2cb",
              }}
            >
              <Text style={{}}>Community Service Fund (For Funds Requested from SCDO)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* University-Wide Student Organization Fund (For USO ONLY) */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#deeaf6",
              }}
            >
              <Text style={{}}>University-Wide Student Organization Fund (For USO ONLY)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CSC/SOCC Fund (For CSC and SOCC ONLY) */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#d0cece",
              }}
            >
              <Text style={{}}>CSC/SOCC Fund (For CSC and SOCC ONLY)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Local Student Council Fund (For LSC ONLY) */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "#e2efd9",
              }}
            >
              <Text style={{}}>Local Student Council Fund (For LSC ONLY)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}></Text>
              <Text style={{ width: "25%", textAlign: "right" }}>TOTAL SUBSIDIES</Text>
              <Text style={{ width: "18%", border: 1 }}>1234</Text>
              <Text style={{ width: "17%" }}></Text>
            </View>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "white",
              }}
            >
              <Text style={{}}>CASH SPONSORSHIP (MONETARY)</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "40%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "25%" }}> </Text>
                <Text style={{ width: "10%" }}> </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> TOTAL AMOUNT OF CASH SPONSORSHIP</Text>
          </View>
          <Text style={{ width: "12.50%", border: 1 }}></Text>
          <Text style={{}}> </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "left" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Interest Income </Text>
          </View>
          <Text style={{ width: "12.50%", border: 1 }}></Text>
          <Text style={{}}> </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Total Cash Receipts </Text>
          </View>
          <Text style={{ width: "12.50%", border: 1 }}></Text>
          <Text style={{}}> </Text>
        </View>

        {/* Expenses */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>
            Less: CASH DISBURSEMENTS (As Reflected in Annex E-2: Liquidation Report){" "}
          </Text>
          <Text style={{ fontFamily: "Arial Narrow Italic", width: "50%", textAlign: "center" }}>
            (Monthly Outflow of Money)
          </Text>

          <View>
            <Expenses month="JUNE" expenses="1234" />
            <Expenses month="JULY" expenses="1234" />
            <Expenses month="AUGUST" expenses="1234" />
            <Expenses month="SEPTEMBER" expenses="1234" />
            <Expenses month="OCTOBER" expenses="1234" />
            <Expenses month="NOVEMBER" expenses="1234" />
            <Expenses month="DECEMBER" expenses="1234" />
            <Expenses month="JANUARY" expenses="1234" />
            <Expenses month="FEBRUARY" expenses="1234" />
            <Expenses month="MARCH" expenses="1234" />
            <Expenses month="APRIL" expenses="1234" />
            <Expenses month="MAY" expenses="1234" />
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold" }}> Total CASH DISBURSEMENTS </Text>
          </View>
          <Text style={{ width: "12.50%", border: 2 }}></Text>
          <Text style={{}}> </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%" }}></View>
          <View style={{ width: "50%", flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: "40%" }}> </Text>
              <Text style={{ width: "25%" }}> </Text>
              <Text style={{ width: "18%", textAlign: "right" }}>Net CASH FLOW </Text>
              <Text style={{ width: "17%", border: 2 }}> </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ width: "70%", textAlign: "center" }}>
            <Text style={{ fontFamily: "Arial Narrow Bold", backgroundColor: "yellow", fontSize: 18 }}>
              FINANCIAL STATEMENTS
            </Text>
          </View>
          {/* <Text style={{ width: "12.50%" }}></Text> */}

          <View
            style={{
              width: "30%",
              backgroundColor: "gray",
              fontSize: 12,
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Text> Activity Liquidation Reports </Text>
          </View>
        </View>

        {/* Financial Statements Table */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "70%", flexDirection: "column", paddingHorizontal: 2 }}>
            <Text style={{ textAlign: "justify", fontSize: "9.5" }}>
              <EmphasizedText>Summary of Receipts and Disbursements Report</EmphasizedText> gives{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>an overview</Text> of the cash disbursements and
              receipts of the council/organization during the whole academic year. The disbursements (activity expenses)
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>
                must be accompanied by the activities’ own liquidation report.
              </Text>
              <Br />
              <Br />
              <EmphasizedText>Liquidation Reports</EmphasizedText> present cash disbursements and receipts of the
              council/organization on a monthly basis. They enable the stakeholders to
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>examine the efficiency </Text> of the
              council/organization in managing their finances. They should be prepared two weeks after the duration of
              each project. The liquidation report must reflect{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>necessary information </Text>such as the payee,
              reference number of the receipts, net cash flow and others.
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Expense Report</Text> present the cash
              disbursements of organization per activity.
              <Text style={{ fontFamily: "Arial Narrow Bold Italic" }}>Photocopies</Text> of the{" "}
              <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>OFFICIAL RECEIPTS</Text>{" "}
              must be attached together with the liquidation reports when submitting to the Office for Student Affairs
              (OSA).
            </Text>
          </View>
          <View style={{ width: "30%", flexDirection: "column", border: 1 }}>
            <View style={{ flexDirection: "row", fontFamily: "Arial Narrow Bold" }}>
              <Text style={{ width: "35%", borderRight: 1, backgroundColor: "#00b0f0", textAlign: "center" }}>
                {" "}
                Title of Activity{" "}
              </Text>
              <Text style={{ width: "32.5%", borderRight: 1, backgroundColor: "#00b0f0", textAlign: "center" }}>
                {" "}
                Beginning Balance{" "}
              </Text>
              <Text style={{ width: "32.5%", backgroundColor: "#00b0f0", textAlign: "center" }}> Ending Balance </Text>
            </View>
            <View style={{ fontSize: 10 }}>
              <LiquidationReport month="AUGUST" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="SEPTEMBER" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="OCTOBER" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="NOVEMBER" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="DECEMBER" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="JANUARY" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="FEBRUARY" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="MARCH" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="APRIL" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="MAY" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="JUNE" beginningBalance="1234" endingBalance="1234" />
              <LiquidationReport month="JULY" beginningBalance="1234" endingBalance="1234" />
            </View>
          </View>
        </View>

        {/* Signatories */}

        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Arial Narrow Bold",
            backgroundColor: "yellow",
            marginTop: 10,
          }}
        >
          Signatories
        </Text>

        <View style={{ fontSize: 10 }}>
          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Prepared By:</Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Treasurer </Text>

          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Approved By:</Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>President </Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SOCC Corporate Treasurer </Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Adviser </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold", paddingTop: 20 }}>Noted By:</Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>SWD Coordinator </Text>
          <Image src="/assets/signature.png" style={{ width: 200, height: 50 }} />
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Full Name, Date </Text>
          <Text style={{ fontFamily: "Arial Narrow Bold" }}>Dean/Director </Text>
        </View>
      </Page>
    </Document>
  );
};

// Footer component
const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
  </View>
);

// Line break component
const Br = () => "\n";

const EmphasizedText = ({ children }) => <Text style={{ fontFamily: "Arial Narrow Bold" }}>{children}</Text>;

const SignatureSection = ({ printedName, dateSigned, title, signatureImage }) => (
  <View style={styles.signatureSection}>
    {signatureImage && <Image src={signatureImage} style={styles.signatureImage} />}
    <View style={styles.signatureDetails}>
      <Text style={{ fontFamily: "Arial Narrow Bold", textDecoration: "underline" }}>{printedName}</Text>
      <Text style={{}}>{dateSigned}</Text>
    </View>
    <Text break style={styles.signatureText}>
      {title}
    </Text>
  </View>
);

const Expenses = ({ month, expenses }) => (
  <View style={{ flexDirection: "row" }}>
    <View style={{ width: "50%" }}></View>
    <View style={{ width: "50%", flexDirection: "row" }}>
      <Text style={{ width: "40%", textAlign: "right" }}>{month} EXPENSES </Text>
      <Text style={{ width: "25%", textAlign: "right" }}> {expenses} </Text>
      <Text style={{ width: "25%" }}> </Text>
      <Text style={{ width: "10%" }}> </Text>
    </View>
  </View>
);

const LiquidationReport = ({ month, beginningBalance, endingBalance }) => (
  <View style={{ flexDirection: "row" }}>
    <Text style={{ width: "35%", borderRight: 1, borderTop: 1, backgroundColor: "#00b0f0" }}>{month} EXPENSES </Text>
    <Text style={{ width: "32.5%", borderRight: 1, borderTop: 1, textAlign: "right" }}> {beginningBalance} </Text>
    <Text style={{ width: "32.5%", borderTop: 1, textAlign: "right" }}> {endingBalance} </Text>
  </View>
);

// Function to generate PDF and open in new tab
const generatePDF = async () => {
  const doc = <MyDocument />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const App = () => (
  <div>
    <h1>PDF GENERATOR EXAMPLE</h1>
    <button onClick={generatePDF} className="btn btn-primary">
      Generate PDF
    </button>
  </div>
);

export default App;
