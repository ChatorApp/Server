const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

module.exports = {
    put: (params) => {
        return s3.putObject(params, (err, data) => {
            if(err) console.log(err, err.stack);
            else return data;
        });
    },
};
