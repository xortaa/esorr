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

    if (!name) return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    if (!logo) return NextResponse.json({ error: "Missing organization logo" }, { status: 400 });
    if (!isNotUniversityWideString)
      return NextResponse.json({ error: "Missing university-wide status" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Missing user email" }, { status: 400 });

    let socials = [],
      signatoryRequests = [];
    if (socialsString) {
      try {
        socials = JSON.parse(socialsString);
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
    });

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
