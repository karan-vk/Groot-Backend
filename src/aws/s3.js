const AWS = require('aws-sdk');
const ID = process.env.AWS_ID;
const SECRET = process.env.S3_SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = 'codepipeline-ap-south-1-539093438114';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
module.exports = s3