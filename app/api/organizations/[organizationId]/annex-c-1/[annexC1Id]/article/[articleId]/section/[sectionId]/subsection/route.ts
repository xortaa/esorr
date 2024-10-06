import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Subsections from "@/models/articles-of-association/subsection";
import { SubsectionInput } from "@/types";
import Sections from "@/models/articles-of-association/section";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
  sectionId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();

  try {
    const subsections = await Subsections.find({ section: params.sectionId });
    return NextResponse.json(subsections, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();

  const subsectionInput: SubsectionInput = await req.json();

  try {
    const newSubsection = await Subsections.create({ ...subsectionInput, section: params.sectionId });
    // Update the section to include the new subsection
    await Sections.findByIdAndUpdate(params.sectionId, {
      $push: { subsections: newSubsection._id },
    });

    return NextResponse.json(newSubsection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
