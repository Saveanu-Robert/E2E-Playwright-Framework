import { defineConfig, devices } from '@playwright/test';

import { EnvironmentConfigManager } from '@config/environment';
import { FRAMEWORK_CONSTANTS } from '@src/utils/constants/framework.constants';

/**
 * Enterprise Playwright Configuration
 *
 * Features:
 * - Multi-environment support (development, pre-prod, prod)
 * - Dynamic performance optimization based on system resources
 * - Cross-browser testing (desktop + mobile)
 * - Intelligent artifact collection (screenshots/videos only for failed web tests)
 * - API testing without browser overhead
 * - Comprehensive reporting
 *
 * Environment Variables:
 * - TEST_ENV: Set environment (development|pre-prod|prod)
 * - CI: Enable CI-specific settings
 * - DEBUG: Enable debug mode
 * - HEADLESS: Override headless mode
 *
 * @example
 * ```bash
 * TEST_ENV=production npm run test
 * DEBUG=1 npm run test:debug
 * ```
 */

// Get current environment and configuration
const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
const envConfig = EnvironmentConfigManager.getConfig(currentEnv);

// Calculate optimal performance settings
const workers = EnvironmentConfigManager.calculateOptimalWorkers();

// Debug logging
if (process.env[FRAMEWORK_CONSTANTS.ENV_VARS.DEBUG]) {
  console.log('🚀 Playwright Configuration:');
  console.log('📍 Environment:', currentEnv);
  console.log('⚡ System Info:', EnvironmentConfigManager.getSystemInfo());
  console.log('🌐 Web URL:', envConfig.web.baseURL);
  console.log('🔗 API URL:', envConfig.api.baseURL);
}

export default defineConfig({
  testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB.replace('./', './'),

  /* Performance Configuration */
  fullyParallel: true,
  workers: process.env[FRAMEWORK_CONSTANTS.ENV_VARS.CI] ? envConfig.performance.workers : workers,

  /* Environment Configuration */
  timeout: envConfig.web.timeout,
  expect: {
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.DEFAULT_ACTION,
  },

  /* Retry Configuration */
  retries: envConfig.web.retries,

  /* CI/CD Configuration */
  forbidOnly: !!process.env[FRAMEWORK_CONSTANTS.ENV_VARS.CI],

  /* Reporting Configuration */
  reporter: [
    [
      'html',
      {
        outputFolder: FRAMEWORK_CONSTANTS.REPORTS.HTML_DIR,
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: FRAMEWORK_CONSTANTS.REPORTS.JSON_FILE,
      },
    ],
    [
      'junit',
      {
        outputFile: FRAMEWORK_CONSTANTS.REPORTS.JUNIT_FILE,
      },
    ],
    ['list'],
  ],

  /* Global Test Configuration */
  use: {
    baseURL: envConfig.web.baseURL,
    actionTimeout: FRAMEWORK_CONSTANTS.TIMEOUTS.DEFAULT_ACTION,
    navigationTimeout: FRAMEWORK_CONSTANTS.TIMEOUTS.DEFAULT_NAVIGATION,

    /* Conditional headless mode */
    headless: process.env[FRAMEWORK_CONSTANTS.ENV_VARS.HEADLESS] !== 'false',

    /* Screenshots and videos only for failed web tests */
    screenshot: 'only-on-failure',
    video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',

    /* Trace configuration */
    trace: 'retain-on-failure',
  },

  /* Output directories */
  outputDir: FRAMEWORK_CONSTANTS.REPORTS.OUTPUT_DIR,

  /* Projects Configuration */
  projects: [
    /* Desktop Web Browsers */
    {
      name: 'chromium-web',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'desktop',
        browser: 'chromium',
      },
    },
    {
      name: 'firefox-web',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'desktop',
        browser: 'firefox',
      },
    },
    {
      name: 'webkit-web',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['Desktop Safari'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'desktop',
        browser: 'webkit',
      },
    },
    {
      name: 'edge-web',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'desktop',
        browser: 'edge',
      },
    },

    /* Mobile Web Browsers */
    {
      name: 'mobile-chrome',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['Pixel 5'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'mobile',
        browser: 'chrome',
      },
    },
    {
      name: 'mobile-safari',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['iPhone 12'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'mobile',
        browser: 'safari',
      },
    },
    {
      name: 'tablet-chrome',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.WEB,
      use: {
        ...devices['iPad Pro'],
        baseURL: envConfig.web.baseURL,
        screenshot: 'only-on-failure',
        video: envConfig.features.enableVideoRecording ? 'retain-on-failure' : 'off',
      },
      metadata: {
        category: 'web',
        platform: 'tablet',
        browser: 'chrome',
      },
    },

    /* API Tests - No browser, no screenshots/videos */
    {
      name: 'api-tests',
      testDir: FRAMEWORK_CONSTANTS.TEST_DIRS.API,
      testIgnore: '**/mocked/**',
      use: {
        baseURL: envConfig.api.baseURL,
        extraHTTPHeaders: envConfig.api.headers,

        /* Disable browser and visual artifacts for API tests */
        browserName: undefined,
        headless: undefined,
        screenshot: 'off',
        video: 'off',
        trace: 'off',
      },
      timeout: envConfig.api.timeout,
      retries: envConfig.api.retries,
      metadata: {
        category: 'api',
        platform: 'server',
        browser: 'none',
      },
    },

    /* API Mocked Tests - Requires browser for route mocking */
    {
      name: 'api-mocked-tests',
      testDir: './tests/api/mocked',
      use: {
        baseURL: envConfig.api.baseURL,
        extraHTTPHeaders: envConfig.api.headers,

        /* Enable browser for route mocking but minimize artifacts */
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'off',
        video: 'off',
        trace: 'off',
      },
      timeout: envConfig.api.timeout,
      retries: envConfig.api.retries,
      metadata: {
        category: 'api-mocked',
        platform: 'browser',
        browser: 'chromium',
      },
    },
  ],

  /* Global Setup and Teardown */
  globalSetup: require.resolve('./src/utils/config/global.setup.ts'),
  globalTeardown: require.resolve('./src/utils/config/global.teardown.ts'),
});
