import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";
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
import Pasoc from "@/models/pasoc";
import OperationalAssessment from "@/models/operational-assessment";
import Inflow from "@/models/inflow";
import { recalculateFinancialReport } from "@/utils/recalculateFinancialReport";
import OfficerInCharge from "@/models/officer-in-charge";

const monthNames = [
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
  "june",
  "july",
];

export async function POST(req: NextRequest, { params }: { params: { organizationId: string } }) {
  console.log("Starting RSO setup process");
  await connectToDatabase();
  console.log("Database connection established");

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const officerInCharge = await OfficerInCharge.findOne();
    const currentOrganization = await Organization.findById(params.organizationId);

    const currentAcademicYear = body.currentAcademicYear;
    const [startYear, endYear] = currentAcademicYear.split("-").map(Number);
    const previousAcademicYear = `${startYear - 1}-${endYear - 1}`;

    currentOrganization.academicYear = currentAcademicYear;
    currentOrganization.isAccredited = false;
    await currentOrganization.save();

    const previousAnnexA = await AnnexA.findOne({
      organization: currentOrganization._id,
      academicYear: previousAcademicYear,
    });
    const previousAnnexE1 = await AnnexE1.findOne({
      organization: currentOrganization._id,
      academicYear: previousAcademicYear,
    });
    const previousFinancialReport = await FinancialReport.findOne({
      academicYear: previousAcademicYear,
      annexE1: previousAnnexE1._id,
    });
    const previousAnnexC1 = await AnnexC1.findOne({
      organization: currentOrganization._id,
      academicYear: previousAcademicYear,
    });
    const previousAnnexD = await AnnexD.findOne({
      organization: currentOrganization._id,
      academicYear: previousAcademicYear,
    });

    // Create all annexes
    console.log("Creating Annex01");
    const newAnnex01 = await Annex01.create({
      organization: currentOrganization._id,
      academicYear: body.currentAcademicYear,
    });
    console.log("Annex01 created:", newAnnex01);

    console.log("Creating Annex02");
    const newAnnex02 = await Annex02.create({
      organization: currentOrganization._id,
      academicYear: body.currentAcademicYear,
      levelOfRecognition: currentOrganization.levelOfRecognition,
      facebook: currentOrganization.facebook,
      isWithCentralOrganization: currentOrganization.isWithCentralOrganization,
      isReligiousOrganization: currentOrganization.isReligiousOrganization,
      affiliation: currentOrganization.affiliation,
      officialEmail: currentOrganization.officialEmail,
    });
    console.log("Annex02 created:", newAnnex02);

    console.log("Creating AnnexA");
    const newAnnexA = await AnnexA.create({
      organization: currentOrganization._id,
      academicYearOfLastRecognition: currentOrganization.academicYearOfLastRecognition,
      levelOfRecognition: currentOrganization.levelOfRecognition,
      affiliation: currentOrganization.affiliation,
      officialEmail: currentOrganization.officialEmail,
      officialWebsite: previousAnnexA?.officialWebsite || "",
      organizationSocials: previousAnnexA?.organizationSocials || [],
      category: previousAnnexA?.category || "",
      strategicDirectionalAreas: previousAnnexA?.strategicDirectionalAreas || [],
      mission: previousAnnexA?.mission || "",
      vision: previousAnnexA?.vision || "",
      description: previousAnnexA?.description || "",
      objectives: previousAnnexA?.objectives || [],
      startingBalance: previousFinancialReport?.endingBalance || 0,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexA created:", newAnnexA);

    console.log("Creating AnnexA1");
    const newAnnexA1 = await AnnexA1.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexA1 created:", newAnnexA1);

    console.log("Creating AnnexB");
    const newAnnexB = await AnnexB.create({
      organization: currentOrganization._id,
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
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexC created:", newAnnexC);

    console.log("Creating AnnexC1");
    const newAnnexC1 = await AnnexC1.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      articlesOfAssociation: previousAnnexC1?.articlesOfAssociation,
      pdf: previousAnnexC1?.pdf,
    });
    console.log("AnnexC1 created:", newAnnexC1);

    console.log("Creating AnnexD");
    const newAnnexD = await AnnexD.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      description: previousAnnexD?.description || "",
      letterhead: previousAnnexD?.letterhead || "",
    });
    console.log("AnnexD created:", newAnnexD);

    console.log("Creating AnnexE");
    const newAnnexE = await AnnexE.create({
      organization: currentOrganization._id,
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

    console.log("Preparing FinancialReportData");
    const financialReportData = {
      annexE1: null,
      academicYear: currentAcademicYear,
      startingBalance: previousFinancialReport?.endingBalance,
      transactions: [],
      totalIncome: 0,
      totalExpenses: 0,
      endingBalance: previousFinancialReport?.endingBalance,
    };

    monthNames.forEach((month) => {
      financialReportData[month] = {
        startingBalance: 0,
        endingBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
      };
    });

    console.log("Creating FinancialReport");
    const newFinancialReport = await FinancialReport.create(financialReportData);
    console.log("FinancialReport created:", newFinancialReport);

    console.log("Creating AnnexE1");
    const newAnnexE1 = await AnnexE1.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      financialReport: newFinancialReport._id,
    });
    console.log("AnnexE1 created:", newAnnexE1);

    console.log("Updating FinancialReport with AnnexE1");
    await newFinancialReport.updateOne({ annexE1: newAnnexE1._id });

    console.log("Creating AnnexE2");
    const newAnnexE2 = await AnnexE2.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexE2 created:", newAnnexE2);

    // Create new inflow for the organization's starting balance
    const firstYear = parseInt(currentAcademicYear.split("-")[0], 10);
    const startOfAugust = new Date(firstYear, 7, 1);
    const monthIndex = 0; // Adjust for fiscal year starting in August
    const monthName = monthNames[monthIndex];

    console.log("Creating initial inflow");
    const newInflow = await Inflow.create({
      category: "Organization Fund / Beginning Balance",
      date: startOfAugust,
      amount: previousFinancialReport?.endingBalance || 0,
      payingParticipants: 0,
      totalMembers: 0,
      merchandiseSales: 0,
    });
    console.log("Initial inflow created:", newInflow);

    // Update AnnexE2 with the new inflow
    if (!newAnnexE2[monthName]) {
      newAnnexE2[monthName] = { inflows: [], totalInflow: 0 };
    }
    newAnnexE2[monthName].inflows.push(newInflow._id);
    newAnnexE2[monthName].totalInflow += previousFinancialReport?.endingBalance || 0;
    await newAnnexE2.save();

    // Update FinancialReport
    console.log("Updating FinancialReport");
    newFinancialReport.transactions.push({
      date: startOfAugust,
      amount: previousFinancialReport?.endingBalance || 0,
      type: "inflow",
      category: "Organization Fund / Beginning Balance",
      description: "Initial organization balance",
    });

    // Recalculate the entire financial report
    recalculateFinancialReport(newFinancialReport);

    newFinancialReport.august.startingBalance = previousFinancialReport?.endingBalance;

    await newFinancialReport.save();
    console.log("FinancialReport updated");

    console.log("Creating AnnexE3");
    const newAnnexE3 = await AnnexE3.create({
      organization: currentOrganization._id,
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
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexF created:", newAnnexF);

    console.log("Creating AnnexG");
    const newAnnexG = await AnnexG.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
    });
    console.log("AnnexG created:", newAnnexG);

    console.log("Creating AnnexH");
    const newAnnexH = await AnnexH.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      osaOfficerInCharge: officerInCharge.name,
    });
    console.log("AnnexH created:", newAnnexH);

    console.log("Creating AnnexI");
    const newAnnexI = await AnnexI.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      osaOfficerInCharge: officerInCharge.name,
    });
    console.log("AnnexI created:", newAnnexI);

    console.log("Creating AnnexJ");
    const newAnnexJ = await AnnexJ.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      osaOfficerInCharge: officerInCharge.name,
    });
    console.log("AnnexJ created:", newAnnexJ);

    console.log("Creating AnnexK");
    const newAnnexK = await AnnexK.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      osaOfficerInCharge: officerInCharge.name,
    });
    console.log("AnnexK created:", newAnnexK);

    console.log("Creating AnnexL");
    const newAnnexL = await AnnexL.create({
      organization: currentOrganization._id,
      academicYear: currentAcademicYear,
      officerInCharge: null,
      secretary: null,
      president: null,
      adviser: null,
      osaOfficerInCharge: officerInCharge.name,
    });
    console.log("AnnexL created:", newAnnexL);

    console.log("Initializing annex fields in organization");
    if (!currentOrganization.annex01) currentOrganization.annex01 = [];
    if (!currentOrganization.annex02) currentOrganization.annex02 = [];
    if (!currentOrganization.annexA) currentOrganization.annexA = [];
    if (!currentOrganization.annexA1) currentOrganization.annexA1 = [];
    if (!currentOrganization.annexB) currentOrganization.annexB = [];
    if (!currentOrganization.annexC) currentOrganization.annexC = [];
    if (!currentOrganization.annexC1) currentOrganization.annexC1 = [];
    if (!currentOrganization.annexD) currentOrganization.annexD = [];
    if (!currentOrganization.annexE) currentOrganization.annexE = [];
    if (!currentOrganization.annexE1) currentOrganization.annexE1 = [];
    if (!currentOrganization.annexE2) currentOrganization.annexE2 = [];
    if (!currentOrganization.annexE3) currentOrganization.annexE3 = [];
    if (!currentOrganization.annexF) currentOrganization.annexF = [];
    if (!currentOrganization.annexG) currentOrganization.annexG = [];
    if (!currentOrganization.annexH) currentOrganization.annexH = [];
    if (!currentOrganization.annexI) currentOrganization.annexI = [];
    if (!currentOrganization.annexJ) currentOrganization.annexJ = [];
    if (!currentOrganization.annexK) currentOrganization.annexK = [];
    if (!currentOrganization.annexL) currentOrganization.annexL = [];

    console.log("Adding annexes to organization");
    currentOrganization.annex01.push(newAnnex01._id);
    currentOrganization.annex02.push(newAnnex02._id);
    currentOrganization.annexA.push(newAnnexA._id);
    currentOrganization.annexA1.push(newAnnexA1._id);
    currentOrganization.annexB.push(newAnnexB._id);
    currentOrganization.annexC.push(newAnnexC._id);
    currentOrganization.annexC1.push(newAnnexC1._id);
    currentOrganization.annexD.push(newAnnexD._id);
    currentOrganization.annexE.push(newAnnexE._id);
    currentOrganization.annexE1.push(newAnnexE1._id);
    currentOrganization.annexE2.push(newAnnexE2._id);
    currentOrganization.annexE3.push(newAnnexE3._id);
    currentOrganization.annexF.push(newAnnexF._id);
    currentOrganization.annexG.push(newAnnexG._id);
    currentOrganization.annexH.push(newAnnexH._id);
    currentOrganization.annexI.push(newAnnexI._id);
    currentOrganization.annexJ.push(newAnnexJ._id);
    currentOrganization.annexK.push(newAnnexK._id);
    currentOrganization.annexL.push(newAnnexL._id);

    console.log("Saving updated organization");
    await currentOrganization.save();
    console.log("Organization saved successfully");

    console.log("new academic year setup process completed successfully");
    return NextResponse.json(
      {
        message: "new academic year setup successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("new academic year setup error:", error);
    return NextResponse.json({ error: "An error occurred during new academic year setup" }, { status: 500 });
  }
}
