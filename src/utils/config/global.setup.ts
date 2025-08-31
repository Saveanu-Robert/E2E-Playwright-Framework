import type { FullConfig } from '@playwright/test';

import { EnvironmentConfigManager } from '@config/environment';

/**
 * Global Test Setup
 *
 * Executed once before all tests across all workers
 *
 * Features:
 * - Environment validation and configuration
 * - System resource optimization
 * - Optional API health checks
 * - Feature flag initialization
 *
 * @param _config - Playwright full configuration (unused)
 */
async function globalSetup(_config: FullConfig) {
  const startTime = Date.now();

  try {
    // Get current environment configuration
    const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
    const envConfig = EnvironmentConfigManager.getConfig(currentEnv);
    const systemInfo = EnvironmentConfigManager.getSystemInfo();

    // Log essential information
    console.log('� Starting Playwright Test Suite...');
    console.log('�📍 Environment:', currentEnv);
    console.log('🌐 Web Base URL:', envConfig.web.baseURL);
    console.log('🔗 API Base URL:', envConfig.api.baseURL);
    console.log('⚡ System Info:', {
      cpuCount: systemInfo.cpuCount,
      memoryGB: systemInfo.totalMemoryGB,
      platform: systemInfo.platform,
      workers: systemInfo.optimalWorkers,
      shards: systemInfo.optimalShards,
    });

    // Validate environment configuration
    if (!EnvironmentConfigManager.validateConfig(envConfig)) {
      throw new Error('Environment configuration validation failed');
    }

    // Environment-specific setup
    if (envConfig.features.enableDebugLogs) {
      console.log('🐛 Debug mode enabled');
    }

    if (envConfig.features.enableMocking) {
      console.log('🎭 Mocking enabled for external services');
      // Initialize mock services here if needed
    }

    // Optional API health check
    if (process.env.SKIP_HEALTH_CHECK !== 'true') {
      await performHealthCheck(envConfig.api.baseURL);
    }

    const setupTime = Date.now() - startTime;
    console.log(`✅ Global setup completed in ${setupTime}ms`);
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Perform basic health check on API endpoints
 * Does not fail tests if health check fails - only warns
 * @param apiBaseURL - API base URL to check
 */
async function performHealthCheck(apiBaseURL: string): Promise<void> {
  try {
    // Simple health check - adjust URL as needed for your API
    const healthEndpoint = `${apiBaseURL}/health`;

    const response = await fetch(healthEndpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      console.log('✅ API health check passed');
    } else {
      console.warn(`⚠️ API health check warning: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ API health check skipped:', errorMessage);
    // Don't fail the tests if health check fails
  }
}

export default globalSetup;
