import { Storage } from "@google-cloud/storage";

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

export async function deleteFile(fileName: string): Promise<void> {
  try {
    await bucket.file(fileName).delete();
    console.log(`File ${fileName} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    throw error;
  }
}
