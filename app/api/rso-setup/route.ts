import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";
import SignatoryRequest from "@/models/signatory-request";
import User from "@/models/user";
import { uploadImage } from "@/utils/storage";
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

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as File;
    const socialsString = formData.get("socials") as string;
    const signatoryRequestsString = formData.get("signatoryRequests") as string;
    const isNotUniversityWideString = formData.get("isNotUniversityWide") as string;
    const affiliation = formData.get("affiliation") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const category = formData.get("category") as string;
    const strategicDirectionalAreasString = formData.get("strategicDirectionalAreas") as string;
    const mission = formData.get("mission") as string;
    const vision = formData.get("vision") as string;
    const description = formData.get("description") as string;
    const objectivesString = formData.get("objectives") as string;
    const startingBalance = parseFloat(formData.get("startingBalance") as string);
    const currentAcademicYear = formData.get("currentAcademicYear") as string;

    const academicYearOfLastRecognition = formData.get("academicYearOfLastRecognition") as string;

    if (!name) return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    if (!logo) return NextResponse.json({ error: "Missing organization logo" }, { status: 400 });
    if (!isNotUniversityWideString)
      return NextResponse.json({ error: "Missing university-wide status" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    if (!website) return NextResponse.json({ error: "Missing organization website" }, { status: 400 });
    if (!category) return NextResponse.json({ error: "Missing organization category" }, { status: 400 });
    if (!mission) return NextResponse.json({ error: "Missing organization mission" }, { status: 400 });
    if (!vision) return NextResponse.json({ error: "Missing organization vision" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Missing organization description" }, { status: 400 });
    if (isNaN(startingBalance)) {
      return NextResponse.json({ error: "Invalid starting balance" }, { status: 400 });
    }

    let socials = [],
      signatoryRequests = [],
      strategicDirectionalAreas = [],
      objectives = [];

    if (socialsString) {
      try {
        socials = JSON.parse(socialsString);
        if (!Array.isArray(socials)) {
          throw new Error("Socials must be an array");
        }
      } catch (error) {
        return NextResponse.json({ error: "Invalid JSON in socials" }, { status: 400 });
      }
    }

    if (signatoryRequestsString) {
      try {
        signatoryRequests = JSON.parse(signatoryRequestsString);
      } catch (error) {
        return NextResponse.json({ error: "Invalid JSON in signatory requests" }, { status: 400 });
      }
    }
    if (strategicDirectionalAreasString) {
      try {
        strategicDirectionalAreas = JSON.parse(strategicDirectionalAreasString);
      } catch (error) {
        return NextResponse.json({ error: "Invalid JSON in strategic directional areas" }, { status: 400 });
      }
    }
    if (objectivesString) {
      try {
        objectives = JSON.parse(objectivesString);
      } catch (error) {
        return NextResponse.json({ error: "Invalid JSON in objectives" }, { status: 400 });
      }
    }

    const isNotUniversityWide = isNotUniversityWideString === "true";

    if (isNotUniversityWide && !affiliation) {
      return NextResponse.json({ error: "Missing affiliation for non-university-wide organization" }, { status: 400 });
    }

    const finalAffiliation = isNotUniversityWide ? affiliation : "University Wide";

    const logoUrl = await uploadImage(logo);

    // create organization
    const newOrganization = await Organization.create({
      name,
      logo: logoUrl,
      affiliation: finalAffiliation,
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

    // Debugging: Log the new organization
    console.log("New Organization:", newOrganization);

    // create all annexes

    const newAnnex01 = await Annex01.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnex02 = await Annex02.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

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

    const newAnnexA1 = await AnnexA1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexB = await AnnexB.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexC = await AnnexC.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexC1 = await AnnexC1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexD = await AnnexD.create({
      logo: logoUrl,
      description: "",
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexE = await AnnexE.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexE1 = await AnnexE1.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexE2 = await AnnexE2.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexE3 = await AnnexE3.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexF = await AnnexF.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexG = await AnnexG.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexH = await AnnexH.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexI = await AnnexI.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexJ = await AnnexJ.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexK = await AnnexK.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    const newAnnexL = await AnnexL.create({
      organization: newOrganization._id,
      academicYear: currentAcademicYear,
    });

    // Debugging: Log the annexes
    console.log("Annexes created:", {
      newAnnex01,
      newAnnex02,
      newAnnexA,
      newAnnexA1,
      newAnnexB,
      newAnnexC,
      newAnnexC1,
      newAnnexD,
      newAnnexE,
      newAnnexE1,
      newAnnexE2,
      newAnnexE3,
      newAnnexF,
      newAnnexG,
      newAnnexH,
      newAnnexI,
      newAnnexJ,
      newAnnexK,
      newAnnexL,
    });

    // Ensure all annex fields are initialized
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

    // add the annex to the organization
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

    await newOrganization.save();

    if (signatoryRequests.length > 0) {
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
    }

    const currentUser = await User.findOne({ role: "RSO", email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's organizations and positions
    const existingPositionIndex = currentUser.positions.findIndex(
      (pos) => pos.organization.toString() === newOrganization._id.toString()
    );

    if (existingPositionIndex !== -1) {
      // Update the existing position
      currentUser.positions[existingPositionIndex].position = "RSO-SIGNATORY";
    } else {
      // Add a new position
      currentUser.positions.push({
        organization: newOrganization._id,
        position: "OFFICIAL EMAIL",
      });
    }

    currentUser.organizations.push(newOrganization._id);
    currentUser.isSetup = true;

    await currentUser.save();

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
