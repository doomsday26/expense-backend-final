const AWS = require("aws-sdk");
require("dotenv").config();

exports.uploadToS3 = (data, filename) => {
  let fileUrl;
  const bucketName = process.env.BUCKET_NAME;
  const userKey = process.env.IAM_USER_KEY;
  const userSecretKey = process.env.IAM_USER_SECRETKEY;
  let s3bucket = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: userSecretKey,
    // Bucket:bucketName
  });

  var params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, response) => {
      if (err) {
        console.log("something went wrong");
        console.log(err);
        reject(err);
      } else {
        console.log("success", response);
        resolve(response.Location);
      }
    });
  });
};
exports.getFromS3 = (user) => {




};


