import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/db/mongodb";
import LetteredParagraphs from "@/models/articles-of-association/lettered-paragraph";
import { LetteredParagraphInput } from "@/types";
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
    const letteredParagraphs = await LetteredParagraphs.find({ section: params.sectionId });
    return NextResponse.json(letteredParagraphs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const letteredParagraphInput: LetteredParagraphInput = await req.json();
  try {
    const letteredParagraph = await LetteredParagraphs.create({
      ...letteredParagraphInput,
      section: params.sectionId,
    });
    // push to corresponding section
    const section = await Sections.findById(params.sectionId);
    section.letteredParagraphs.push(letteredParagraph._id);
    await section.save();

    return NextResponse.json(letteredParagraph, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
