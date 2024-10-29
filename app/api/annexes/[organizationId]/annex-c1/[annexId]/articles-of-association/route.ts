import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import mongoose from "mongoose";
import ArticlesOfAssociation from "@/models/articles-of-association";
import AnnexC1 from "@/models/annex-c1";

export async function GET(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { annexId } = params;

    const annexC1 = await AnnexC1.findById(annexId);
    if (!annexC1) {
      return NextResponse.json({ message: "AnnexC1 not found" }, { status: 404 });
    }

    const articlesOfAssociation = await ArticlesOfAssociation.findOne({ annexc1: annexC1._id });

    if (!articlesOfAssociation) {
      return NextResponse.json({ message: "Articles of Association not found" }, { status: 404 });
    }

    return NextResponse.json(articlesOfAssociation);
  } catch (error) {
    console.error("Error fetching Articles of Association:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { annexId } = params;
    const body = await request.json();

    const annexC1 = await AnnexC1.findById(annexId);
    if (!annexC1) {
      return NextResponse.json({ message: "AnnexC1 not found" }, { status: 404 });
    }

    // Check if ArticlesOfAssociation already exists for this AnnexC1
    const existingArticlesOfAssociation = await ArticlesOfAssociation.findOne({ annexc1: annexC1._id });
    if (existingArticlesOfAssociation) {
      return NextResponse.json({ message: "Articles of Association already exist for this AnnexC1" }, { status: 400 });
    }

    const newArticlesOfAssociation = new ArticlesOfAssociation({
      ...body,
      annexc1: annexC1._id,
    });

    const savedArticlesOfAssociation = await newArticlesOfAssociation.save();

    // Update AnnexC1 with the new ArticlesOfAssociation reference
    annexC1.articlesOfAssociation = savedArticlesOfAssociation._id;
    await annexC1.save();

    return NextResponse.json(savedArticlesOfAssociation, { status: 201 });
  } catch (error) {
    console.error("Error creating Articles of Association:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { organizationId: string; annexId: string } }) {
  try {
    await connectToDatabase();
    const { annexId } = params;
    const body = await request.json();

    const annexC1 = await AnnexC1.findById(annexId);
    if (!annexC1) {
      return NextResponse.json({ message: "AnnexC1 not found" }, { status: 404 });
    }

    const updatedArticlesOfAssociation = await ArticlesOfAssociation.findOneAndUpdate(
      { annexc1: annexC1._id },
      {
        $set: body,
      },
      { new: true, upsert: true }
    );

    if (!updatedArticlesOfAssociation) {
      return NextResponse.json({ message: "Failed to update Articles of Association" }, { status: 500 });
    }

    // Ensure AnnexC1 has the reference to ArticlesOfAssociation
    if (!annexC1.articlesOfAssociation) {
      annexC1.articlesOfAssociation = updatedArticlesOfAssociation._id;
      await annexC1.save();
    }

    return NextResponse.json(updatedArticlesOfAssociation);
  } catch (error) {
    console.error("Error updating Articles of Association:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
