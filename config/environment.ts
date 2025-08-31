import * as os from "node:os";
import { FRAMEWORK_CONSTANTS } from "@src/utils/constants/framework.constants";
import { developmentConfig } from "./environments/development";
import { preProdConfig } from "./environments/pre-prod";
import { prodConfig } from "./environments/prod";
import type {
	EnvironmentConfig,
	EnvironmentManager,
	EnvironmentType,
} from "./types/environment.types";

/**
 * Environment Configuration Manager
 *
 * Central manager for environment-specific configurations with dynamic optimization
 * Features:
 * - Dynamic worker calculation based on system resources
 * - Environment validation
 * - Performance optimization
 * - Type-safe configuration access
 *
 * @example
 * ```typescript
 * import { EnvironmentConfigManager } from '@config/environment';
 *
 * const config = EnvironmentConfigManager.getConfig('development');
 * const workers = EnvironmentConfigManager.calculateOptimalWorkers();
 * ```
 */
class EnvironmentConfigManagerImpl implements EnvironmentManager {
	private readonly configs: Record<EnvironmentType, EnvironmentConfig> = {
		development: developmentConfig,
		"pre-prod": preProdConfig,
		prod: prodConfig,
	};

	/**
	 * Get configuration for specific environment
	 * @param env - Environment type
	 * @returns Environment configuration
	 */
	getConfig(
		env: EnvironmentType = FRAMEWORK_CONSTANTS.DEFAULT_ENVIRONMENT,
	): EnvironmentConfig {
		const config = this.configs[env];
		if (!config) {
			throw new Error(`Environment configuration not found for: ${env}`);
		}

		if (!this.validateConfig(config)) {
			throw new Error(`Invalid configuration for environment: ${env}`);
		}

		return config;
	}

	/**
	 * Get current environment from environment variables
	 * @returns Current environment type
	 */
	getCurrentEnvironment(): EnvironmentType {
		const env = process.env[
			FRAMEWORK_CONSTANTS.ENV_VARS.TEST_ENV
		] as EnvironmentType;
		return env && Object.keys(this.configs).includes(env)
			? env
			: FRAMEWORK_CONSTANTS.DEFAULT_ENVIRONMENT;
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
				console.error("Missing required base URLs in configuration");
				return false;
			}

			// Validate URL format
			new URL(config.web.baseURL);
			new URL(config.api.baseURL);

			// Validate timeouts
			if (config.web.timeout <= 0 || config.api.timeout <= 0) {
				console.error("Invalid timeout values in configuration");
				return false;
			}

			// Validate retries
			if (config.web.retries < 0 || config.api.retries < 0) {
				console.error("Invalid retry values in configuration");
				return false;
			}

			return true;
		} catch (error) {
			console.error("Configuration validation failed:", error);
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
		let workers = Math.floor(
			cpuCount * FRAMEWORK_CONSTANTS.PERFORMANCE.CPU_UTILIZATION_PERCENTAGE,
		);

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
		return Math.max(
			1,
			Math.floor(workers * FRAMEWORK_CONSTANTS.PERFORMANCE.SHARD_RATIO),
		);
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
			totalMemoryGB:
				Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 100) / 100,
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
export const getEnvironmentConfig = EnvironmentConfigManager.getConfig.bind(
	EnvironmentConfigManager,
);
export const calculateOptimalWorkers =
	EnvironmentConfigManager.calculateOptimalWorkers.bind(
		EnvironmentConfigManager,
	);
export const calculateOptimalShards =
	EnvironmentConfigManager.calculateOptimalShards.bind(
		EnvironmentConfigManager,
	);

// Type exports
export type { EnvironmentConfig, EnvironmentType };
