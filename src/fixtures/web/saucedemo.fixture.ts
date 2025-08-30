import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@pages/web/LoginPage';
import { InventoryPage } from '@pages/web/InventoryPage';
import { CartPage } from '@pages/web/CartPage';
import { CheckoutPage } from '@pages/web/CheckoutPage';
import { getEnvironmentConfig } from '@config/environment';

/**
 * Custom test fixtures for SauceDemo Web Testing
 * Provides pre-configured page objects and utilities
 */

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
  baseUrl: string;
};

/**
 * Extended test with SauceDemo-specific fixtures
 */
export const test = base.extend<SauceDemoFixtures>({
  /**
   * Base URL fixture - gets environment-specific URL
   */
  baseUrl: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    console.log(`🌍 Using base URL: ${envConfig.web.baseURL}`);
    await use(envConfig.web.baseURL);
  },

  /**
   * Login Page fixture
   */
  loginPage: async ({ page }, use) => {
    console.log('🏗️ Creating LoginPage fixture');
    const loginPage = new LoginPage(page);
    await use(loginPage);
    console.log('🧹 LoginPage fixture cleanup completed');
  },

  /**
   * Inventory Page fixture
   */
  inventoryPage: async ({ page }, use) => {
    console.log('🏗️ Creating InventoryPage fixture');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
    console.log('🧹 InventoryPage fixture cleanup completed');
  },

  /**
   * Cart Page fixture
   */
  cartPage: async ({ page }, use) => {
    console.log('🏗️ Creating CartPage fixture');
    const cartPage = new CartPage(page);
    await use(cartPage);
    console.log('🧹 CartPage fixture cleanup completed');
  },

  /**
   * Checkout Page fixture
   */
  checkoutPage: async ({ page }, use) => {
    console.log('🏗️ Creating CheckoutPage fixture');
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
    console.log('🧹 CheckoutPage fixture cleanup completed');
  },

  /**
   * Authenticated Page fixture - provides a page that's already logged in
   */
  authenticatedPage: async ({ page, baseUrl }, use) => {
    console.log('🔐 Creating authenticated page fixture');
    
    // Import user data
    const { SAUCEDEMO_USERS } = await import('@data/testdata/saucedemo.users');
    
    // Navigate and login
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(baseUrl);
    await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
    await loginPage.validateSuccessfulLogin();
    
    console.log('✅ Authenticated page fixture ready');
    await use(page);
    console.log('🧹 Authenticated page fixture cleanup completed');
  }
});

export { expect } from '@playwright/test';
