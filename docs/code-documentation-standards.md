# 📝 Code Documentation Standards

## 🎯 Overview

This document outlines the code documentation standards for the E2E Playwright
Framework. These standards ensure consistency, maintainability, and
professionalism across all framework components.

## 📋 Table of Contents

1. [File Headers](#file-headers)
2. [Class Documentation](#class-documentation)
3. [Method Documentation](#method-documentation)
4. [Interface Documentation](#interface-documentation)
5. [Type Documentation](#type-documentation)
6. [Configuration Documentation](#configuration-documentation)
7. [Test Documentation](#test-documentation)
8. [Examples](#examples)

---

## 📄 File Headers

### **Standard File Header Template**

````typescript
/**
 * @fileoverview [Brief description of file purpose]
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * [Detailed description of the file's purpose, main functionality, and how it fits
 * into the overall framework architecture. Include any important notes about usage,
 * dependencies, or limitations.]
 *
 * @example
 * ```typescript
 * // Basic usage example
 * import { ClassName } from './path/to/file';
 * const instance = new ClassName();
 * ```
 *
 * @see {@link RelatedClass} - Related functionality
 * @see {@link ../README.md} - Framework documentation
 */
````

### **Page Object File Header**

````typescript
/**
 * @fileoverview [PageName]Page - Page Object Model implementation for [Page Description]
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This page object provides comprehensive interaction methods for the [Page Name] page
 * of the SauceDemo application. It follows the Page Object Model pattern to encapsulate
 * UI elements and user interactions, providing a clean API for test automation.
 *
 * Key Features:
 * - Element locators with robust selectors
 * - User interaction methods (click, type, select, etc.)
 * - Validation methods for page state and content
 * - Navigation methods for page transitions
 * - Error handling and retry logic
 *
 * @example
 * ```typescript
 * import { LoginPage } from '@pages/web/LoginPage';
 *
 * test('login functionality', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.login({ username: 'user', password: 'pass' });
 *   await loginPage.validateSuccessfulLogin();
 * });
 * ```
 *
 * @see {@link InventoryPage} - Next page in user flow
 * @see {@link ../fixtures/web/saucedemo.fixture.ts} - Test fixtures
 * @see {@link ../../docs/guides/page-objects.md} - Page Object guidelines
 */
````

### **Fixture File Header**

````typescript
/**
 * @fileoverview [ServiceName] Test Fixtures - Pre-configured test context and page objects
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This fixture file provides pre-configured test context, page objects, and utilities
 * specifically for [Service Name] testing. It extends Playwright's base test with
 * domain-specific functionality and provides a consistent testing interface.
 *
 * Provided Fixtures:
 * - Pre-initialized page objects
 * - Environment-specific configuration
 * - Authentication context
 * - Test data and utilities
 * - Performance tracking
 *
 * @example
 * ```typescript
 * import { test, expect } from '@fixtures/web/saucedemo.fixture';
 *
 * test('user journey test', async ({
 *   loginPage,
 *   inventoryPage,
 *   baseUrl
 * }) => {
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.loginWithValidUser();
 *   await inventoryPage.validateInventoryPageLoad();
 * });
 * ```
 *
 * @see {@link ../../pages/web/} - Page objects used by this fixture
 * @see {@link ../../config/environment.ts} - Environment configuration
 */
````

---

## 🏗️ Class Documentation

### **Page Object Class Template**

````typescript
/**
 * [ClassName] - [Brief class description]
 *
 * @description
 * [Detailed description of the class purpose, functionality, and design patterns used.
 * Include information about the page/component it represents, key features, and how it
 * fits into the testing framework.]
 *
 * @example
 * ```typescript
 * const page = new LoginPage(page);
 * await page.login({ username: 'user', password: 'pass' });
 * await page.validateSuccessfulLogin();
 * ```
 *
 * @public
 * @class
 * @implements {IPageObject} - If implementing interface
 * @extends {BasePage} - If extending base class
 */
export class LoginPage {
  // Class implementation
}
````

### **Utility Class Template**

````typescript
/**
 * [UtilityName] - [Brief utility description]
 *
 * @description
 * [Detailed description of utility functionality, use cases, and any important
 * considerations for usage. Include information about static vs instance methods,
 * performance implications, and best practices.]
 *
 * @example
 * ```typescript
 * const result = TestUtils.generateRandomUser();
 * const isValid = TestUtils.validateEmailFormat(email);
 * ```
 *
 * @public
 * @static - If all methods are static
 * @class
 */
export class TestUtils {
  // Utility implementation
}
````

---

## 📋 Method Documentation

### **Standard Method Template**

````typescript
/**
 * [Method description - what it does and when to use it]
 *
 * @description
 * [Detailed description of method functionality, behavior, and any side effects.
 * Include information about validation, error handling, and performance considerations.]
 *
 * @param {Type} paramName - [Parameter description]
 * @param {Type} [optionalParam] - [Optional parameter description]
 * @param {Object} options - [Options object description]
 * @param {string} options.property - [Specific property description]
 *
 * @returns {Promise<ReturnType>} [Description of return value and when it resolves]
 *
 * @throws {Error} [Description of when and why errors are thrown]
 *
 * @example
 * ```typescript
 * await loginPage.login({
 *   username: 'standard_user',
 *   password: 'secret_sauce'
 * });
 * ```
 *
 * @since 1.0.0
 * @public
 * @async
 */
async login(credentials: UserCredentials): Promise<void> {
  // Method implementation
}
````

### **Validation Method Template**

````typescript
/**
 * Validates [what is being validated] and ensures [expected state]
 *
 * @description
 * This validation method checks [specific conditions] and throws descriptive
 * errors if validation fails. It provides detailed feedback for test debugging
 * and ensures reliable test assertions.
 *
 * @param {Type} [expectedValue] - [Expected value for comparison]
 * @param {Object} [options] - [Validation options]
 * @param {number} [options.timeout=5000] - Maximum wait time for validation
 * @param {boolean} [options.soft=false] - Whether to use soft assertions
 *
 * @returns {Promise<void>} Resolves when validation passes
 *
 * @throws {ValidationError} When validation fails with detailed error message
 * @throws {TimeoutError} When validation times out
 *
 * @example
 * ```typescript
 * await inventoryPage.validateCartItemCount(3);
 * await cartPage.validateCartTotal(45.97);
 * ```
 *
 * @since 1.0.0
 * @public
 * @async
 */
async validateCartItemCount(expectedCount: number): Promise<void> {
  // Validation implementation
}
````

### **Navigation Method Template**

````typescript
/**
 * Navigates to [destination] and waits for page to load completely
 *
 * @description
 * Performs navigation to [specific page/section] with comprehensive loading
 * validation. Includes retry logic for network failures and ensures page
 * is in a stable state before proceeding.
 *
 * @param {string} url - Base URL for navigation
 * @param {Object} [options] - Navigation options
 * @param {number} [options.timeout=30000] - Navigation timeout in milliseconds
 * @param {boolean} [options.waitForLoad=true] - Whether to wait for load events
 *
 * @returns {Promise<void>} Resolves when navigation is complete and page is ready
 *
 * @throws {NavigationError} When navigation fails or times out
 * @throws {ValidationError} When page load validation fails
 *
 * @example
 * ```typescript
 * await loginPage.navigateToLoginPage('https://saucedemo.com');
 * await loginPage.navigateToLoginPage(baseUrl, { timeout: 10000 });
 * ```
 *
 * @since 1.0.0
 * @public
 * @async
 */
async navigateToLoginPage(url: string, options?: NavigationOptions): Promise<void> {
  // Navigation implementation
}
````

---

## 🔧 Interface Documentation

### **Interface Template**

````typescript
/**
 * [InterfaceName] - [Brief interface description]
 *
 * @description
 * [Detailed description of the interface purpose, when to implement it,
 * and what functionality it defines. Include information about required
 * vs optional properties and methods.]
 *
 * @example
 * ```typescript
 * class MyPage implements IPageObject {
 *   async navigate(): Promise<void> { ... }
 *   async validate(): Promise<void> { ... }
 * }
 * ```
 *
 * @public
 * @interface
 * @since 1.0.0
 */
export interface UserCredentials {
  /**
   * User's login username
   * @type {string}
   * @description Must be a valid username from the test data
   */
  username: string;

  /**
   * User's login password
   * @type {string}
   * @description Must match the corresponding password for the username
   */
  password: string;

  /**
   * Optional display name for the user
   * @type {string}
   * @optional
   * @description Used for display purposes in test reports
   */
  displayName?: string;
}
````

---

## 🎛️ Configuration Documentation

### **Configuration Object Template**

````typescript
/**
 * [ConfigName] Configuration
 *
 * @description
 * [Detailed description of configuration purpose, structure, and usage.
 * Include information about environment-specific values, validation rules,
 * and impact on framework behavior.]
 *
 * @example
 * ```typescript
 * const config = getEnvironmentConfig('development');
 * const baseUrl = config.web.baseURL;
 * ```
 *
 * @public
 * @readonly
 * @since 1.0.0
 */
export const ENVIRONMENT_CONFIG = {
  /**
   * Web application configuration
   * @type {Object}
   * @description Settings for web UI testing
   */
  web: {
    /**
     * Base URL for the web application
     * @type {string}
     * @description Environment-specific URL without trailing slash
     */
    baseURL: string;

    /**
     * Default timeout for web operations
     * @type {number}
     * @description Timeout in milliseconds for page actions
     * @default 30000
     */
    timeout: number;
  }
} as const;
````

---

## 🧪 Test Documentation

### **Test File Header Template**

````typescript
/**
 * @fileoverview [Test Category] - [Brief test description]
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This test suite covers [test scope and objectives]. It includes [types of tests]
 * and validates [specific functionality or requirements]. Tests are designed to
 * run in [environment context] and support [browser/platform coverage].
 *
 * Test Categories:
 * - [Category 1]: [Description]
 * - [Category 2]: [Description]
 *
 * @example
 * ```bash
 * # Run this test suite
 * npm run test:smoke
 * npm run test:smoke -- --headed
 * ```
 *
 * @see {@link ../../../docs/testing-strategy.md} - Testing strategy
 * @see {@link ../../fixtures/web/saucedemo.fixture.ts} - Test fixtures
 */
````

### **Test Suite Template**

```typescript
/**
 * Test Suite: [Suite Name]
 *
 * @description
 * [Detailed description of what this test suite covers, the user journey
 * or functionality being tested, and the expected outcomes. Include any
 * prerequisites, dependencies, or special considerations.]
 *
 * Test Scenarios:
 * - [Scenario 1]: [Description]
 * - [Scenario 2]: [Description]
 *
 * @requirements
 * - [Requirement 1]: [Description]
 * - [Requirement 2]: [Description]
 */
test.describe('[Test Suite Name]', () => {
  /**
   * Individual Test: [Test Name]
   *
   * @description
   * [Detailed description of what this specific test validates,
   * the steps it performs, and the expected outcome.]
   *
   * @steps
   * 1. [Step 1 description]
   * 2. [Step 2 description]
   * 3. [Step 3 description]
   *
   * @expected
   * - [Expected outcome 1]
   * - [Expected outcome 2]
   *
   * @tags @smoke @regression @login
   */
  test('should [action] when [condition]', async ({
    loginPage,
    inventoryPage,
    baseUrl,
  }) => {
    // Test implementation with clear step comments

    // Step 1: Navigate to login page
    await loginPage.navigateToLoginPage(baseUrl);

    // Step 2: Perform login with valid credentials
    await loginPage.loginWithValidUser();

    // Step 3: Validate successful login and redirect
    await inventoryPage.validateInventoryPageLoad();
  });
});
```

---

## 📝 Documentation Examples

### **Complete Page Object Example**

````typescript
/**
 * @fileoverview LoginPage - Page Object Model implementation for SauceDemo login functionality
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This page object provides comprehensive interaction methods for the SauceDemo login page.
 * It follows the Page Object Model pattern to encapsulate UI elements and user interactions,
 * providing a clean API for test automation.
 *
 * Key Features:
 * - Robust element selectors with fallback strategies
 * - Comprehensive validation methods for login states
 * - Error handling with descriptive messages
 * - Support for different user types and scenarios
 * - Performance tracking for login operations
 *
 * @example
 * ```typescript
 * import { LoginPage } from '@pages/web/LoginPage';
 *
 * test('successful login', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.login({ username: 'standard_user', password: 'secret_sauce' });
 *   await loginPage.validateSuccessfulLogin();
 * });
 * ```
 *
 * @see {@link InventoryPage} - Next page in user flow
 * @see {@link ../fixtures/web/saucedemo.fixture.ts} - Test fixtures
 * @see {@link ../../docs/guides/page-objects.md} - Page Object guidelines
 */

import { Page, Locator } from '@playwright/test';
import { UserCredentials } from '@config/types/environment.types';
import { TestLogger } from '@utils/helpers/test.utils';

/**
 * LoginPage - Handles user authentication flows for SauceDemo application
 *
 * @description
 * This page object encapsulates all interactions with the SauceDemo login page,
 * providing methods for navigation, authentication, validation, and error handling.
 * It supports multiple user types and includes comprehensive error reporting.
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.login({ username: 'user', password: 'pass' });
 * await loginPage.validateSuccessfulLogin();
 * ```
 *
 * @public
 * @class
 * @since 1.0.0
 */
export class LoginPage {
  // Private properties with comprehensive documentation

  /**
   * Playwright Page instance for browser interactions
   * @private
   * @readonly
   */
  private readonly page: Page;

  /**
   * Username input field locator
   * @private
   * @readonly
   * @description Primary selector with data-test fallback
   */
  private readonly usernameField: Locator;

  /**
   * Password input field locator
   * @private
   * @readonly
   * @description Primary selector with data-test fallback
   */
  private readonly passwordField: Locator;

  /**
   * Login button locator
   * @private
   * @readonly
   * @description Primary selector with multiple fallback strategies
   */
  private readonly loginButton: Locator;

  /**
   * Error message container locator
   * @private
   * @readonly
   * @description Used for validation of login errors
   */
  private readonly errorMessage: Locator;

  /**
   * Creates a new LoginPage instance
   *
   * @description
   * Initializes the page object with locators and sets up the page context
   * for login operations. All locators are defined using robust selector
   * strategies with fallbacks for reliability.
   *
   * @param {Page} page - Playwright Page instance
   *
   * @example
   * ```typescript
   * const loginPage = new LoginPage(page);
   * ```
   *
   * @public
   * @constructor
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators with robust selectors
    this.usernameField = page.locator('#user-name, [data-test="username"]');
    this.passwordField = page.locator('#password, [data-test="password"]');
    this.loginButton = page.locator(
      '#login-button, [data-test="login-button"], input[type="submit"]',
    );
    this.errorMessage = page.locator(
      '[data-test="error"], .error-message-container, .error',
    );
  }

  /**
   * Navigates to the login page and waits for complete loading
   *
   * @description
   * Performs navigation to the SauceDemo login page with comprehensive loading
   * validation. Includes retry logic for network failures and ensures the page
   * is in a stable state before proceeding with test actions.
   *
   * @param {string} baseUrl - Base URL for the SauceDemo application
   * @param {Object} [options] - Navigation options
   * @param {number} [options.timeout=30000] - Navigation timeout in milliseconds
   * @param {boolean} [options.waitForLoad=true] - Whether to wait for load events
   *
   * @returns {Promise<void>} Resolves when navigation is complete and page is ready
   *
   * @throws {NavigationError} When navigation fails or times out
   * @throws {ValidationError} When page load validation fails
   *
   * @example
   * ```typescript
   * await loginPage.navigateToLoginPage('https://saucedemo.com');
   * await loginPage.navigateToLoginPage(baseUrl, { timeout: 10000 });
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async navigateToLoginPage(
    baseUrl: string,
    options?: NavigationOptions,
  ): Promise<void> {
    TestLogger.logStep(1, `Navigating to login page: ${baseUrl}`);

    try {
      await this.page.goto(baseUrl, {
        timeout: options?.timeout ?? 30000,
        waitUntil: options?.waitForLoad ? 'networkidle' : 'domcontentloaded',
      });

      // Validate page load
      await this.validateLoginPageLoad();

      TestLogger.logInfo('Successfully navigated to login page');
    } catch (error) {
      TestLogger.logError(`Failed to navigate to login page: ${error.message}`);
      throw new NavigationError(
        `Navigation to login page failed: ${error.message}`,
      );
    }
  }

  /**
   * Performs user login with provided credentials
   *
   * @description
   * Executes the complete login flow including form filling, submission,
   * and initial validation. Supports different user types and provides
   * detailed error reporting for login failures.
   *
   * @param {UserCredentials} credentials - User login credentials
   * @param {string} credentials.username - Valid username from test data
   * @param {string} credentials.password - Corresponding password
   * @param {Object} [options] - Login options
   * @param {boolean} [options.validate=true] - Whether to validate login success
   * @param {number} [options.timeout=10000] - Login operation timeout
   *
   * @returns {Promise<void>} Resolves when login is complete
   *
   * @throws {ValidationError} When credentials are invalid or login fails
   * @throws {TimeoutError} When login operation times out
   *
   * @example
   * ```typescript
   * await loginPage.login({
   *   username: 'standard_user',
   *   password: 'secret_sauce'
   * });
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async login(
    credentials: UserCredentials,
    options?: LoginOptions,
  ): Promise<void> {
    TestLogger.logStep(2, `Logging in with user: ${credentials.username}`);

    try {
      // Fill credentials
      await this.fillUsername(credentials.username);
      await this.fillPassword(credentials.password);

      // Submit login form
      await this.clickLoginButton();

      // Optional validation
      if (options?.validate !== false) {
        await this.validateSuccessfulLogin();
      }

      TestLogger.logInfo(`Successfully logged in as: ${credentials.username}`);
    } catch (error) {
      TestLogger.logError(
        `Login failed for user ${credentials.username}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Validates that the login page has loaded correctly
   *
   * @description
   * Comprehensive validation that ensures the login page is fully loaded
   * and all required elements are present and interactive. Includes checks
   * for form elements, page title, and visual indicators.
   *
   * @param {Object} [options] - Validation options
   * @param {number} [options.timeout=5000] - Maximum wait time for validation
   * @param {boolean} [options.soft=false] - Whether to use soft assertions
   *
   * @returns {Promise<void>} Resolves when validation passes
   *
   * @throws {ValidationError} When page validation fails
   * @throws {TimeoutError} When validation times out
   *
   * @example
   * ```typescript
   * await loginPage.validateLoginPageLoad();
   * await loginPage.validateLoginPageLoad({ timeout: 10000 });
   * ```
   *
   * @public
   * @async
   * @since 1.0.0
   */
  async validateLoginPageLoad(options?: ValidationOptions): Promise<void> {
    TestLogger.logStep(0, 'Validating login page load');

    try {
      const timeout = options?.timeout ?? 5000;

      // Wait for essential elements
      await Promise.all([
        this.usernameField.waitFor({ state: 'visible', timeout }),
        this.passwordField.waitFor({ state: 'visible', timeout }),
        this.loginButton.waitFor({ state: 'visible', timeout }),
      ]);

      // Validate page title
      const title = await this.page.title();
      if (!title.includes('Swag Labs')) {
        throw new ValidationError(`Invalid page title: ${title}`);
      }

      // Validate form is interactive
      await this.validateFormInteractivity();

      TestLogger.logInfo('Login page validation successful');
    } catch (error) {
      TestLogger.logError(`Login page validation failed: ${error.message}`);
      throw new ValidationError(
        `Login page validation failed: ${error.message}`,
      );
    }
  }

  // Additional private helper methods with documentation...

  /**
   * Validates that form elements are interactive and ready for input
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async validateFormInteractivity(): Promise<void> {
    // Implementation details...
  }
}

// Type definitions with comprehensive documentation
interface NavigationOptions {
  timeout?: number;
  waitForLoad?: boolean;
}

interface LoginOptions {
  validate?: boolean;
  timeout?: number;
}

interface ValidationOptions {
  timeout?: number;
  soft?: boolean;
}
````

This comprehensive documentation standard ensures that all framework code is
professional, maintainable, and easy to understand for both current and future
team members.

---

## 📊 Documentation Checklist

### **Before Committing Code**

- [ ] File header with complete metadata
- [ ] Class/interface documentation with examples
- [ ] All public methods documented with JSDoc
- [ ] Parameter types and descriptions provided
- [ ] Return values clearly documented
- [ ] Error conditions and exceptions documented
- [ ] Usage examples provided where appropriate
- [ ] Related documentation linked
- [ ] Type definitions documented
- [ ] Private methods have brief documentation

### **Review Standards**

- [ ] Documentation follows consistent formatting
- [ ] Examples are accurate and executable
- [ ] Technical terminology is used correctly
- [ ] Documentation matches actual implementation
- [ ] Grammar and spelling are correct
- [ ] Cross-references are valid and helpful
