import { test, expect } from '@fixtures/web/saucedemo.fixture';
import { SAUCEDEMO_USERS, INVALID_CREDENTIALS } from '@data/testdata/saucedemo.users';
import { TestLogger, PageUtils, AssertionUtils } from '@utils/helpers/test.utils';

/**
 * SauceDemo Smoke Test - Login Functionality
 * 
 * Critical path test for login functionality
 * - Fast execution for CI/CD pipeline
 * - Core functionality validation
 * - Essential user journey coverage
 * 
 * Test Category: Smoke Test
 * Priority: Critical (P0)
 * Execution Time: ~30 seconds
 */

test.describe('SauceDemo Smoke Test - Login', () => {
  
  test.beforeEach(async ({ page }) => {
    TestLogger.logInfo('Setting up smoke test prerequisites');
    await PageUtils.waitForPageLoad(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      TestLogger.logError(`Smoke test failed: ${testInfo.title}`);
      await PageUtils.takeScreenshot(page, `smoke-failed-${testInfo.title.replace(/\s+/g, '-')}`, true);
    }
  });

  /**
   * Smoke Test: Critical Login Path
   * 
   * Validates the most critical user journey:
   * 1. Page loads correctly
   * 2. User can login with valid credentials
   * 3. User is redirected to main application
   * 
   * This test must pass for deployment to proceed
   */
  test('should complete critical login journey successfully', async ({ 
    page, 
    loginPage, 
    inventoryPage, 
    baseUrl 
  }) => {
    const testName = 'Critical Login Path';
    const testDescription = 'Smoke test for essential login functionality';
    
    TestLogger.logTestStart(testName, testDescription);

    try {
      // Step 1: Navigate and verify page load
      TestLogger.logStep(1, 'Navigate to application and verify page load');
      await loginPage.navigateToLoginPage(baseUrl);
      
      // Critical: Page must load within acceptable time
      await expect(page).toHaveTitle('Swag Labs');
      await expect(loginPage.loginButton).toBeVisible();
      TestLogger.logValidation('Application loaded successfully', true);

      // Step 2: Perform critical login
      TestLogger.logStep(2, 'Execute login with standard user');
      await loginPage.login(SAUCEDEMO_USERS.STANDARD_USER);
      
      // Step 3: Verify successful authentication
      TestLogger.logStep(3, 'Verify successful authentication and application access');
      await loginPage.validateSuccessfulLogin();
      await inventoryPage.validateInventoryPageLoad();
      
      // Critical: User must reach main application
      await AssertionUtils.assertUrlPattern(
        page, 
        /.*inventory\.html/, 
        'main application after login'
      );

      TestLogger.logValidation('Critical login path completed successfully', true);
      TestLogger.logTestEnd(testName, true);
      
    } catch (error) {
      TestLogger.logError('Critical smoke test failed', error instanceof Error ? error.message : String(error));
      TestLogger.logTestEnd(testName, false);
      throw error;
    }
  });

  /**
   * Smoke Test: Security Validation
   * 
   * Quick validation of basic security measures:
   * 1. Invalid credentials are rejected
   * 2. Appropriate error messages are shown
   * 3. No unauthorized access is possible
   */
  test('should enforce basic security measures', async ({ 
    page, 
    loginPage, 
    baseUrl 
  }) => {
    const testName = 'Basic Security Validation';
    const testDescription = 'Smoke test for essential security measures';
    
    TestLogger.logTestStart(testName, testDescription);

    try {
      // Step 1: Navigate to login
      TestLogger.logStep(1, 'Navigate to login page');
      await loginPage.navigateToLoginPage(baseUrl);

      // Step 2: Test invalid credentials rejection
      TestLogger.logStep(2, 'Verify invalid credentials are rejected');
      await loginPage.login(INVALID_CREDENTIALS.INVALID_USERNAME);
      
      // Critical: System must reject invalid credentials
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toContain('Username and password do not match');
      
      TestLogger.logValidation('Invalid credentials properly rejected', true);

      // Step 3: Verify no unauthorized access
      TestLogger.logStep(3, 'Verify user remains on login page');
      await AssertionUtils.assertUrlPattern(
        page, 
        /.*\/$/, 
        'login page after failed authentication'
      );

      TestLogger.logValidation('Security measures validated', true);
      TestLogger.logTestEnd(testName, true);
      
    } catch (error) {
      TestLogger.logError('Security smoke test failed', error instanceof Error ? error.message : String(error));
      TestLogger.logTestEnd(testName, false);
      throw error;
    }
  });

});
