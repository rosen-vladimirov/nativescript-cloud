import { EulaConstants } from "../constants";
import { isInteractive } from "../helpers";

export class EulaCommandHelper implements IEulaCommandHelper {
	constructor(private $nsCloudErrorsService: IErrors,
		private $logger: ILogger,
		private $nsCloudEulaService: IEulaService,
		private $prompter: IPrompter,
		private $nsCloudStoppageService: IStoppageService) { }

	public acceptEula(): Promise<void> {
		this.$logger.printMarkdown(`Accepting EULA located at ${EulaConstants.eulaUrl}.`);
		return this.$nsCloudEulaService.acceptEula();
	}

	public async ensureEulaIsAccepted(): Promise<void> {
		this.$nsCloudStoppageService.showWarningMessageForProcess();

		const eulaData = await this.$nsCloudEulaService.getEulaDataWithCache();
		if (!eulaData.shouldAcceptEula) {
			this.$logger.trace("Ensure EULA accepted: no need to accept EULA - already accepted.");
			return;
		}

		this.$logger.printMarkdown(`In order to use cloud services, you must accept our EULA. You can read it here: ${EulaConstants.eulaUrl}.`);

		const actionOnError = () => this.$nsCloudErrorsService.fail("You cannot use cloud services without accepting the EULA.");

		if (!isInteractive()) {
			return actionOnError();
		}

		const hasAcceptedEula = await this.$prompter.confirm("Do you accept the EULA?");

		if (!hasAcceptedEula) {
			return actionOnError();
		}

		await this.$nsCloudEulaService.acceptEula();
	}
}

$injector.register("nsCloudEulaCommandHelper", EulaCommandHelper);
