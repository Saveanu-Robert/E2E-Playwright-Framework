/**
 * Environment Configuration Types
 * 
 * Defines the structure and types for environment-specific configurations
 * Ensures type safety across all environment files
 */

export interface WebConfig {
  /** Base URL for web application */
  baseURL: string;
  /** Timeout for web operations in milliseconds */
  timeout: number;
  /** Number of retries for failed tests */
  retries: number;
}

export interface ApiConfig {
  /** Base URL for API endpoints */
  baseURL: string;
  /** Timeout for API operations in milliseconds */
  timeout: number;
  /** Number of retries for failed API calls */
  retries: number;
  /** Default headers for API requests */
  headers: Record<string, string>;
}

export interface DatabaseConfig {
  /** Database connection string */
  connectionString: string;
  /** Connection timeout in milliseconds */
  timeout: number;
}

export interface FeatureFlags {
  /** Enable debug logging */
  enableDebugLogs: boolean;
  /** Enable mocking for external services */
  enableMocking: boolean;
  /** Skip authentication validation */
  skipAuthValidation: boolean;
  /** Enable video recording for tests */
  enableVideoRecording: boolean;
}

export interface PerformanceConfig {
  /** Number of workers for test execution */
  workers: number;
  /** Maximum concurrent operations */
  maxConcurrency: number;
}

export interface EnvironmentConfig {
  /** Web application configuration */
  web: WebConfig;
  /** API configuration */
  api: ApiConfig;
  /** Database configuration */
  database: DatabaseConfig;
  /** Feature flags for environment-specific behavior */
  features: FeatureFlags;
  /** Performance tuning configuration */
  performance: PerformanceConfig;
}

export type EnvironmentType = 'development' | 'pre-prod' | 'prod';

export interface EnvironmentManager {
  /** Get configuration for specific environment */
  getConfig(env: EnvironmentType): EnvironmentConfig;
  /** Get current environment */
  getCurrentEnvironment(): EnvironmentType;
  /** Validate environment configuration */
  validateConfig(config: EnvironmentConfig): boolean;
}
