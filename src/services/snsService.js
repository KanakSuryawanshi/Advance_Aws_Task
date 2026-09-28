const { PublishCommand } = require("@aws-sdk/client-sns");
const sns = require("../config/snsConfig");
const { sendLog, sendMetric } = require("./cloudwatchService");
const sendNotification = async (
    user_id,
    s3_key,
    originalname,
    requestId,
    route
) => {
    const message = {
        event: "DOCUMENT_UPLOADED",
        userId: user_id,
        fileName: originalname,
        s3Key: s3_key
        // uploadedAt:
    };

    const command = new PublishCommand({
        TopicArn: process.env.SNS_TOPICARN,
        Subject: "Document Uploaded Successfully",
        Message: JSON.stringify(message)
    });

    try {
        await sns.send(command);

        // await sendLog("INFO: SNS notification published");
        await sendLog(
            "INFO",
            "SNS notification published",
            requestId,
            user_id,
            route,
            200,
            null
        );
        // await sendMetric("SNSNotificationsSent");


    } catch (err) {
        console.log("SNS notification failed");

        // await sendLog("ERROR: SNS notification failed");
        await sendLog(
            "ERROR",
            "SNS notification failed",
            requestId,
            user_id,
            route,
            500,
            null
        );
        // await sendMetric("SNSNotificationsFailed");
        await sendMetric("SNSPublishFailureCount", 1, "Count");
    }
};

module.exports = { sendNotification };

