# 🔧 Configuration Architecture & Documentation

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Configuration Files](#configuration-files)
3. [Environment Management](#environment-management)
4. [Performance Optimization](#performance-optimization)
5. [Constants Management](#constants-management)
6. [Best Practices](#best-practices)
7. [Customization Guide](#customization-guide)

## 🏗️ Architecture Overview

The framework follows a **hierarchical configuration architecture** with separation of concerns:

```
📁 Configuration Architecture
├── 🎯 Framework Constants (Non-changeable core values)
├── 🌍 Environment Configs (Environment-specific settings)
├── ⚡ Performance Manager (Dynamic system optimization)
├── 🔧 Playwright Config (Main test configuration)
└── 🌐 Global Setup/Teardown (Runtime initialization)
```

### Design Principles

- **🔒 No Hardcoded Values**: All values centralized in constants
- **🌍 Environment Agnostic**: Easy switching between environments
- **⚡ Dynamic Optimization**: Auto-adapts to system resources
- **🎯 Type Safety**: Full TypeScript support with strict types
- **📦 Modular Design**: Each component has single responsibility
- **🔧 Easy Maintenance**: Centralized configuration management

## 📁 Configuration Files

### 1. Framework Constants (`src/utils/constants/framework.constants.ts`)

**Purpose**: Central repository for all framework-wide constants

```typescript
export const FRAMEWORK_CONSTANTS = {
  PERFORMANCE: {
    CPU_UTILIZATION_PERCENTAGE: 0.75,  // Use 75% of CPU cores
    MIN_WORKERS: 2,                     // Minimum workers
    MAX_WORKERS: 16,                    // Maximum workers
    MEMORY_PER_WORKER_GB: 2,           // Memory per worker
    SHARD_RATIO: 0.5,                  // Shards = workers/2
  },
  TIMEOUTS: {
    DEFAULT_ACTION: 15000,             // 15 seconds
    DEFAULT_NAVIGATION: 30000,         // 30 seconds
    TEST_TIMEOUT: {
      DEVELOPMENT: 30000,              // 30 seconds
      PRE_PROD: 45000,                 // 45 seconds
      PRODUCTION: 60000,               // 60 seconds
    },
  },
  // ... more constants
};
```

**Key Features**:
- 🔒 **Immutable**: Uses `as const` for compile-time constants
- 📊 **Performance Tuning**: CPU and memory optimization settings
- ⏱️ **Timeout Management**: Environment-specific timeout configurations
- 📂 **Directory Management**: Centralized path definitions
- 🌐 **HTTP Configuration**: Default headers and API settings

### 2. Environment Types (`config/types/environment.types.ts`)

**Purpose**: TypeScript type definitions for configuration structure

```typescript
export interface EnvironmentConfig {
  web: WebConfig;
  api: ApiConfig;
  database: DatabaseConfig;
  features: FeatureFlags;
  performance: PerformanceConfig;
}
```

**Benefits**:
- 🛡️ **Type Safety**: Compile-time validation
- 📝 **IntelliSense**: Auto-completion in IDEs
- 🔍 **Documentation**: Self-documenting interfaces
- ✅ **Validation**: Prevents configuration errors

### 3. Environment Configurations

#### Development (`config/environments/development.ts`)

```typescript
export const developmentConfig: EnvironmentConfig = {
  web: {
    baseURL: process.env.DEV_WEB_URL || 'https://dev-app.example.com',
    timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT.DEVELOPMENT,
    retries: FRAMEWORK_CONSTANTS.RETRIES.DEVELOPMENT,
  },
  features: {
    enableDebugLogs: true,
    enableMocking: true,
    skipAuthValidation: true,
    enableVideoRecording: false,
  },
  // ... more config
};
```

**Characteristics**:
- 🚀 **Fast Execution**: Lower timeouts for rapid development
- 🐛 **Debug Friendly**: Enhanced logging and debugging
- 🎭 **Mocking Enabled**: Mock external dependencies
- 📸 **Minimal Artifacts**: No video recording for speed

#### Pre-Production (`config/environments/pre-prod.ts`)

**Characteristics**:
- ⚖️ **Balanced Performance**: Moderate timeouts and retries
- 🔍 **Testing Focus**: Video recording enabled
- 🔐 **Security Enabled**: Authentication validation active
- 🎯 **Production-like**: Mirrors production behavior

#### Production (`config/environments/prod.ts`)

**Characteristics**:
- 🛡️ **Maximum Reliability**: Highest timeouts and retries
- 🔒 **Security First**: All validations enabled
- 📊 **Full Monitoring**: Comprehensive artifact collection
- ⚡ **Performance Optimized**: Maximum workers and concurrency

### 4. Environment Manager (`config/environment.ts`)

**Purpose**: Central management system for environment configurations

```typescript
class EnvironmentConfigManagerImpl implements EnvironmentManager {
  getConfig(env: EnvironmentType): EnvironmentConfig;
  getCurrentEnvironment(): EnvironmentType;
  validateConfig(config: EnvironmentConfig): boolean;
  calculateOptimalWorkers(): number;
  calculateOptimalShards(): number;
  getSystemInfo(): SystemInfo;
}
```

**Key Features**:
- 🎯 **Singleton Pattern**: Single source of truth
- ✅ **Validation**: Runtime configuration validation
- ⚡ **Performance Calculation**: Dynamic resource optimization
- 🔍 **System Analysis**: Hardware capability detection
- 🛡️ **Error Handling**: Graceful fallbacks and validation

## � Environment Management

### Environment Selection

**Priority Order**:
1. `TEST_ENV` environment variable
2. Default to `development`

```bash
# Set environment
export TEST_ENV=production
npm run test

# Or inline
TEST_ENV=pre-prod npm run test
```

### Environment Variables

| Category | Variable | Description | Default |
|----------|----------|-------------|---------|
| **URLs** | `DEV_WEB_URL` | Development web URL | `https://dev-app.example.com` |
| | `DEV_API_URL` | Development API URL | `https://api-dev.example.com` |
| | `PREPROD_WEB_URL` | Pre-prod web URL | `https://preprod-app.example.com` |
| | `PREPROD_API_URL` | Pre-prod API URL | `https://api-preprod.example.com` |
| | `PROD_WEB_URL` | Production web URL | `https://app.example.com` |
| | `PROD_API_URL` | Production API URL | `https://api.example.com` |
| **Database** | `DEV_DB_CONNECTION` | Dev DB connection | `mongodb://localhost:27017/dev_db` |
| | `PREPROD_DB_CONNECTION` | Pre-prod DB connection | `mongodb://preprod-db:27017/preprod_db` |
| | `PROD_DB_CONNECTION` | Production DB connection | `mongodb://prod-db:27017/prod_db` |
| **Control** | `TEST_ENV` | Test environment | `development` |
| | `CI` | CI/CD environment | `false` |
| | `DEBUG` | Debug logging | `false` |
| | `HEADLESS` | Browser headless mode | `true` |
| | `SKIP_HEALTH_CHECK` | Skip API health check | `false` |

### Configuration Validation

The framework performs automatic validation:

```typescript
validateConfig(config: EnvironmentConfig): boolean {
  // ✅ URL format validation
  new URL(config.web.baseURL);
  new URL(config.api.baseURL);
  
  // ✅ Positive timeout validation
  if (config.web.timeout <= 0) return false;
  
  // ✅ Non-negative retry validation
  if (config.web.retries < 0) return false;
  
  return true;
}
```

## ⚡ Performance Optimization

### Dynamic Worker Calculation

```typescript
calculateOptimalWorkers(): number {
  const cpuCount = os.cpus().length;
  const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024);
  
  // Use 75% of CPU cores
  let workers = Math.floor(cpuCount * 0.75);
  
  // Ensure 2GB memory per worker
  const memoryBasedWorkers = Math.floor(totalMemoryGB / 2);
  workers = Math.min(workers, memoryBasedWorkers);
  
  // Apply constraints (min: 2, max: 16)
  return Math.max(2, Math.min(16, workers));
}
```

### System Resource Analysis

The framework analyzes your system:

```bash
# Example output
🚀 Playwright Configuration:
📍 Environment: development
⚡ System Info: {
  cpuCount: 8,
  memoryGB: 16,
  platform: 'win32',
  workers: 6,
  shards: 3
}
```

### Performance Factors

| Factor | Impact | Calculation |
|--------|--------|-------------|
| **CPU Cores** | Worker count | `cores × 0.75` |
| **Memory** | Worker limit | `memory ÷ 2GB` |
| **Environment** | Base workers | Development: 2, Pre-prod: 4, Prod: 6 |
| **CI Mode** | Override | Uses environment-specific worker count |

## 🔧 Constants Management

### Adding New Constants

```typescript
// ✅ Good: Add to framework.constants.ts
export const FRAMEWORK_CONSTANTS = {
  // ... existing constants
  NEW_FEATURE: {
    TIMEOUT: 5000,
    RETRIES: 3,
    ENABLED: true,
  },
} as const;

// ❌ Bad: Hardcoded in configuration
timeout: 5000, // Don't do this
```

### Constant Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **PERFORMANCE** | System optimization | Workers, memory, CPU usage |
| **TIMEOUTS** | Time-based settings | Action, navigation, test timeouts |
| **RETRIES** | Retry configurations | Environment-specific retry counts |
| **REPORTS** | Reporting paths | HTML, JSON, screenshots, videos |
| **BROWSERS** | Browser definitions | Desktop, mobile browser lists |
| **TEST_DIRS** | Test directories | Web, API, E2E, smoke test paths |
| **ENV_VARS** | Environment variables | Variable names as constants |
| **DEFAULT_API_HEADERS** | HTTP settings | Content-Type, Accept headers |

## 🎯 Best Practices

### 1. Configuration Design

```typescript
// ✅ Good: Environment-aware configuration
const config = {
  baseURL: process.env.WEB_URL || defaultUrl,
  timeout: FRAMEWORK_CONSTANTS.TIMEOUTS.TEST_TIMEOUT[environment],
};

// ❌ Bad: Hardcoded values
const config = {
  baseURL: 'https://example.com',
  timeout: 30000,
};
```

### 2. Type Safety

```typescript
// ✅ Good: Strongly typed
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// ❌ Bad: Any types
const config: any = { ... };
```

### 3. Environment Variables

```typescript
// ✅ Good: With fallback
const dbUrl = process.env.DB_CONNECTION || 'mongodb://localhost:27017/test';

// ❌ Bad: No fallback
const dbUrl = process.env.DB_CONNECTION;
```

### 4. Validation

```typescript
// ✅ Good: Runtime validation
if (!validateConfig(config)) {
  throw new Error('Invalid configuration');
}

// ❌ Bad: No validation
// Assume configuration is always valid
```

## �️ Customization Guide

### Adding New Environment

1. **Create environment file**:
```typescript
// config/environments/staging.ts
export const stagingConfig: EnvironmentConfig = {
  web: { /* ... */ },
  api: { /* ... */ },
  // ... complete configuration
};
```

2. **Update environment manager**:
```typescript
// config/environment.ts
import { stagingConfig } from './environments/staging';

private readonly configs: Record<EnvironmentType, EnvironmentConfig> = {
  development: developmentConfig,
  'pre-prod': preProdConfig,
  prod: prodConfig,
  staging: stagingConfig, // Add new environment
};
```

3. **Update types**:
```typescript
// config/types/environment.types.ts
export type EnvironmentType = 'development' | 'pre-prod' | 'prod' | 'staging';
```

### Adding New Configuration Options

1. **Update types**:
```typescript
export interface EnvironmentConfig {
  // ... existing
  newFeature: NewFeatureConfig;
}

export interface NewFeatureConfig {
  enabled: boolean;
  apiKey: string;
  timeout: number;
}
```

2. **Add constants**:
```typescript
export const FRAMEWORK_CONSTANTS = {
  // ... existing
  NEW_FEATURE: {
    DEFAULT_TIMEOUT: 10000,
    DEFAULT_ENABLED: false,
  },
} as const;
```

3. **Update environment configs**:
```typescript
export const developmentConfig: EnvironmentConfig = {
  // ... existing
  newFeature: {
    enabled: FRAMEWORK_CONSTANTS.NEW_FEATURE.DEFAULT_ENABLED,
    apiKey: process.env.DEV_API_KEY || 'dev-key',
    timeout: FRAMEWORK_CONSTANTS.NEW_FEATURE.DEFAULT_TIMEOUT,
  },
};
```

### Performance Tuning

```typescript
// Override default performance settings
export const FRAMEWORK_CONSTANTS = {
  PERFORMANCE: {
    CPU_UTILIZATION_PERCENTAGE: 0.85, // Use 85% instead of 75%
    MIN_WORKERS: 4,                    // Increase minimum
    MAX_WORKERS: 32,                   // Increase maximum
    MEMORY_PER_WORKER_GB: 1.5,        // Reduce memory requirement
    SHARD_RATIO: 0.33,                // Reduce shards ratio
  },
  // ... rest of constants
};
```

### Custom Validation Rules

```typescript
// Add custom validation in environment manager
validateConfig(config: EnvironmentConfig): boolean {
  // Standard validation
  if (!this.standardValidation(config)) return false;
  
  // Custom validation
  if (config.api.timeout > config.web.timeout * 2) {
    console.error('API timeout should not be more than 2x web timeout');
    return false;
  }
  
  // Feature-specific validation
  if (config.features.enableMocking && config.api.baseURL.includes('production')) {
    console.error('Mocking should not be enabled in production');
    return false;
  }
  
  return true;
}
```

## 🚀 Advanced Configuration

### Conditional Configuration

```typescript
// Environment-based feature flags
export const developmentConfig: EnvironmentConfig = {
  features: {
    enableDebugLogs: !process.env.CI,              // Debug only in local
    enableMocking: process.env.NODE_ENV !== 'production',
    skipAuthValidation: process.env.SKIP_AUTH === 'true',
    enableVideoRecording: process.env.RECORD_VIDEO === 'true',
  },
};
```

### Dynamic URL Configuration

```typescript
// Multi-region support
const getRegionalUrl = (baseUrl: string): string => {
  const region = process.env.TEST_REGION || 'us-east-1';
  return baseUrl.replace('{{region}}', region);
};

export const prodConfig: EnvironmentConfig = {
  web: {
    baseURL: getRegionalUrl('https://{{region}}.app.example.com'),
    // ...
  },
};
```

### Profile-Based Configuration

```typescript
// Different profiles for same environment
const profile = process.env.TEST_PROFILE || 'default';

export const developmentConfig: EnvironmentConfig = {
  performance: {
    workers: profile === 'performance' ? 8 : 2,
    maxConcurrency: profile === 'performance' ? 16 : 4,
  },
};
```

This comprehensive configuration architecture ensures your Playwright framework is maintainable, scalable, and adaptable to any environment or requirement! 🎯
