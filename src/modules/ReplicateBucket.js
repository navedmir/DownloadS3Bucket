import "core-js/stable";
import "regenerator-runtime/runtime";
import fs from "fs";
import path from "path";
import Promise from "bluebird";
import { makeDirectory } from "./FileOperations";

/**
 * This function replicates the whole s3 bucket
 * It first creates a bucket root directory, then gets all the keys from a bucket and uses those to create sub directories
 * and it the end it download's files from bucket and saves in their respective directory
 * @param {aws service object} s3
 */
export async function ReplicateS3Bucket(s3) {
	try {
		/** Array containing all the keys from a bucket */
		let bucketKeys = [];
		/** Array containing keys only for files(it excludes key's for empty directories) */
		let fileKeys;
		/** Root directory for the bucket files, it is same as the bucket name */
		const bucketDir = process.env.rootBuckets + process.env.bucketName;

		/** parameter to be passed to get the bucket keys,
		 * bucket - bucket name
		 * Max keys- number of keys to return in one call(default 1000)
		 */
		const getBucketKeyParam = {
			Bucket: process.env.bucketName,
			MaxKeys: 1000
		};

		/** create a root directory with the bucket name */
		makeDirectory(bucketDir);
		bucketKeys = await getAllBucketKeys(s3, getBucketKeyParam, []);
		makeBucketDirectories(bucketKeys, bucketDir);
		fileKeys = bucketKeys.filter(bucketKey => !bucketKey.endsWith("/"));
		downloadFiles(s3, fileKeys, bucketDir);
	} catch (e) {
		console.log("Error in Replicate");
		console.log(e);
		throw e;
	}
}

/**
 * Return  all the keys in a specified bucket
 * @param {aws service object} s3
 * @param {Object} params - parameters to be passed to listObjectsV2
 * @param {Array} bucketKeys - Array folding the bucket Keys
 * @return Array of bucket keys
 * Throw an error , if getting bucket keys fails
 */

async function getAllBucketKeys(s3, params, bucketKeys) {
	try {
		let bucketObj = await s3.listObjectsV2(params).promise();

		/** extract keys and push it to bucketKeys array */
		bucketObj.Contents.forEach(obj => bucketKeys.push(obj.Key));

		if (bucketObj.IsTruncated) {
			params.ContinuationToken = bucketObj.NextContinuationToken;
			await getAllBucketKeys(s3, params, bucketKeys);
		}
		return bucketKeys;
	} catch (e) {
		console.log("Error while getting the keys");
		console.log(e);
		throw e;
	}
}

/**
 * Make all the directories and sub-directories for the keys
 * @param {Array} bucketKeys - All the keys in a bucket
 * @param {string} bucketDir - Root directory for the bucket files
 */
export function makeBucketDirectories(bucketKeys, bucketDir) {
	bucketKeys.forEach(filePath => {
		let fileDir = filePath.endsWith("/") ? filePath : path.dirname(filePath);
		makeDirectory(`${bucketDir}/${fileDir}`);
	});
}

/**
 * It download's the files form a bucket and stores in the respective directories
 * It controls the download by specifying the concurrent downloads parameter(4)
 * @param {aws service object} s3
 * @param {Array} fileKeys - Array containing keys for all the files to be downloaded from a given bucket
 * @param {string} bucketDir - Root directory name
 */

function downloadFiles(s3, fileKeys, bucketDir) {
	Promise.map(
		fileKeys,
		filekey => {
			const params = {
				Bucket: process.env.bucketName,
				Key: filekey
			};
			let file = fs.createWriteStream(`${bucketDir}/${filekey}`);
			s3.getObject(params)
				.createReadStream()
				.pipe(file);
		},
		{
			concurrency: 4
		}
	)
		.then(() => console.log("All the files downloaded"))
		.catch(e => {
			console.log("File download error");
			console.log(e);
		});
}
