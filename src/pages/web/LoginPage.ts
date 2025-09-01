/**
 * @fileoverview LoginPage - Page Object Model implementation for SauceDemo login functionality
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This page object provides comprehensive interaction methods for the SauceDemo login page.
 * It follows the Page Object Model pattern to encapsulate UI elements and user interactions,
 * providing a clean API for test automation with mobile device compatibility and retry logic.
 *
 * Key Features:
 * - Robust element selectors with data-test attributes
 * - Comprehensive validation methods for login states
 * - Mobile device compatibility with force click options
 * - Error handling with descriptive messages
 * - Performance optimizations for test execution
 * - Form validation and interaction helpers
 *
 * @example
 * ```typescript
 * import { LoginPage } from '@pages/web/LoginPage';
 *
 * test('successful login', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.login({ username: 'standard_user', password: 'secret_sauce' });
 *   await loginPage.validateSuccessfulLogin();
 * });
 * ```
 *
 * @see {@link InventoryPage} - Next page in user flow
 * @see {@link ../fixtures/web/saucedemo.fixture.ts} - Test fixtures
 * @see {@link ../../data/testdata/saucedemo.users.ts} - User test data
 */

import { expect, type Locator, type Page } from '@playwright/test';

import type { UserCredentials } from '@data/testdata/saucedemo.users';
/**
 * LoginPage - Handles user authentication flows for SauceDemo application
 *
 * @description
 * This page object encapsulates all interactions with the SauceDemo login page,
 * providing methods for navigation, authentication, validation, and error handling.
 * It supports mobile device compatibility and includes comprehensive error reporting.
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.login({ username: 'user', password: 'pass' });
 * await loginPage.validateSuccessfulLogin();
 * ```
 *
 * @public
 * @class
 * @since 1.0.0
 */
export class LoginPage {
  /**
   * Playwright Page instance for browser interactions
   * @readonly
   * @public
   */
  readonly page: Page;

  /**
   * Username input field locator using data-test attribute
   * @readonly
   * @public
   */
  readonly usernameInput: Locator;

  /**
   * Password input field locator using data-test attribute
   * @readonly
   * @public
   */
  readonly passwordInput: Locator;

  /**
   * Login button locator using data-test attribute
   * @readonly
   * @public
   */
  readonly loginButton: Locator;

  /**
   * Error message container locator for validation of login errors
   * @readonly
   * @public
   */
  readonly errorMessage: Locator;

  /**
   * Accepted usernames information panel locator
   * @readonly
   * @public
   */
  readonly acceptedUsernames: Locator;

  /**
   * Password information panel locator
   * @readonly
   * @public
   */
  readonly passwordInfo: Locator;

  /**
   * SauceDemo logo image locator for page validation
   * @readonly
   * @public
   */
  readonly logoImage: Locator;

  /**
   * Creates a new LoginPage instance
   *
   * @description
   * Initializes the page object with locators using robust data-test selectors
   * for reliable element identification across different environments and browsers.
   *
   * @param {Page} page - Playwright Page instance for browser interactions
   *
   * @example
   * ```typescript
   * const loginPage = new LoginPage(page);
   * ```
   *
   * @public
   * @constructor
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust data-test selectors
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.acceptedUsernames = page.locator('.login_credentials');
    this.passwordInfo = page.locator('.login_password');
    this.logoImage = page.locator('.login_logo');
  }

  /**
   * Navigates to the login page and validates essential elements
   *
   * @description
   * Performs navigation to the SauceDemo login page with comprehensive loading
   * validation. Ensures the page title is correct and the logo is visible,
   * confirming successful page load before proceeding with test actions.
   *
   * @param {string} baseUrl - The base URL of the SauceDemo application
   *
   * @returns {Promise<void>} Resolves when navigation is complete and page is validated
   *
   * @throws {Error} When navigation fails or page validation fails
   *
   * @example
   * ```typescript
   * await loginPage.navigateToLoginPage('https://saucedemo.com');
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async navigateToLoginPage(baseUrl: string): Promise<void> {
    // Navigate to the application
    await this.page.goto(baseUrl);

    // Validate successful page load
    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.logoImage).toBeVisible();
  }

  /**
   * Performs user authentication with provided credentials
   *
   * @description
   * Executes the complete login flow with mobile device compatibility and retry logic.
   * Includes field clearing, value validation, button state verification, and force
   * click for reliable interaction across different devices and browsers.
   *
   * @param {UserCredentials} credentials - User login credentials object
   * @param {string} credentials.username - Valid username from test data
   * @param {string} credentials.password - Corresponding password
   *
   * @returns {Promise<void>} Resolves when login process is complete
   *
   * @throws {Error} When credential filling fails or button interaction fails
   *
   * @example
   * ```typescript
   * await loginPage.login({
   *   username: 'standard_user',
   *   password: 'secret_sauce'
   * });
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async login(credentials: UserCredentials): Promise<void> {
    // Clear and fill username with validation
    await this.usernameInput.clear();
    await this.usernameInput.fill(credentials.username);
    await expect(this.usernameInput).toHaveValue(credentials.username);

    // Clear and fill password with validation
    await this.passwordInput.clear();
    await this.passwordInput.fill(credentials.password);
    await expect(this.passwordInput).toHaveValue(credentials.password);

    // Wait for button to be ready and ensure DOM stability
    await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.loginButton.waitFor({ state: 'attached', timeout: 10000 });

    // Small delay for mobile devices to ensure DOM is stable
    await this.page.waitForTimeout(100);

    // Force click for mobile device compatibility
    await this.loginButton.click({ force: true, timeout: 30000 });
  }

  /**
   * Validates successful login by checking URL redirect
   *
   * @description
   * Confirms that login was successful by validating the URL redirect to the
   * inventory page. This is the primary indicator of successful authentication
   * in the SauceDemo application.
   *
   * @returns {Promise<void>} Resolves when URL validation passes
   *
   * @throws {Error} When URL doesn't match expected inventory page pattern
   *
   * @example
   * ```typescript
   * await loginPage.validateSuccessfulLogin();
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async validateSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }

  /**
   * Validates login failure with expected error message
   *
   * @description
   * Confirms that login failed with the expected error message by checking
   * the error message container visibility and content. Used for negative
   * testing scenarios and credential validation.
   *
   * @param {string} expectedErrorMessage - Expected error message text to validate
   *
   * @returns {Promise<void>} Resolves when error validation passes
   *
   * @throws {Error} When error message is not visible or doesn't match expected text
   *
   * @example
   * ```typescript
   * await loginPage.validateLoginError('Username and password do not match');
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async validateLoginError(expectedErrorMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedErrorMessage);
  }

  /**
   * Validates comprehensive login page element availability and functionality
   *
   * @description
   * Performs thorough validation of all login page elements including form inputs,
   * buttons, and informational panels. Ensures elements are visible, enabled,
   * and editable where appropriate for complete page readiness verification.
   *
   * @returns {Promise<void>} Resolves when all elements pass validation
   *
   * @throws {Error} When any element fails visibility or functionality checks
   *
   * @example
   * ```typescript
   * await loginPage.validatePageElements();
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async validatePageElements(): Promise<void> {
    // Validate form input elements - visibility and editability
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEditable();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEditable();

    // Validate login button - visibility and enabled state
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();

    // Validate informational elements - visibility
    await expect(this.acceptedUsernames).toBeVisible();
    await expect(this.passwordInfo).toBeVisible();
  }

  /**
   * Clears all form input fields
   *
   * @description
   * Utility method to reset the login form by clearing both username and
   * password fields. Useful for test cleanup or preparing for new credentials.
   *
   * @returns {Promise<void>} Resolves when all fields are cleared
   *
   * @example
   * ```typescript
   * await loginPage.clearForm();
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Retrieves the current error message text if visible
   *
   * @description
   * Safely extracts error message text when an error is displayed on the login page.
   * Returns empty string if no error is present, making it safe for conditional logic.
   * Includes error handling to prevent test failures on element access issues.
   *
   * @returns {Promise<string>} The error message text or empty string if no error
   *
   * @example
   * ```typescript
   * const errorText = await loginPage.getErrorMessage();
   * if (errorText) {
   *   console.log('Login error:', errorText);
   * }
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async getErrorMessage(): Promise<string> {
    try {
      if (await this.errorMessage.isVisible()) {
        const errorText = await this.errorMessage.textContent();
        return errorText ?? '';
      }
      return '';
    } catch {
      // Return empty string if error message access fails
      return '';
    }
  }

  /**
   * Checks if the login form is ready for user interaction
   *
   * @description
   * Validates that all essential form elements (username input, password input,
   * and login button) are visible and ready for interaction. Useful for
   * conditional logic and ensuring page readiness before test actions.
   *
   * @returns {Promise<boolean>} True if all form elements are visible and ready
   *
   * @example
   * ```typescript
   * const isReady = await loginPage.isLoginFormReady();
   * if (isReady) {
   *   await loginPage.login(credentials);
   * }
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async isLoginFormReady(): Promise<boolean> {
    try {
      // Check visibility of all essential form elements
      await expect(this.usernameInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      return true;
    } catch {
      // Return false if any element is not ready
      return false;
    }
  }
}
