import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import Subsections from "@/models/articles-of-association/subsection";
import { SubsectionInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
  sectionId: string;
  subsectionId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const subsection = await Subsections.findById(params.subsectionId);
    return NextResponse.json(subsection, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const subsectionInput: SubsectionInput = await req.json();
  try {
    const updatedSubsection = await Subsections.findByIdAndUpdate(params.subsectionId, subsectionInput, {
      new: true,
    });
    return NextResponse.json(updatedSubsection, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
