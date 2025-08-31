import { expect, type Page } from "@playwright/test";
import { TestLogger } from "@utils/helpers/test.utils";

/**
 * CheckoutPage - Page Object Model for SauceDemo checkout functionality
 *
 * Handles all checkout-related interactions including:
 * - Checkout form filling
 * - Order review and confirmation
 * - Payment simulation
 * - Error handling and validation
 */
export class CheckoutPage {
	private readonly page: Page;

	// Checkout Form Selectors
	private readonly firstNameInput = '[data-test="firstName"]';
	private readonly lastNameInput = '[data-test="lastName"]';
	private readonly postalCodeInput = '[data-test="postalCode"]';
	private readonly continueButton = '[data-test="continue"]';
	private readonly cancelButton = '[data-test="cancel"]';

	// Checkout Overview Selectors
	private readonly finishButton = '[data-test="finish"]';
	private readonly summaryContainer =
		'[data-test="checkout-summary-container"]';
	private readonly itemTotalLabel = '[data-test="subtotal-label"]';
	private readonly taxLabel = '[data-test="tax-label"]';
	private readonly totalLabel = '[data-test="total-label"]';

	// Error Handling
	private readonly errorContainer = '[data-test="error"]';
	private readonly errorButton = '[data-test="error-button"]';

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Validates that the checkout information page has loaded correctly
	 */
	async validateCheckoutPageLoad(): Promise<void> {
		TestLogger.logAction("Validating checkout page load");

		await expect(this.page.locator(this.firstNameInput)).toBeVisible();
		await expect(this.page.locator(this.lastNameInput)).toBeVisible();
		await expect(this.page.locator(this.postalCodeInput)).toBeVisible();
		await expect(this.page.locator(this.continueButton)).toBeVisible();

		const currentUrl = this.page.url();
		expect(currentUrl).toContain("checkout-step-one");

		TestLogger.logValidation("Checkout page loaded successfully", true);
	}

	/**
	 * Fills out the checkout information form
	 * @param customerData - Customer information object
	 */
	async fillCheckoutInformation(customerData: {
		firstName: string;
		lastName: string;
		postalCode: string;
	}): Promise<void> {
		TestLogger.logAction(
			`Filling checkout information for ${customerData.firstName} ${customerData.lastName}`,
		);

		await this.page.locator(this.firstNameInput).fill(customerData.firstName);
		await this.page.locator(this.lastNameInput).fill(customerData.lastName);
		await this.page.locator(this.postalCodeInput).fill(customerData.postalCode);

		TestLogger.logValidation("Checkout information filled successfully", true);
	}

	/**
	 * Continues to the checkout overview page
	 */
	async continueToOverview(): Promise<void> {
		TestLogger.logAction("Proceeding to checkout overview");

		await this.page.locator(this.continueButton).click();
		await this.page.waitForURL("**/checkout-step-two.html");

		TestLogger.logValidation(
			"Successfully navigated to checkout overview",
			true,
		);
	}

	/**
	 * Validates the checkout overview page elements
	 */
	async validateCheckoutOverview(): Promise<void> {
		TestLogger.logAction("Validating checkout overview page");

		await expect(this.page.locator(this.summaryContainer)).toBeVisible();
		await expect(this.page.locator(this.finishButton)).toBeVisible();
		await expect(this.page.locator(this.itemTotalLabel)).toBeVisible();

		const currentUrl = this.page.url();
		expect(currentUrl).toContain("checkout-step-two");

		TestLogger.logValidation(
			"Checkout overview page validated successfully",
			true,
		);
	}

	/**
	 * Gets the order summary totals
	 */
	async getOrderSummary(): Promise<{
		itemTotal: number;
		tax: number;
		total: number;
	}> {
		TestLogger.logAction("Retrieving order summary details");

		const itemTotalText =
			(await this.page.locator(this.itemTotalLabel).textContent()) || "";
		const taxText =
			(await this.page.locator(this.taxLabel).textContent()) || "";
		const totalText =
			(await this.page.locator(this.totalLabel).textContent()) || "";

		const itemTotal = parseFloat(itemTotalText.replace(/[^0-9.]/g, "")) || 0;
		const tax = parseFloat(taxText.replace(/[^0-9.]/g, "")) || 0;
		const total = parseFloat(totalText.replace(/[^0-9.]/g, "")) || 0;

		TestLogger.logInfo(
			`Order summary - Item Total: $${itemTotal}, Tax: $${tax}, Total: $${total}`,
		);

		return { itemTotal, tax, total };
	}

	/**
	 * Completes the order by clicking finish
	 */
	async finishOrder(): Promise<void> {
		TestLogger.logAction("Completing order");

		await this.page.locator(this.finishButton).click();
		await this.page.waitForURL("**/checkout-complete.html");

		TestLogger.logValidation("Order completed successfully", true);
	}

	/**
	 * Cancels the checkout process
	 */
	async cancelCheckout(): Promise<void> {
		TestLogger.logAction("Cancelling checkout process");

		await this.page.locator(this.cancelButton).click();

		TestLogger.logValidation("Checkout cancelled successfully", true);
	}

	/**
	 * Validates checkout form error handling
	 */
	async validateCheckoutError(expectedErrorMessage?: string): Promise<void> {
		TestLogger.logAction("Validating checkout error handling");

		await expect(this.page.locator(this.errorContainer)).toBeVisible();

		if (expectedErrorMessage) {
			const errorText = await this.page
				.locator(this.errorContainer)
				.textContent();
			expect(errorText).toContain(expectedErrorMessage);
			TestLogger.logValidation(
				`Error message validated: ${expectedErrorMessage}`,
				true,
			);
		}

		TestLogger.logValidation("Checkout error handling validated", true);
	}

	/**
	 * Dismisses error message
	 */
	async dismissError(): Promise<void> {
		TestLogger.logAction("Dismissing error message");

		await this.page.locator(this.errorButton).click();
		await expect(this.page.locator(this.errorContainer)).not.toBeVisible();

		TestLogger.logValidation("Error message dismissed", true);
	}

	/**
	 * Validates checkout form field requirements
	 */
	async validateRequiredFields(): Promise<void> {
		TestLogger.logAction("Validating required field enforcement");

		// Try to continue without filling fields
		await this.page.locator(this.continueButton).click();

		// Should show error for missing first name
		await this.validateCheckoutError("First Name is required");
		await this.dismissError();

		// Fill first name, try again
		await this.page.locator(this.firstNameInput).fill("Test");
		await this.page.locator(this.continueButton).click();

		// Should show error for missing last name
		await this.validateCheckoutError("Last Name is required");
		await this.dismissError();

		// Fill last name, try again
		await this.page.locator(this.lastNameInput).fill("User");
		await this.page.locator(this.continueButton).click();

		// Should show error for missing postal code
		await this.validateCheckoutError("Postal Code is required");
		await this.dismissError();

		TestLogger.logValidation("Required field validation completed", true);
	}

	/**
	 * Cleanup method for any page-specific teardown
	 */
	async cleanup(): Promise<void> {
		TestLogger.logInfo("🧹 CheckoutPage fixture cleanup completed");
	}
}
