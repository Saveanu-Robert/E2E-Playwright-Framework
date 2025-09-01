/**
 * @fileoverview InventoryPage - Page Object Model implementation for SauceDemo product inventory
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This page object provides comprehensive interaction methods for the SauceDemo inventory/products page.
 * It manages product listing, sorting functionality, shopping cart interactions, and product validation
 * with mobile device compatibility and robust state management.
 *
 * Key Features:
 * - Product catalog management and validation
 * - Shopping cart interaction with button state tracking
 * - Product sorting and filtering capabilities
 * - Mobile device compatibility with force click options
 * - Comprehensive product information validation
 * - Cart badge validation and count tracking
 * - Performance optimizations for DOM state changes
 *
 * @example
 * ```typescript
 * import { InventoryPage } from '@pages/web/InventoryPage';
 *
 * test('product management', async ({ page }) => {
 *   const inventoryPage = new InventoryPage(page);
 *   await inventoryPage.validateInventoryPageLoad();
 *   await inventoryPage.addProductToCart(product);
 *   await inventoryPage.validateCartItemCount(1);
 * });
 * ```
 *
 * @see {@link LoginPage} - Previous page in user flow
 * @see {@link CartPage} - Next page in shopping flow
 * @see {@link ../fixtures/web/saucedemo.fixture.ts} - Test fixtures
 * @see {@link ../../data/testdata/saucedemo.products.ts} - Product test data
 */

import { expect, type Locator, type Page } from '@playwright/test';

import type { ProductData } from '@data/testdata/saucedemo.products';
/**
 * InventoryPage - Manages product catalog and shopping cart interactions
 *
 * @description
 * This page object encapsulates all interactions with the SauceDemo inventory/products page,
 * providing methods for product management, cart operations, sorting, and validation.
 * It includes mobile device compatibility and comprehensive state management for reliable testing.
 *
 * @example
 * ```typescript
 * const inventoryPage = new InventoryPage(page);
 * await inventoryPage.addProductToCart(product);
 * await inventoryPage.validateCartItemCount(1);
 * ```
 *
 * @public
 * @class
 * @since 1.0.0
 */
export class InventoryPage {
  /**
   * Playwright Page instance for browser interactions
   * @readonly
   * @public
   */
  readonly page: Page;

  /**
   * Page title locator for validation
   * @readonly
   * @public
   */
  readonly pageTitle: Locator;

  /**
   * Product sort dropdown locator
   * @readonly
   * @public
   */
  readonly sortDropdown: Locator;

  /**
   * Shopping cart link locator for navigation
   * @readonly
   * @public
   */
  readonly shoppingCartLink: Locator;

  /**
   * Shopping cart badge locator for item count display
   * @readonly
   * @public
   */
  readonly shoppingCartBadge: Locator;

  /**
   * Menu button locator for navigation
   * @readonly
   * @public
   */
  readonly menuButton: Locator;

  /**
   * Main inventory container locator for page validation
   * @readonly
   * @public
   */
  readonly inventoryContainer: Locator;

  /**
   * Creates a new InventoryPage instance
   *
   * @description
   * Initializes the page object with locators using robust data-test selectors
   * for reliable element identification across different environments and browsers.
   *
   * @param {Page} page - Playwright Page instance for browser interactions
   *
   * @example
   * ```typescript
   * const inventoryPage = new InventoryPage(page);
   * ```
   *
   * @public
   * @constructor
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust data-test selectors
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
  }

  /**
   * Validates successful navigation and loading of the inventory page
   *
   * @description
   * Performs comprehensive validation to ensure the inventory page has loaded correctly.
   * Checks URL pattern, page title, and main container visibility to confirm page readiness.
   *
   * @returns {Promise<void>} Resolves when all validations pass
   *
   * @throws {Error} When URL, title, or container validation fails
   *
   * @example
   * ```typescript
   * await inventoryPage.validateInventoryPageLoad();
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async validateInventoryPageLoad(): Promise<void> {
    // Validate URL contains inventory.html
    await expect(this.page).toHaveURL(/.*inventory\.html/);

    // Validate page title displays "Products"
    await expect(this.pageTitle).toHaveText('Products');

    // Validate main inventory container is visible
    await expect(this.inventoryContainer).toBeVisible();
  }

  /**
   * Retrieves the "Add to Cart" button locator for a specific product
   *
   * @description
   * Creates a locator for the product's add to cart button using the data-test
   * attribute pattern. Used internally for product cart operations.
   *
   * @param {string} productId - The unique product identifier/slug
   *
   * @returns {Locator} Playwright locator for the add to cart button
   *
   * @private
   * @since 1.0.0
   */
  private getAddToCartButton(productId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`);
  }

  /**
   * Retrieves the "Remove" button locator for a specific product
   *
   * @description
   * Creates a locator for the product's remove button using the data-test
   * attribute pattern. Used internally for product cart operations.
   *
   * @param {string} productId - The unique product identifier/slug
   *
   * @returns {Locator} Playwright locator for the remove button
   *
   * @private
   * @since 1.0.0
   */
  private getRemoveButton(productId: string): Locator {
    return this.page.locator(`[data-test="remove-${productId}"]`);
  }

  /**
   * Waits for button state transition from "Add to Cart" to "Remove"
   *
   * @description
   * Monitors DOM changes after adding a product to cart to ensure the button
   * state has updated properly. Critical for mobile device compatibility and
   * reliable test execution with proper state verification.
   *
   * @param {string} productId - The unique product identifier/slug
   *
   * @returns {Promise<void>} Resolves when button state change is complete
   *
   * @throws {Error} When button state change times out
   *
   * @private
   * @async
   * @since 1.0.0
   */
  private async waitForButtonStateChange(productId: string): Promise<void> {
    const addButton = this.getAddToCartButton(productId);
    const removeButton = this.getRemoveButton(productId);

    // Wait for add button to disappear and remove button to appear
    await expect(addButton).toBeHidden({ timeout: 30000 });
    await expect(removeButton).toBeVisible({ timeout: 30000 });
  }

  /**
   * Waits for button state transition from "Remove" back to "Add to Cart"
   *
   * @description
   * Monitors DOM changes after removing a product from cart to ensure the button
   * state has reverted properly. Includes text validation for complete state verification.
   *
   * @param {string} productId - The unique product identifier/slug
   *
   * @returns {Promise<void>} Resolves when button state restoration is complete
   *
   * @throws {Error} When button state restoration times out
   *
   * @private
   * @async
   * @since 1.0.0
   */
  private async waitForAddButtonRestore(productId: string): Promise<void> {
    const addButton = this.getAddToCartButton(productId);
    const removeButton = this.getRemoveButton(productId);

    // Wait for remove button to disappear and add button to appear
    await expect(removeButton).toBeHidden({ timeout: 30000 });
    await expect(addButton).toBeVisible({ timeout: 30000 });
    await expect(addButton).toHaveText('Add to cart', { timeout: 30000 });
  }

  /**
   * Get product name link for a specific product
   * @param productId - The product identifier
   */
  private getProductNameLink(productId: string): Locator {
    // Use the text content to find the product link
    return this.page
      .locator(`[data-test="inventory-item-name"]`)
      .filter({ hasText: productId.replace(/-/g, ' ') })
      .first();
  }

  /**
   * Add a product to cart with mobile device compatibility
   * Handles DOM state changes and ensures reliable cart interaction
   * @param product - Product data to add to cart
   */
  async addProductToCart(product: ProductData): Promise<void> {
    const addToCartButton = this.getAddToCartButton(product.id);
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toHaveText('Add to cart');

    // Ensure button stability before interaction
    await addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
    await addToCartButton.waitFor({ state: 'attached', timeout: 10000 });

    // Small delay for mobile device DOM stability
    await this.page.waitForTimeout(50);

    // Force click for mobile device compatibility
    await addToCartButton.click({ force: true, timeout: 30000 });

    // Wait for DOM update to complete
    await this.waitForButtonStateChange(product.id);

    // Additional validation for mobile safari
    const removeButton = this.getRemoveButton(product.id);
    await expect(removeButton).toHaveText('Remove', { timeout: 30000 });
  }

  /**
   * Remove a product from cart with mobile device compatibility
   * @param product - Product data to remove from cart
   */
  async removeProductFromCart(product: ProductData): Promise<void> {
    const removeButton = this.getRemoveButton(product.id);
    await expect(removeButton).toBeVisible({ timeout: 30000 });
    await expect(removeButton).toHaveText('Remove', { timeout: 30000 });

    // Force click for mobile device compatibility
    await removeButton.click({ force: true, timeout: 30000 });

    // Wait for state change back to add to cart
    await this.waitForAddButtonRestore(product.id);
  }

  /**
   * Validate product information is displayed correctly on the page
   * Checks product name, description, price, and image
   * @param product - Product data to validate
   */
  async validateProductInformation(product: ProductData): Promise<void> {
    // Find the product by name using a flexible approach
    const productNameElement = this.page
      .locator(`[data-test="inventory-item-name"]`)
      .filter({ hasText: product.name });
    await expect(productNameElement.first()).toBeVisible();

    // Get the product container that contains this product name
    const productContainer = productNameElement.first().locator('../../../..');

    // Validate product description is visible
    const productDescription = productContainer.locator('[data-test="inventory-item-desc"]');
    await expect(productDescription).toBeVisible();

    // Validate product price
    const productPrice = productContainer.locator('[data-test="inventory-item-price"]');
    await expect(productPrice).toHaveText(product.priceDisplay);

    // Validate product image
    const productImage = productContainer.locator('.inventory_item_img img');
    await expect(productImage).toBeVisible();
    await expect(productImage).toHaveAttribute('alt', product.name);
  }

  /**
   * Get current cart item count from badge
   * @returns Number of items in cart (0 if badge not visible)
   */
  async getCartItemCount(): Promise<number> {
    try {
      if (await this.shoppingCartBadge.isVisible()) {
        const badgeText = await this.shoppingCartBadge.textContent();
        return parseInt(badgeText ?? '0', 10);
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * Validate cart badge displays correct count
   * For count > 0: verifies badge is visible with correct text
   * For count = 0: verifies badge is hidden
   * @param expectedCount - Expected number of items in cart
   */
  async validateCartItemCount(expectedCount: number): Promise<void> {
    if (expectedCount > 0) {
      await expect(this.shoppingCartBadge).toBeVisible();
      await expect(this.shoppingCartBadge).toHaveText(expectedCount.toString());
    } else {
      await expect(this.shoppingCartBadge).not.toBeVisible();
    }
  }

  /**
   * Navigate to shopping cart page
   */
  async navigateToCart(): Promise<void> {
    await this.shoppingCartLink.click();
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }

  /**
   * Sort products by specified option
   * @param sortOption - Sort option value (az, za, lohi, hilo)
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    // Validate selection was applied
    await expect(this.sortDropdown).toHaveValue(sortOption);
  }

  /**
   * Get all visible product names in current display order
   * @returns Array of product names as they appear on page
   */
  async getAllProductNames(): Promise<string[]> {
    const productNames = await this.page.locator('.inventory_item_name').allTextContents();
    return productNames;
  }

  /**
   * Get all visible product prices in current display order
   * @returns Array of product prices as numbers (without $ symbol)
   */
  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Validate products are sorted correctly by specified criteria
   * @param sortType - Type of sorting to validate
   */
  async validateProductSorting(
    sortType: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc',
  ): Promise<void> {
    switch (sortType) {
      case 'name-asc': {
        const namesAsc = await this.getAllProductNames();
        const sortedNamesAsc = [...namesAsc].sort();
        expect(namesAsc).toEqual(sortedNamesAsc);
        break;
      }

      case 'name-desc': {
        const namesDesc = await this.getAllProductNames();
        const sortedNamesDesc = [...namesDesc].sort().reverse();
        expect(namesDesc).toEqual(sortedNamesDesc);
        break;
      }

      case 'price-asc': {
        const pricesAsc = await this.getAllProductPrices();
        const sortedPricesAsc = [...pricesAsc].sort((a, b) => a - b);
        expect(pricesAsc).toEqual(sortedPricesAsc);
        break;
      }

      case 'price-desc': {
        const pricesDesc = await this.getAllProductPrices();
        const sortedPricesDesc = [...pricesDesc].sort((a, b) => b - a);
        expect(pricesDesc).toEqual(sortedPricesDesc);
        break;
      }
    }
  }

  /**
   * Click on product name to view detailed product page
   * @param product - Product to view details
   */
  async viewProductDetails(product: ProductData): Promise<void> {
    const productNameLink = this.getProductNameLink(product.id);
    await productNameLink.click();
    await expect(this.page).toHaveURL(/.*inventory-item\.html/);
  }
}
