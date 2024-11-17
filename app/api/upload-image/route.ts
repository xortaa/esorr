import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const storageClient = new Storage({
  credentials: {
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
  },
  projectId: process.env.GCP_PROJECT_ID,
});

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storageClient.bucket(bucketName);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename using uuid
    const uniqueFilename = `${uuidv4()}-${file.name}`;

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
