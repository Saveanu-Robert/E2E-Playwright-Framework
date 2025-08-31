import { FRAMEWORK_CONSTANTS } from '@src/utils/constants/framework.constants';
import type { EnvironmentConfig } from '@config/types/environment.types';

/**
 * Production Environment Configuration
 *
 * Purpose: Configuration for production environment testing
 * Features: Maximum stability, comprehensive retries, production-grade timeouts
 *
 * @example
 * ```typescript
 * import { prodConfig } from '@config/environments/prod';
 * console.log(prodConfig.web.baseURL); // https://app.example.com
 * ```
 */
export const prodConfig: EnvironmentConfig = {
  web: {
    baseURL: process.env.PROD_WEB_URL ?? 'https://app.example.com',
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.PRODUCTION,
    retries: FRAMEWORK_CONSTANTS.RETRIES.PRODUCTION,
  },
  api: {
    baseURL: process.env.PROD_API_URL ?? 'https://api.example.com',
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.PRODUCTION,
    retries: FRAMEWORK_CONSTANTS.RETRIES.PRODUCTION,
    headers: {
      ...FRAMEWORK_CONSTANTS.DEFAULT_API_HEADERS,
      'X-Environment': 'production',
    },
  },
  database: {
    connectionString: process.env.PROD_DB_CONNECTION ?? 'mongodb://prod-db:27017/prod_db',
    timeout: 15000,
  },
  features: {
    enableDebugLogs: false,
    enableMocking: false,
    skipAuthValidation: false,
    enableVideoRecording: true,
  },
  performance: {
    workers: 6,
    maxConcurrency: 12,
  },
};
