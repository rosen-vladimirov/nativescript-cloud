import { CloudLibVersion } from "../../lib/commands/cloud-lib-version";
import { PackageInfoService } from "../../lib/services/package-info-service";
import { Yok } from "nativescript/lib/common/yok";
import { FileSystem } from "nativescript/lib/common/file-system";
import * as fs from "fs";
import * as path from "path";
import { assert } from "chai";

describe("cloud lib version command", () => {
	it("returns the real version of the package", async () => {
		const testInjector = new Yok();
		testInjector.register("fs", FileSystem);
		testInjector.register("nsCloudStoppageService", {
			showWarningMessageForProcess: (): void => undefined
		});
		let message: string = null;
		const loggerInfo = (msg: string) => {
			message = msg;
		};

		testInjector.register("logger", {
			info: loggerInfo
		});

		testInjector.register("nsCloudPackageInfoService", PackageInfoService);
		testInjector.registerCommand("command", CloudLibVersion);

		await testInjector.resolveCommand("command").execute([]);

		const realVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json")).toString()).version;
		assert.deepEqual(message, realVersion);
	});
});
