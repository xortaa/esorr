"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, pdf, Font, PDFViewer } from "@react-pdf/renderer";

// Register Times New Roman and Arial Narrow fonts
Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/timesnewroman/times-new-roman.woff2",
});

Font.register({
  family: "Arial Narrow",
  src: "", // Replace with your actual Arial Narrow font URL
});

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingVertical: 80,
    paddingHorizontal: 80,
    fontSize: 11,
    fontFamily: "Times-Roman",
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    textAlign: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
  },
  subheading: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  subSubHeading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
  indent: {
    marginLeft: 20,
  },
  indent2: {
    marginLeft: 40,
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
    marginBottom: 10,
  },

  sectionCellHeader: {
    display: "flex",
    fontSize: 11,
    textAlign: "left",
    width: 200,
  },
  sectionCellContent: {
    display: "flex",
    fontSize: 11,
    width: 800,
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
    marginTop: 40,
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
    textAlign: "center",
    marginTop: 5,
  },
  signatureDetails: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

// Create Document Component
const MyDocument = () => {
  return (
    <Document>
      <Page style={[styles.page, styles.indent]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "left" }}>
            STUDENT ORGANIZATIONS RECOGNITION REQUIREMENTS
          </Text>

          <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "right" }}>Page |</Text>

          <Text style={{ fontSize: 8, fontWeight: "bold", textAlign: "right", paddingRight: 16 }}>
            The Rules of Procedure for Recognition of Student Organizations
          </Text>

          <Text style={{ fontSize: 8, textAlign: "right" }}>AY 2024-2025</Text>
        </View>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Student Organizations Recognition Requirements</Text>
        </View>
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 1.</Text>
          <Text style={styles.sectionCellContent}>
            Only student organizations created with the purpose consistent with the mission and vision of the University
            may be recognized. Recognition of student organizations is a matter of privilege which may be granted upon
            the discretion of the University
          </Text>
        </View>
        {/* Section 2 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 2.</Text>
          <Text style={styles.sectionCellContent}>
            The Petition for Recognition of a student organization must be submitted to the Office for Student Affairs
            not later than the 21st of June. Late and incomplete (unsigned) document submissions will not be accepted.
          </Text>
        </View>
        {/* Section 3 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 3.</Text>
          <Text style={styles.sectionCellContent}>
            The Petition for recognition must be signed by the duly elected president of the organization for the
            upcoming academic year and endorsed by the current organization adviser. For College-based organization
            (CBO), the Petition must be endorsed by the Coordinator of the Student Welfare and Development Committee
            (SWDC), the Dean/Director and Regent.
          </Text>
        </View>
        {/* Section 4 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 4.</Text>
          <View style={styles.sectionTableCol}>
            <Text style={styles.sectionCellContent}>
              The petition must include as part of its annexes the following documents:
            </Text>

            <Text style={styles.sectionCellContent}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat, amet sapiente nulla, minus, nesciunt
              odio maxime obcaecati recusandae eaque neque harum soluta eius repellendus totam tempora optio vitae quod
              in!
            </Text>
          </View>
        </View>
        {/* Section 5 */}
        <View style={styles.sectionTableRow}>
          <Text style={styles.sectionCellHeader}>Section 3.</Text>
          <Text style={styles.sectionCellContent}>
            All pages must be signed by the incoming president (left margin) before submitting to OSA. <br />
            <br />
            Hard copies submitted in CLEAR BOOK in the color as provided in section 7. Failure to submit the documents
            in both manners may cause the denial of the petition for recognition.
          </Text>
        </View>
        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 6</Text>
          <Text style={styles.text}>
            The Petition for College-based Organization must be prepared in triplicate copies. The ORIGINAL copy is to
            be filed with OSA, the DUPLICATE copy to the Dean’s Office (optional), and the petitioner shall retain the
            THIRD copy.
          </Text>
        </View>
        {/* Section 7 with Table */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 7</Text>
          <Text style={styles.text}>
            The name of college-based student organizations shall contain a suffix as provided herein. Example: Legal
            Management Society (AB). University-wide student organizations shall not be followed by any suffix.
          </Text>

          {/* Table starts here */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeader}>Name of College</Text>
              <Text style={styles.tableCellHeader}>Clear Book Color</Text>
              <Text style={styles.tableHeaderLastCell}>Abbreviation</Text>
            </View>

            {/* Table Rows */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>University-wide</Text>
              <Text style={styles.tableCell}>BLACK</Text>
              <Text style={styles.tableLastCell}>No suffix</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Accountancy</Text>
              <Text style={styles.tableCell}>CLEAR</Text>
              <Text style={styles.tableLastCell}>ACCT</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Arts and Letters</Text>
              <Text style={styles.tableCell}>DARK BLUE</Text>
              <Text style={styles.tableLastCell}>AB</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Architecture</Text>
              <Text style={styles.tableCell}>MAROON</Text>
              <Text style={styles.tableLastCell}>ARC</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Commerce</Text>
              <Text style={styles.tableCell}>LIGHT YELLOW</Text>
              <Text style={styles.tableLastCell}>COM</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Education</Text>
              <Text style={styles.tableCell}>ORANGE</Text>
              <Text style={styles.tableLastCell}>EDUC</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Engineering</Text>
              <Text style={styles.tableCell}>GRAY</Text>
              <Text style={styles.tableLastCell}>ENG</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Fine Arts and Design</Text>
              <Text style={styles.tableCell}>BROWN</Text>
              <Text style={styles.tableLastCell}>CFAD</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Information and Computing Sciences</Text>
              <Text style={styles.tableCell}>RED</Text>
              <Text style={styles.tableLastCell}>ICS</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Medicine and Surgery</Text>
              <Text style={styles.tableCell}>GOLDEN YELLOW</Text>
              <Text style={styles.tableLastCell}>MED</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Conservatory of Music</Text>
              <Text style={styles.tableCell}>PINK</Text>
              <Text style={styles.tableLastCell}>MUS</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Nursing</Text>
              <Text style={styles.tableCell}>GREEN</Text>
              <Text style={styles.tableLastCell}>NUR</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Faculty of Pharmacy</Text>
              <Text style={styles.tableCell}>VIOLET</Text>
              <Text style={styles.tableLastCell}>PHA</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Rehabilitation Sciences</Text>
              <Text style={styles.tableCell}>ROYAL BLUE</Text>
              <Text style={styles.tableLastCell}>CRS</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Science</Text>
              <Text style={styles.tableCell}>MARIAN BLUE (UST seal background)</Text>
              <Text style={styles.tableLastCell}>SCI</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>College of Tourism and Hospitality Management</Text>
              <Text style={styles.tableCell}>APPLE GREEN</Text>
              <Text style={styles.tableLastCell}>CTHM</Text>
            </View>
          </View>
          {/* Table ends here */}
        </View>
        {/* Section 8 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 8</Text>
          <Text style={styles.text}>
            Each student organization shall use the official G-Suite account provided, where it may be officially
            notified of the OSA’s communications. All notices shall be considered served to the organization upon
            sending of the message to the official e-mail address.
          </Text>
        </View>
        {/* Section 9 */}
        <View style={styles.section}>
          <Text style={styles.subSubHeading}>Section 9</Text>
          <Text style={styles.text}>
            The petition shall contain a commitment to send the President of the Organization to the SOCC Leadership
            Training Summit (SOCC-LTS) conducted by OSA. In case of incapacity, the officer next in line shall represent
            the organization.
          </Text>
        </View>
        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.text}>
            I acknowledge that I have read and understood the Rules of Procedure for Recognition of Student
            Organizations in its entirety and agree to abide by them.
          </Text>

          {/* Signature line */}
          <View style={styles.signatureLine} />

          {/* Signature title */}
          <Text style={styles.signatureText}>Incoming Organization President</Text>

          {/* Signature details (Print name, Date signed) */}
          <View style={styles.signatureDetails}>
            <Text>Print Name: _______________________</Text>
            <Text>Date Signed: ____________________</Text>
          </View>
        </View>
        {/* Footer with dynamic page numbering */}
        <Footer currentPage={1} totalPages={1} /> {/* This needs to be adjusted based on total pages */}
      </Page>
    </Document>
  );
};

// Footer component
const Footer = ({ currentPage, totalPages }) => (
  <View style={styles.footer}>
    <Text>All rights reserved by the Office for Student Affairs</Text>
    <Text>
      Page {currentPage} of {totalPages}
    </Text>
  </View>
);

  useEffect(() => {
    fetchTestEntries();
  }, []);

  const fetchTestEntries = async () => {
    try {
      const response = await fetch("/api/test");
      if (response.ok) {
        const data = await response.json();
        setTestEntries(data);
      } else {
        throw new Error("Failed to fetch test entries");
      }
    } catch (error) {
      console.error("Error fetching test entries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !image) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("image", image);

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Test entry created successfully!");
        setFirstName("");
        setLastName("");
        setImage(null);
        fetchTestEntries(); // Refresh the list of test entries
      } else {
        throw new Error("Failed to create test entry");
      }
    } catch (error) {
      console.error("Error creating test entry:", error);
      alert("An error occurred while creating the test entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create Test Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="firstName">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="input input-bordered w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="lastName">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="input input-bordered w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="image">
                  <span className="label-text">Image</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Test Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Test Entries</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {testEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{`${entry.firstName} ${entry.lastName}`}</td>
                      <td>
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
                            <Image
                              src={entry.image}
                              alt={`${entry.firstName} ${entry.lastName}`}
                              width={48}
                              height={48}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
