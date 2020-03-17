export class StoppageService implements IStoppageService {
	private isWarningMessageShown = false;
	constructor(private $logger: ILogger) {
	}

	public getWarningMessage(): string {
		let msg = 'Free cloud builds will be stopped on <date>. Paid cloud builds will be stopped on <date>.' +
		' More information is available in this blogpost <link>';

		return msg;
	}

	public showWarningMessageForProcess(): void {
		if (!this.isWarningMessageShown) {
			this.isWarningMessageShown = true;
			const msg = this.getWarningMessage();
			this.$logger.warn(msg, { wrapMessageWithBorders: true, useStderr: true });
		}
	}

}

$injector.register("nsCloudStoppageService", StoppageService);
