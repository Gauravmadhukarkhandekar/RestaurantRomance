const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file, folder = 'restaurants') => {
  const key = `${folder}/${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    // Construct the public URL manually (v3 PutObjectCommand doesn't return Location)
    const location = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-1'}.amazonaws.com/${key}`;
    return location;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

module.exports = { uploadToS3 };
