# 📚 API Reference Documentation

## 📋 Table of Contents

1. [Page Objects API](#page-objects-api)
2. [Fixtures API](#fixtures-api)
3. [Configuration API](#configuration-api)
4. [Utilities API](#utilities-api)
5. [Data Management API](#data-management-api)
6. [Testing API](#testing-api)

---

## 🖥️ Page Objects API

### 📱 Web Page Objects

The framework provides a comprehensive set of page objects for web testing,
following the Page Object Model pattern.

#### **🔑 LoginPage**

````typescript
/**
 * LoginPage - Handles user authentication flows
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.login({ username: 'user', password: 'pass' });
 * ```
 */
class LoginPage {
  constructor(page: Page);

  // Navigation
  navigateToLoginPage(baseUrl: string): Promise<void>;

  // Authentication
  login(credentials: UserCredentials): Promise<void>;
  loginWithValidUser(): Promise<void>;
  loginWithInvalidUser(): Promise<void>;

  // Validation
  validateLoginPageLoad(): Promise<void>;
  validateLoginError(expectedMessage: string): Promise<void>;

  // Form Interactions
  fillUsername(username: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLoginButton(): Promise<void>;

  // Getters
  getUsernameField(): Locator;
  getPasswordField(): Locator;
  getLoginButton(): Locator;
  getErrorMessage(): Locator;
}
````

#### **🛒 InventoryPage**

```typescript
/**
 * InventoryPage - Manages product catalog and shopping functionality
 */
class InventoryPage {
  constructor(page: Page);

  // Navigation & Validation
  validateInventoryPageLoad(): Promise<void>;
  validateProductCount(expectedCount: number): Promise<void>;

  // Product Interactions
  addProductToCart(productName: string): Promise<void>;
  removeProductFromCart(productName: string): Promise<void>;
  getProductPrice(productName: string): Promise<string>;
  getProductByName(productName: string): Locator;

  // Cart Management
  validateCartItemCount(expectedCount: number): Promise<void>;
  getCartItemCount(): Promise<number>;
  navigateToCart(): Promise<void>;

  // Sorting & Filtering
  sortProductsByName(): Promise<void>;
  sortProductsByPrice(): Promise<void>;
  filterProductsByCategory(category: string): Promise<void>;

  // Product Information
  getAllProducts(): Promise<ProductInfo[]>;
  getProductDetails(productName: string): Promise<ProductDetails>;
}
```

#### **🛍️ CartPage**

```typescript
/**
 * CartPage - Shopping cart management functionality
 */
class CartPage {
  constructor(page: Page);

  // Navigation & Validation
  validateCartPageLoad(): Promise<void>;
  validateEmptyCart(): Promise<void>;
  validateCartItems(expectedItems: CartItem[]): Promise<void>;

  // Cart Operations
  removeItemFromCart(productName: string): Promise<void>;
  updateItemQuantity(productName: string, quantity: number): Promise<void>;
  clearCart(): Promise<void>;
  proceedToCheckout(): Promise<void>;

  // Cart Information
  getCartItems(): Promise<CartItem[]>;
  getCartTotal(): Promise<number>;
  getCartItemCount(): Promise<number>;

  // Validation
  validateItemInCart(productName: string): Promise<void>;
  validateCartTotal(expectedTotal: number): Promise<void>;
}
```

#### **💳 CheckoutPage**

```typescript
/**
 * CheckoutPage - Checkout process management
 */
class CheckoutPage {
  constructor(page: Page);

  // Navigation & Validation
  validateCheckoutPageLoad(): Promise<void>;
  validateOrderSummary(expectedItems: CartItem[]): Promise<void>;
  validateOrderComplete(): Promise<void>;

  // Checkout Process
  fillCheckoutInformation(info: CheckoutInfo): Promise<void>;
  completeCheckout(): Promise<void>;
  cancelCheckout(): Promise<void>;

  // Form Management
  fillFirstName(firstName: string): Promise<void>;
  fillLastName(lastName: string): Promise<void>;
  fillPostalCode(postalCode: string): Promise<void>;

  // Order Management
  getOrderNumber(): Promise<string>;
  getOrderTotal(): Promise<number>;
  getOrderItems(): Promise<OrderItem[]>;
}
```

### 🧩 UI Components

```typescript
/**
 * Reusable UI components for common elements
 */
namespace UIComponents {
  /**
   * Header component with navigation and user info
   */
  class HeaderComponent {
    constructor(page: Page);

    // Navigation
    navigateToCart(): Promise<void>;
    navigateToMenu(): Promise<void>;
    logout(): Promise<void>;

    // Information
    getCartItemCount(): Promise<number>;
    getUserInfo(): Promise<UserInfo>;

    // Validation
    validateUserLoggedIn(): Promise<void>;
    validateCartBadge(expectedCount: number): Promise<void>;
  }

  /**
   * Product card component for product listings
   */
  class ProductCardComponent {
    constructor(page: Page, productElement: Locator);

    // Product Information
    getProductName(): Promise<string>;
    getProductPrice(): Promise<number>;
    getProductDescription(): Promise<string>;
    getProductImage(): Promise<string>;

    // Actions
    addToCart(): Promise<void>;
    removeFromCart(): Promise<void>;
    viewDetails(): Promise<void>;

    // Validation
    validateProductInfo(expectedProduct: ProductInfo): Promise<void>;
    validateAddToCartButton(): Promise<void>;
  }
}
```

---

## 🔧 Fixtures API

### 🌐 Web Test Fixtures

````typescript
/**
 * SauceDemo Web Test Fixtures
 * Provides pre-configured page objects and test context
 */
interface SauceDemoFixtures {
  // Page Objects
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;

  // Context
  authenticatedPage: Page; // Pre-authenticated page
  baseUrl: string;         // Environment-specific URL
}

/**
 * Extended test with SauceDemo fixtures
 *
 * @example
 * ```typescript
 * import { test, expect } from '@fixtures/web/saucedemo.fixture';
 *
 * test('should add product to cart', async ({
 *   loginPage,
 *   inventoryPage,
 *   baseUrl
 * }) => {
 *   await loginPage.navigateToLoginPage(baseUrl);
 *   await loginPage.loginWithValidUser();
 *   await inventoryPage.addProductToCart('Sauce Labs Backpack');
 *   await inventoryPage.validateCartItemCount(1);
 * });
 * ```
 */
export const test = base.extend<SauceDemoFixtures>({...});
````

### 🔗 API Test Fixtures

```typescript
/**
 * JSONPlaceholder API Test Fixtures
 * Provides API clients, validation, and performance tracking
 */
interface JsonPlaceholderApiFixtures {
  // API Context
  apiContext: APIRequestContext;
  apiBaseUrl: string;
  authHeaders: Record<string, string>;

  // API Client
  jsonPlaceholderClient: JsonPlaceholderApiClient;

  // Utilities
  schemaValidator: SchemaValidator;
  performanceTracker: PerformanceTracker;
  mockContext: MockContext;
}

/**
 * API Client for JSONPlaceholder service
 */
class JsonPlaceholderApiClient {
  constructor(context: APIRequestContext, baseUrl: string);

  // Posts
  getPosts(): Promise<APIResponse>;
  getPost(id: number): Promise<APIResponse>;
  createPost(data: PostData): Promise<APIResponse>;
  updatePost(id: number, data: PostData): Promise<APIResponse>;
  deletePost(id: number): Promise<APIResponse>;

  // Comments
  getComments(): Promise<APIResponse>;
  getComment(id: number): Promise<APIResponse>;
  getPostComments(postId: number): Promise<APIResponse>;
  createComment(data: CommentData): Promise<APIResponse>;

  // Users
  getUsers(): Promise<APIResponse>;
  getUser(id: number): Promise<APIResponse>;
  getUserPosts(userId: number): Promise<APIResponse>;
  getUserAlbums(userId: number): Promise<APIResponse>;

  // Albums & Photos
  getAlbums(): Promise<APIResponse>;
  getAlbum(id: number): Promise<APIResponse>;
  getAlbumPhotos(albumId: number): Promise<APIResponse>;
  getPhotos(): Promise<APIResponse>;

  // Todos
  getTodos(): Promise<APIResponse>;
  getTodo(id: number): Promise<APIResponse>;
  getUserTodos(userId: number): Promise<APIResponse>;
}

/**
 * Schema Validator for API responses
 */
class SchemaValidator {
  // Validation Methods
  validatePost(data: any): void;
  validateComment(data: any): void;
  validateUser(data: any): void;
  validateAlbum(data: any): void;
  validatePhoto(data: any): void;
  validateTodo(data: any): void;

  // Array Validation
  validatePostsArray(data: any[]): void;
  validateCommentsArray(data: any[]): void;
  validateUsersArray(data: any[]): void;

  // Custom Validation
  validateSchema(data: any, schema: JSONSchema): void;
  validateResponse(response: APIResponse, expectedSchema: JSONSchema): void;
}

/**
 * Performance Tracker for API calls
 */
class PerformanceTracker {
  // Timer Management
  startTimer(name: string): () => void;
  getMetric(name: string): PerformanceMetric;
  getAllMetrics(): Record<string, PerformanceMetric>;

  // Benchmarking
  benchmark(name: string, operation: () => Promise<any>): Promise<any>;
  validatePerformance(name: string, maxTime: number): void;

  // Reporting
  generateReport(): PerformanceReport;
  logMetrics(): void;
}
```

---

## ⚙️ Configuration API

### 🌍 Environment Management

```typescript
/**
 * Environment Configuration Manager
 * Handles environment-specific settings and optimization
 */
class EnvironmentConfigManager {
  // Configuration Access
  getConfig(env?: EnvironmentType): EnvironmentConfig;
  getCurrentEnvironment(): EnvironmentType;
  validateConfig(config: EnvironmentConfig): boolean;

  // System Optimization
  calculateOptimalWorkers(): number;
  calculateOptimalShards(): number;
  getSystemInfo(): SystemInfo;

  // Environment Detection
  detectEnvironment(): EnvironmentType;
  isCI(): boolean;
  isMobile(): boolean;

  // Configuration Override
  overrideConfig(overrides: Partial<EnvironmentConfig>): void;
  resetConfig(): void;
}

/**
 * Environment Configuration Structure
 */
interface EnvironmentConfig {
  web: {
    baseURL: string;
    timeout: number;
    retries: number;
    viewport?: ViewportSize;
  };

  api: {
    baseURL: string;
    timeout: number;
    retries: number;
    headers: Record<string, string>;
  };

  jsonplaceholder: {
    baseURL: string;
    timeout: number;
    retries: number;
    headers: Record<string, string>;
  };

  database: {
    connectionString: string;
    timeout: number;
  };

  features: {
    enableDebugLogs: boolean;
    enableMocking: boolean;
    skipAuthValidation: boolean;
    enableVideoRecording: boolean;
  };

  performance: {
    workers: number;
    maxConcurrency: number;
  };
}

/**
 * Framework Constants
 */
interface FrameworkConstants {
  PERFORMANCE: {
    CPU_UTILIZATION_PERCENTAGE: number;
    MIN_WORKERS: number;
    MAX_WORKERS: number;
    MEMORY_PER_WORKER_GB: number;
    SHARD_RATIO: number;
  };

  TIMEOUTS: {
    DEFAULT_ACTION: number;
    DEFAULT_NAVIGATION: number;
    TEST_TIMEOUT: Record<EnvironmentType, number>;
  };

  RETRIES: Record<EnvironmentType, number>;

  REPORTS: {
    OUTPUT_DIR: string;
    HTML_DIR: string;
    JSON_FILE: string;
    SCREENSHOTS_DIR: string;
    VIDEOS_DIR: string;
  };

  TEST_DIRS: {
    WEB: string;
    API: string;
    E2E: string;
    SMOKE: string;
    INTEGRATION_WEB: string;
    INTEGRATION_API: string;
    FUNCTIONAL: string;
    CONTRACT: string;
    MOCKED: string;
  };
}
```

---

## 🛠️ Utilities API

### 🔧 Test Utilities

```typescript
/**
 * Test Logger for enhanced test reporting
 */
class TestLogger {
  // Logging Methods
  static logTestStart(testName: string, description?: string): void;
  static logTestEnd(testName: string, status: 'passed' | 'failed'): void;
  static logStep(stepNumber: number, description: string): void;
  static logInfo(message: string): void;
  static logWarning(message: string): void;
  static logError(message: string): void;
  static logDebug(message: string): void;

  // Performance Logging
  static logPerformance(operation: string, duration: number): void;
  static logBenchmark(name: string, metrics: PerformanceMetrics): void;

  // Test Context
  static setTestContext(context: TestContext): void;
  static getTestContext(): TestContext;
}

/**
 * Test Data Utilities
 */
class TestDataUtils {
  // Data Generation
  static generateRandomUser(): UserData;
  static generateRandomProduct(): ProductData;
  static generateRandomOrder(): OrderData;

  // Data Validation
  static validateEmailFormat(email: string): boolean;
  static validatePhoneNumber(phone: string): boolean;
  static validateCreditCard(cardNumber: string): boolean;

  // Data Transformation
  static formatCurrency(amount: number): string;
  static formatDate(date: Date, format: string): string;
  static sanitizeString(input: string): string;

  // Test Data Loading
  static loadTestData<T>(filename: string): T;
  static loadUserData(): UserData[];
  static loadProductData(): ProductData[];
}

/**
 * Browser Utilities
 */
class BrowserUtils {
  // Browser Information
  static getBrowserInfo(browserName: string): BrowserInfo;
  static isMobileBrowser(browserName: string): boolean;
  static supportedBrowsers(): string[];

  // Screenshot Utilities
  static takeElementScreenshot(
    element: Locator,
    filename?: string,
  ): Promise<void>;
  static takeFullPageScreenshot(page: Page, filename?: string): Promise<void>;
  static compareScreenshots(actual: string, expected: string): Promise<boolean>;

  // Browser Manipulation
  static setViewport(page: Page, size: ViewportSize): Promise<void>;
  static clearBrowserData(page: Page): Promise<void>;
  static setGeolocation(page: Page, location: GeolocationData): Promise<void>;
}
```

### 📊 Reporting Utilities

```typescript
/**
 * Test Reporting and Analytics
 */
class TestReporter {
  // Report Generation
  static generateHTMLReport(results: TestResults): string;
  static generateJSONReport(results: TestResults): object;
  static generateJUnitReport(results: TestResults): string;

  // Metrics Collection
  static collectTestMetrics(): TestMetrics;
  static collectPerformanceMetrics(): PerformanceMetrics;
  static collectCoverageMetrics(): CoverageMetrics;

  // Report Publishing
  static publishToCI(report: TestReport): Promise<void>;
  static saveToFile(report: string, filename: string): Promise<void>;
  static uploadToCloud(report: TestReport): Promise<void>;
}
```

---

## 📊 Data Management API

### 🗃️ Test Data Management

```typescript
/**
 * Test Data Constants
 */
namespace TestData {
  // User Data
  export const USERS = {
    STANDARD_USER: {
      username: 'standard_user',
      password: 'secret_sauce',
    },
    LOCKED_OUT_USER: {
      username: 'locked_out_user',
      password: 'secret_sauce',
    },
    PROBLEM_USER: {
      username: 'problem_user',
      password: 'secret_sauce',
    },
    PERFORMANCE_GLITCH_USER: {
      username: 'performance_glitch_user',
      password: 'secret_sauce',
    },
  };

  // Product Data
  export const PRODUCTS = {
    BACKPACK: {
      name: 'Sauce Labs Backpack',
      price: 29.99,
      description: 'carry.allTheThings()',
    },
    BIKE_LIGHT: {
      name: 'Sauce Labs Bike Light',
      price: 9.99,
      description: 'A red light',
    },
    BOLT_TSHIRT: {
      name: 'Sauce Labs Bolt T-Shirt',
      price: 15.99,
      description: 'Get your testing superhero',
    },
  };

  // API Data
  export const API_DATA = {
    VALID_IDS: {
      POST: 1,
      USER: 1,
      COMMENT: 1,
      ALBUM: 1,
      PHOTO: 1,
      TODO: 1,
    },
    INVALID_IDS: {
      NON_EXISTENT: 99999,
      NEGATIVE: -1,
      ZERO: 0,
    },
  };
}

/**
 * Mock Data Factory
 */
class MockDataFactory {
  // User Data
  static createUser(overrides?: Partial<UserData>): UserData;
  static createUsers(count: number): UserData[];

  // Product Data
  static createProduct(overrides?: Partial<ProductData>): ProductData;
  static createProducts(count: number): ProductData[];

  // Order Data
  static createOrder(overrides?: Partial<OrderData>): OrderData;
  static createOrders(count: number): OrderData[];

  // API Data
  static createPost(overrides?: Partial<PostData>): PostData;
  static createComment(overrides?: Partial<CommentData>): CommentData;
  static createAlbum(overrides?: Partial<AlbumData>): AlbumData;
}
```

---

## 🧪 Testing API

### 🎯 Custom Test Functions

```typescript
/**
 * Enhanced test functions with additional capabilities
 */
namespace CustomTest {
  /**
   * Retry test with custom retry logic
   */
  export function retryTest(
    testName: string,
    testFn: () => Promise<void>,
    options?: RetryOptions,
  ): void;

  /**
   * Performance test with benchmarking
   */
  export function performanceTest(
    testName: string,
    testFn: () => Promise<void>,
    benchmarks: PerformanceBenchmarks,
  ): void;

  /**
   * Visual regression test
   */
  export function visualTest(
    testName: string,
    testFn: (page: Page) => Promise<void>,
    options?: VisualTestOptions,
  ): void;

  /**
   * Accessibility test
   */
  export function a11yTest(
    testName: string,
    testFn: (page: Page) => Promise<void>,
    options?: A11yTestOptions,
  ): void;

  /**
   * Cross-browser test
   */
  export function crossBrowserTest(
    testName: string,
    testFn: (page: Page, browserName: string) => Promise<void>,
    browsers?: string[],
  ): void;
}

/**
 * Test Validation Utilities
 */
namespace TestValidation {
  /**
   * Enhanced expect functions
   */
  export function expectVisible(locator: Locator): Promise<void>;
  export function expectHidden(locator: Locator): Promise<void>;
  export function expectText(locator: Locator, text: string): Promise<void>;
  export function expectCount(locator: Locator, count: number): Promise<void>;

  /**
   * API Response Validation
   */
  export function expectSuccessResponse(response: APIResponse): Promise<void>;
  export function expectErrorResponse(
    response: APIResponse,
    statusCode: number,
  ): Promise<void>;
  export function expectSchema(data: any, schema: JSONSchema): void;

  /**
   * Performance Validation
   */
  export function expectPerformance(duration: number, maxTime: number): void;
  export function expectMemoryUsage(usage: number, maxUsage: number): void;
}
```

---

## 📝 Usage Examples

### 🌐 Complete Web Test Example

```typescript
import { test, expect } from '@fixtures/web/saucedemo.fixture';
import { SAUCEDEMO_USERS, SAUCEDEMO_PRODUCTS } from '@data/testdata/saucedemo';

test.describe('E2E Shopping Journey', () => {
  test('should complete full shopping journey', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    baseUrl,
  }) => {
    // Login
    await loginPage.navigateToLoginPage(baseUrl);
    await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);

    // Add products to cart
    await inventoryPage.validateInventoryPageLoad();
    await inventoryPage.addProductToCart(SAUCEDEMO_PRODUCTS.BACKPACK.name);
    await inventoryPage.addProductToCart(SAUCEDEMO_PRODUCTS.BIKE_LIGHT.name);

    // Validate cart
    await inventoryPage.validateCartItemCount(2);
    await inventoryPage.navigateToCart();

    // Checkout
    await cartPage.validateCartPageLoad();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInformation({
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345',
    });

    await checkoutPage.completeCheckout();
    await checkoutPage.validateOrderComplete();
  });
});
```

### 🔗 Complete API Test Example

```typescript
import { apiTest, expect } from '@fixtures/api/jsonplaceholder.fixture';
import { JSONPLACEHOLDER_API } from '@utils/constants/jsonplaceholder.constants';

apiTest.describe('JSONPlaceholder API Integration', () => {
  apiTest(
    'should validate complete user content workflow',
    async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
      const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

      // Performance tracking
      const timer = performanceTracker.startTimer('user_content_workflow');

      // Get user data
      const userResponse = await jsonPlaceholderClient.getUser(userId);
      expect(userResponse.status()).toBe(200);

      const user = await userResponse.json();
      schemaValidator.validateUser(user);

      // Get user posts
      const postsResponse = await jsonPlaceholderClient.getUserPosts(userId);
      expect(postsResponse.status()).toBe(200);

      const posts = await postsResponse.json();
      schemaValidator.validatePostsArray(posts);

      // Get post comments
      if (posts.length > 0) {
        const commentsResponse = await jsonPlaceholderClient.getPostComments(
          posts[0].id,
        );
        expect(commentsResponse.status()).toBe(200);

        const comments = await commentsResponse.json();
        schemaValidator.validateCommentsArray(comments);
      }

      timer();

      // Validate performance
      const metrics = performanceTracker.getMetric('user_content_workflow');
      expect(metrics.duration).toBeLessThan(5000); // 5 seconds max
    },
  );
});
```

This comprehensive API documentation covers all major components and provides
detailed examples for effective framework usage.
