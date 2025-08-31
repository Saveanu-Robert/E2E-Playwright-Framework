import { test as base, type APIRequestContext } from '@playwright/test';

import { getEnvironmentConfig } from '@config/environment';

/**
 * Custom test fixtures for SauceDemo API Testing
 * Provides pre-configured API context and utilities
 */

interface SauceDemoApiFixtures {
  apiContext: APIRequestContext;
  apiBaseUrl: string;
  authHeaders: Record<string, string>;
}

/**
 * Extended test with SauceDemo API-specific fixtures
 */
export const apiTest = base.extend<SauceDemoApiFixtures>({
  /**
   * API Base URL fixture - gets environment-specific API URL
   */
  apiBaseUrl: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    console.log(`🌍 Using API base URL: ${envConfig.api.baseURL}`);
    await use(envConfig.api.baseURL);
  },

  /**
   * Authentication Headers fixture
   */
  authHeaders: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    console.log('🔑 Setting up authentication headers');
    await use(envConfig.api.headers);
  },

  /**
   * API Request Context fixture with authentication
   */
  apiContext: async ({ playwright, apiBaseUrl, authHeaders }, use) => {
    console.log('🏗️ Creating authenticated API context');

    const apiContext = await playwright.request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        ...authHeaders,
        'User-Agent': 'SauceDemo-Playwright-Tests/1.0',
      },
      timeout: 30000,
    });

    console.log('✅ API context ready');
    await use(apiContext);

    console.log('🧹 Disposing API context');
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
