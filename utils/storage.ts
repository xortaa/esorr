import { Storage } from "@google-cloud/storage";

const storageClient = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storageClient.bucket(bucketName);

export const uploadImage = async (image: File): Promise<string> => {
  const blob = bucket.file(image.name);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: image.type,
    },
  });

  const imageBuffer = await image.arrayBuffer();
  blobStream.end(Buffer.from(imageBuffer));

  await new Promise((resolve, reject) => {
    blobStream.on("finish", resolve);
    blobStream.on("error", reject);
  });

  return `https://storage.googleapis.com/${bucketName}/${image.name}`;
};
