const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({}); // uses region/creds from Lambda environment

exports.handler = async (event) => {
  console.log("Event received: ", JSON.stringify(event, null, 2));

  const bucket = process.env.BUCKET_NAME;
  if (!bucket) {
    throw new Error("BUCKET_NAME environment variable is not set");
  }

  try {
    const params = {
      Bucket: bucket,
      Key: `test-object-${Date.now()}.txt`,
      Body: JSON.stringify(event),
    };

    // ✅ Use send with PutObjectCommand
    await s3.send(new PutObjectCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from Lambda!! PedroOps AWS CDK + Typescript Implementation.",
        bucket,
      }),
    };
  } catch (err) {
    console.error("S3 upload failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
