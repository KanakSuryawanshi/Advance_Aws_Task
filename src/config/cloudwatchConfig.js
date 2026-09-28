// const { CloudWatchLogsClient } = require("@aws-sdk/client-cloudwatch-logs");
// const { CloudWatchClient } = require("@aws-sdk/client-cloudwatch");

// const cloudwatchLogs = new CloudWatchLogsClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESSKEYID,
//         secretAccessKey: process.env.AWS_SECRETKEYID
//     }
// });

// const cloudwatch = new CloudWatchClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESSKEYID,
//         secretAccessKey: process.env.AWS_SECRETKEYID
//     }
// });

// module.exports = { cloudwatchLogs, cloudwatch };

const { CloudWatchLogsClient } = require("@aws-sdk/client-cloudwatch-logs");
const { CloudWatchClient } = require("@aws-sdk/client-cloudwatch");

const cloudwatchLogs = new CloudWatchLogsClient({
    region: process.env.AWS_REGION
});

const cloudwatch = new CloudWatchClient({
    region: process.env.AWS_REGION
});

module.exports = { cloudwatchLogs, cloudwatch };