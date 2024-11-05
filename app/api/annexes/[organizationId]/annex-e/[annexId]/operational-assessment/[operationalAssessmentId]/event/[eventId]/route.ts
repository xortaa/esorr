import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import Event from "@/models/event";

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; operationalAssessmentId: string; eventId: string } }
) {
  try {
    await connectToDatabase();
    const event = await Event.findById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; operationalAssessmentId: string; eventId: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updateData: any = {
      title: body.title,
      eReserveNumber: body.eReserveNumber,
      date: body.date,
      venue: body.venue,
      adviser: body.adviser,
      timeAttended: body.timeAttended,
      speakerName: body.speakerName,
      speakerTopic: body.speakerTopic,
      speakerAffiliation: body.speakerAffiliation,
      speakerPosition: body.speakerPosition,
      totalParticipants: body.totalParticipants,
      totalRespondents: body.totalRespondents,
      evaluationSummary: body.evaluationSummary,
      assessment: body.assessment,
      comments: body.comments,
      sponsorName: body.sponsorName,
      sponsorshipTypes: body.sponsorshipTypes,
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      params.eventId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { organizationId: string; annexId: string; operationalAssessmentId: string; eventId: string } }
) {
  try {
    await connectToDatabase();
    const deletedEvent = await Event.findByIdAndDelete(params.eventId);
    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}