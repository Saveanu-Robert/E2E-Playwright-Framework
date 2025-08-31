import { expect, type Locator, type Page } from '@playwright/test';

import type { ProductData } from '@data/testdata/saucedemo.products';

/**
 * Page Object Model for SauceDemo Shopping Cart Page
 * Manages cart items, quantities, and checkout process
 */
export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartList: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item'); // Use class selector since cart items use inventory-item data-test
  }

  /**
   * Validate cart page load
   */
  async validateCartPageLoad(): Promise<void> {
    console.log('🔍 Validating cart page load');

    await expect(this.page).toHaveURL(/.*cart\.html/);
    await expect(this.pageTitle).toHaveText('Your Cart');

    console.log('✅ Cart page loaded successfully');
  }

  /**
   * Get cart item by product ID
   * @param productId - Product identifier
   */
  private getCartItem(productId: string): Locator {
    // Cart items use the same structure as inventory items
    return this.page.locator(`.cart_item:has([data-test*="${productId}"])`);
  }

  /**
   * Get remove button for cart item
   * @param productId - Product identifier
   */
  private getRemoveButton(productId: string): Locator {
    return this.page.locator(`[data-test="remove-${productId}"]`);
  }

  /**
   * Validate product in cart
   * @param product - Product data to validate
   */
  async validateProductInCart(product: ProductData): Promise<void> {
    console.log(`🔍 Validating product in cart: ${product.name}`);

    const cartItem = this.getCartItem(product.id);
    await expect(cartItem).toBeVisible();

    // Validate product name
    const productName = cartItem.locator('[data-test="inventory-item-name"]');
    await expect(productName).toHaveText(product.name);

    // Validate product description
    const productDesc = cartItem.locator('[data-test="inventory-item-desc"]');
    await expect(productDesc).toBeVisible();

    // Validate product price
    const productPrice = cartItem.locator('[data-test="inventory-item-price"]');
    await expect(productPrice).toHaveText(product.priceDisplay);

    // Validate quantity
    const quantity = cartItem.locator('[data-test="item-quantity"]');
    await expect(quantity).toHaveText('1');

    console.log(`✅ Product validated in cart: ${product.name}`);
  }

  /**
   * Remove product from cart
   * @param product - Product to remove
   */
  async removeProductFromCart(product: ProductData): Promise<void> {
    console.log(`🗑️ Removing product from cart: ${product.name}`);

    const removeButton = this.getRemoveButton(product.id);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Validate product is removed
    const cartItem = this.getCartItem(product.id);
    await expect(cartItem).not.toBeVisible();

    console.log(`✅ Product removed from cart: ${product.name}`);
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const count = await this.cartItems.count();
    console.log(`ℹ️ Cart contains ${count} items`);
    return count;
  }

  /**
   * Validate cart is empty
   */
  async validateEmptyCart(): Promise<void> {
    console.log('🔍 Validating cart is empty');

    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(0);

    console.log('✅ Cart is empty');
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    console.log('🛍️ Continuing shopping');

    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/.*inventory\.html/);

    console.log('✅ Returned to inventory page');
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    console.log('💳 Proceeding to checkout');

    // Wait for checkout button to be ready and stable
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.checkoutButton.waitFor({ state: 'attached', timeout: 10000 });

    // Add small delay for mobile devices to ensure DOM is stable
    await this.page.waitForTimeout(100);

    // Use force click for mobile devices to avoid interaction issues
    await this.checkoutButton.click({ force: true, timeout: 30000 });
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);

    console.log('✅ Navigated to checkout information page');
  }

  /**
   * Calculate total cart value
   * @returns Total price of all items in cart
   */
  async calculateTotalValue(): Promise<number> {
    console.log('💰 Calculating total cart value');

    const priceElements = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    const prices = priceElements.map(price => parseFloat(price.replace('$', '')));
    const total = prices.reduce((sum, price) => sum + price, 0);

    console.log(`ℹ️ Individual prices: [${prices.map(p => `$${p.toFixed(2)}`).join(', ')}]`);
    console.log(`ℹ️ Total cart value: $${total.toFixed(2)}`);
    return total;
  }

  /**
   * Validate total cart value against expected product data
   * @param expectedProducts - Array of products expected in cart
   * @returns True if totals match within acceptable tolerance
   */
  async validateTotalAgainstData(expectedProducts: ProductData[]): Promise<boolean> {
    console.log('🔍 Validating cart total against expected product data');

    const actualTotal = await this.calculateTotalValue();
    const expectedTotal = expectedProducts.reduce((sum, product) => sum + product.price, 0);
    const tolerance = 0.01; // Allow 1 cent tolerance for floating point precision

    const isValid = Math.abs(actualTotal - expectedTotal) <= tolerance;

    console.log(`ℹ️ Expected total: $${expectedTotal.toFixed(2)}`);
    console.log(`ℹ️ Actual total: $${actualTotal.toFixed(2)}`);
    console.log(`ℹ️ Difference: $${Math.abs(actualTotal - expectedTotal).toFixed(2)}`);
    console.log(`${isValid ? '✅' : '❌'} Total validation: ${isValid ? 'PASSED' : 'FAILED'}`);

    return isValid;
  }

  /**
   * Validate specific cart contents
   * @param expectedProducts - Array of products expected in cart
   */
  async validateCartContents(expectedProducts: ProductData[]): Promise<void> {
    console.log(`🔍 Validating cart contains ${expectedProducts.length} products`);

    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(expectedProducts.length);

    for (const product of expectedProducts) {
      await this.validateProductInCart(product);
    }

    console.log('✅ Cart contents validated successfully');
  }
}
