// const { SNSClient } = require("@aws-sdk/client-sns");

// const sns = new SNSClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESSKEYID,
//         secretAccessKey: process.env.AWS_SECRETKEYID
//     }
// });

// module.exports = sns;

const { SNSClient } = require("@aws-sdk/client-sns");

const sns = new SNSClient({
    region: process.env.AWS_REGION
});

module.exports = { sns };