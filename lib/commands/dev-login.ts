export class DevLoginCommand implements ICommand {
	public allowedParameters: ICommandParameter[] = [
		this.$stringParameterBuilder.createMandatoryParameter("Missing user name or password."),
		this.$stringParameterBuilder.createMandatoryParameter("Missing user name or password.")
	];

	public get dashedOptions() {
		return this.$nsCloudOptionsProvider.dashedOptions;
	}

	constructor(private $nsCloudErrorsService: IErrors,
		private $logger: ILogger,
		private $options: ICloudOptions,
		private $nsCloudOptionsProvider: ICloudOptionsProvider,
		private $nsCloudAuthenticationService: IAuthenticationService,
		private $nsCloudServicesPolicyService: ICloudServicesPolicyService,
		private $nsCloudStoppageService: IStoppageService,
		private $stringParameterBuilder: IStringParameterBuilder) { }

	public async execute(args: string[]): Promise<void> {
		this.$nsCloudStoppageService.showWarningMessageForProcess();

		if (await this.$nsCloudServicesPolicyService.shouldAcceptCloudServicesPolicy()) {
			this.$logger.info(await this.$nsCloudServicesPolicyService.getCloudServicesFullMessage());
		}

		try {
			await this.$nsCloudAuthenticationService.devLogin(args[0], args[1], this.$options.instanceId || "");
		} catch (err) {
			this.$nsCloudErrorsService.fail(err.message);
		}

		this.$logger.info("Successfully logged in.");
	}
}

$injector.registerCommand("dev-login", DevLoginCommand);
