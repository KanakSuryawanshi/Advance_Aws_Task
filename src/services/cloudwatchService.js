const { PutLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const { PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch");
const { cloudwatchLogs, cloudwatch } = require("../config/cloudwatchConfig");

const sendLog = async (level, message, requestId, userId, route, statusCode, duration) => {

    const log = {
        timestamp: new Date().toISOString(),
        level: level,
        message: message,
        requestId: requestId,
        userId: userId,
        route: route,
        statusCode: statusCode,
        duration: duration
    };

    const command = new PutLogEventsCommand({
        logGroupName: process.env.CLOUDWATCH_LOGGROUP,
        logStreamName: process.env.CLOUDWATCH_LOGSTREAM,
        logEvents: [
            {
                message: JSON.stringify(log),
                timestamp: Date.now()
            }
        ]
    });

    await cloudwatchLogs.send(command);
};


const sendMetric = async (metricName, value, unit) => {

    const command = new PutMetricDataCommand({
        Namespace: "AdvancedDocumentSystem",
        MetricData: [
            {
                MetricName: metricName,
                Value: value,
                Unit: unit
            }
        ]
    });

    await cloudwatch.send(command);
};

module.exports = { sendLog, sendMetric };