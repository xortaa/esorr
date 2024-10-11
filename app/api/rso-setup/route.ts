import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organization from "@/models/organization";
import SignatoryRequest from "@/models/signatory-request";
import User from "@/models/user";
import { uploadImage } from "@/utils/storage";

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

    const newOrganization = await Organization.create({
      name,
      logo: logoUrl,
      socials,
      affiliation: finalAffiliation,
      website,
      category,
      strategicDirectionalAreas,
      mission,
      vision,
      description,
      objectives,
    });

    if (signatoryRequests.length > 0) {
      await Promise.all(
        signatoryRequests.map(async (request: any) => {
          return await SignatoryRequest.create({
            ...request,
            organization: newOrganization._id,
            requestedBy: email,
            role: request.isExecutive ? "RSO-EXECUTIVE" : "RSO-SIGNATORY",
          });
        })
      );
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.findOneAndUpdate(
      { email },
      {
        isSetup: true,
        organizations: [...currentUser.organizations, newOrganization._id],
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "RSO setup successful",
        organizationId: newOrganization._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSO setup error:", error);
    return NextResponse.json({ error: "An error occurred during RSO setup" }, { status: 500 });
  }
}
