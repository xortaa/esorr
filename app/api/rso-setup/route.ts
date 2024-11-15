import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";
import SignatoryRequest from "@/models/signatory-request";
import User from "@/models/user";
import Annex01 from "@/models/annex-01";
import Annex02 from "@/models/annex-02";
import AnnexA from "@/models/annex-a";
import AnnexA1 from "@/models/annex-a1";
import AnnexB from "@/models/annex-b";
import AnnexC from "@/models/annex-c";
import AnnexC1 from "@/models/annex-c1";
import AnnexD from "@/models/annex-d";
import AnnexE from "@/models/annex-e";
import AnnexE1 from "@/models/annex-e1";
import AnnexE2 from "@/models/annex-e2";
import AnnexE3 from "@/models/annex-e3";
import AnnexF from "@/models/annex-f";
import AnnexG from "@/models/annex-g";
import AnnexH from "@/models/annex-h";
import AnnexI from "@/models/annex-i";
import AnnexJ from "@/models/annex-j";
import AnnexK from "@/models/annex-k";
import AnnexL from "@/models/annex-l";
import FinancialReport from "@/models/financial-report";
import { MonthData, Transaction, FinancialReportData } from "@/types";
import Pasoc from "@/models/pasoc";
import OperationalAssessment from "@/models/operational-assessment";

export async function POST(req: NextRequest) {
  console.log("Starting RSO setup process");
  await connectToDatabase();
  console.log("Database connection established");

  try {
    const body = await req.json();
    console.log("Received request body:", body);

   const {
     name,
     logo,
     socials,
     facebookLink,
     signatoryRequests,
     isNotUniversityWide,
     affiliation,
     email,
     website,
     category,
     strategicDirectionalAreas,
     mission,
     vision,
     description,
     objectives,
     startingBalance,
     currentAcademicYear,
     academicYearOfLastRecognition,
     levelOfRecognition,
     isWithCentralOrganization,
     isReligiousOrganization,
   } = body;

    // Validation checks
    if (!name) return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    if (!logo) return NextResponse.json({ error: "Missing organization logo" }, { status: 400 });
    if (typeof isNotUniversityWide !== "boolean")
      return NextResponse.json({ error: "Invalid university-wide status" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    if (!website) return NextResponse.json({ error: "Missing organization website" }, { status: 400 });
    if (!category) return NextResponse.json({ error: "Missing organization category" }, { status: 400 });
    if (!mission) return NextResponse.json({ error: "Missing organization mission" }, { status: 400 });
    if (!vision) return NextResponse.json({ error: "Missing organization vision" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Missing organization description" }, { status: 400 });
    if (isNaN(startingBalance)) {
      return NextResponse.json({ error: "Invalid starting balance" }, { status: 400 });
    }

    const logoUrl = logo;

    if (isNotUniversityWide && !affiliation) {
      return NextResponse.json({ error: "Missing affiliation for non-university-wide organization" }, { status: 400 });
    }

    const finalAffiliation = isNotUniversityWide ? affiliation : "University Wide";

    console.log("Creating new organization");
    const newOrganization = await Organization.create({
      name,
      logo: logoUrl,
      affiliation,
      facebookLink,
      isWithCentralOrganization,
      isReligiousOrganization,
      levelOfRecognition,
      annex01: [],
      annex02: [],
      annexA: [],
      annexA1: [],
      annexB: [],
      annexC: [],
      annexC1: [],
      annexD: [],
      annexE: [],
      annexE1: [],
      annexE2: [],
      annexE3: [],
      annexF: [],
      annexG: [],
      annexH: [],
      annexI: [],
      annexJ: [],
      annexK: [],
      annexL: [],
    });
    console.log("New organization created:", newOrganization);

    // Create all annexes
    console.log("Creating annexes");

    console.log("Creating Annex01");
    const newAnnex01 = await Annex01.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("Annex01 created:", newAnnex01);

    console.log("Creating Annex02");
    const newAnnex02 = await Annex02.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
      levelOfRecognition,
      facebookLink,
      isWithCentralOrganization,
      isReligiousOrganization,
      affiliation
    });
    console.log("Annex02 created:", newAnnex02);

    console.log("Creating AnnexA");
    const newAnnexA = await AnnexA.create({
      organization: newOrganization._id,
      academicYearOfLastRecognition,
      affiliation: finalAffiliation,
      officialEmail: email,
      officialWebsite: website,
      organizationSocials: socials,
      category,
      strategicDirectionalAreas,
      mission,
      vision,
      description,
      objectives,
      startingBalance,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexA created:", newAnnexA);

    console.log("Creating AnnexA1");
    const newAnnexA1 = await AnnexA1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexA1 created:", newAnnexA1);

    console.log("Creating AnnexB");
    const newAnnexB = await AnnexB.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
      members: [],
      numberOfOfficers: 0,
      maleMembersBelow18: 0,
      maleMembers18To20: 0,
      maleMembers21AndAbove: 0,
      femaleMembersBelow18: 0,
      femaleMembers18To20: 0,
      femaleMembers21AndAbove: 0,
      memberDistribution: {},
      totalMembers: 0,
      totalOfficersAndMembers: 0,
    });
    console.log("AnnexB created:", newAnnexB);

    console.log("Creating AnnexC");
    const newAnnexC = await AnnexC.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexC created:", newAnnexC);

    console.log("Creating AnnexC1");
    const newAnnexC1 = await AnnexC1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
      articlesOfAssociation: null,
    });
    console.log("AnnexC1 created:", newAnnexC1);

    console.log("Creating AnnexD");
    const newAnnexD = await AnnexD.create({
      description: "",
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexD created:", newAnnexD);

    console.log("Creating AnnexE");
    const newAnnexE = await AnnexE.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexE created:", newAnnexE);

    console.log("Creating OperationalAssessment");
    const newOperationalAssessment = await OperationalAssessment.create({
      annexE: newAnnexE._id,
      v01: [],
      v02: [],
      v03: [],
      v04: [],
      v05: [],
      v06: [],
      v07: [],
      v08: [],
      v09: [],
      s1: [],
      s2: [],
      s3: [],
      e1: [],
      e2: [],
      e3: [],
      a1: [],
      a2: [],
      a3: [],
      l1: [],
      l2: [],
      l3: [],
      sdg1: [],
      sdg2: [],
      sdg3: [],
      sdg4: [],
      sdg5: [],
      sdg6: [],
      sdg7: [],
      sdg8: [],
      sdg9: [],
      sdg10: [],
      sdg11: [],
      sdg12: [],
      sdg13: [],
      sdg14: [],
      sdg15: [],
      sdg16: [],
      sdg17: [],
    });
    console.log("OperationalAssessment created:", newOperationalAssessment);

    console.log("Updating AnnexE with OperationalAssessment");
    await newAnnexE.updateOne({ operationalAssessment: newOperationalAssessment._id });

    const months = [
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "january",
      "february",
      "march",
      "april",
      "may",
    ] as const;

    console.log("Preparing FinancialReportData");
    const financialReportData: FinancialReportData = {
      annexE1: null,
      academicYear: currentAcademicYear,
      startingBalance: startingBalance,
      transactions: [],
      totalIncome: 0,
      totalExpenses: 0,
      endingBalance: startingBalance,
      june: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      july: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      august: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      september: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      october: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      november: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      december: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      january: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      february: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      march: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      april: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
      may: { startingBalance: startingBalance, endingBalance: startingBalance, totalIncome: 0, totalExpenses: 0 },
    };

    months.forEach((month) => {
      financialReportData[month] = {
        startingBalance: startingBalance,
        endingBalance: startingBalance,
        totalIncome: 0,
        totalExpenses: 0,
      };
    });

    console.log("Creating FinancialReport");
    const newFinancialReport = await FinancialReport.create(financialReportData);
    console.log("FinancialReport created:", newFinancialReport);

    console.log("Creating AnnexE1");
    const newAnnexE1 = await AnnexE1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
      financialReport: newFinancialReport._id,
    });
    console.log("AnnexE1 created:", newAnnexE1);

    console.log("Updating FinancialReport with AnnexE1");
    await newFinancialReport.updateOne({ annexE1: newAnnexE1._id });

    console.log("Creating AnnexE2");
    const newAnnexE2 = await AnnexE2.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexE2 created:", newAnnexE2);

    console.log("Creating AnnexE3");
    const newAnnexE3 = await AnnexE3.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexE3 created:", newAnnexE3);

    console.log("Creating Pasoc");
    const newPasoc = await Pasoc.create({
      annexe3: newAnnexE3._id,
      servantLeadership: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
        "3": { rating: 0, comment: "" },
      },
      operationalPlan: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
      },
      constituentFocus: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
      },
      monitoringAndEvaluation: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
        "3": { rating: 0, comment: "" },
      },
      membershipAndOrganizationClimate: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
        "3": { rating: 0, comment: "" },
      },
      personalAndSocialAndCommunityService: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
      },
      outcomesAndAchievements: {
        "1": { rating: 0, comment: "" },
        "2": { rating: 0, comment: "" },
        "3": { rating: 0, comment: "" },
        "4": { rating: 0, comment: "" },
        "5": { rating: 0, comment: "" },
        "6": { rating: 0, comment: "" },
      },
      furtherComments: "",
    });
    console.log("Pasoc created:", newPasoc);

    console.log("Updating AnnexE3 with Pasoc");
    await newAnnexE3.updateOne({ pasoc: newPasoc._id });

    console.log("Creating AnnexF");
    const newAnnexF = await AnnexF.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexF created:", newAnnexF);

    console.log("Creating AnnexG");
    const newAnnexG = await AnnexG.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexG created:", newAnnexG);

    console.log("Creating AnnexH");
    const newAnnexH = await AnnexH.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexH created:", newAnnexH);

    console.log("Creating AnnexI");
    const newAnnexI = await AnnexI.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexI created:", newAnnexI);

    console.log("Creating AnnexJ");
    const newAnnexJ = await AnnexJ.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexJ created:", newAnnexJ);

    console.log("Creating AnnexK");
    const newAnnexK = await AnnexK.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexK created:", newAnnexK);

    console.log("Creating AnnexL");
    const newAnnexL = await AnnexL.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
      isSubmitted: false,
      officerInCharge: null,
      secretary: null,
      president: null,
      adviser: null,
    });
    console.log("AnnexL created:", newAnnexL);

    console.log("Initializing annex fields in organization");
    if (!newOrganization.annex01) newOrganization.annex01 = [];
    if (!newOrganization.annex02) newOrganization.annex02 = [];
    if (!newOrganization.annexA) newOrganization.annexA = [];
    if (!newOrganization.annexA1) newOrganization.annexA1 = [];
    if (!newOrganization.annexB) newOrganization.annexB = [];
    if (!newOrganization.annexC) newOrganization.annexC = [];
    if (!newOrganization.annexC1) newOrganization.annexC1 = [];
    if (!newOrganization.annexD) newOrganization.annexD = [];
    if (!newOrganization.annexE) newOrganization.annexE = [];
    if (!newOrganization.annexE1) newOrganization.annexE1 = [];
    if (!newOrganization.annexE2) newOrganization.annexE2 = [];
    if (!newOrganization.annexE3) newOrganization.annexE3 = [];
    if (!newOrganization.annexF) newOrganization.annexF = [];
    if (!newOrganization.annexG) newOrganization.annexG = [];
    if (!newOrganization.annexH) newOrganization.annexH = [];
    if (!newOrganization.annexI) newOrganization.annexI = [];
    if (!newOrganization.annexJ) newOrganization.annexJ = [];
    if (!newOrganization.annexK) newOrganization.annexK = [];
    if (!newOrganization.annexL) newOrganization.annexL = [];

    console.log("Adding annexes to organization");
    newOrganization.annex01.push(newAnnex01._id);
    newOrganization.annex02.push(newAnnex02._id);
    newOrganization.annexA.push(newAnnexA._id);
    newOrganization.annexA1.push(newAnnexA1._id);
    newOrganization.annexB.push(newAnnexB._id);
    newOrganization.annexC.push(newAnnexC._id);
    newOrganization.annexC1.push(newAnnexC1._id);
    newOrganization.annexD.push(newAnnexD._id);
    newOrganization.annexE.push(newAnnexE._id);
    newOrganization.annexE1.push(newAnnexE1._id);
    newOrganization.annexE2.push(newAnnexE2._id);
    newOrganization.annexE3.push(newAnnexE3._id);
    newOrganization.annexF.push(newAnnexF._id);
    newOrganization.annexG.push(newAnnexG._id);
    newOrganization.annexH.push(newAnnexH._id);
    newOrganization.annexI.push(newAnnexI._id);
    newOrganization.annexJ.push(newAnnexJ._id);
    newOrganization.annexK.push(newAnnexK._id);
    newOrganization.annexL.push(newAnnexL._id);

    console.log("Saving updated organization");
    await newOrganization.save();
    console.log("Organization saved successfully");

    if (signatoryRequests.length > 0) {
      console.log("Creating signatory requests");
      await Promise.all(
        signatoryRequests.map(async (request: any) => {
          return await SignatoryRequest.create({
            ...request,
            organization: newOrganization._id,
            requestedBy: email,
            role: "RSO-SIGNATORY",
          });
        })
      );
      console.log("Signatory requests created");
    }

    console.log("Finding current user");
    const currentUser = await User.findOne({ role: "RSO", email });
    if (!currentUser) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("Current user found:", currentUser);

    console.log("Updating user's organizations and positions");
    const existingPositionIndex = currentUser.positions.findIndex(
      (pos) => pos.organization.toString() === newOrganization._id.toString()
    );

    if (existingPositionIndex !== -1) {
      console.log("Updating existing position");
      currentUser.positions[existingPositionIndex].position = "RSO-SIGNATORY";
    } else {
      console.log("Adding new position");
      currentUser.positions.push({
        organization: newOrganization._id,
        position: "OFFICIAL EMAIL",
      });
    }

    currentUser.organizations.push(newOrganization._id);
    currentUser.isSetup = true;

    console.log("Saving updated user");
    await currentUser.save();
    console.log("User saved successfully");

    console.log("RSO setup process completed successfully");
    return NextResponse.json(
      {
        message: "RSO setup successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSO setup error:", error);
    return NextResponse.json({ error: "An error occurred during RSO setup" }, { status: 500 });
  }
}
