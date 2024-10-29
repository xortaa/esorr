import { Storage } from "@google-cloud/storage";

const storageClient = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
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
