import { Policies } from "./../constants";

export class PolicyAcceptCommand implements ICommand {
	public allowedParameters: ICommandParameter[] = [
		this.$stringParameterBuilder.createMandatoryParameter("Policy name cannot be empty."),
		this.$stringParameter
	];

	constructor(private $nsCloudErrorsService: IErrors,
		private $nsCloudPolicyService: IPolicyService,
		private $nsCloudServicesPolicyService: ICloudServicesPolicyService,
		private $nsCloudStoppageService: IStoppageService,
		private $stringParameter: ICommandParameter,
		private $stringParameterBuilder: IStringParameterBuilder) { }

	public async execute(args: string[]): Promise<void> {
		this.$nsCloudStoppageService.showWarningMessageForProcess();

		const policyName = args[0];

		if (policyName === Policies.CLOUD_SERVICES_POLICY_NAME) {
			await this.$nsCloudServicesPolicyService.acceptCloudServicesPolicy();
			return;
		}

		const policyUri = args[1];
		if (!policyUri || policyUri.length === 0) {
			this.$nsCloudErrorsService.fail("Please provide policy path.");
		}

		await this.$nsCloudPolicyService.accept({ policyName, policyUri });
	}
}

$injector.registerCommand("policy|accept", PolicyAcceptCommand);
