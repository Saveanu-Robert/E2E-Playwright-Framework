import { test as base, type Page } from '@playwright/test';

import { getEnvironmentConfig } from '@config/environment';
import { CartPage } from '@pages/web/CartPage';
import { CheckoutPage } from '@pages/web/CheckoutPage';
import { InventoryPage } from '@pages/web/InventoryPage';
import { LoginPage } from '@pages/web/LoginPage';

/**
 * Custom test fixtures for SauceDemo Web Testing
 *
 * Provides pre-configured page objects and utilities for testing
 * Includes authenticated page fixture for tests requiring login
 *
 * @example
 * ```typescript
 * import { test, expect } from '@fixtures/web/saucedemo.fixture';
 *
 * test('should add product to cart', async ({ loginPage, inventoryPage, baseUrl }) => {
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   // ... test implementation
 * });
 * ```
 */

interface SauceDemoFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
  baseUrl: string;
}

/**
 * Extended test with SauceDemo-specific fixtures
 */
export const test = base.extend<SauceDemoFixtures>({
  /**
   * Base URL fixture - provides environment-specific URL configuration
   */
  baseUrl: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    await use(envConfig.web.baseURL);
  },

  /**
   * Login Page fixture - provides login functionality
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Inventory Page fixture - provides product browsing and cart functionality
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Cart Page fixture - provides shopping cart management
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Checkout Page fixture - provides checkout process functionality
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Authenticated Page fixture - provides a page that's already logged in
   * Uses standard user credentials for automatic authentication
   */
  authenticatedPage: async ({ page, baseUrl }, use) => {
    // Import user data
    const { SAUCEDEMO_USERS } = await import('@data/testdata/saucedemo.users');

    // Navigate and login
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(baseUrl);
    await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
    await loginPage.validateSuccessfulLogin();

    await use(page);
  },
});

export { expect } from '@playwright/test';
