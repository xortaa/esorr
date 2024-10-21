import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Sections from "@/models/articles-of-association/section";
import Articles from "@/models/articles-of-association/article";
import { SectionInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const sections = await Sections.find({ articleId: params.articleId });
    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const sectionInput: SectionInput = await req.json();
  try {
    const newSection = await Sections.create({
      ...sectionInput,
      articleId: params.articleId,
    });
    // push to corresponding article
    const article = await Articles.findById(params.articleId);
    article.sections.push(newSection._id);
    await article.save();

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
