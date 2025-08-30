import { FRAMEWORK_CONSTANTS } from '@src/utils/constants/framework.constants';
import type { EnvironmentConfig } from '../types/environment.types';

/**
 * Development Environment Configuration
 * 
 * Purpose: Configuration for local development and testing
 * Features: Lower timeouts, minimal retries, optimized for speed
 * 
 * @example
 * ```typescript
 * import { developmentConfig } from '@config/environments/development';
 * console.log(developmentConfig.web.baseURL); // https://dev-app.example.com
 * ```
 */
export const developmentConfig: EnvironmentConfig = {
  web: {
    baseURL: process.env.DEV_WEB_URL || 'https://www.saucedemo.com',
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.DEVELOPMENT,
    retries: FRAMEWORK_CONSTANTS.RETRIES.DEVELOPMENT,
  },
  api: {
    baseURL: process.env.DEV_API_URL || 'https://api-dev.example.com',
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.DEVELOPMENT,
    retries: FRAMEWORK_CONSTANTS.RETRIES.DEVELOPMENT,
    headers: {
      ...FRAMEWORK_CONSTANTS.DEFAULT_API_HEADERS,
      'X-Environment': 'development',
    },
  },
  database: {
    connectionString: process.env.DEV_DB_CONNECTION || 'mongodb://localhost:27017/dev_db',
    timeout: 5000,
  },
  features: {
    enableDebugLogs: true,
    enableMocking: true,
    skipAuthValidation: true,
    enableVideoRecording: false,
  },
  performance: {
    workers: 2,
    maxConcurrency: 4,
  },
};
