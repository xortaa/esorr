import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/db/mongodb";
import LetteredParagraphs from "@/models/articles-of-association/lettered-paragraph";
import { LetteredParagraphInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
  sectionId: string;
  subsectionId: string;
  letteredParagraphId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const letteredParagraph = await LetteredParagraphs.findById(params.letteredParagraphId);
    console.log(params.letteredParagraphId);
    return NextResponse.json(letteredParagraph, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const letteredParagraphInput: LetteredParagraphInput = await req.json();
  try {
    const updatedLetteredParagraph = await LetteredParagraphs.findByIdAndUpdate(
      params.letteredParagraphId,
      letteredParagraphInput,
      {
        new: true,
      }
    );
    return NextResponse.json(updatedLetteredParagraph, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
