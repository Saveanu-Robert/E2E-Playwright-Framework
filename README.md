# 🎭 E2E Playwright Framework

Enterprise-grade test automation framework built with Playwright, featuring dynamic performance optimization, multi-environment support, and comprehensive testing capabilities for both Web UI and API testing.

## 🚀 Key Features

- **🌍 Multi-Environment Support**: Development, Pre-production, and Production configurations
- **⚡ Dynamic Performance Optimization**: Auto-calculated workers and shards based on system resources
- **🌐 Cross-Browser Testing**: Desktop (Chrome, Firefox, Safari, Edge) and Mobile (Chrome, Safari, Tablet)
- **🔗 API Testing**: Dedicated API testing without browser overhead
- **📸 Smart Artifacts**: Screenshots and videos only for failed web tests
- **📊 Comprehensive Reporting**: HTML, JSON, JUnit reports with structured output
- **🎯 TypeScript Path Mapping**: Optimized imports with clean architecture
- **🔧 Enterprise Architecture**: Modular, scalable, and maintainable design

## 📁 Project Structure

```
📂 E2E-Playwright-Framework/
├── 📁 config/                          # Configuration management
│   ├── 📁 environments/                # Environment-specific configs
│   │   ├── development.ts              # Development environment
│   │   ├── pre-prod.ts                 # Pre-production environment
│   │   └── prod.ts                     # Production environment
│   ├── 📁 types/                       # TypeScript type definitions
│   │   └── environment.types.ts        # Environment configuration types
│   └── environment.ts                  # Environment manager and optimization
├── 📁 src/                             # Framework source code
│   ├── 📁 api/                         # API testing components
│   │   ├── 📁 clients/                 # API client classes
│   │   ├── 📁 models/                  # Data models and interfaces
│   │   └── 📁 schemas/                 # JSON schemas for validation
│   ├── 📁 pages/                       # Page Object Models
│   │   └── 📁 web/                     # Web page objects
│   │       └── 📁 components/          # Reusable UI components
│   ├── 📁 fixtures/                    # Test fixtures and setup
│   │   ├── 📁 api/                     # API test fixtures
│   │   └── 📁 web/                     # Web test fixtures
│   └── 📁 utils/                       # Utility functions and helpers
│       ├── 📁 config/                  # Configuration utilities
│       │   ├── global.setup.ts         # Global test setup
│       │   └── global.teardown.ts      # Global test teardown
│       ├── 📁 constants/               # Framework constants
│       │   └── framework.constants.ts  # Centralized constants
│       └── 📁 helpers/                 # Helper functions
├── 📁 tests/                           # Test files organized by type
│   ├── 📁 api/                         # API tests
│   │   ├── 📁 contract/                # Contract/schema tests
│   │   ├── 📁 functional/              # API functional tests
│   │   └── 📁 integration/             # API integration tests
│   └── 📁 web/                         # Web UI tests
│       ├── 📁 e2e/                     # End-to-end tests
│       ├── 📁 integration/             # Web integration tests
│       └── 📁 smoke/                   # Smoke tests
├── 📁 data/                            # Test data management
│   ├── 📁 testdata/                    # Static test data files
│   ├── 📁 fixtures/                    # Data fixtures
│   └── 📁 mock/                        # Mock data
├── 📁 reports/                         # Test reports and artifacts
│   ├── 📁 html/                        # HTML reports
│   ├── 📁 json/                        # JSON reports
│   ├── 📁 screenshots/                 # Test screenshots
│   └── 📁 videos/                      # Test videos
├── 📁 docs/                            # Documentation
│   └── configuration.md                # Configuration guide
├── playwright.config.ts                # Main Playwright configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Project dependencies and scripts
```

## 🛠️ Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Saveanu-Robert/E2E-Playwright-Framework.git
cd E2E-Playwright-Framework

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Install system dependencies (if needed)
npm run install:deps
```

### Running Tests

```bash
# Run all tests in development environment
npm run test:dev

# Run web tests only
npm run test:web

# Run API tests only
npm run test:api

# Run tests in production environment
npm run test:prod

# Run with debug mode
DEBUG=1 npm run test:debug

# Run in headed mode
npm run test:headed

# View test reports
npm run report
```

## 📖 Documentation

- [Configuration Guide](./docs/configuration.md) - Detailed configuration documentation
- [Environment Setup](./config/README.md) - Environment configuration guide
- [API Testing](./src/api/README.md) - API testing documentation
- [Web Testing](./src/pages/README.md) - Web testing documentation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `TEST_ENV` | Test environment | `development` | `pre-prod`, `prod` |
| `CI` | CI/CD environment flag | `false` | `true` |
| `DEBUG` | Enable debug logging | `false` | `1`, `true` |
| `HEADLESS` | Override headless mode | `true` | `false` |
| `SKIP_HEALTH_CHECK` | Skip API health check | `false` | `true` |

### URL Configuration

Set environment-specific URLs via environment variables:

```bash
# Development
export DEV_WEB_URL="https://dev-app.example.com"
export DEV_API_URL="https://api-dev.example.com"

# Pre-production
export PREPROD_WEB_URL="https://preprod-app.example.com"
export PREPROD_API_URL="https://api-preprod.example.com"

# Production
export PROD_WEB_URL="https://app.example.com"
export PROD_API_URL="https://api.example.com"
```

## 🎯 Path Mapping

Use TypeScript path mapping for clean imports:

```typescript
// Instead of relative paths
import { HomePage } from '../../../src/pages/web/HomePage';

// Use path mapping
import { HomePage } from '@pages/web/HomePage';
import { ApiClient } from '@api/clients/ApiClient';
import { TestData } from '@data/testdata/users';
import { Helper } from '@utils/helpers/common';
```

## 📊 Performance Optimization

The framework automatically optimizes performance based on your system:

- **Workers**: 75% of CPU cores (min: 2, max: 16)
- **Memory**: Ensures 2GB per worker
- **Shards**: Calculated as workers/2 for optimal distribution

## 🌐 Browser Support

### Desktop Browsers
- ✅ Chromium (Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Microsoft Edge

### Mobile Devices
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)
- ✅ Tablet Chrome (iPad Pro)

## 📋 Test Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:web` | Run web tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:dev` | Run in development environment |
| `npm run test:pre-prod` | Run in pre-production environment |
| `npm run test:prod` | Run in production environment |
| `npm run test:chromium` | Run Chrome tests only |
| `npm run test:firefox` | Run Firefox tests only |
| `npm run test:webkit` | Run Safari tests only |
| `npm run test:edge` | Run Edge tests only |
| `npm run test:mobile` | Run mobile browser tests |
| `npm run test:desktop` | Run desktop browser tests |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:contract` | Run contract tests |
| `npm run test:functional` | Run functional API tests |
| `npm run test:sharded` | Run with sharding |
| `npm run test:headed` | Run in headed mode |
| `npm run test:debug` | Run in debug mode |
| `npm run test:ui` | Run with UI mode |
| `npm run report` | Open HTML report |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions and support, please open an issue in the [GitHub repository](https://github.com/Saveanu-Robert/E2E-Playwright-Framework/issues).