// C:\Users\kercw\code\dev\esorr\app\api\annexes\[organizationId]\annex-c\[annexId]\articles-of-association\[articlesOfAssociationId]\route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import ArticlesOfAssociation from "@/models/articles-of-association";

export async function PUT(
  req: Request,
  { params }: { params: { organizationId: string; annexId: string; articlesOfAssociationId: string } }
) {
  await connectToDatabase();

  try {
    const { articles } = await req.json();
    const { articlesOfAssociationId } = params;

    const articlesOfAssociation = await ArticlesOfAssociation.findById(articlesOfAssociationId);

    if (!articlesOfAssociation) {
      return NextResponse.json({ error: "Articles of Association not found" }, { status: 404 });
    }

    articlesOfAssociation.articles = articles;
    await articlesOfAssociation.save();

    return NextResponse.json(articlesOfAssociation, { status: 200 });
  } catch (error) {
    console.error("Error updating Articles of Association:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
