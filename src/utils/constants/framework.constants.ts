/**
 * Framework Constants
 * Central location for all framework-wide configuration values
 */

export const FRAMEWORK_CONSTANTS = {
  // Performance Configuration
  PERFORMANCE: {
    CPU_UTILIZATION_PERCENTAGE: 0.75,
    MIN_WORKERS: 2,
    MAX_WORKERS: 16,
    MEMORY_PER_WORKER_GB: 2,
    SHARD_RATIO: 0.5, // workers/2
  },

  // Timeout Configuration (in milliseconds)
  TIMEOUTS: {
    DEFAULT_ACTION: 15000,
    DEFAULT_NAVIGATION: 30000,
    TEST_TIMEOUT: {
      DEVELOPMENT: 30000,
      PRE_PROD: 45000,
      PRODUCTION: 60000,
    },
  },

  // Retry Configuration
  RETRIES: {
    DEVELOPMENT: 1,
    PRE_PROD: 2,
    PRODUCTION: 3,
  },

  // Reporting Configuration
  REPORTS: {
    OUTPUT_DIR: './reports/test-results',
    HTML_DIR: './reports/html',
    JSON_FILE: './reports/json/test-results.json',
    JUNIT_FILE: './reports/junit.xml',
    SCREENSHOTS_DIR: './reports/screenshots',
    VIDEOS_DIR: './reports/videos',
  },

  // Browser Configuration
  BROWSERS: {
    DESKTOP: ['chromium', 'firefox', 'webkit', 'edge'],
    MOBILE: ['mobile-chrome', 'mobile-safari', 'tablet-chrome'],
  },

  // Test Directories
  TEST_DIRS: {
    WEB: './tests/web',
    API: './tests/api',
    E2E: './tests/web/e2e',
    SMOKE: './tests/web/smoke',
    INTEGRATION_WEB: './tests/web/integration',
    INTEGRATION_API: './tests/api/integration',
    FUNCTIONAL: './tests/api/functional',
    CONTRACT: './tests/api/contract',
  },

  // Environment Variables
  ENV_VARS: {
    TEST_ENV: 'TEST_ENV',
    CI: 'CI',
    DEBUG: 'DEBUG',
    HEADLESS: 'HEADLESS',
  },

  // Default Environment
  DEFAULT_ENVIRONMENT: 'development' as const,

  // HTTP Headers
  DEFAULT_API_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
} as const;

export type EnvironmentType = 'development' | 'pre-prod' | 'prod';
export type BrowserType = typeof FRAMEWORK_CONSTANTS.BROWSERS.DESKTOP[number];
export type MobileType = typeof FRAMEWORK_CONSTANTS.BROWSERS.MOBILE[number];
