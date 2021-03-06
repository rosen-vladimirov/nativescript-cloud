import * as path from "path";
import { EventEmitter } from "events";
import { v4 } from "uuid";

import { CloudOperationMessageTypes, CloudCommunicationEvents } from "../constants";

export abstract class CloudService extends EventEmitter implements ICloudService {
	private static readonly CLOUD_OPERATION_VERSION_1: string = "v1";
	protected abstract failedToStartError: string;
	protected abstract failedError: string;

	private cloudOperations: IDictionary<{ cloudOperation: ICloudOperation, children: ICloudOperation[] }>;

	constructor(protected $nsCloudErrorsService: IErrors,
		protected $fs: IFileSystem,
		protected $httpClient: Server.IHttpClient,
		protected $logger: ILogger,
		private $constants: IDictionary<any>,
		private $nsCloudOperationFactory: ICloudOperationFactory,
		private $nsCloudOutputFilter: ICloudOutputFilter,
		private $nsCloudProcessService: IProcessService) {
		super();
		this.cloudOperations = Object.create(null);
		this.$nsCloudProcessService.attachToProcessExitSignals(this, this.cleanup.bind(this));
	}

	public getServerOperationOutputDirectory(options: IOutputDirectoryOptions): string {
		return "";
	}

	public async sendCloudMessage<T>(message: ICloudOperationMessage<T>): Promise<void> {
		const cloudOperation = this.cloudOperations[message.cloudOperationId];
		if (!cloudOperation) {
			this.$nsCloudErrorsService.fail(`Cloud operation with id: ${message.cloudOperationId} not found.`);
		}

		await cloudOperation.cloudOperation.sendMessage(message);
	}

	protected getServerResults(serverResult: ICloudOperationResult): IServerItem[] {
		return [];
	}

	protected async executeCloudOperation<T>(cloudOperationName: string, action: (cloudOperationId: string) => Promise<T>): Promise<T> {
		const cloudOperationId: string = v4();
		try {
			this.$logger.info(`Starting ${cloudOperationName}. Cloud operation id: ${cloudOperationId}`);
			const result = await action(cloudOperationId);
			await this.cleanCloudOperation(cloudOperationId);

			return result;
		} catch (err) {
			await this.cleanCloudOperation(cloudOperationId);

			err.cloudOperationId = cloudOperationId;
			throw err;
		}
	}

	protected async waitForCloudOperationToFinish(cloudOperationId: string, serverResponse: IServerResponse, options: ICloudOperationExecutionOptions): Promise<ICloudOperationResult> {
		const cloudOperationVersion = serverResponse.cloudOperationVersion || CloudService.CLOUD_OPERATION_VERSION_1;
		const cloudOperation: ICloudOperation = this.$nsCloudOperationFactory.create(cloudOperationVersion, cloudOperationId, serverResponse);
		if (options.parentCloudOperationId) {
			this.cloudOperations[options.parentCloudOperationId].children.push(cloudOperation);
		}

		this.cloudOperations[cloudOperationId] = { cloudOperation, children: [] };

		cloudOperation.on(CloudCommunicationEvents.MESSAGE, (m: ICloudOperationMessage<any>) => {
			if (m.type === CloudOperationMessageTypes.CLOUD_OPERATION_OUTPUT && !options.silent) {
				const body: ICloudOperationOutput = m.body;
				let log = body.data;
				if (cloudOperationVersion !== CloudService.CLOUD_OPERATION_VERSION_1) {
					log = this.$nsCloudOutputFilter.filterBpcMetadata(log);
				}

				if (body.pipe === "stdout") {
					this.printMessageOnTheSameLine(log);
				} else if (body.pipe === "stderr") {
					this.$logger.error(log);
				}
			} else if (m.type === CloudOperationMessageTypes.CLOUD_OPERATION_SERVER_HELLO && !options.hideBuildMachineMetadata) {
				const body: ICloudOperationServerHello = m.body;

				if (body.hostName) {
					this.$logger.info(`Build machine host name: ${body.hostName}`);
				}
			}

			this.emit(CloudCommunicationEvents.MESSAGE, m);
		});

		try {
			await cloudOperation.init();
		} catch (err) {
			this.$logger.trace(err);
			await cloudOperation.cleanup();
			throw new Error(this.failedToStartError);
		}

		try {
			const result = await cloudOperation.waitForResult();
			await cloudOperation.cleanup();

			return result;
		} catch (err) {
			this.$logger.trace(err);
			await cloudOperation.cleanup();
			throw new Error(this.failedError);
		}
	}

	protected async downloadServerResults(serverResult: ICloudOperationResult, outputOptions: ICloudOperationOutputOptions): Promise<string[]> {
		const destinationDir = this.getServerOperationOutputDirectory(outputOptions);
		this.$fs.ensureDirectoryExists(destinationDir);

		const serverResultObjs = this.getServerResults(serverResult);

		let targetFileNames: string[] = [];
		for (const serverResultObj of serverResultObjs) {
			this.$logger.info(`Result url: ${serverResultObj.fullPath}`);

			let filename = serverResultObj.filename;
			if (outputOptions.extension) {
				filename = `${path.parse(filename).name}.${outputOptions.extension}`;
			}

			const targetFileName = path.join(destinationDir, filename);
			targetFileNames.push(targetFileName);
			const targetFile = this.$fs.createWriteStream(targetFileName);

			// Download the output file.
			await this.$httpClient.httpRequest({
				url: serverResultObj.fullPath,
				pipeTo: targetFile
			});
		}

		return targetFileNames;
	}

	protected getCollectedLogs(cloudOperationId: string): Promise<string> {
		return this.cloudOperations[cloudOperationId].cloudOperation.getCollectedLogs();
	}

	private async cleanup(): Promise<void> {
		await Promise.all(_(this.cloudOperations).keys().map((id: string) => this.cleanCloudOperation(id)).value());
		this.cloudOperations = {};
	}

	private async cleanCloudOperation(cloudOperationId: string): Promise<void> {
		try {
			const cloudOperation = this.cloudOperations[cloudOperationId];
			if (!cloudOperation) {
				return;
			}

			for (let child of cloudOperation.children) {
				await child.cleanup();
				delete this.cloudOperations[child.id];
			}

			await cloudOperation.cloudOperation.cleanup();
			delete this.cloudOperations[cloudOperationId];
		} catch (err) {
			this.$logger.error(`Cloud operation ${cloudOperationId} failed with error: ${err.message}`);
		}
	}

	private printMessageOnTheSameLine(msg: string): void {
		const logger: any = this.$logger;
		// Print the output on the same line to have cool effects like loading indicators.
		// The cloud process will take care of the new lines.
		if (logger.printInfoMessageOnSameLine) {
			// Used in CLI before 6.0.0
			logger.printInfoMessageOnSameLine(msg);
		} else {
			this.$logger.info(msg, { [this.$constants.LoggerConfigData.skipNewLine]: true });
		}
	}
}
