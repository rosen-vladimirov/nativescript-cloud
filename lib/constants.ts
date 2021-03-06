export const CLOUD_TEMP_DIR_NAME = ".cloud";
export const CODESIGN_FILES_DIR_NAME = "codesign_files";

export const CRYPTO = {
	CERTIFICATE_HEADER: "-----BEGINCERTIFICATE-----",
	CERTIFICATE_FOOTER: "-----ENDCERTIFICATE-----",
	ORGANIZATION_FIELD_NAME: "O",
	COMMON_NAME_FIELD_NAME: "CN",
	PLIST_HEADER: "<plist",
	PLIST_FOOTER: "</plist>"
};

export const APPLE_INC = "Apple Inc.";

export const PROVISION_TYPES = {
	ENTERPRISE: "Enterprise",
	APP_STORE: "App Store",
	ADHOC: "AdHoc",
	DEVELOPMENT: "Development",
};

export const AUTH_SERVICE_NAME = "auth-service";
export const BUILD_SERVICE_NAME = "build-service";
export const MISC_SERVICE_NAME = "misc-service";
export const ACCOUNTS_SERVICE_NAME = "accounts-service";
export const PROJECT_SERVICE_NAME = "project-service";
export const DEFAULT_ANDROID_PUBLISH_TRACK = "beta";
export const UNLIMITED = "unlimited";
export const NAMESPACE_LOWER_CASE = "namespace";
export const KINVEY_LOWER_CASE = "kinvey";

export const CLOUD_BUILD_EVENT_NAMES = {
	STEP_CHANGED: "stepChanged"
};

export const DEVICE_DISCOVERY_EVENTS = {
	DEVICE_FOUND: "deviceFound",
	DEVICE_LOST: "deviceLost"
};

export const CLOUD_BUILD_CONFIGURATIONS = {
	DEBUG: "Debug",
	RELEASE: "Release"
};

export const CLOUD_BUILD_DIRECTORY_NAMES = {
	DEVICE: "device",
	EMULATOR: "emulator"
};

export const CONTENT_TYPES = {
	APPLICATION_JSON: "application/json",
	TEXT_HTML: "text/html",
	TEXT_JAVASCRIPT: "text/javascript",
	TEXT_CSS: "text/css",
	IMAGE_JPEG: "image/jpeg",
	IMAGE_PNG: "image/png"
};

export const HTTP_METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE"
};

export const HTTP_HEADERS = {
	ACCEPT: "Accept",
	AUTHORIZATION: "Authorization",
	CONNECTION: "Connection",
	CONTENT_TYPE: "Content-Type",
	LOCATION: "Location",
	X_NS_NAMESPACE: "X-NS-Namespace",
	X_NS_INSTANCE_ID: "X-NS-Instance-Id"
};

export const HTTP_STATUS_CODES = {
	SUCCESS: 200,
	FOUND: 302,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402
};

export const DISPOSITIONS = {
	PACKAGE_ZIP: "PackageZip",
	PACKAGE_GIT: "PackageGit",
	BUILD_RESULT: "BuildResult",
	PROVISION: "Provision",
	CERTIFICATE: "Certificate",
	KEYCHAIN: "Keychain",
	CRYPTO_STORE: "CryptoStore"
};

export const BUILD_STEP_NAME = {
	PREPARE: "prepare",
	UPLOAD: "upload",
	BUILD: "build",
	DOWNLOAD: "download"
};

export const BUILD_STEP_PROGRESS = {
	START: 0,
	END: 100
};

export const ERROR_MESSAGES = {
	COMMAND_REQUIRES_APPLE_USERNAME_PASS: "The command accepts only two parameters - Apple account id and Apple account password."
};

export class EulaConstants {
	public static eulaUrl = "https://www.nativescript.org/nativescript-sidekick/eula";
	public static kinveyEulaUrl = "https://www.nativescript.org/nativescript-sidekick/kinvey-free-eula";
	public static acceptedEulaHashKey = "acceptedEulaHash";
	public static acceptedKinveyEulaHashKey = "acceptedKinveyEulaHash";
	public static timeout = 60000;
}

export const KINVEY_SERVICE_NAME = "kinvey";

export const BEARER_AUTH_SCHEME = "Bearer";

export class Authentication {
	public static OAuth2 = "OAuth2";
	public static OIDC = "OIDC";
}

export class Policies {
	public static readonly PRIVACY_POLICY_NAME: string = "Progress Software Privacy Policy";
	public static readonly CLOUD_SERVICES_POLICY_NAME: string = "cloud-services-policy";
}

export class CloudOperationWebSocketMessageActions {
	public static readonly SEND_MESSAGE: string = "sendMessage";
}

export class CloudOperationMessageTypes {
	public static readonly CLOUD_OPERATION_OUTPUT: string = "output";
	public static readonly CLOUD_OPERATION_INPUT_REQUEST: string = "inputRequest";
	public static readonly CLOUD_OPERATION_INPUT: string = "input";
	public static readonly CLOUD_OPERATION_CLIENT_HELLO: string = "clientHello";
	public static readonly CLOUD_OPERATION_SERVER_HELLO: string = "serverHello";
	public static readonly CLOUD_OPERATION_HANDSHAKE_ERROR: string = "handshakeError";
	public static readonly CLOUD_OPERATION_STOP: string = "stop";
	public static readonly CLOUD_OPERATION_RESULT: string = "result";
	public static readonly CLOUD_OPERATION_ECHO: string = "echo";
	public static readonly CLOUD_OPERATION_ECHO_REPLY: string = "echoReply";
}

export class CloudCommunicationChannelTypes {
	public static readonly WEBSOCKET: string = "WebSocket";
}

export class CloudCommunicationEvents {
	public static readonly MESSAGE: string = "message";
	public static readonly CLOSE: string = "close";
	public static readonly ERROR: string = "error";
}

export class CloudCommunicationChannelExitCodes {
	public static readonly UNEXPECTED_RESPONSE: number = 128;
	public static readonly MISSING_ECHO_REPLIES: number = 129;
}
