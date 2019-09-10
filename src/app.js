import "core-js/stable";
import "regenerator-runtime/runtime";
import AWS from "aws-sdk";
import "dotenv/config";
import { ReplicateS3Bucket } from "./modules/ReplicateBucket";

var s3 = new AWS.S3({
	accessKeyId: process.env.access_key_id,
	secretAccessKey: process.env.secret_access_key,
	region: process.env.region
});

ReplicateS3Bucket(s3);