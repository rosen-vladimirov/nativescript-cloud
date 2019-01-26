import { v4 } from "uuid";

import { CommunicationChannelBase } from "./communication-channel-base";
import { CloudOperationWebsocketMessageActions, CloudCommunicationEvents, CloudCommunicationChannelExitCodes } from "../../constants";

export class WebsocketCommunicationChannel extends CommunicationChannelBase {
	private ws: IWebSocket;

	constructor(protected cloudOperationId: string,
		protected data: ICloudCommunicationChannelData<IWebsocketCloudChannelConfigProperties>,
		protected $logger: ILogger,
		private $nsCloudWebSocketFactory: IWebSocketFactory) {
		super(cloudOperationId, data, $logger);
	}

	protected async closeCore(code: number, reason?: string): Promise<void> {
		if (this.ws.readyState === this.ws.OPEN) {
			this.ws.removeAllListeners();
			this.ws.close();
		}
	}

	protected sendMessageCore<T>(message: ICloudOperationMessage<T>): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const id = v4();
				const wsMsg: ICloudOperationWebsocketMessage<T> = { id, action: CloudOperationWebsocketMessageActions.SEND_MESSAGE, cloudOperationId: this.cloudOperationId, body: message };
				this.$logger.trace(wsMsg);
				this.ws.send(JSON.stringify(wsMsg), err => {
					if (err) {
						return reject(err);
					}

					resolve(id);
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	protected connectCore(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				this.ws = this.$nsCloudWebSocketFactory.create(this.data.config.url);
				this.ws.once("close", (c, r) => {
					reject(new Error(`Connection closed with code: ${c}`));
					this.close(c, r);
				});

				this.ws.once("unexpected-response", () => {
					const errMsg = "Unexpected response received.";
					reject(new Error(errMsg));
					this.close(CloudCommunicationChannelExitCodes.UNEXPECTED_RESPONSE, errMsg);
				});
			} catch (err) {
				return reject(err);
			}

			this.addChannelListeners();
			this.ws.once("open", resolve);
		});
	}

	private addChannelListeners() {
		this.ws.on(CloudCommunicationEvents.MESSAGE, m => {
			const msg = super._handleMessage(m);
			this.emit(CloudCommunicationEvents.MESSAGE, msg);
		});

		this.ws.once("error", err => this.emit("error", err));
		this.ws.once("close", (code, reason) => this.emit("close", code, reason));
	}
}
