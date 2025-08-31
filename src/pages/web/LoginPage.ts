import { expect, type Locator, type Page } from '@playwright/test';

import type { UserCredentials } from '@data/testdata/saucedemo.users';

/**
 * Page Object Model for SauceDemo Login Page
 * Implements the Page Object pattern with detailed logging and validation
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly acceptedUsernames: Locator;
  readonly passwordInfo: Locator;
  readonly logoImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.acceptedUsernames = page.locator('.login_credentials');
    this.passwordInfo = page.locator('.login_password');
    this.logoImage = page.locator('.login_logo');
  }

  /**
   * Navigate to the login page and validate basic elements
   * @param baseUrl - The base URL of the application
   */
  async navigateToLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
    // Validate page load
    await expect(this.page).toHaveTitle('Swag Labs');
    await expect(this.logoImage).toBeVisible();
  }

  /**
   * Perform login with user credentials
   * Optimized for mobile device compatibility with retry logic
   * @param credentials - User credentials for login
   */
  async login(credentials: UserCredentials): Promise<void> {
    // Clear and fill username
    await this.usernameInput.clear();
    await this.usernameInput.fill(credentials.username);
    await expect(this.usernameInput).toHaveValue(credentials.username);

    // Clear and fill password
    await this.passwordInput.clear();
    await this.passwordInput.fill(credentials.password);
    await expect(this.passwordInput).toHaveValue(credentials.password);

    // Wait for button to be ready and click with retry logic
    await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.loginButton.waitFor({ state: 'attached', timeout: 10000 });

    // Small delay for mobile devices to ensure DOM is stable
    await this.page.waitForTimeout(100);

    // Force click for mobile device compatibility
    await this.loginButton.click({ force: true, timeout: 30000 });
  }

  /**
   * Validate successful login by checking URL redirect to inventory page
   */
  async validateSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }

  /**
   * Validate login failure with expected error message
   * @param expectedErrorMessage - Expected error message text
   */
  async validateLoginError(expectedErrorMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedErrorMessage);
  }

  /**
   * Validate all login page elements are visible and functional
   * Checks form inputs, buttons, and informational panels
   */
  async validatePageElements(): Promise<void> {
    // Check form elements
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEditable();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEditable();

    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();

    // Check informational elements
    await expect(this.acceptedUsernames).toBeVisible();
    await expect(this.passwordInfo).toBeVisible();
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get the current error message text if visible
   * @returns The error message text or empty string if no error
   */
  async getErrorMessage(): Promise<string> {
    try {
      if (await this.errorMessage.isVisible()) {
        const errorText = await this.errorMessage.textContent();
        return errorText ?? '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Check if login form is ready for user interaction
   * @returns True if all form elements are visible and ready
   */
  async isLoginFormReady(): Promise<boolean> {
    try {
      await expect(this.usernameInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}
