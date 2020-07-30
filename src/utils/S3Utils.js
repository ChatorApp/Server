const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

module.exports = {
  put: (params) => s3.putObject(params, (err, data) => (err ? err.stack : data)),
};
