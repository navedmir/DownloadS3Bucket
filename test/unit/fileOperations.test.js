import { makeDirectory } from "../../src/modules/FileOperations";
import fs from "fs";

jest.mock("fs");

describe("make directory", () => {
	it("When directory already exists", async () => {
		fs.existsSync.mockReturnValue(true);
		makeDirectory("abc");
		expect(fs.mkdir).not.toHaveBeenCalled();
	});
	it("When directory doesn't exists", async () => {
		fs.existsSync.mockReturnValue(false);
		makeDirectory("abc");
		expect(fs.mkdir).toHaveBeenCalled();
	});
});
