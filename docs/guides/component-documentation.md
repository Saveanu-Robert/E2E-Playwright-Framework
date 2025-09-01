# 📚 Component Documentation Guide

## 🎯 Overview

This guide provides detailed documentation for each major component of the E2E
Playwright Framework. It serves as a comprehensive reference for understanding
framework architecture, usage patterns, and best practices.

## 📋 Table of Contents

1. [Page Objects](#page-objects)
2. [Test Fixtures](#test-fixtures)
3. [Configuration System](#configuration-system)
4. [Test Data Management](#test-data-management)
5. [Utilities and Helpers](#utilities-and-helpers)
6. [API Testing Components](#api-testing-components)
7. [Performance Optimization](#performance-optimization)

---

## 🖥️ Page Objects

### **Architecture Pattern**

The framework implements the **Page Object Model (POM)** pattern to encapsulate
web page interactions and provide a clean API for test automation.

#### **Design Principles**

```typescript
// ✅ Good: Clear separation of concerns
class LoginPage {
  // Locators are private and encapsulated
  private readonly usernameInput: Locator;

  // Public methods provide clear API
  async login(credentials: UserCredentials): Promise<void> {
    // Implementation details are hidden
  }
}

// ❌ Bad: Exposing implementation details
class BadLoginPage {
  // Public locators expose implementation
  public usernameInput: Locator;

  // No clear API structure
  async fillUsername(username: string): Promise<void> {}
  async fillPassword(password: string): Promise<void> {}
  async clickSubmit(): Promise<void> {}
}
```

#### **Key Components**

| Component         | Purpose                    | Example                              |
| ----------------- | -------------------------- | ------------------------------------ |
| **LoginPage**     | Authentication flows       | User login, error validation         |
| **InventoryPage** | Product catalog management | Add to cart, sorting, filtering      |
| **CartPage**      | Shopping cart operations   | Item management, checkout navigation |
| **CheckoutPage**  | Purchase completion        | Form filling, order processing       |

#### **Usage Patterns**

```typescript
// Standard usage with fixtures
test('user journey', async ({ loginPage, inventoryPage, baseUrl }) => {
  await loginPage.navigateToLoginPage(baseUrl);
  await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
  await inventoryPage.validateInventoryPageLoad();
  await inventoryPage.addProductToCart(SAUCEDEMO_PRODUCTS.BACKPACK);
});

// Manual instantiation for custom scenarios
test('custom scenario', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const customConfig = { timeout: 5000 };
  await loginPage.navigateToLoginPage(baseUrl, customConfig);
});
```

---

## 🔧 Test Fixtures

### **Fixture Architecture**

Test fixtures provide pre-configured page objects and test context to streamline
test development and ensure consistency.

#### **SauceDemo Web Fixtures**

```typescript
interface SauceDemoFixtures {
  loginPage: LoginPage; // Pre-configured login functionality
  inventoryPage: InventoryPage; // Product catalog operations
  cartPage: CartPage; // Shopping cart management
  checkoutPage: CheckoutPage; // Checkout process handling
  authenticatedPage: Page; // Pre-authenticated page context
  baseUrl: string; // Environment-specific URL
}
```

#### **API Test Fixtures**

```typescript
interface JsonPlaceholderApiFixtures {
  apiContext: APIRequestContext; // HTTP client context
  jsonPlaceholderClient: ApiClient; // Pre-configured API client
  schemaValidator: SchemaValidator; // Response validation
  performanceTracker: PerformanceTracker; // Performance monitoring
}
```

#### **Fixture Benefits**

| Benefit         | Description                          | Example                        |
| --------------- | ------------------------------------ | ------------------------------ |
| **Consistency** | Standardized setup across tests      | Same page object configuration |
| **Reusability** | Shared components reduce duplication | Common validation methods      |
| **Maintenance** | Centralized configuration management | Single point for URL changes   |
| **Performance** | Optimized resource usage             | Shared browser contexts        |

#### **Advanced Usage**

```typescript
// Conditional fixture usage
test('responsive test', async ({ loginPage, page }) => {
  // Configure for mobile testing
  await page.setViewportSize({ width: 375, height: 667 });
  await loginPage.navigateToLoginPage(baseUrl);
});

// Fixture composition
test('complex scenario', async ({
  authenticatedPage,
  inventoryPage,
  cartPage,
  performanceTracker,
}) => {
  const timer = performanceTracker.startTimer('full-journey');

  await inventoryPage.addProductToCart(product);
  await cartPage.proceedToCheckout();

  timer();
});
```

---

## ⚙️ Configuration System

### **Environment Management**

The framework provides sophisticated environment management with dynamic
optimization and validation.

#### **Configuration Structure**

```typescript
interface EnvironmentConfig {
  web: {
    baseURL: string; // Application URL
    timeout: number; // Default timeouts
    retries: number; // Retry attempts
    viewport?: ViewportSize; // Browser viewport
  };
  api: {
    baseURL: string; // API endpoint
    timeout: number; // Request timeout
    headers: Headers; // Default headers
  };
  features: {
    enableDebugLogs: boolean; // Debug logging
    enableMocking: boolean; // Mock responses
    enableVideoRecording: boolean; // Test recordings
  };
  performance: {
    workers: number; // Parallel workers
    maxConcurrency: number; // Concurrent tests
  };
}
```

#### **Dynamic Optimization**

```typescript
// Automatic worker calculation based on system resources
const optimalWorkers = EnvironmentConfigManager.calculateOptimalWorkers();
// Result: CPU cores * utilization % with memory constraints

// System information for debugging
const systemInfo = EnvironmentConfigManager.getSystemInfo();
console.log('System specs:', systemInfo);
```

#### **Environment Detection**

```typescript
// Automatic environment detection
const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();

// Environment-specific configuration
const config = getEnvironmentConfig(currentEnv);

// Environment validation
const isValid = EnvironmentConfigManager.validateConfig(config);
```

#### **Configuration Override**

```typescript
// Runtime configuration override
test.use({
  baseURL: 'https://custom-environment.com',
  viewport: { width: 1920, height: 1080 },
});

// Test-specific configuration
test('custom config test', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    Authorization: 'Bearer custom-token',
  });
});
```

---

## 📊 Test Data Management

### **Data Architecture**

The framework provides structured test data management with type safety and
validation.

#### **User Data Structure**

```typescript
interface UserCredentials {
  username: string; // Login username
  password: string; // User password
  displayName?: string; // Optional display name
  userType: UserType; // User classification
}

// Predefined test users
export const SAUCEDEMO_USERS = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
    userType: 'standard',
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    userType: 'locked',
  },
} as const;
```

#### **Product Data Structure**

```typescript
interface ProductData {
  id: string; // Unique identifier
  name: string; // Display name
  price: number; // Numeric price
  priceDisplay: string; // Formatted price
  description: string; // Product description
  imageUrl: string; // Product image
}

// Product catalog
export const SAUCEDEMO_PRODUCTS = {
  BACKPACK: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    priceDisplay: '$29.99',
    description: 'carry.allTheThings()',
  },
} as const;
```

#### **Data Generation**

```typescript
// Dynamic data generation
class TestDataFactory {
  static generateUser(overrides?: Partial<UserData>): UserData {
    return {
      username: `user_${Date.now()}`,
      password: 'generated_password',
      email: `test${Date.now()}@example.com`,
      ...overrides,
    };
  }

  static generateProduct(): ProductData {
    return {
      id: `product_${Math.random().toString(36).substr(2, 9)}`,
      name: `Test Product ${Date.now()}`,
      price: Math.round(Math.random() * 100 * 100) / 100,
    };
  }
}
```

#### **Data Validation**

```typescript
// Schema validation for API responses
const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
};

// Usage in tests
test('API response validation', async ({
  jsonPlaceholderClient,
  schemaValidator,
}) => {
  const response = await jsonPlaceholderClient.getUser(1);
  const user = await response.json();

  schemaValidator.validateSchema(user, userSchema);
});
```

---

## 🛠️ Utilities and Helpers

### **Test Utilities**

The framework provides comprehensive utility functions for common testing
operations.

#### **Logging and Reporting**

```typescript
class TestLogger {
  // Structured logging for better test reporting
  static logTestStart(testName: string, description?: string): void {
    console.log(`🧪 Starting test: ${testName}`);
    if (description) console.log(`📝 Description: ${description}`);
  }

  static logStep(stepNumber: number, description: string): void {
    console.log(`📍 Step ${stepNumber}: ${description}`);
  }

  static logPerformance(operation: string, duration: number): void {
    console.log(`⏱️ ${operation} completed in ${duration}ms`);
  }
}

// Usage in tests
test('logged test example', async ({ loginPage }) => {
  TestLogger.logTestStart('User Authentication');
  TestLogger.logStep(1, 'Navigate to login page');
  await loginPage.navigateToLoginPage(baseUrl);

  TestLogger.logStep(2, 'Enter credentials');
  await loginPage.login(credentials);
});
```

#### **Browser Utilities**

```typescript
class BrowserUtils {
  // Screenshot utilities
  static async takeElementScreenshot(
    element: Locator,
    filename?: string,
  ): Promise<void> {
    const screenshot = await element.screenshot();
    const name = filename || `element-${Date.now()}.png`;
    await fs.writeFile(`./screenshots/${name}`, screenshot);
  }

  // Viewport management
  static async setMobileViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 375, height: 667 });
  }

  // Browser information
  static getBrowserInfo(browserName: string): BrowserInfo {
    return {
      name: browserName,
      isMobile: ['webkit'].includes(browserName),
      supportsWebGL: !browserName.includes('firefox'),
    };
  }
}
```

#### **Data Utilities**

```typescript
class TestDataUtils {
  // Email validation
  static validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Random data generation
  static generateRandomUser(): UserData {
    return {
      username: `user_${Math.random().toString(36).substr(2, 8)}`,
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
    };
  }

  // Currency formatting
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
```

---

## 🔗 API Testing Components

### **API Client Architecture**

The framework provides robust API testing capabilities with comprehensive
validation and performance tracking.

#### **JSONPlaceholder API Client**

```typescript
class JsonPlaceholderApiClient {
  constructor(
    private context: APIRequestContext,
    private baseUrl: string,
  ) {}

  // User operations
  async getUsers(): Promise<APIResponse> {
    return this.context.get(`${this.baseUrl}/users`);
  }

  async getUser(id: number): Promise<APIResponse> {
    return this.context.get(`${this.baseUrl}/users/${id}`);
  }

  async createUser(userData: UserData): Promise<APIResponse> {
    return this.context.post(`${this.baseUrl}/users`, {
      data: userData,
    });
  }

  // Posts operations
  async getPosts(): Promise<APIResponse> {
    return this.context.get(`${this.baseUrl}/posts`);
  }

  async getUserPosts(userId: number): Promise<APIResponse> {
    return this.context.get(`${this.baseUrl}/users/${userId}/posts`);
  }
}
```

#### **Schema Validation**

```typescript
class SchemaValidator {
  validateUser(user: any): void {
    const userSchema = {
      type: 'object',
      required: ['id', 'name', 'username', 'email'],
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            zipcode: { type: 'string' },
          },
        },
      },
    };

    this.validateSchema(user, userSchema);
  }

  validatePost(post: any): void {
    const postSchema = {
      type: 'object',
      required: ['id', 'title', 'body', 'userId'],
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        body: { type: 'string' },
        userId: { type: 'number' },
      },
    };

    this.validateSchema(post, postSchema);
  }
}
```

#### **Performance Tracking**

```typescript
class PerformanceTracker {
  private metrics: Map<string, PerformanceMetric> = new Map();

  startTimer(name: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.set(name, {
        name,
        duration,
        timestamp: new Date(),
        type: 'timer',
      });
    };
  }

  async benchmark<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const timer = this.startTimer(name);
    const result = await operation();
    timer();
    return result;
  }

  generateReport(): PerformanceReport {
    return {
      totalOperations: this.metrics.size,
      averageResponseTime: this.calculateAverage(),
      slowestOperation: this.findSlowest(),
      fastestOperation: this.findFastest(),
      metrics: Array.from(this.metrics.values()),
    };
  }
}
```

#### **API Test Examples**

```typescript
// Complete API workflow test
test('JSONPlaceholder API workflow', async ({
  jsonPlaceholderClient,
  schemaValidator,
  performanceTracker,
}) => {
  // Performance tracking
  const workflowTimer = performanceTracker.startTimer('complete-workflow');

  // Get all users with validation
  const usersResponse = await jsonPlaceholderClient.getUsers();
  expect(usersResponse.status()).toBe(200);

  const users = await usersResponse.json();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);

  // Validate each user schema
  users.forEach(user => schemaValidator.validateUser(user));

  // Get posts for first user
  const userPosts = await jsonPlaceholderClient.getUserPosts(users[0].id);
  expect(userPosts.status()).toBe(200);

  const posts = await userPosts.json();
  posts.forEach(post => schemaValidator.validatePost(post));

  workflowTimer();

  // Performance validation
  const metrics = performanceTracker.getMetric('complete-workflow');
  expect(metrics.duration).toBeLessThan(5000); // 5 seconds max
});
```

---

## ⚡ Performance Optimization

### **Framework Optimizations**

The framework includes several performance optimizations to ensure fast and
reliable test execution.

#### **Worker Optimization**

```typescript
// Automatic worker calculation
const systemCPUs = os.cpus().length;
const systemMemoryGB = os.totalmem() / (1024 * 1024 * 1024);

// Calculate optimal workers based on resources
const optimalWorkers = Math.min(
  Math.floor(systemCPUs * 0.75), // 75% CPU utilization
  Math.floor(systemMemoryGB / 2), // 2GB per worker
  MAX_WORKERS, // Framework limit
);

// Playwright configuration
export default defineConfig({
  workers: optimalWorkers,
  fullyParallel: true,
  use: {
    // Connection reuse for faster execution
    reuseExistingServer: true,
  },
});
```

#### **Resource Management**

```typescript
// Browser context reuse
test.describe.configure({ mode: 'parallel' });

// Page object optimization
class OptimizedLoginPage {
  // Lazy locator initialization
  private _usernameInput?: Locator;
  get usernameInput(): Locator {
    if (!this._usernameInput) {
      this._usernameInput = this.page.locator('[data-test="username"]');
    }
    return this._usernameInput;
  }

  // Optimized waiting strategies
  async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.usernameInput.waitFor({ state: 'visible' }),
      this.page.waitForFunction(() => document.readyState === 'complete'),
    ]);
  }
}
```

#### **Test Execution Strategies**

```typescript
// Sharding for large test suites
const shardIndex = process.env.SHARD_INDEX || '1';
const shardTotal = process.env.SHARD_TOTAL || '1';

export default defineConfig({
  shard: { total: parseInt(shardTotal), current: parseInt(shardIndex) },

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Timeout optimization
  timeout: 30000,
  expect: { timeout: 10000 },

  // Test isolation
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
});
```

#### **Memory Management**

```typescript
// Resource cleanup
test.afterEach(async ({ page }) => {
  // Clear browser storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Close extra tabs
  const pages = page.context().pages();
  for (const extraPage of pages) {
    if (extraPage !== page) {
      await extraPage.close();
    }
  }
});

// Memory monitoring
class MemoryMonitor {
  static logMemoryUsage(testName: string): void {
    const usage = process.memoryUsage();
    console.log(`Memory usage for ${testName}:`, {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
    });
  }
}
```

---

## 📈 Performance Metrics

### **Monitoring and Reporting**

```typescript
// Performance benchmarks
interface PerformanceBenchmarks {
  pageLoad: number; // Max page load time
  apiResponse: number; // Max API response time
  userAction: number; // Max user interaction time
  testExecution: number; // Max test execution time
}

const PERFORMANCE_BENCHMARKS: PerformanceBenchmarks = {
  pageLoad: 3000, // 3 seconds
  apiResponse: 2000, // 2 seconds
  userAction: 1000, // 1 second
  testExecution: 30000, // 30 seconds
};

// Performance validation
test('performance validation', async ({ loginPage, performanceTracker }) => {
  const pageLoadTimer = performanceTracker.startTimer('page-load');
  await loginPage.navigateToLoginPage(baseUrl);
  pageLoadTimer();

  const metrics = performanceTracker.getMetric('page-load');
  expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.pageLoad);
});
```

This comprehensive component documentation provides detailed information about
each aspect of the framework, enabling developers to understand and effectively
utilize all available features and patterns.
