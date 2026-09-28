const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { sendLog } = require('./cloudwatchService');
const { sendMetric } = require('./cloudwatchService')
const s3 = require("../config/s3Config");

const uploadToS3 = async (fileBuffer, key, mimeType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType
    });
    try {
        await s3.send(command);
        console.log("S3 upload successful");
        await sendLog("INFO: S3 upload successful");
        await sendMetric("DocumentsUploaded");

    } catch (err) {
        console.log("S3 upload failed");
        await sendLog("ERROR: S3 upload failed");
        await sendMetric("DocumentsUploadFailed");

        return;
    }

    const s3Url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return s3Url;
};


const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    });
    await s3.send(command);
};


const getDownloadUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return url;
};

module.exports = { uploadToS3, deleteFromS3, getDownloadUrl };