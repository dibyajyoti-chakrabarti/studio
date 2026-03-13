import { S3Client } from "@aws-sdk/client-s3";

let region = process.env.AWS_REGION || "ap-south-1";

// Handle formats like "Stockholm-eu-north-1" or "Stockholm (eu-north-1)"
if (region.includes("-") && !/^(us|eu|ap|sa|ca|me|af)-/.test(region)) {
    const match = region.match(/(us|eu|ap|sa|ca|me|af)-[a-z]+-\d+/);
    if (match) {
        region = match[0];
    }
}

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.replace(/\s/g, ''); // Clean any accidental spaces

if (!region || !accessKeyId || !secretAccessKey) {
    console.warn("AWS S3 configuration missing in environment variables");
}

export const s3Client = new S3Client({
    region: region || "ap-south-1",
    credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
    },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || "";
export const S3_REGION = region || "ap-south-1";
