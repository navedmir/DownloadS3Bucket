import "core-js/stable";
import "regenerator-runtime/runtime";
import fs from "fs";

/**
 * This function takes in a name of a directory and first checks whether the directory exists
 * If it doesn't exist, it creates the directory
 * @param {string} dirName - name of the directory
 * It throws an error , it directory can't be made(access denied etc)
 */

export function makeDirectory(dirName) {
	try {
		if (!fs.existsSync(dirName))
			fs.mkdir(dirName,{recursive: true},err =>{
					if (err) throw err;
				}
			);
	} catch (e) {
		console.log("Make directory error")
		console.log(e);
		throw e;
	}
}
