import { FullConfig } from '@playwright/test';
import { EnvironmentConfigManager } from '@config/environment';

/**
 * Global Setup
 * 
 * Runs once before all tests across all workers
 * Purpose: Initialize shared resources, validate environment, setup global state
 * 
 * @param config - Playwright full configuration
 */
async function globalSetup(config: FullConfig) {
  const startTime = Date.now();
  console.log('🚀 Starting Playwright Test Suite...');
  
  try {
    // Get current environment configuration
    const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
    const envConfig = EnvironmentConfigManager.getConfig(currentEnv);
    const systemInfo = EnvironmentConfigManager.getSystemInfo();
    
    // Log environment information
    console.log('📍 Environment:', currentEnv);
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
      // Initialize mock services here
    }
    
    // Health check for API endpoints (optional)
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
 * Perform health check on API endpoints
 * @param apiBaseURL - API base URL to check
 */
async function performHealthCheck(apiBaseURL: string): Promise<void> {
  try {
    // Simple health check - adjust URL as needed
    const healthEndpoint = `${apiBaseURL}/health`;
    console.log(`🏥 Performing health check: ${healthEndpoint}`);
    
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
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
