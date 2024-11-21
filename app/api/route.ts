import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// Helper function to handle all methods
async function handleMethod(request: NextRequest) {
  const method = request.method;
  return NextResponse.json({ message: `Received ${method} request` }, { status: 200 });
}

export async function GET(request: NextRequest) {
  return handleMethod(request);
}

export async function POST(request: NextRequest) {
  return handleMethod(request);
}

export async function PUT(request: NextRequest) {
  return handleMethod(request);
}

export async function DELETE(request: NextRequest) {
  return handleMethod(request);
}

export async function PATCH(request: NextRequest) {
  return handleMethod(request);
}

export async function HEAD(request: NextRequest) {
  return handleMethod(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleMethod(request);
}
