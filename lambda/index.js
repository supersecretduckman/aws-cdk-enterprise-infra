const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Initialize S3 client (uses Lambda's IAM role for auth)
const s3 = new S3Client();

exports.handler = async (event) => {
  try {
    // 🔹 Log the incoming event from API Gateway
    console.log("Event received:", JSON.stringify(event, null, 2));

    const bucket = process.env.BUCKET_NAME;
    const key = `test-object-${Date.now()}.txt`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(event),
    };

    // Upload object to S3
    await s3.send(new PutObjectCommand(params));

    // 🔹 Log the success message
    console.log(`✅ Hello from Lambda!! Successfully uploaded ${key} to bucket: ${bucket}`);

    // Return HTTP response to API Gateway
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from Lambda!! This is a PedroOps implementation using AWS CDK + Typescript...",
        bucket,
        key,
      }),
    };
  } catch (error) {
    console.error("❌ Lambda execution failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
