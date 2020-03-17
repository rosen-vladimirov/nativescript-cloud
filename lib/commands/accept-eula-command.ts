export class AcceptEulaCommand implements ICommand {
	public allowedParameters: ICommandParameter[];

	constructor(private $nsCloudEulaCommandHelper: IEulaCommandHelper,
		private $nsCloudStoppageService: IStoppageService,
		private $nsCloudErrorsService: IErrors) {

	}
	public async canExecute(args: string[]): Promise<boolean> {
		this.$nsCloudStoppageService.showWarningMessageForProcess();

		if (args.length) {
			this.$nsCloudErrorsService.fail("This command does not accept arguments.");
		}

		return true;
	}

	public execute(args: string[]): Promise<void> {
		return this.$nsCloudEulaCommandHelper.acceptEula();
	}
}

$injector.registerCommand("accept|eula", AcceptEulaCommand);
