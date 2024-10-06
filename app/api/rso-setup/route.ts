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
    const socials = JSON.parse(formData.get("socials") as string);
    const signatoryRequests = JSON.parse(formData.get("signatoryRequests") as string);
    const email = formData.get("email") as string;

    if (!name || !logo || !socials || !signatoryRequests || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logoUrl = await uploadImage(logo);

    const newOrganization = await Organization.create({
      name,
      logo: logoUrl,
      socials,
    });

    const newSignatoryRequests = await Promise.all(
      signatoryRequests.map(async (request: any) => {
        return await SignatoryRequest.create({
          ...request,
          organization: newOrganization._id,
          requestedBy: email,
          role: "RSO-SIGNATORY",
        });
      })
    );

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    currentUser.organizations.push(newOrganization._id);
    await currentUser.save();

    return NextResponse.json(
      { message: "Organization created successfully", data: newOrganization, signatoryRequests: newSignatoryRequests },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json({ error: "An error occurred while creating the organization" }, { status: 500 });
  }
}
