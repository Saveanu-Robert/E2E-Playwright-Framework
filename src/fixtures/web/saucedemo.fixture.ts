/**
 * @fileoverview SauceDemo Web Test Fixtures - Pre-configured test context and page objects
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This fixture file provides pre-configured test context, page objects, and utilities
 * specifically for SauceDemo web application testing. It extends Playwright's base test
 * with domain-specific functionality and provides a consistent testing interface.
 *
 * Provided Fixtures:
 * - Pre-initialized page objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
 * - Environment-specific configuration and base URL
 * - Authenticated page context for tests requiring login
 * - Automatic user authentication using standard test credentials
 *
 * @example
 * ```typescript
 * import { test, expect } from '@fixtures/web/saucedemo.fixture';
 *
 * test('user journey test', async ({
 *   loginPage,
 *   inventoryPage,
 *   baseUrl
 * }) => {
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
 *   await inventoryPage.validateInventoryPageLoad();
 * });
 *
 * test('authenticated test', async ({ authenticatedPage, inventoryPage }) => {
 *   // Page is already logged in
 *   await inventoryPage.validateInventoryPageLoad();
 * });
 * ```
 *
 * @see {@link ../../pages/web/} - Page objects used by this fixture
 * @see {@link ../../config/environment.ts} - Environment configuration
 * @see {@link ../../data/testdata/saucedemo.users.ts} - User test data
 */

import { test as base, type Page } from '@playwright/test';

import { getEnvironmentConfig } from '@config/environment';
import { CartPage } from '@pages/web/CartPage';
import { CheckoutPage } from '@pages/web/CheckoutPage';
import { InventoryPage } from '@pages/web/InventoryPage';
import { LoginPage } from '@pages/web/LoginPage';

/**
 * SauceDemo Test Fixtures Interface
 *
 * @description
 * Defines the structure of fixtures available for SauceDemo web testing.
 * Each fixture provides pre-configured instances of page objects and utilities
 * to streamline test development and maintain consistency.
 *
 * @interface
 * @since 1.0.0
 */
interface SauceDemoFixtures {
  /**
   * Login page object for authentication operations
   * @type {LoginPage}
   */
  loginPage: LoginPage;

  /**
   * Inventory page object for product browsing and cart operations
   * @type {InventoryPage}
   */
  inventoryPage: InventoryPage;

  /**
   * Cart page object for shopping cart management
   * @type {CartPage}
   */
  cartPage: CartPage;

  /**
   * Checkout page object for purchase completion
   * @type {CheckoutPage}
   */
  checkoutPage: CheckoutPage;

  /**
   * Pre-authenticated page instance for tests requiring login
   * @type {Page}
   */
  authenticatedPage: Page;

  /**
   * Environment-specific base URL for the application
   * @type {string}
   */
  baseUrl: string;
}

/**
 * Extended Playwright test with SauceDemo-specific fixtures
 *
 * @description
 * Extends the base Playwright test with domain-specific fixtures for SauceDemo
 * application testing. Provides pre-configured page objects, environment settings,
 * and authenticated contexts for streamlined test development.
 *
 * @example
 * ```typescript
 * test('shopping flow', async ({ loginPage, inventoryPage, cartPage }) => {
 *   // All page objects are pre-configured and ready to use
 * });
 * ```
 *
 * @since 1.0.0
 */
export const test = base.extend<SauceDemoFixtures>({
  /**
   * Base URL fixture - provides environment-specific URL configuration
   *
   * @description
   * Automatically retrieves the base URL from environment configuration,
   * ensuring tests run against the correct environment without hardcoding URLs.
   *
   * @returns {Promise<string>} Environment-specific base URL
   *
   * @example
   * ```typescript
   * test('navigation', async ({ baseUrl }) => {
   *   console.log('Testing against:', baseUrl);
   * });
   * ```
   */
  baseUrl: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    await use(envConfig.web.baseURL);
  },

  /**
   * Login Page fixture - provides pre-configured login page object
   *
   * @description
   * Creates and provides a LoginPage instance bound to the current test page.
   * Includes all login functionality and validation methods.
   *
   * @returns {Promise<LoginPage>} Pre-configured LoginPage instance
   *
   * @example
   * ```typescript
   * test('login', async ({ loginPage, baseUrl }) => {
   *   await loginPage.navigateToLoginPage(baseUrl);
   *   await loginPage.login(credentials);
   * });
   * ```
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Inventory Page fixture - provides pre-configured inventory page object
   *
   * @description
   * Creates and provides an InventoryPage instance for product browsing,
   * cart operations, and product validation functionality.
   *
   * @returns {Promise<InventoryPage>} Pre-configured InventoryPage instance
   *
   * @example
   * ```typescript
   * test('product operations', async ({ inventoryPage }) => {
   *   await inventoryPage.addProductToCart(product);
   *   await inventoryPage.validateCartItemCount(1);
   * });
   * ```
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Cart Page fixture - provides pre-configured cart page object
   *
   * @description
   * Creates and provides a CartPage instance for shopping cart management,
   * item validation, and checkout navigation functionality.
   *
   * @returns {Promise<CartPage>} Pre-configured CartPage instance
   *
   * @example
   * ```typescript
   * test('cart management', async ({ cartPage }) => {
   *   await cartPage.validateCartItems();
   *   await cartPage.proceedToCheckout();
   * });
   * ```
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Checkout Page fixture - provides pre-configured checkout page object
   *
   * @description
   * Creates and provides a CheckoutPage instance for purchase completion,
   * form filling, and order validation functionality.
   *
   * @returns {Promise<CheckoutPage>} Pre-configured CheckoutPage instance
   *
   * @example
   * ```typescript
   * test('checkout process', async ({ checkoutPage }) => {
   *   await checkoutPage.fillCheckoutInformation(info);
   *   await checkoutPage.completeCheckout();
   * });
   * ```
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Authenticated Page fixture - provides a pre-authenticated page instance
   *
   * @description
   * Automatically performs login using standard test credentials and provides
   * a page instance that's already authenticated. Ideal for tests that don't
   * need to test the login flow but require an authenticated state.
   *
   * @returns {Promise<Page>} Pre-authenticated Playwright Page instance
   *
   * @throws {Error} When automatic login fails
   *
   * @example
   * ```typescript
   * test('authenticated operations', async ({ authenticatedPage, inventoryPage }) => {
   *   // Page is already logged in, can proceed with inventory operations
   *   await inventoryPage.validateInventoryPageLoad();
   * });
   * ```
   *
   * @since 1.0.0
   */
  authenticatedPage: async ({ page, baseUrl }, use) => {
    // Import user data dynamically to avoid circular dependencies
    const { SAUCEDEMO_USERS } = await import('@data/testdata/saucedemo.users');

    // Perform automatic login
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(baseUrl);
    await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
    await loginPage.validateSuccessfulLogin();

    // Provide authenticated page instance
    await use(page);
  },
});

/**
 * Re-exports Playwright's expect function for convenience
 *
 * @description
 * Provides direct access to Playwright's expect function from this fixture file,
 * allowing tests to import both test and expect from a single location.
 *
 * @example
 * ```typescript
 * import { test, expect } from '@fixtures/web/saucedemo.fixture';
 *
 * test('validation example', async ({ inventoryPage }) => {
 *   await expect(inventoryPage.pageTitle).toHaveText('Products');
 * });
 * ```
 *
 * @since 1.0.0
 */
export { expect } from '@playwright/test';
