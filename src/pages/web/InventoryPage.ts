import type { ProductData } from "@data/testdata/saucedemo.products";
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Page Object Model for SauceDemo Inventory/Products Page
 * Manages product listing, sorting, and shopping cart interactions
 */
export class InventoryPage {
	readonly page: Page;
	readonly pageTitle: Locator;
	readonly sortDropdown: Locator;
	readonly shoppingCartLink: Locator;
	readonly shoppingCartBadge: Locator;
	readonly menuButton: Locator;
	readonly inventoryContainer: Locator;

	constructor(page: Page) {
		this.page = page;
		this.pageTitle = page.locator('[data-test="title"]');
		this.sortDropdown = page.locator('[data-test="product-sort-container"]');
		this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
		this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
		this.menuButton = page.locator("#react-burger-menu-btn");
		this.inventoryContainer = page.locator('[data-test="inventory-container"]');
	}

	/**
	 * Validate successful navigation to inventory page
	 */
	async validateInventoryPageLoad(): Promise<void> {
		console.log("🔍 Validating inventory page load");

		await expect(this.page).toHaveURL(/.*inventory\.html/);
		await expect(this.pageTitle).toHaveText("Products");
		await expect(this.inventoryContainer).toBeVisible();

		console.log("✅ Inventory page loaded successfully");
	}

	/**
	 * Get add to cart button for a specific product
	 * @param productId - The product identifier
	 */
	private getAddToCartButton(productId: string): Locator {
		return this.page.locator(`[data-test="add-to-cart-${productId}"]`);
	}

	/**
	 * Get remove button for a specific product
	 * @param productId - The product identifier
	 */
	private getRemoveButton(productId: string): Locator {
		return this.page.locator(`[data-test="remove-${productId}"]`);
	}

	/**
	 * Wait for button state change from Add to Remove
	 * @param productId - The product identifier
	 */
	private async waitForButtonStateChange(productId: string): Promise<void> {
		const addButton = this.getAddToCartButton(productId);
		const removeButton = this.getRemoveButton(productId);
		
		// Wait for add button to disappear and remove button to appear
		await expect(addButton).toBeHidden({ timeout: 30000 });
		await expect(removeButton).toBeVisible({ timeout: 30000 });
	}

	/**
	 * Wait for button state change from Remove back to Add to Cart
	 * @param productId - The product identifier
	 */
	private async waitForAddButtonRestore(productId: string): Promise<void> {
		const addButton = this.getAddToCartButton(productId);
		const removeButton = this.getRemoveButton(productId);
		
		// Wait for remove button to disappear and add button to appear
		await expect(removeButton).toBeHidden({ timeout: 30000 });
		await expect(addButton).toBeVisible({ timeout: 30000 });
		await expect(addButton).toHaveText("Add to cart", { timeout: 30000 });
	}

	/**
	 * Get product name link for a specific product
	 * @param productId - The product identifier
	 */
	private getProductNameLink(productId: string): Locator {
		// Use the text content to find the product link
		return this.page
			.locator(`[data-test="inventory-item-name"]`)
			.filter({ hasText: productId.replace(/-/g, " ") })
			.first();
	}

	/**
	 * Add a product to cart
	 * @param product - Product data to add to cart
	 */
	async addProductToCart(product: ProductData): Promise<void> {
		console.log(`🛒 Adding product to cart: ${product.name}`);

		const addToCartButton = this.getAddToCartButton(product.id);
		await expect(addToCartButton).toBeVisible();
		await expect(addToCartButton).toHaveText("Add to cart");

		// Wait for button to be ready and stable before clicking
		await addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
		await addToCartButton.waitFor({ state: 'attached', timeout: 10000 });
		
		// Add small delay for mobile devices to ensure DOM is stable
		await this.page.waitForTimeout(50);
		
		// Use force click for mobile devices to avoid interaction issues
		await addToCartButton.click({ force: true, timeout: 30000 });

		// Wait for DOM update to complete using comprehensive strategy
		await this.waitForButtonStateChange(product.id);
		
		// Additional validation for mobile safari
		const removeButton = this.getRemoveButton(product.id);
		await expect(removeButton).toHaveText("Remove", { timeout: 30000 });

		console.log(`✅ Product added to cart successfully: ${product.name}`);
	}

	/**
	 * Remove a product from cart
	 * @param product - Product data to remove from cart
	 */
	async removeProductFromCart(product: ProductData): Promise<void> {
		console.log(`🗑️ Removing product from cart: ${product.name}`);

		const removeButton = this.getRemoveButton(product.id);
		await expect(removeButton).toBeVisible({ timeout: 30000 });
		await expect(removeButton).toHaveText("Remove", { timeout: 30000 });

		// Use force click for mobile devices
		await removeButton.click({ force: true, timeout: 30000 });

		// Wait for state change back to add to cart
		await this.waitForAddButtonRestore(product.id);

		console.log(`✅ Product removed from cart successfully: ${product.name}`);
	}

	/**
	 * Validate product information on the page
	 * @param product - Product data to validate
	 */
	async validateProductInformation(product: ProductData): Promise<void> {
		console.log(`🔍 Validating product information: ${product.name}`);

		// Find the product by name using a more flexible approach
		const productNameElement = this.page
			.locator(`[data-test="inventory-item-name"]`)
			.filter({ hasText: product.name });
		await expect(productNameElement.first()).toBeVisible();

		// Get the product container that contains this product name
		const productContainer = productNameElement.first().locator("../../../..");

		// Validate product description is visible
		const productDescription = productContainer.locator(
			'[data-test="inventory-item-desc"]',
		);
		await expect(productDescription).toBeVisible();

		// Validate product price
		const productPrice = productContainer.locator(
			'[data-test="inventory-item-price"]',
		);
		await expect(productPrice).toHaveText(product.priceDisplay);

		// Validate product image
		const productImage = productContainer.locator(".inventory_item_img img");
		await expect(productImage).toBeVisible();
		await expect(productImage).toHaveAttribute("alt", product.name);

		console.log(`✅ Product information validated: ${product.name}`);
	}

	/**
	 * Get current cart item count
	 * @returns Number of items in cart
	 */
	async getCartItemCount(): Promise<number> {
		try {
			if (await this.shoppingCartBadge.isVisible()) {
				const badgeText = await this.shoppingCartBadge.textContent();
				const count = parseInt(badgeText || "0", 10);
				console.log(`ℹ️ Cart item count: ${count}`);
				return count;
			}
			console.log("ℹ️ Cart is empty (no badge visible)");
			return 0;
		} catch {
			return 0;
		}
	}

	/**
	 * Validate cart badge count
	 * @param expectedCount - Expected number of items in cart
	 */
	async validateCartItemCount(expectedCount: number): Promise<void> {
		console.log(`🔍 Validating cart item count: ${expectedCount}`);

		if (expectedCount > 0) {
			await expect(this.shoppingCartBadge).toBeVisible();
			await expect(this.shoppingCartBadge).toHaveText(expectedCount.toString());
			console.log(`✅ Cart badge shows correct count: ${expectedCount}`);
		} else {
			await expect(this.shoppingCartBadge).not.toBeVisible();
			console.log("✅ Cart badge is hidden (empty cart)");
		}
	}

	/**
	 * Navigate to shopping cart
	 */
	async navigateToCart(): Promise<void> {
		console.log("🛒 Navigating to shopping cart");
		await this.shoppingCartLink.click();
		await expect(this.page).toHaveURL(/.*cart\.html/);
		console.log("✅ Successfully navigated to cart page");
	}

	/**
	 * Sort products by option
	 * @param sortOption - Sort option value (az, za, lohi, hilo)
	 */
	async sortProducts(sortOption: "az" | "za" | "lohi" | "hilo"): Promise<void> {
		console.log(`📊 Sorting products by: ${sortOption}`);

		await this.sortDropdown.selectOption(sortOption);

		// Validate selection
		await expect(this.sortDropdown).toHaveValue(sortOption);

		console.log(`✅ Products sorted by: ${sortOption}`);
	}

	/**
	 * Get all visible product names in order
	 * @returns Array of product names
	 */
	async getAllProductNames(): Promise<string[]> {
		console.log("📋 Getting all product names");

		const productNames = await this.page
			.locator(".inventory_item_name")
			.allTextContents();

		console.log(
			`ℹ️ Found ${productNames.length} products: ${productNames.join(", ")}`,
		);
		return productNames;
	}

	/**
	 * Get all visible product prices in order
	 * @returns Array of product prices as numbers
	 */
	async getAllProductPrices(): Promise<number[]> {
		console.log("💰 Getting all product prices");

		const priceTexts = await this.page
			.locator(".inventory_item_price")
			.allTextContents();
		const prices = priceTexts.map((price) =>
			parseFloat(price.replace("$", "")),
		);

		console.log(`ℹ️ Found ${prices.length} prices: ${prices.join(", ")}`);
		return prices;
	}

	/**
	 * Validate products are sorted correctly
	 * @param sortType - Type of sorting to validate
	 */
	async validateProductSorting(
		sortType: "name-asc" | "name-desc" | "price-asc" | "price-desc",
	): Promise<void> {
		console.log(`🔍 Validating product sorting: ${sortType}`);

		switch (sortType) {
			case "name-asc": {
				const namesAsc = await this.getAllProductNames();
				const sortedNamesAsc = [...namesAsc].sort();
				expect(namesAsc).toEqual(sortedNamesAsc);
				console.log("✅ Products sorted by name (A-Z) correctly");
				break;
			}

			case "name-desc": {
				const namesDesc = await this.getAllProductNames();
				const sortedNamesDesc = [...namesDesc].sort().reverse();
				expect(namesDesc).toEqual(sortedNamesDesc);
				console.log("✅ Products sorted by name (Z-A) correctly");
				break;
			}

			case "price-asc": {
				const pricesAsc = await this.getAllProductPrices();
				const sortedPricesAsc = [...pricesAsc].sort((a, b) => a - b);
				expect(pricesAsc).toEqual(sortedPricesAsc);
				console.log("✅ Products sorted by price (low to high) correctly");
				break;
			}

			case "price-desc": {
				const pricesDesc = await this.getAllProductPrices();
				const sortedPricesDesc = [...pricesDesc].sort((a, b) => b - a);
				expect(pricesDesc).toEqual(sortedPricesDesc);
				console.log("✅ Products sorted by price (high to low) correctly");
				break;
			}
		}
	}

	/**
	 * Click on product name to view details
	 * @param product - Product to view details
	 */
	async viewProductDetails(product: ProductData): Promise<void> {
		console.log(`👁️ Viewing product details: ${product.name}`);

		const productNameLink = this.getProductNameLink(product.id);
		await productNameLink.click();

		await expect(this.page).toHaveURL(/.*inventory-item\.html/);
		console.log(`✅ Navigated to product details: ${product.name}`);
	}
}
