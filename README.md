# 🎭 E2E Playwright Framework

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

> A modern, enterprise-grade end-to-end testing framework built with Microsoft
> Playwright. Featuring comprehensive documentation, professional code quality,
> and scalable architecture. Free to use, fork, and contribute! 🚀

## 🌟 About This Project

This framework is **completely free and open source**! Whether you're a startup,
enterprise, or individual developer, you can use this framework without any
restrictions. We encourage the community to contribute, fork, and help make it
even better.

### 🤝 Community-Driven Development

- **🆓 100% Free**: No licensing fees, no restrictions
- **🔓 Open Source**: ISC licensed for maximum freedom
- **🤝 Contribution Welcome**: Submit PRs, report issues, suggest features
- **🍴 Fork Friendly**: Create your own versions and improvements
- **📚 Learning Resource**: Great for learning modern test automation patterns
- **🌍 Global Community**: Join developers worldwide using this framework

## ✨ Key Features

### 🏗️ Architecture & Design

- **🎯 TypeScript-First**: Full type safety with intelligent IntelliSense
- **🏛️ Enterprise Architecture**: Modular, scalable, and maintainable codebase
- **📦 Page Object Model**: Clean separation of concerns with reusable
  components
- **🔌 Fixture-Based**: Powerful test fixtures for setup and teardown
- **🛠️ Path Mapping**: Clean imports with `@src/`, `@pages/`, `@data/` aliases
- **📋 Professional Documentation**: Comprehensive API docs, guides, and
  examples

### 🌐 Testing Capabilities

- **🌍 Multi-Environment**: Seamless testing across Dev, Staging, and Production
- **🖥️ Cross-Browser**: Chrome, Firefox, Safari, Edge support
- **📱 Mobile Testing**: iPhone, Android, and Tablet simulation
- **🔗 API Testing**: Full REST API testing with schema validation
- **🎭 Mocking Support**: Built-in request/response mocking capabilities
- **👁️ Visual Testing**: Screenshot comparison and visual regression testing

### ⚡ Performance & Optimization

- **🚀 Dynamic Scaling**: Auto-calculated workers based on system resources
- **⚖️ Load Balancing**: Intelligent test sharding for optimal execution
- **📊 Resource Management**: Memory-aware worker allocation
- **🎯 Parallel Execution**: Run tests across multiple browsers simultaneously
- **⏱️ Performance Tracking**: Built-in metrics and benchmarking

### 📸 Reporting & Debugging

- **📊 Rich Reports**: HTML, JSON, and JUnit formats
- **📸 Smart Artifacts**: Screenshots and videos for failed tests only
- **🔍 Debug Mode**: Detailed logging and step-by-step execution
- **📈 Performance Metrics**: Test execution timing and resource usage
- **🎪 Interactive Reports**: Playwright's native UI mode support

### ✨ Code Quality & Maintenance

- **🔧 ESLint v9**: Latest linting with flat config format
- **💄 Prettier**: Consistent code formatting across the project
- **🧹 Auto Cleanup**: Removes unused imports and dead code
- **📝 Type Safety**: Comprehensive TypeScript coverage
- **📚 Professional Comments**: JSDoc documentation throughout codebase

## 📚 Documentation

### 📖 Comprehensive Guides

- **[📋 Framework Architecture](docs/framework-architecture.md)** - Detailed
  architecture overview with diagrams
- **[🔧 API Reference](docs/api/framework-api.md)** - Complete API documentation
- **[📝 Code Documentation Standards](docs/code-documentation-standards.md)** -
  Professional commenting guidelines
- **[🧪 Testing Strategy](docs/testing-strategy.md)** - Comprehensive testing
  approach
- **[🛠️ Component Guide](docs/guides/component-documentation.md)** - Detailed
  component documentation
- **[⚙️ Configuration Guide](docs/configuration.md)** - Environment and setup
  configuration

### 🎯 Quick Access Documentation

| Topic               | Description                       | Link                                                                                                 |
| ------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Getting Started** | Setup and first test run          | [docs/guides/getting-started.md](docs/guides/getting-started.md)                                     |
| **Page Objects**    | Page Object Model implementation  | [docs/api/framework-api.md#page-objects-api](docs/api/framework-api.md#page-objects-api)             |
| **Test Fixtures**   | Fixture configuration and usage   | [docs/api/framework-api.md#fixtures-api](docs/api/framework-api.md#fixtures-api)                     |
| **API Testing**     | REST API testing capabilities     | [docs/api/framework-api.md#api-testing-components](docs/api/framework-api.md#api-testing-components) |
| **Configuration**   | Environment and performance setup | [docs/api/framework-api.md#configuration-api](docs/api/framework-api.md#configuration-api)           |
| **Best Practices**  | Testing guidelines and standards  | [docs/testing-strategy.md#best-practices](docs/testing-strategy.md#best-practices)                   |

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
│       ├── 📁 mocked/                  # Tests with mocked services
│       ├── 📁 smoke/                   # Smoke tests
│       └── 📁 validation/              # Component validation tests
├── 📁 data/                            # Test data management
│   ├── 📁 testdata/                    # Static test data files
│   ├── 📁 fixtures/                    # Data fixtures
│   └── 📁 mock/                        # Mock data
├── 📁 reports/                         # Test reports and artifacts
│   ├── 📁 html/                        # HTML reports
│   ├── 📁 json/                        # JSON reports
│   ├── 📁 screenshots/                 # Test screenshots
│   └── 📁 videos/                      # Test videos
├── 📁 docs/                            # 📚 Comprehensive Documentation
    ├── 📁 api/                         # API Reference Documentation
    │   └── framework-api.md            # Complete API documentation
    ├── 📁 guides/                      # Detailed guides and tutorials
    │   ├── getting-started.md          # Quick start guide
    │   └── component-documentation.md  # Component usage guide
    ├── framework-architecture.md       # Architecture overview with diagrams
    ├── code-documentation-standards.md # Professional commenting guidelines
    ├── testing-strategy.md             # Comprehensive testing approach
    └── configuration.md                # Configuration reference
```

## 🛠️ Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for version control

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

### Your First Test Run

```bash
# Run all tests in development environment
npm run test:dev

# Run a quick smoke test
npm run test:smoke

# View the test report
npm run report
```

## 🚀 Running Tests

### Environment-Based Testing

```bash
# Development environment
npm run test:dev

# Pre-production environment
npm run test:pre-prod

# Production environment
npm run test:prod
```

### Test Type Execution

```bash
# Web UI tests only
npm run test:web

# API tests only
npm run test:api

# End-to-end tests
npm run test:e2e

# Integration tests
npm run test:integration

# Smoke tests
npm run test:smoke
```

### Browser-Specific Testing

```bash
# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:edge

# Mobile devices
npm run test:mobile

# Desktop browsers only
npm run test:desktop
```

### Advanced Execution

```bash
# Debug mode with detailed logging
DEBUG=1 npm run test:debug

# Headed mode (visible browser)
npm run test:headed

# Interactive UI mode
npm run test:ui

# Parallel execution with sharding
npm run test:sharded
```

## 🔧 Configuration

### Environment Variables

Configure the framework using environment variables:

| Variable              | Description              | Default                                | Example                 |
| --------------------- | ------------------------ | -------------------------------------- | ----------------------- |
| `TEST_ENV`            | Test environment         | `development`                          | `pre-prod`, `prod`      |
| `CI`                  | CI/CD environment flag   | `false`                                | `true`                  |
| `DEBUG`               | Enable debug logging     | `false`                                | `1`, `true`             |
| `HEADLESS`            | Override headless mode   | `true`                                 | `false`                 |
| `SKIP_HEALTH_CHECK`   | Skip API health check    | `false`                                | `true`                  |
| `JSONPLACEHOLDER_URL` | JSONPlaceholder base URL | `https://jsonplaceholder.typicode.com` | `http://localhost:3000` |

### URL Configuration

Set environment-specific URLs:

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

### Performance Optimization

The framework automatically optimizes performance:

- **Workers**: 75% of CPU cores (min: 2, max: 16)
- **Memory**: Ensures 2GB per worker minimum
- **Shards**: Calculated as workers/2 for optimal distribution

## 🎯 TypeScript Path Mapping

Use clean imports with path aliases:

```typescript
// ❌ Before: Relative paths
import { HomePage } from '../../../src/pages/web/HomePage';
import { ApiClient } from '../../../src/api/clients/ApiClient';

// ✅ After: Path mapping
import { HomePage } from '@pages/web/HomePage';
import { ApiClient } from '@api/clients/ApiClient';
import { TestData } from '@data/testdata/users';
import { Helper } from '@utils/helpers/common';
```

## 🧹 Code Quality & Linting

### Built-in Quality Tools

```bash
# Lint and auto-fix issues
npm run lint

# Format code with Prettier
npm run format

# Run both linting and formatting
npm run code:clean

# Check code quality without fixing
npm run code:check
```

### Quality Standards

- **ESLint v9**: Latest flat config with TypeScript rules
- **Prettier**: Consistent formatting across all files
- **Type Safety**: Comprehensive TypeScript coverage
- **Best Practices**: Playwright-specific linting rules
- **Auto Cleanup**: Removes unused imports and variables

## 📊 Test Reports

### Generate Reports

```bash
# View HTML report
npm run report

# Generate custom reports
npm run test -- --reporter=html,json,junit
```

### Report Types

- **HTML**: Interactive web-based reports with screenshots
- **JSON**: Machine-readable format for CI/CD integration
- **JUnit**: XML format for Jenkins and other CI tools

## 🌐 Browser Support

### Desktop Browsers

- ✅ **Chromium** (Chrome/Edge)
- ✅ **Firefox**
- ✅ **WebKit** (Safari)
- ✅ **Microsoft Edge**

### Mobile Devices

- ✅ **Mobile Chrome** (Pixel 5 simulation)
- ✅ **Mobile Safari** (iPhone 12 simulation)
- ✅ **Tablet Chrome** (iPad Pro simulation)

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   `git clone https://github.com/YOUR_USERNAME/E2E-Playwright-Framework.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** your changes: `npm run test`
6. **Lint** your code: `npm run code:clean`
7. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Create** a Pull Request

### Contribution Guidelines

- **Code Style**: Follow the existing ESLint and Prettier configuration
- **Tests**: Add tests for new features and ensure existing tests pass
- **Documentation**: Update README and docs for new features
- **Commit Messages**: Use conventional commit format (`feat:`, `fix:`, `docs:`,
  etc.)

### Types of Contributions

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Add new testing capabilities
- 📚 **Documentation**: Improve guides and examples
- 🔧 **Configuration**: Enhance environment configs
- 🎨 **Page Objects**: Add new page object models
- 🧪 **Test Cases**: Contribute new test scenarios

### What This Means

- ✅ **Commercial Use**: Use in commercial projects freely
- ✅ **Modification**: Modify and adapt to your needs
- ✅ **Distribution**: Share and redistribute
- ✅ **Private Use**: Use in private projects
- ❌ **Liability**: No warranty or liability provided
- ❌ **Patent Use**: No patent rights granted

## 🆘 Support & Community

### Getting Help

- 📋 **Issues**:
  [Report bugs or request features](https://github.com/Saveanu-Robert/E2E-Playwright-Framework/issues)
-  **Documentation**: Check the `docs/` folder for detailed guides

### Community Guidelines

- Be respectful and constructive
- Search existing issues before creating new ones
- Provide clear reproduction steps for bugs
- Include relevant code examples
- Follow the issue and PR templates

## 🎉 Acknowledgments

Special thanks to:

- 🎭 **Microsoft Playwright Team** for the amazing testing framework
- 🏗️ **TypeScript Team** for robust type safety
- 🌐 **Open Source Community** for inspiration and contributions

---

**Ready to start testing?** Clone this repository and run `npm install` to get
started! 🚀

**Questions?** Open an issue and we'll help you out! 💬

**Want to contribute?** We'd love your help! Check out our contribution
guidelines above. 🤝
