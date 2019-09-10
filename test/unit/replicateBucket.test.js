import { makeBucketDirectories } from "../../src/modules/ReplicateBucket";
import * as makeDirectory from "../../src/modules/FileOperations";

jest.mock("fs");

describe("make bucket directories", () => {
	it("for a single key", async () => {
		const spy = jest.spyOn(makeDirectory, "makeDirectory");
		spy.mockImplementation(param1 => param1);
		spy.mockReturnValue("mocked");
		makeBucketDirectories(["abc/file.js"], "abc");
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith("abc/abc");
		jest.resetAllMocks();
	});

	it("for a more than one key,with second being a empty folder", async () => {
		const spy = jest.spyOn(makeDirectory, "makeDirectory");
		spy.mockImplementation(param1 => param1);
		spy.mockReturnValue("mocked");
		makeBucketDirectories(["sub/file.js", "sub/folder1/"], "abc");
		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy.mock.calls).toEqual([["abc/sub"], ["abc/sub/folder1/"]]);
		jest.resetAllMocks();
	});
});
