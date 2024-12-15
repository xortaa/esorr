  import { NextRequest, NextResponse } from "next/server";
  import connectToDatabase from "@/utils/mongodb";
  import Affiliations from "@/models/affiliation";

  export const PATCH = async (req: NextRequest, { params }: { params: { affiliationId: string; programId: string } }) => {
    await connectToDatabase();

    const { isArchived } = await req.json();

    try {
      const updatedAffiliation = await Affiliations.findOneAndUpdate(
        { _id: params.affiliationId, "programs._id": params.programId },
        { $set: { "programs.$.isArchived": isArchived } },
        { new: true }
      );

      if (!updatedAffiliation) {
        return NextResponse.json({ error: "Affiliation or program not found" }, { status: 404 });
      }

      return NextResponse.json(updatedAffiliation, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
  };

  export const DELETE = async (
    req: NextRequest,
    { params }: { params: { affiliationId: string; programId: string } }
  ) => {
    await connectToDatabase();

    try {
      const updatedAffiliation = await Affiliations.findOneAndUpdate(
        { _id: params.affiliationId, "programs._id": params.programId },
        { $set: { "programs.$.isArchived": true } },
        { new: true }
      );

      if (!updatedAffiliation) {
        return NextResponse.json({ error: "Affiliation or program not found" }, { status: 404 });
      }

      return NextResponse.json(updatedAffiliation, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
  };
