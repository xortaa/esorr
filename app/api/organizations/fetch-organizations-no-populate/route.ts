import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Organizations from "@/models/organization";

export const GET = async (req: NextRequest) => {
  await connectToDatabase();

  try {
    const organizations = await Organizations.find().select("name affiliation").lean();

    const sortedOrganizations = organizations.sort((a, b) => {
      if (a.affiliation === "University Wide" && b.affiliation !== "University Wide") {
        return -1;
      }
      if (a.affiliation !== "University Wide" && b.affiliation === "University Wide") {
        return 1;
      }
      if (a.affiliation !== b.affiliation) {
        const getThirdWord = (affiliation) => {
          const words = affiliation.split(" ");
          return words.length >= 3 ? words[2] : affiliation;
        };
        return getThirdWord(a.affiliation).localeCompare(getThirdWord(b.affiliation));
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(sortedOrganizations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
