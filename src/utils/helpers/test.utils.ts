/**
 * Test Utilities for SauceDemo Testing
 * Common helper functions and utilities for test execution
 */

import { Page, expect } from '@playwright/test';

/**
 * Test logging utilities with timestamps and context
 */
export class TestLogger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static logTestStart(testName: string, description: string): void {
    console.log(`\n🚀 [${this.getTimestamp()}] Starting Test: ${testName}`);
    console.log(`📝 Description: ${description}`);
    console.log('─'.repeat(80));
  }

  static logTestEnd(testName: string, success: boolean): void {
    const status = success ? '✅ PASSED' : '❌ FAILED';
    console.log('─'.repeat(80));
    console.log(`🏁 [${this.getTimestamp()}] Test Completed: ${testName} - ${status}\n`);
  }

  static logStep(stepNumber: number, description: string): void {
    console.log(`📋 Step ${stepNumber}: ${description}`);
  }

  static logAction(action: string, element?: string): void {
    const elementInfo = element ? ` on "${element}"` : '';
    console.log(`🎯 Action: ${action}${elementInfo}`);
  }

  static logValidation(validation: string, result: boolean): void {
    const status = result ? '✅' : '❌';
    console.log(`🔍 Validation: ${validation} - ${status}`);
  }

  static logError(error: string, details?: string): void {
    console.error(`❌ Error: ${error}`);
    if (details) {
      console.error(`📋 Details: ${details}`);
    }
  }

  static logWarning(warning: string): void {
    console.warn(`⚠️ Warning: ${warning}`);
  }

  static logInfo(info: string): void {
    console.log(`ℹ️ Info: ${info}`);
  }
}

/**
 * Page utilities for common operations
 */
export class PageUtils {
  /**
   * Wait for page to be fully loaded
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    TestLogger.logAction('Waiting for page to load completely');
    
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    TestLogger.logValidation('Page loaded completely', true);
  }

  /**
   * Take screenshot with timestamp
   * @param page - Playwright page object
   * @param name - Screenshot name
   * @param fullPage - Whether to take full page screenshot
   */
  static async takeScreenshot(
    page: Page, 
    name: string, 
    fullPage: boolean = false
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    
    TestLogger.logAction(`Taking screenshot: ${filename}`);
    
    await page.screenshot({
      path: `./reports/screenshots/${filename}`,
      fullPage,
      type: 'png'
    });
    
    TestLogger.logInfo(`Screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Scroll element into view
   * @param page - Playwright page object
   * @param selector - Element selector
   */
  static async scrollIntoView(page: Page, selector: string): Promise<void> {
    TestLogger.logAction(`Scrolling element into view: ${selector}`);
    
    await page.locator(selector).scrollIntoViewIfNeeded();
    
    TestLogger.logValidation('Element scrolled into view', true);
  }

  /**
   * Wait for element to be stable (not moving)
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   */
  static async waitForElementStable(
    page: Page, 
    selector: string, 
    timeout: number = 5000
  ): Promise<void> {
    TestLogger.logAction(`Waiting for element to be stable: ${selector}`);
    
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    
    // Wait for element to stop moving
    let previousBox = await element.boundingBox();
    await page.waitForTimeout(100);
    let currentBox = await element.boundingBox();
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (previousBox && currentBox &&
          previousBox.x === currentBox.x &&
          previousBox.y === currentBox.y &&
          previousBox.width === currentBox.width &&
          previousBox.height === currentBox.height) {
        break;
      }
      
      await page.waitForTimeout(100);
      previousBox = currentBox;
      currentBox = await element.boundingBox();
    }
    
    TestLogger.logValidation('Element is stable', true);
  }

  /**
   * Highlight element for debugging
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param color - Highlight color
   */
  static async highlightElement(
    page: Page, 
    selector: string, 
    color: string = 'red'
  ): Promise<void> {
    TestLogger.logAction(`Highlighting element: ${selector}`);
    
    await page.locator(selector).evaluate((element, color) => {
      element.style.border = `3px solid ${color}`;
      element.style.backgroundColor = `${color}20`;
    }, color);
    
    await page.waitForTimeout(1000);
  }
}

/**
 * Data utilities for test data manipulation
 */
export class DataUtils {
  /**
   * Generate random string
   * @param length - String length
   * @param includeNumbers - Include numbers in string
   */
  static generateRandomString(length: number = 8, includeNumbers: boolean = true): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const chars = includeNumbers ? letters + numbers : letters;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    TestLogger.logInfo(`Generated random string: ${result}`);
    return result;
  }

  /**
   * Generate random email
   * @param domain - Email domain
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const username = this.generateRandomString(8, true).toLowerCase();
    const email = `${username}@${domain}`;
    
    TestLogger.logInfo(`Generated random email: ${email}`);
    return email;
  }

  /**
   * Generate random number within range
   * @param min - Minimum value
   * @param max - Maximum value
   */
  static generateRandomNumber(min: number = 1, max: number = 100): number {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    
    TestLogger.logInfo(`Generated random number: ${number}`);
    return number;
  }

  /**
   * Format currency value
   * @param amount - Numeric amount
   * @param currency - Currency symbol
   */
  static formatCurrency(amount: number, currency: string = '$'): string {
    return `${currency}${amount.toFixed(2)}`;
  }

  /**
   * Parse currency string to number
   * @param currencyString - Currency string (e.g., "$29.99")
   */
  static parseCurrency(currencyString: string): number {
    const number = parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));
    return isNaN(number) ? 0 : number;
  }
}

/**
 * Assertion utilities for enhanced validations
 */
export class AssertionUtils {
  /**
   * Assert element is visible and enabled
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param elementName - Human-readable element name
   */
  static async assertElementReady(
    page: Page, 
    selector: string, 
    elementName: string
  ): Promise<void> {
    TestLogger.logValidation(`Checking if ${elementName} is ready`, false);
    
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
    
    TestLogger.logValidation(`${elementName} is ready for interaction`, true);
  }

  /**
   * Assert text content with detailed logging
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param expectedText - Expected text content
   * @param elementName - Human-readable element name
   */
  static async assertTextContent(
    page: Page, 
    selector: string, 
    expectedText: string, 
    elementName: string
  ): Promise<void> {
    TestLogger.logValidation(`Checking ${elementName} text content`, false);
    
    const element = page.locator(selector);
    await expect(element).toHaveText(expectedText);
    
    TestLogger.logValidation(`${elementName} has correct text: "${expectedText}"`, true);
  }

  /**
   * Assert URL pattern with logging
   * @param page - Playwright page object
   * @param urlPattern - Expected URL pattern (regex)
   * @param description - Description of expected page
   */
  static async assertUrlPattern(
    page: Page, 
    urlPattern: RegExp, 
    description: string
  ): Promise<void> {
    TestLogger.logValidation(`Checking navigation to ${description}`, false);
    
    await expect(page).toHaveURL(urlPattern);
    
    TestLogger.logValidation(`Successfully navigated to ${description}`, true);
  }

  /**
   * Assert element count
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param expectedCount - Expected element count
   * @param elementName - Human-readable element name
   */
  static async assertElementCount(
    page: Page, 
    selector: string, 
    expectedCount: number, 
    elementName: string
  ): Promise<void> {
    TestLogger.logValidation(`Checking ${elementName} count`, false);
    
    const elements = page.locator(selector);
    await expect(elements).toHaveCount(expectedCount);
    
    TestLogger.logValidation(`${elementName} count is correct: ${expectedCount}`, true);
  }
}

/**
 * Wait utilities for complex waiting scenarios
 */
export class WaitUtils {
  /**
   * Wait for API response with specific status
   * @param page - Playwright page object
   * @param urlPattern - URL pattern to match
   * @param expectedStatus - Expected HTTP status
   * @param timeout - Maximum wait time
   */
  static async waitForApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    expectedStatus: number = 200,
    timeout: number = 30000
  ): Promise<void> {
    TestLogger.logAction(`Waiting for API response: ${urlPattern}`);
    
    const response = await page.waitForResponse(
      (response) => {
        const url = response.url();
        const status = response.status();
        const matches = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
        
        return matches && status === expectedStatus;
      },
      { timeout }
    );
    
    TestLogger.logValidation(
      `API response received: ${response.url()} - ${response.status()}`, 
      true
    );
  }

  /**
   * Wait for element to have specific attribute value
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param attribute - Attribute name
   * @param value - Expected attribute value
   * @param timeout - Maximum wait time
   */
  static async waitForAttributeValue(
    page: Page,
    selector: string,
    attribute: string,
    value: string,
    timeout: number = 10000
  ): Promise<void> {
    TestLogger.logAction(`Waiting for ${selector} to have ${attribute}="${value}"`);
    
    await page.waitForFunction(
      ({ selector, attribute, value }) => {
        const element = document.querySelector(selector);
        return element && element.getAttribute(attribute) === value;
      },
      { selector, attribute, value },
      { timeout }
    );
    
    TestLogger.logValidation(`Element has correct attribute value`, true);
  }
}
