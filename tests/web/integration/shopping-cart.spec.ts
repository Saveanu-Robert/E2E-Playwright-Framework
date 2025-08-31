import {
	CHECKOUT_DATA,
	INVALID_CHECKOUT_DATA,
	SAUCEDEMO_PRODUCTS,
} from "@data/testdata/saucedemo.products";
import { SAUCEDEMO_USERS } from "@data/testdata/saucedemo.users";
import { expect, test } from "@fixtures/web/saucedemo.fixture";
import {
	AssertionUtils,
	PageUtils,
	TestLogger,
} from "@utils/helpers/test.utils";

/**
 * SauceDemo Integration Test - Shopping Cart Flow
 *
 * Tests integration between multiple components:
 * - Login system integration with inventory
 * - Product management integration with cart
 * - Cart integration with checkout process
 * - Form validation integration
 *
 * Test Category: Integration Test
 * Priority: High (P1)
 * Execution Time: ~2-3 minutes
 */

test.describe("SauceDemo Integration Test - Shopping Cart Flow", () => {
	test.beforeEach(async ({ page }) => {
		TestLogger.logInfo("Setting up integration test prerequisites");
		await PageUtils.waitForPageLoad(page);
	});

	test.afterEach(async ({ page }, testInfo) => {
		if (testInfo.status === "failed") {
			TestLogger.logError(`Integration test failed: ${testInfo.title}`);
			await PageUtils.takeScreenshot(
				page,
				`integration-failed-${testInfo.title.replace(/\s+/g, "-")}`,
				true,
			);
		}
	});

	/**
	 * Integration Test: Complete Shopping Cart Workflow
	 *
	 * Tests the integration of multiple system components:
	 * 1. Authentication → Inventory access
	 * 2. Product selection → Cart management
	 * 3. Cart operations → Checkout process
	 * 4. Form validation → Order processing
	 *
	 * This test validates that all components work together seamlessly
	 */
	test("should integrate login, shopping, and checkout processes", async ({
		page,
		loginPage,
		inventoryPage,
		cartPage,
		checkoutPage,
		baseUrl,
	}) => {
		const testName = "Complete Shopping Cart Integration";
		const testDescription =
			"Test integration between login, shopping cart, and checkout systems";

		TestLogger.logTestStart(testName, testDescription);

		try {
			// Phase 1: Authentication Integration
			TestLogger.logStep(
				1,
				"Test authentication integration with application access",
			);
			await loginPage.navigateToLoginPage(baseUrl);
			await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
			await loginPage.validateSuccessfulLogin();
			await inventoryPage.validateInventoryPageLoad();

			TestLogger.logValidation(
				"Authentication successfully integrated with inventory access",
				true,
			);

			// Phase 2: Product Management Integration
			TestLogger.logStep(
				2,
				"Test product selection integration with cart system",
			);

			// Select multiple products to test cart integration
			const selectedProducts = [
				SAUCEDEMO_PRODUCTS.SAUCE_LABS_BACKPACK,
				SAUCEDEMO_PRODUCTS.SAUCE_LABS_BOLT_TSHIRT,
				SAUCEDEMO_PRODUCTS.SAUCE_LABS_BIKE_LIGHT,
			];

			let expectedCartCount = 0;
			for (const product of selectedProducts) {
				TestLogger.logAction(`Adding product to cart: ${product.name}`);

				// Validate product display before adding
				await inventoryPage.validateProductInformation(product);

				// Add to cart and verify integration
				await inventoryPage.addProductToCart(product);
				expectedCartCount++;

				// Verify cart count updates correctly (integration validation)
				await inventoryPage.validateCartItemCount(expectedCartCount);
			}

			TestLogger.logValidation(
				`Product selection integrated with cart (${expectedCartCount} items)`,
				true,
			);

			// Phase 3: Cart Management Integration
			TestLogger.logStep(
				3,
				"Test cart management integration with product data",
			);

			// Navigate to cart and verify product integration
			await inventoryPage.navigateToCart();
			await cartPage.validateCartPageLoad();

			// Verify all selected products are properly integrated in cart
			await cartPage.validateCartContents(selectedProducts);

			// Test cart manipulation integration
			TestLogger.logAction("Testing cart item removal integration");
			await cartPage.removeProductFromCart(selectedProducts[1]); // Remove middle item

			const remainingProducts = [selectedProducts[0], selectedProducts[2]];
			await cartPage.validateCartContents(remainingProducts);

			TestLogger.logValidation(
				"Cart management integrated with product data correctly",
				true,
			);

			// Phase 4: Checkout Process Integration
			TestLogger.logStep(
				4,
				"Test checkout process integration with cart and forms",
			);

			// Calculate expected total for integration validation
			const expectedTotal = await cartPage.calculateTotalValue();
			TestLogger.logInfo(`Expected cart total: $${expectedTotal.toFixed(2)}`);

			// Proceed to checkout and test form integration
			await cartPage.proceedToCheckout();
			await checkoutPage.validateCheckoutPageLoad();

			// Test form validation integration
			TestLogger.logAction("Testing checkout form validation integration");

			// Test invalid data handling
			await checkoutPage.fillCheckoutInformation({
				firstName: INVALID_CHECKOUT_DATA.EMPTY_FIRST_NAME.firstName || "",
				lastName: CHECKOUT_DATA.VALID_CUSTOMER.lastName,
				postalCode: CHECKOUT_DATA.VALID_CUSTOMER.postalCode,
			});

			// Try to continue with invalid data - should show error
			await page.locator('[data-test="continue"]').click();
			await checkoutPage.validateCheckoutError("Error: First Name is required");
			await checkoutPage.dismissError();

			TestLogger.logValidation(
				"Form validation integrated with checkout process",
				true,
			);

			// Phase 5: Data Integration Validation
			TestLogger.logStep(5, "Complete checkout with valid data integration");

			// Clear and fill with valid data
			await checkoutPage.fillCheckoutInformation(CHECKOUT_DATA.VALID_CUSTOMER);
			await checkoutPage.continueToOverview();

			// Verify navigation to overview (integration success)
			await AssertionUtils.assertUrlPattern(
				page,
				/.*checkout-step-two\.html/,
				"checkout overview after successful form integration",
			);

			TestLogger.logValidation(
				"Complete checkout integration validated successfully",
				true,
			);

			// Phase 6: System State Integration
			TestLogger.logStep(6, "Validate final system state integration");

			// Verify cart badge still shows correct count throughout process
			const finalCartCount = await inventoryPage.getCartItemCount();
			expect(finalCartCount).toBe(remainingProducts.length);

			TestLogger.logValidation(
				"System state consistently integrated across all components",
				true,
			);
			TestLogger.logTestEnd(testName, true);
		} catch (error) {
			TestLogger.logError(
				"Integration test failed",
				error instanceof Error ? error.message : String(error),
			);
			TestLogger.logTestEnd(testName, false);
			throw error;
		}
	});

	/**
	 * Integration Test: Product Sorting and Filtering
	 *
	 * Tests integration between:
	 * 1. Product data management
	 * 2. UI sorting functionality
	 * 3. Data persistence across operations
	 * 4. User interaction state management
	 */
	test("should integrate product sorting with cart operations", async ({
		page,
		authenticatedPage: _,
		inventoryPage,
		cartPage,
	}) => {
		const testName = "Product Sorting Integration";
		const testDescription =
			"Test integration between product sorting and cart operations";

		TestLogger.logTestStart(testName, testDescription);

		try {
			// Step 1: Validate initial product order integration
			TestLogger.logStep(1, "Validate default product sorting integration");

			await inventoryPage.validateInventoryPageLoad();
			const initialProducts = await inventoryPage.getAllProductNames();
			TestLogger.logInfo(
				`Initial product order: ${initialProducts.join(", ")}`,
			);

			// Step 2: Test sorting integration with product data
			TestLogger.logStep(2, "Test product sorting integration");

			// Test name sorting (A-Z)
			await inventoryPage.sortProducts("az");
			await inventoryPage.validateProductSorting("name-asc");

			// Add product while sorted - test state integration
			await inventoryPage.addProductToCart(
				SAUCEDEMO_PRODUCTS.SAUCE_LABS_BACKPACK,
			);
			await inventoryPage.validateCartItemCount(1);

			// Test sorting persistence with cart state
			await inventoryPage.sortProducts("za");
			await inventoryPage.validateProductSorting("name-desc");

			// Verify cart state persists through sorting
			await inventoryPage.validateCartItemCount(1);

			TestLogger.logValidation(
				"Product sorting integrated with cart state",
				true,
			);

			// Step 3: Test price sorting integration
			TestLogger.logStep(
				3,
				"Test price sorting integration with cart operations",
			);

			await inventoryPage.sortProducts("lohi");
			await inventoryPage.validateProductSorting("price-asc");

			// Add another product while price sorted
			await inventoryPage.addProductToCart(
				SAUCEDEMO_PRODUCTS.SAUCE_LABS_ONESIE,
			);
			await inventoryPage.validateCartItemCount(2);

			// Navigate to cart and verify products maintained
			await inventoryPage.navigateToCart();
			await cartPage.validateCartPageLoad();

			const cartItemCount = await cartPage.getCartItemCount();
			expect(cartItemCount).toBe(2);

			TestLogger.logValidation(
				"Price sorting integrated with cart operations",
				true,
			);

			// Step 4: Test navigation integration
			TestLogger.logStep(4, "Test navigation integration with sorted state");

			// Return to inventory and verify sort state management
			await cartPage.continueShopping();
			await inventoryPage.validateInventoryPageLoad();

			// Note: SauceDemo resets sort to default after navigation - this is expected behavior
			const currentSort = await page
				.locator('[data-test="product-sort-container"]')
				.inputValue();
			TestLogger.logInfo(
				`Sort state after navigation: ${currentSort} (SauceDemo resets to default 'az')`,
			);
			expect(currentSort).toBe("az"); // SauceDemo resets to default

			TestLogger.logValidation(
				"Navigation integrated with proper state management (sort reset is expected)",
				true,
			);
			TestLogger.logTestEnd(testName, true);
		} catch (error) {
			TestLogger.logError(
				"Product sorting integration test failed",
				error instanceof Error ? error.message : String(error),
			);
			TestLogger.logTestEnd(testName, false);
			throw error;
		}
	});
});
