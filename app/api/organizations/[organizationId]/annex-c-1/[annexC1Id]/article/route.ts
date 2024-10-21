import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Articles from "@/models/articles-of-association/article";
import AnnexC1s from "@/models/articles-of-association/annex-c-1";
import { ArticleInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const article = await Articles.find({ annex_c_1: params.annexC1Id });
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const articleInput: ArticleInput = await req.json();
  try {
    const newArticle = await Articles.create({
      ...articleInput,
      annex_c_1: params.annexC1Id,
    });
    // push to corresponding annexc1
    const annexC1 = await AnnexC1s.findById(params.annexC1Id);
    annexC1.articles.push(newArticle._id);
    await annexC1.save();
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
