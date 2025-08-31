import type { FullConfig } from '@playwright/test';

import { EnvironmentConfigManager } from '@config/environment';

/**
 * Global Test Teardown
 *
 * Executed once after all tests across all workers complete
 *
 * Features:
 * - Environment-specific cleanup
 * - Temporary file cleanup
 * - Debug report generation
 * - Resource cleanup
 *
 * @param _config - Playwright full configuration (unused)
 */
async function globalTeardown(_config: FullConfig) {
  const startTime = Date.now();
  console.log('🧹 Starting global teardown...');

  try {
    const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
    const envConfig = EnvironmentConfigManager.getConfig(currentEnv);

    // Environment-specific cleanup
    if (envConfig.features.enableMocking) {
      console.log('🎭 Cleaning up mock services...');
      // Cleanup mock services here if implemented
    }

    // Cleanup temporary files
    await cleanupTempFiles();

    // Generate debug report if debug mode enabled
    if (envConfig.features.enableDebugLogs) {
      await generateDebugReport();
    }

    const teardownTime = Date.now() - startTime;
    console.log(`✅ Global teardown completed in ${teardownTime}ms`);
    console.log('🎉 All tests completed!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Global teardown failed:', errorMessage);
    // Don't throw to avoid masking test failures
  }
}

/**
 * Cleanup temporary files and directories created during test execution
 */
async function cleanupTempFiles(): Promise<void> {
  try {
    console.log('🗑️ Cleaning up temporary files...');
    // Add cleanup logic for temporary files as needed
    // Example: fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Temp file cleanup warning:', errorMessage);
  }
}

/**
 * Generate comprehensive debug report with system and environment information
 */
async function generateDebugReport(): Promise<void> {
  try {
    console.log('📊 Generating debug report...');
    const systemInfo = EnvironmentConfigManager.getSystemInfo();
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: EnvironmentConfigManager.getCurrentEnvironment(),
      systemInfo,
      nodeVersion: process.version,
      playwrightVersion: require('@playwright/test/package.json').version,
    };

    // Save debug info to reports directory
    const fs = require('node:fs').promises;
    await fs.writeFile('./reports/debug-info.json', JSON.stringify(debugInfo, null, 2));
    console.log('📋 Debug report saved to ./reports/debug-info.json');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Debug report generation warning:', errorMessage);
  }
}

export default globalTeardown;
