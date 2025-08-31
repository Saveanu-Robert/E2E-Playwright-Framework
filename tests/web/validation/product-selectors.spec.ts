import { SAUCEDEMO_PRODUCTS } from "@data/testdata/saucedemo.products";
import { SAUCEDEMO_USERS } from "@data/testdata/saucedemo.users";
import { expect, test } from "@fixtures/web/saucedemo.fixture";
import { TestLogger } from "@utils/helpers/test.utils";

/**
 * Simple Product Interaction Test
 *
 * This test validates our page object selectors work correctly
 * with the actual SauceDemo website structure.
 */

test.describe("Product Interaction Validation", () => {
	test("should validate product selectors and basic cart operations", async ({
		page: _,
		loginPage,
		inventoryPage,
		cartPage,
		baseUrl,
	}) => {
		TestLogger.logTestStart(
			"Product Selectors Validation",
			"Validate our page object selectors work with actual SauceDemo",
		);

		try {
			// Step 1: Login
			await loginPage.navigateToLoginPage(baseUrl);
			await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
			await inventoryPage.validateInventoryPageLoad();

			TestLogger.logStep(1, "Testing product name detection");
			// Test getting all product names
			const products = await inventoryPage.getAllProductNames();
			TestLogger.logInfo(`Found products: ${products.join(", ")}`);
			expect(products.length).toBeGreaterThan(0);

			TestLogger.logStep(2, "Testing add to cart functionality");
			// Test adding a product to cart using the actual product name
			const sauceLabsBackpack = SAUCEDEMO_PRODUCTS.SAUCE_LABS_BACKPACK;

			// Try to add the backpack to cart
			await inventoryPage.addProductToCart(sauceLabsBackpack);

			// Verify cart count
			const cartCount = await inventoryPage.getCartItemCount();
			TestLogger.logInfo(`Cart count after adding product: ${cartCount}`);
			expect(cartCount).toBe(1);

			TestLogger.logStep(3, "Testing cart page functionality");
			// Navigate to cart and validate
			await inventoryPage.navigateToCart();
			await cartPage.validateCartPageLoad();

			// Check cart item count on cart page
			const cartPageItemCount = await cartPage.getCartItemCount();
			TestLogger.logInfo(`Cart page shows ${cartPageItemCount} items`);
			expect(cartPageItemCount).toBe(1);

			// Validate the product is actually in the cart
			await cartPage.validateCartContents([sauceLabsBackpack]);

			TestLogger.logValidation(
				"Product selectors and cart functionality working correctly",
				true,
			);
			TestLogger.logTestEnd("Product Selectors Validation", true);
		} catch (error) {
			TestLogger.logError(
				"Product selector validation failed",
				error instanceof Error ? error.message : String(error),
			);
			TestLogger.logTestEnd("Product Selectors Validation", false);
			throw error;
		}
	});
});
