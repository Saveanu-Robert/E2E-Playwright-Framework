import { expect, type Locator, type Page } from '@playwright/test';

import type { ProductData } from '@data/testdata/saucedemo.products';

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
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
  }

  /**
   * Validate successful navigation to inventory page
   * Ensures page URL, title, and main container are loaded correctly
   */
  async validateInventoryPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryContainer).toBeVisible();
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
