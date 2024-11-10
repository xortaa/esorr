import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const storageClient = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});

const bucketName = process.env.GCP_BUCKET_SIGNATURES;
const bucket = storageClient.bucket(bucketName);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const annexId = formData.get("annexId") as string;
    const position = formData.get("position") as string;

    if (!file || !annexId || !position) {
      return NextResponse.json({ error: "Missing required information" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${annexId}_${position}_${uuidv4()}.${fileExtension}`;

    // Upload to Google Cloud Storage
    const blob = bucket.file(uniqueFilename);
    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.type,
        },
      });

      blobStream.on("error", reject);
      blobStream.on("finish", resolve);
      blobStream.end(buffer);
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
