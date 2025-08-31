import type { UserCredentials } from "@data/testdata/saucedemo.users";
import { expect, type Locator, type Page } from "@playwright/test";

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
		this.acceptedUsernames = page.locator(".login_credentials");
		this.passwordInfo = page.locator(".login_password");
		this.logoImage = page.locator(".login_logo");
	}

	/**
	 * Navigate to the login page
	 * @param baseUrl - The base URL of the application
	 */
	async navigateToLoginPage(baseUrl: string): Promise<void> {
		console.log("🚀 Navigating to SauceDemo login page");
		await this.page.goto(baseUrl);

		// Validate page load
		await expect(this.page).toHaveTitle("Swag Labs");
		await expect(this.logoImage).toBeVisible();
		console.log("✅ Successfully navigated to login page");
	}

	/**
	 * Perform login with user credentials
	 * @param credentials - User credentials for login
	 */
	async login(credentials: UserCredentials): Promise<void> {
		console.log(
			`🔐 Attempting login with user: ${credentials.username} (${credentials.description})`,
		);

		// Clear and fill username
		console.log("📝 Entering username");
		await this.usernameInput.clear();
		await this.usernameInput.fill(credentials.username);
		await expect(this.usernameInput).toHaveValue(credentials.username);

		// Clear and fill password
		console.log("🔑 Entering password");
		await this.passwordInput.clear();
		await this.passwordInput.fill(credentials.password);
		await expect(this.passwordInput).toHaveValue(credentials.password);

		// Wait for button to be ready and click with retry logic
		console.log("🖱️ Clicking login button");
		await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.loginButton.waitFor({ state: 'attached', timeout: 10000 });
		
		// Add small delay for mobile devices to ensure DOM is stable
		await this.page.waitForTimeout(100);
		
		// Use force click for mobile devices to avoid interaction issues
		await this.loginButton.click({ force: true, timeout: 30000 });

		console.log("✅ Login attempt completed");
	}

	/**
	 * Validate successful login by checking URL redirect
	 */
	async validateSuccessfulLogin(): Promise<void> {
		console.log("🔍 Validating successful login");
		await expect(this.page).toHaveURL(/.*inventory\.html/);
		console.log(
			"✅ Login validation successful - redirected to inventory page",
		);
	}

	/**
	 * Validate login failure with error message
	 * @param expectedErrorMessage - Expected error message text
	 */
	async validateLoginError(expectedErrorMessage: string): Promise<void> {
		console.log("🔍 Validating login error message");
		await expect(this.errorMessage).toBeVisible();
		await expect(this.errorMessage).toContainText(expectedErrorMessage);
		console.log(`✅ Error message validated: "${expectedErrorMessage}"`);
	}

	/**
	 * Validate page elements are visible and functional
	 */
	async validatePageElements(): Promise<void> {
		console.log("🔍 Validating login page elements");

		// Check form elements
		await expect(this.usernameInput).toBeVisible();
		await expect(this.usernameInput).toBeEditable();
		console.log("✅ Username input is visible and editable");

		await expect(this.passwordInput).toBeVisible();
		await expect(this.passwordInput).toBeEditable();
		console.log("✅ Password input is visible and editable");

		await expect(this.loginButton).toBeVisible();
		await expect(this.loginButton).toBeEnabled();
		console.log("✅ Login button is visible and enabled");

		// Check informational elements
		await expect(this.acceptedUsernames).toBeVisible();
		await expect(this.passwordInfo).toBeVisible();
		console.log("✅ User information panels are visible");

		console.log("✅ All page elements validation completed");
	}

	/**
	 * Clear all form fields
	 */
	async clearForm(): Promise<void> {
		console.log("🧹 Clearing login form");
		await this.usernameInput.clear();
		await this.passwordInput.clear();
		console.log("✅ Form cleared successfully");
	}

	/**
	 * Get the current error message text
	 * @returns The error message text or empty string if no error
	 */
	async getErrorMessage(): Promise<string> {
		try {
			if (await this.errorMessage.isVisible()) {
				const errorText = await this.errorMessage.textContent();
				console.log(`ℹ️ Error message found: "${errorText}"`);
				return errorText || "";
			}
			return "";
		} catch {
			return "";
		}
	}

	/**
	 * Check if login form is ready for interaction
	 */
	async isLoginFormReady(): Promise<boolean> {
		try {
			await expect(this.usernameInput).toBeVisible();
			await expect(this.passwordInput).toBeVisible();
			await expect(this.loginButton).toBeVisible();
			console.log("✅ Login form is ready for interaction");
			return true;
		} catch {
			console.log("❌ Login form is not ready");
			return false;
		}
	}
}
