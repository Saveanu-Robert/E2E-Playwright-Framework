# Getting Started Guide

Welcome to the E2E Playwright Framework! This guide will help you get up and
running quickly.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for version control
- **VS Code** (recommended) with Playwright extension

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Saveanu-Robert/E2E-Playwright-Framework.git
cd E2E-Playwright-Framework
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npm run install:browsers
```

### 4. Verify Installation

```bash
npm run test:smoke
```

## 🎯 Your First Test

Let's create a simple test to verify everything works:

### 1. Understanding the Structure

```typescript
import { test, expect } from '@fixtures/web/saucedemo.fixture';

test.describe('My First Test Suite', () => {
  test('should login successfully', async ({
    loginPage,
    inventoryPage,
    baseUrl,
  }) => {
    // Test implementation here
  });
});
```

### 2. Writing the Test

```typescript
import { test, expect } from '@fixtures/web/saucedemo.fixture';
import { SAUCEDEMO_USERS } from '@data/testdata/saucedemo.users';

test.describe('Login Tests', () => {
  test('should login with valid credentials', async ({
    loginPage,
    inventoryPage,
    baseUrl,
  }) => {
    // Navigate to login page
    await loginPage.navigateToLoginPage(baseUrl);

    // Perform login
    await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);

    // Validate successful login
    await loginPage.validateSuccessfulLogin();

    // Verify we're on inventory page
    await inventoryPage.validateInventoryPageLoad();
  });
});
```

### 3. Run Your Test

```bash
npm run test -- tests/my-first-test.spec.ts
```

## 🏗️ Framework Architecture

### Page Object Pattern

The framework uses the Page Object Model:

```typescript
// Page Object
class LoginPage {
  constructor(private page: Page) {}

  async login(credentials: UserCredentials) {
    // Implementation
  }
}

// Test Usage
test('login test', async ({ loginPage }) => {
  await loginPage.login(credentials);
});
```

### Fixtures

Pre-configured components for easy testing:

```typescript
interface SauceDemoFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page; // Already logged in
  baseUrl: string;
}
```

### Path Mapping

Clean imports with TypeScript path mapping:

```typescript
import { LoginPage } from '@pages/web/LoginPage';
import { TestData } from '@data/testdata/users';
import { Helper } from '@utils/helpers/common';
```

## 🔧 Configuration

### Environment Setup

Set environment variables for different environments:

```bash
# Development
export TEST_ENV=development
export DEV_WEB_URL=https://www.saucedemo.com

# Production
export TEST_ENV=prod
export PROD_WEB_URL=https://prod-app.example.com
```

### Running Tests by Environment

```bash
# Development
npm run test:dev

# Pre-production
npm run test:pre-prod

# Production
npm run test:prod
```

## 🌐 Browser Testing

### Desktop Browsers

```bash
# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# All desktop browsers
npm run test:desktop
```

### Mobile Testing

```bash
# Mobile devices
npm run test:mobile

# Specific mobile tests
npm run test -- --project=mobile-chrome
npm run test -- --project=mobile-safari
```

## 📊 Reports and Debugging

### View Test Reports

```bash
npm run report
```

### Debug Mode

```bash
DEBUG=1 npm run test:debug
```

### Headed Mode (Visible Browser)

```bash
npm run test:headed
```

## 🧹 Code Quality

### Linting and Formatting

```bash
# Fix linting issues
npm run lint

# Format code
npm run format

# Both linting and formatting
npm run code:clean
```

## 📝 Writing Effective Tests

### Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ loginPage, baseUrl }) => {
    // Setup before each test
    await loginPage.navigateToLoginPage(baseUrl);
  });

  test('should perform specific action', async ({ page }) => {
    // Arrange - Set up test data
    const testData = getTestData();

    // Act - Perform the action
    await page.performAction(testData);

    // Assert - Verify the result
    await expect(page.locator('.result')).toHaveText('Expected Result');
  });
});
```

### Best Practices

1. **Use Fixtures**: Leverage pre-configured page objects
2. **Path Mapping**: Use clean imports with `@` aliases
3. **Type Safety**: Always use TypeScript types
4. **Page Objects**: Keep test logic in page objects
5. **Data Separation**: Use external test data files
6. **Descriptive Tests**: Write clear test names and descriptions

### Mobile-First Testing

```typescript
test('should work on mobile', async ({ page, loginPage, baseUrl }) => {
  // The framework automatically handles mobile compatibility
  await loginPage.navigateToLoginPage(baseUrl);
  await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);

  // All interactions work across desktop and mobile
});
```

## 🚨 Common Issues and Solutions

### Browser Not Found

```bash
# Reinstall browsers
npm run install:browsers
```

### Port Already in Use

```bash
# Check what's using the port
netstat -tulpn | grep :3000

# Or use a different port
PORT=3001 npm run test
```

### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Verify path mappings in tsconfig.json
```

## 📚 Next Steps

Now that you're set up:

1. 📖 Read the [Architecture Guide](./architecture.md)
2. 🔧 Learn about [Advanced Configuration](../configuration.md)
3. ✍️ Study [Writing Tests Guide](./writing-tests.md)
4. 🐛 Check the [Debugging Guide](./debugging.md)
5. 🚀 Set up [CI/CD Integration](./ci-cd.md)

## 🤝 Need Help?

- 📋
  [Open an Issue](https://github.com/Saveanu-Robert/E2E-Playwright-Framework/issues)
- 💬
  [Start a Discussion](https://github.com/Saveanu-Robert/E2E-Playwright-Framework/discussions)
- 📖 [Check Documentation](../README.md)

Happy Testing! 🎭
