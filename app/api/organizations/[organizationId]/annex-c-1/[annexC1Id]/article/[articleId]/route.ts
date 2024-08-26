import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/db/mongodb";
import Articles from "@/models/articles-of-association/article";
import { ArticleInput } from "@/types";

interface Params {
  organizationId: string;
  annexC1Id: string;
  articleId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  try {
    const article = await Articles.findById(params.articleId);
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  await connectToDatabase();
  const articleInput: ArticleInput = await req.json();
  try {
    const updatedArticle = await Articles.findByIdAndUpdate(params.articleId, articleInput, { new: true });
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
