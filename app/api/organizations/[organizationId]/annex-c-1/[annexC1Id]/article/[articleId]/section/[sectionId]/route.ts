import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Sections from "@/models/articles-of-association/section";
import { SectionInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
  sectionId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const section = await Sections.findById(params.sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();

  const sectionInput: SectionInput = await req.json();

  try {
    const updatedSection = await Sections.findByIdAndUpdate(params.sectionId, sectionInput, { new: true });
    if (!updatedSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(updatedSection, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
