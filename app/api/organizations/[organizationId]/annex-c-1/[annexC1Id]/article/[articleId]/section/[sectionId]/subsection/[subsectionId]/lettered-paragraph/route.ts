import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import LetteredParagraphs from "@/models/articles-of-association/lettered-paragraph";
import Subsections from "@/models/articles-of-association/subsection";
import { LetteredParagraphInput } from "@/types";

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
    const letteredParagraphs = await LetteredParagraphs.find({ subsection: params.subsectionId });
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
      subsection: params.subsectionId,
    });
    await Subsections.findByIdAndUpdate(params.subsectionId, { $push: { letteredParagraphs: letteredParagraph._id } });

    return NextResponse.json(letteredParagraph, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
