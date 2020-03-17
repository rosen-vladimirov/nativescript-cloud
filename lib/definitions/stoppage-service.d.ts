interface IStoppageService {
	/**
	 * Returns the warning message related to stopping of cloud builds.
	 */
	getWarningMessage(): string;

	/**
	 * Shows the warning message only once per process.
	 * No matter how many times you've called the method, only the first call will print the warning message.
	 */
	showWarningMessageForProcess(): void;
}
