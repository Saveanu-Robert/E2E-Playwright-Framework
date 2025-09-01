// @ts-check
const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const playwright = require('eslint-plugin-playwright');
const unusedImports = require('eslint-plugin-unused-imports');
const globals = require('globals');

module.exports = [
  // Global ignores (must be first)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'reports/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      '*.min.js',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  },

  // Base JavaScript configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // Import/Export rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Code quality rules
      complexity: ['error', { max: 10 }],
      'max-depth': ['error', 4],
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 4],
      'no-console': 'off', // Allowed for test logging
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // Best practices
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      'no-lone-blocks': 'error',
      'no-multi-spaces': 'error',
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-redeclare': 'error',
      'no-self-compare': 'error',
      'no-unused-expressions': 'error',
      radix: 'error',
      yoda: 'error',

      // Style rules (handled mostly by Prettier, but some logical ones)
      'consistent-return': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-exponentiation-operator': 'error',

      // Error prevention
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',
    },
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // Import/Export rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      // Code quality rules
      complexity: ['error', { max: 10 }],
      'max-depth': ['error', 4],
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 4],
      'no-console': 'off', // Allowed for test logging
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // Best practices
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      'no-lone-blocks': 'error',
      'no-multi-spaces': 'error',
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-redeclare': 'error',
      'no-self-compare': 'error',
      'no-unused-expressions': 'error',
      radix: 'error',
      yoda: 'error',

      // Style rules (handled mostly by Prettier, but some logical ones)
      'consistent-return': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-exponentiation-operator': 'error',

      // Error prevention
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',
    },
  },

  // Playwright test files specific configuration
  {
    files: ['tests/**/*.{ts,js}', '**/*.spec.{ts,js}', '**/*.test.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      playwright,
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // Import/Export rules
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Playwright specific rules
      'playwright/expect-expect': 'off', // Allow tests without explicit expect
      'playwright/max-nested-describe': ['error', { max: 3 }],
      'playwright/no-conditional-in-test': 'warn', // Allow conditionals in tests
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'warn', // Allow eval in some cases
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-page-pause': 'error',
      'playwright/no-restricted-matchers': 'off',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-lowercase-title': 'error',
      'playwright/prefer-strict-equal': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/require-top-level-describe': 'error',
      'playwright/valid-describe-callback': 'error',
      'playwright/valid-expect': 'error',
      'playwright/valid-title': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-expect': 'warn',
      'playwright/no-networkidle': 'error',
      'playwright/no-standalone-expect': 'off', // Disabled for custom apiTest fixture
      'playwright/no-unsafe-references': 'error',
      'playwright/no-wait-for-navigation': 'error',
      'playwright/no-wait-for-selector': 'warn',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/valid-expect-in-promise': 'error',

      // TypeScript specific rules for tests
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow in tests
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Relax some rules for test files
      'max-lines-per-function': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 1000, skipBlankLines: true, skipComments: true }],
      'no-console': 'off',
      'no-nested-ternary': 'warn', // Allow in tests
      complexity: ['error', { max: 20 }], // Allow more complexity in tests
      'no-undef': 'off', // Turn off for tests as they may use global objects
    },
  },

  // Configuration files
  {
    files: [
      '*.config.{js,ts}',
      'playwright.config.{js,ts}',
      'eslint.config.{js,cjs}',
      '**/config/**/*.{js,ts}',
      '**/*.types.{ts,js}',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'no-console': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
      'max-lines': 'off',
      'no-new': 'off', // Allow new for side effects in config files
      'no-empty-pattern': 'off', // Allow empty patterns in fixtures and config files
      'no-unused-vars': 'off', // Allow unused parameters in config and type files
      'unused-imports/no-unused-vars': 'off',
    },
  },

  // Fixture files - allow empty object patterns for Playwright fixtures
  {
    files: ['**/fixtures/**/*.{ts,js}'],
    rules: {
      'no-empty-pattern': 'off', // Playwright fixtures often use empty destructuring
      'no-unused-vars': 'off', // Interface parameters in fixtures are often unused
      'unused-imports/no-unused-vars': 'off', // Interface parameters in fixtures are often unused
    },
  },

  // Mocked test files - more lenient rules for error handling
  {
    files: ['**/mocked/**/*.spec.{ts,js}', '**/mock/**/*.spec.{ts,js}'],
    rules: {
      'no-unused-vars': 'off', // Allow unused error variables in mocked tests
      'unused-imports/no-unused-vars': 'off', // Allow unused error variables
      'max-lines-per-function': ['error', { max: 700 }], // Allow longer functions for complex mocks
    },
  },
];
