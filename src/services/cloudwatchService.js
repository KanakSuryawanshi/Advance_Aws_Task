const { PutLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const { PutMetricDataCommand } = require("@aws-sdk/client-cloudwatch");

const { cloudwatchLogs, cloudwatch } = require("../config/cloudwatchConfig");

const sendLog = async (message) => {
    const command = new PutLogEventsCommand({
        logGroupName: process.env.CLOUDWATCH_LOGGROUP,
        logStreamName: process.env.CLOUDWATCH_LOGSTREAM,
        logEvents: [
            {
                message: message,
                timestamp: Date.now()
            }
        ]
    });
    // console.log(cloudwatch.message)
    await cloudwatchLogs.send(command);
};


const sendMetric = async (metricName) => {
    const command = new PutMetricDataCommand({
        Namespace: "AdvancedDocumentSystem",
        MetricData: [
            {
                MetricName: metricName,
                Value: 1,
                Unit: "Count"
            }
        ]
    });
    await cloudwatch.send(command);
};

module.exports = { sendLog, sendMetric };

