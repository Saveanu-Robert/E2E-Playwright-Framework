/**
 * @fileoverview Environment Configuration Manager - Central configuration management system
 * @version 1.0.0
 * @author E2E Playwright Framework Team
 * @since 2024
 *
 * @description
 * This module provides comprehensive environment configuration management for the testing framework.
 * It includes dynamic resource optimization, environment validation, and type-safe configuration access
 * with support for multiple environments (development, pre-production, production).
 *
 * Key Features:
 * - Dynamic worker calculation based on system resources (CPU, memory)
 * - Environment-specific configuration with validation
 * - Performance optimization algorithms
 * - Type-safe configuration access
 * - System resource monitoring and reporting
 * - Flexible environment detection and override
 *
 * @example
 * ```typescript
 * import { EnvironmentConfigManager, getEnvironmentConfig } from '@config/environment';
 *
 * // Get configuration for specific environment
 * const config = getEnvironmentConfig('development');
 * const baseUrl = config.web.baseURL;
 *
 * // Get optimal worker count for performance
 * const workers = EnvironmentConfigManager.calculateOptimalWorkers();
 *
 * // System information for debugging
 * const systemInfo = EnvironmentConfigManager.getSystemInfo();
 * ```
 *
 * @see {@link ./environments/development.ts} - Development environment configuration
 * @see {@link ./environments/pre-prod.ts} - Pre-production environment configuration
 * @see {@link ./environments/prod.ts} - Production environment configuration
 * @see {@link ./types/environment.types.ts} - Type definitions
 */

import * as os from 'node:os';

import { FRAMEWORK_CONSTANTS } from '@src/utils/constants/framework.constants';
import { developmentConfig } from './environments/development';
import { preProdConfig } from './environments/pre-prod';
import { prodConfig } from './environments/prod';
import type {
  EnvironmentConfig,
  EnvironmentManager,
  EnvironmentType,
} from '@config/types/environment.types';
/**
 * Environment Configuration Manager Implementation
 *
 * @description
 * Core implementation of the environment management system providing configuration
 * access, validation, and system resource optimization. Implements the EnvironmentManager
 * interface with comprehensive error handling and performance monitoring.
 *
 * @implements {EnvironmentManager}
 * @class
 * @since 1.0.0
 */
class EnvironmentConfigManagerImpl implements EnvironmentManager {
  /**
   * Registry of all available environment configurations
   * @private
   * @readonly
   */
  private readonly configs: Record<EnvironmentType, EnvironmentConfig> = {
    development: developmentConfig,
    'pre-prod': preProdConfig,
    prod: prodConfig,
  };

  /**
   * Retrieves configuration for the specified environment
   *
   * @description
   * Returns environment-specific configuration with automatic validation.
   * Falls back to default environment if no environment is specified.
   *
   * @param {EnvironmentType} [env] - Target environment type
   * @returns {EnvironmentConfig} Validated environment configuration
   *
   * @throws {Error} When environment configuration is not found or invalid
   *
   * @example
   * ```typescript
   * const devConfig = EnvironmentConfigManager.getConfig('development');
   * const defaultConfig = EnvironmentConfigManager.getConfig(); // Uses default
   * ```
   *
   * @public
   * @since 1.0.0
   */
  getConfig(env: EnvironmentType = FRAMEWORK_CONSTANTS.DEFAULT_ENVIRONMENT): EnvironmentConfig {
    const config = this.configs[env];
    if (!(env in this.configs)) {
      throw new Error(`Environment configuration not found for: ${env}`);
    }

    this.validateConfig(config);

    return config;
  }

  /**
   * Detects the current environment from environment variables
   *
   * @description
   * Reads the TEST_ENV environment variable to determine the current environment.
   * Falls back to the default environment if variable is not set or invalid.
   *
   * @returns {EnvironmentType} Current environment type
   *
   * @example
   * ```typescript
   * const currentEnv = EnvironmentConfigManager.getCurrentEnvironment();
   * console.log('Running tests in:', currentEnv);
   * ```
   *
   * @public
   * @since 1.0.0
   */
  getCurrentEnvironment(): EnvironmentType {
    const env = process.env[FRAMEWORK_CONSTANTS.ENV_VARS.TEST_ENV] as EnvironmentType;
    if (env && Object.keys(this.configs).includes(env)) {
      return env;
    }
    return FRAMEWORK_CONSTANTS.DEFAULT_ENVIRONMENT;
  }

  /**
   * Validate environment configuration
   * @param config - Configuration to validate
   * @returns True if valid, false otherwise
   */
  validateConfig(config: EnvironmentConfig): boolean {
    try {
      // Validate required URLs
      if (!config.web.baseURL || !config.api.baseURL) {
        console.error('Missing required base URLs in configuration');
        return false;
      }

      // Validate URL format
      try {
        new URL(config.web.baseURL);
        new URL(config.api.baseURL);
      } catch (error) {
        console.error('Invalid URL format in configuration:', error);
        return false;
      }

      // Validate timeouts
      if (config.web.timeout <= 0 || config.api.timeout <= 0) {
        console.error('Invalid timeout values in configuration');
        return false;
      }

      // Validate retries
      if (config.web.retries < 0 || config.api.retries < 0) {
        console.error('Invalid retry values in configuration');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Calculate optimal number of workers based on system resources
   * @returns Optimal worker count
   */
  calculateOptimalWorkers(): number {
    const cpuCount = os.cpus().length;
    const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024);

    // Calculate based on CPU utilization percentage
    let workers = Math.floor(cpuCount * FRAMEWORK_CONSTANTS.PERFORMANCE.CPU_UTILIZATION_PERCENTAGE);

    // Adjust based on available memory
    const memoryBasedWorkers = Math.floor(
      totalMemoryGB / FRAMEWORK_CONSTANTS.PERFORMANCE.MEMORY_PER_WORKER_GB,
    );
    workers = Math.min(workers, memoryBasedWorkers);

    // Apply framework constraints
    workers = Math.max(
      FRAMEWORK_CONSTANTS.PERFORMANCE.MIN_WORKERS,
      Math.min(FRAMEWORK_CONSTANTS.PERFORMANCE.MAX_WORKERS, workers),
    );

    return workers;
  }

  /**
   * Calculate optimal number of shards for parallel execution
   * @returns Optimal shard count
   */
  calculateOptimalShards(): number {
    const workers = this.calculateOptimalWorkers();
    return Math.max(1, Math.floor(workers * FRAMEWORK_CONSTANTS.PERFORMANCE.SHARD_RATIO));
  }

  /**
   * Get system information for debugging
   * @returns System information object
   */
  getSystemInfo(): {
    cpuCount: number;
    totalMemoryGB: number;
    platform: string;
    optimalWorkers: number;
    optimalShards: number;
  } {
    return {
      cpuCount: os.cpus().length,
      totalMemoryGB: Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 100) / 100,
      platform: os.platform(),
      optimalWorkers: this.calculateOptimalWorkers(),
      optimalShards: this.calculateOptimalShards(),
    };
  }

  /**
   * Get all available environments
   * @returns Array of environment types
   */
  getAvailableEnvironments(): EnvironmentType[] {
    return Object.keys(this.configs) as EnvironmentType[];
  }
}

// Export singleton instance
export const EnvironmentConfigManager = new EnvironmentConfigManagerImpl();

// Legacy exports for backward compatibility
export const getEnvironmentConfig =
  EnvironmentConfigManager.getConfig.bind(EnvironmentConfigManager);
export const calculateOptimalWorkers =
  EnvironmentConfigManager.calculateOptimalWorkers.bind(EnvironmentConfigManager);
export const calculateOptimalShards =
  EnvironmentConfigManager.calculateOptimalShards.bind(EnvironmentConfigManager);

// Type exports
export type { EnvironmentConfig, EnvironmentType };
