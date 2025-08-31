import { FRAMEWORK_CONSTANTS } from "@src/utils/constants/framework.constants";
import type { EnvironmentConfig } from "../types/environment.types";

/**
 * Pre-Production Environment Configuration
 *
 * Purpose: Configuration for pre-production testing environment
 * Features: Production-like settings with enhanced testing capabilities
 *
 * @example
 * ```typescript
 * import { preProdConfig } from '@config/environments/pre-prod';
 * console.log(preProdConfig.api.baseURL); // https://api-preprod.example.com
 * ```
 */
export const preProdConfig: EnvironmentConfig = {
	web: {
		baseURL: process.env.PREPROD_WEB_URL || "https://preprod-app.example.com",
		timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.PRE_PROD,
		retries: FRAMEWORK_CONSTANTS.RETRIES.PRE_PROD,
	},
	api: {
		baseURL: process.env.PREPROD_API_URL || "https://api-preprod.example.com",
		timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.PRE_PROD,
		retries: FRAMEWORK_CONSTANTS.RETRIES.PRE_PROD,
		headers: {
			...FRAMEWORK_CONSTANTS.DEFAULT_API_HEADERS,
			"X-Environment": "pre-prod",
		},
	},
	database: {
		connectionString:
			process.env.PREPROD_DB_CONNECTION ||
			"mongodb://preprod-db:27017/preprod_db",
		timeout: 10000,
	},
	features: {
		enableDebugLogs: true,
		enableMocking: false,
		skipAuthValidation: false,
		enableVideoRecording: true,
	},
	performance: {
		workers: 4,
		maxConcurrency: 8,
	},
};
