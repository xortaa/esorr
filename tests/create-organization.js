const fetch = require("node-fetch");

const API_URL = "http://localhost:3000/api/rso-setup";

const organizationData = {
  name: "Sample Organization",
  logo: "https://example.com/logo.png",
  socials: ["https://facebook.com/sampleorg", "https://twitter.com/sampleorg"],
  signatoryRequests: [
    {
      name: "John Doe",
      email: "john@example.com",
      position: "President",
    },
  ],
  isNotUniversityWide: true,
  affiliation: "College of Engineering",
  email: "admin@sampleorg.com",
  website: "https://sampleorg.com",
  category: "Academic",
  strategicDirectionalAreas: ["Research", "Community Service"],
  mission: "To advance knowledge and foster innovation",
  vision: "To be a leading organization in our field",
  description: "We are a student organization dedicated to excellence",
  objectives: ["Promote academic growth", "Encourage community engagement"],
  startingBalance: 1000,
  currentAcademicYear: "2023-2024",
  academicYearOfLastRecognition: "2022-2023",
};

async function createOrganization() {
  try {
    console.log("Sending request to create organization...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Organization created successfully!");
    console.log("Response:", data);
  } catch (error) {
    console.error("Error creating organization:", error.message);
  }
}

createOrganization();
