import { test as base, type APIRequestContext, type Page, type Route } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { getEnvironmentConfig } from '@config/environment';
import { JSON_SCHEMAS } from '@api/schemas/jsonplaceholder.schemas';
import { JSONPLACEHOLDER_API } from '@utils/constants/jsonplaceholder.constants';

/**
 * Custom test fixtures for JSONPlaceholder API Testing
 * Provides pre-configured API context, schema validation, and utilities
 *
 * Features:
 * - Authenticated API context
 * - JSON Schema validation
 * - Request/response helpers
 * - Mock data support
 * - Performance tracking
 *
 * @example
 * ```typescript
 * import { apiTest, expect } from '@fixtures/api/jsonplaceholder.fixture';
 *
 * apiTest('should get posts', async ({ jsonPlaceholderClient, schemaValidator }) => {
 *   const response = await jsonPlaceholderClient.getPosts();
 *   expect(response.status()).toBe(200);
 *
 *   const posts = await response.json();
 *   schemaValidator.validatePostsArray(posts);
 * });
 * ```
 */

/**
 * Mock Context for testing with controlled responses
 */
interface MockContext {
  mockSuccessResponse: (_pattern: string | RegExp, _options: any) => Promise<void>;
  mockErrorResponse: (_pattern: string | RegExp, _options: any) => Promise<void>;
  mockTimeout: (_pattern: string | RegExp, _delay?: number) => Promise<void>;
  mockRawResponse: (_pattern: string | RegExp, _options: any) => Promise<void>;
  mockSlowResponse: (_pattern: string | RegExp, _options: any) => Promise<void>;
}

interface JsonPlaceholderApiFixtures {
  /** API request context configured for JSONPlaceholder */
  apiContext: APIRequestContext;
  /** JSONPlaceholder API base URL */
  apiBaseUrl: string;
  /** Authentication headers */
  authHeaders: Record<string, string>;
  /** JSONPlaceholder API client with helper methods */
  jsonPlaceholderClient: JsonPlaceholderApiClient;
  /** Schema validator for response validation */
  schemaValidator: SchemaValidator;
  /** Performance tracker for response times */
  performanceTracker: PerformanceTracker;
  /** Mock context for testing with controlled responses */
  mockContext: MockContext;
}

/**
 * JSONPlaceholder API Client
 * Provides convenient methods for interacting with the JSONPlaceholder API
 */
class JsonPlaceholderApiClient {
  private readonly context: APIRequestContext;
  private readonly baseUrl: string;

  constructor(context: APIRequestContext, baseUrl: string) {
    this.context = context;
    this.baseUrl = baseUrl;
  }

  // Posts endpoints
  async getPosts() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.POSTS.GET_ALL}`);
  }

  async getPost(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getPostComments(postId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.GET_COMMENTS.replace(
      '{id}',
      String(postId),
    );
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async createPost(data: { title: string; body: string; userId: number }) {
    return this.context.post(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.POSTS.CREATE}`, {
      headers: {
        'Content-Type': JSONPLACEHOLDER_API.REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
      },
      data,
    });
  }

  async updatePost(id: number, data: { id: number; title: string; body: string; userId: number }) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.UPDATE.replace('{id}', String(id));
    return this.context.put(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': JSONPLACEHOLDER_API.REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
      },
      data,
    });
  }

  async patchPost(id: number, data: Partial<{ title: string; body: string; userId: number }>) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.PATCH.replace('{id}', String(id));
    return this.context.patch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': JSONPLACEHOLDER_API.REQUEST_CONFIG.HEADERS.CONTENT_TYPE,
      },
      data,
    });
  }

  async deletePost(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.DELETE.replace('{id}', String(id));
    return this.context.delete(`${this.baseUrl}${endpoint}`);
  }

  // Comments endpoints
  async getComments() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.COMMENTS.GET_ALL}`);
  }

  async getComment(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.COMMENTS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getCommentsByPost(postId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.COMMENTS.GET_BY_POST.replace(
      '{postId}',
      String(postId),
    );
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  // Albums endpoints
  async getAlbums() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.ALBUMS.GET_ALL}`);
  }

  async getAlbum(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.ALBUMS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getAlbumPhotos(albumId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.ALBUMS.GET_PHOTOS.replace(
      '{id}',
      String(albumId),
    );
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  // Photos endpoints
  async getPhotos() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.PHOTOS.GET_ALL}`);
  }

  async getPhoto(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.PHOTOS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  // Todos endpoints
  async getTodos() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.TODOS.GET_ALL}`);
  }

  async getTodo(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.TODOS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getUserTodos(userId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.TODOS.GET_BY_USER.replace(
      '{userId}',
      String(userId),
    );
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  // Users endpoints
  async getUsers() {
    return this.context.get(`${this.baseUrl}${JSONPLACEHOLDER_API.ENDPOINTS.USERS.GET_ALL}`);
  }

  async getUser(id: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.USERS.GET_BY_ID.replace('{id}', String(id));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getUserAlbums(userId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.USERS.GET_ALBUMS.replace('{id}', String(userId));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getUserTodosFromUser(userId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.USERS.GET_TODOS.replace('{id}', String(userId));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }

  async getUserPosts(userId: number) {
    const endpoint = JSONPLACEHOLDER_API.ENDPOINTS.USERS.GET_POSTS.replace('{id}', String(userId));
    return this.context.get(`${this.baseUrl}${endpoint}`);
  }
}

/**
 * Schema Validator
 * Validates API responses against JSON Schema definitions
 */
class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);

    // Add individual schemas for each resource type
    this.ajv.addSchema(JSON_SCHEMAS.POST, 'post');
    this.ajv.addSchema(JSON_SCHEMAS.COMMENT, 'comment');
    this.ajv.addSchema(JSON_SCHEMAS.USER, 'user');
    this.ajv.addSchema(JSON_SCHEMAS.ALBUM, 'album');
    this.ajv.addSchema(JSON_SCHEMAS.PHOTO, 'photo');
    this.ajv.addSchema(JSON_SCHEMAS.TODO, 'todo');
  }

  validatePost(data: unknown): boolean {
    const validate = this.ajv.getSchema('post');
    if (!validate) {
      throw new Error('Post schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(`Post schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    return true;
  }

  validatePostsArray(data: unknown): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Expected posts array');
    }

    data.forEach((post, index) => {
      try {
        this.validatePost(post);
      } catch (error) {
        throw new Error(`Post at index ${index} failed validation: ${error}`);
      }
    });
    return true;
  }

  validateComment(data: unknown): boolean {
    const validate = this.ajv.getSchema('comment');
    if (!validate) {
      throw new Error('Comment schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(
        `Comment schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`,
      );
    }
    return true;
  }

  validateCommentsArray(data: unknown): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Expected comments array');
    }

    data.forEach((comment, index) => {
      try {
        this.validateComment(comment);
      } catch (error) {
        throw new Error(`Comment at index ${index} failed validation: ${error}`);
      }
    });
    return true;
  }

  validateUser(data: unknown): boolean {
    const validate = this.ajv.getSchema('user');
    if (!validate) {
      throw new Error('User schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(`User schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    return true;
  }

  validateUsersArray(data: unknown): boolean {
    if (!Array.isArray(data)) {
      throw new Error('Expected users array');
    }

    data.forEach((user, index) => {
      try {
        this.validateUser(user);
      } catch (error) {
        throw new Error(`User at index ${index} failed validation: ${error}`);
      }
    });
    return true;
  }

  validateAlbum(data: unknown): boolean {
    const validate = this.ajv.getSchema('album');
    if (!validate) {
      throw new Error('Album schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(
        `Album schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`,
      );
    }
    return true;
  }

  validatePhoto(data: unknown): boolean {
    const validate = this.ajv.getSchema('photo');
    if (!validate) {
      throw new Error('Photo schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(
        `Photo schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`,
      );
    }
    return true;
  }

  validateTodo(data: unknown): boolean {
    const validate = this.ajv.getSchema('todo');
    if (!validate) {
      throw new Error('Todo schema not found');
    }

    const isValid = validate(data);
    if (!isValid) {
      throw new Error(`Todo schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }
    return true;
  }
}

/**
 * Performance Tracker
 * Tracks API response times and performance metrics
 */
class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map();

  startTimer(operation: string): () => number {
    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      this.recordMetric(operation, duration);
      return duration;
    };
  }

  recordMetric(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    const metrics = this.metrics.get(operation);
    if (metrics) {
      metrics.push(duration);
    }
  }

  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation) ?? [];
    if (times.length === 0) {
      return 0;
    }
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMaxTime(operation: string): number {
    const times = this.metrics.get(operation) ?? [];
    return times.length > 0 ? Math.max(...times) : 0;
  }

  getMinTime(operation: string): number {
    const times = this.metrics.get(operation) ?? [];
    return times.length > 0 ? Math.min(...times) : 0;
  }

  getAllMetrics(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const result: Record<string, { avg: number; max: number; min: number; count: number }> = {};

    this.metrics.forEach((times, operation) => {
      result[operation] = {
        avg: this.getAverageTime(operation),
        max: this.getMaxTime(operation),
        min: this.getMinTime(operation),
        count: times.length,
      };
    });

    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}

/**
 * Extended test with JSONPlaceholder API-specific fixtures
 */
export const apiTest = base.extend<JsonPlaceholderApiFixtures>({
  /**
   * API Base URL fixture - gets JSONPlaceholder URL from environment
   */
  apiBaseUrl: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    console.log(`🌍 Using JSONPlaceholder API base URL: ${envConfig.jsonplaceholder.baseURL}`);
    await use(envConfig.jsonplaceholder.baseURL);
  },

  /**
   * Authentication Headers fixture
   */
  authHeaders: async ({}, use) => {
    const envConfig = getEnvironmentConfig();
    console.log('🔑 Setting up JSONPlaceholder API headers');
    await use(envConfig.jsonplaceholder.headers);
  },

  /**
   * API Request Context fixture with authentication
   */
  apiContext: async ({ playwright, apiBaseUrl, authHeaders }, use) => {
    console.log('🏗️ Creating JSONPlaceholder API context');

    const apiContext = await playwright.request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        ...authHeaders,
        'User-Agent': JSONPLACEHOLDER_API.REQUEST_CONFIG.HEADERS.USER_AGENT,
      },
      timeout: JSONPLACEHOLDER_API.REQUEST_CONFIG.TIMEOUTS.DEFAULT,
    });

    console.log('✅ JSONPlaceholder API context ready');
    await use(apiContext);

    console.log('🧹 Disposing JSONPlaceholder API context');
    await apiContext.dispose();
  },

  /**
   * JSONPlaceholder API Client fixture
   */
  jsonPlaceholderClient: async ({ apiContext, apiBaseUrl }, use) => {
    console.log('🔧 Creating JSONPlaceholder API client');
    const client = new JsonPlaceholderApiClient(apiContext, apiBaseUrl);
    await use(client);
  },

  /**
   * Schema Validator fixture
   */
  schemaValidator: async ({}, use) => {
    console.log('📝 Setting up schema validator');
    const validator = new SchemaValidator();
    await use(validator);
  },

  /**
   * Performance Tracker fixture
   */
  performanceTracker: async ({}, use) => {
    console.log('⏱️ Setting up performance tracker');
    const tracker = new PerformanceTracker();
    await use(tracker);

    // Log performance metrics after test
    const metrics = tracker.getAllMetrics();
    if (Object.keys(metrics).length > 0) {
      console.log('📊 Performance Metrics:', JSON.stringify(metrics, null, 2));
    }
  },

  /**
   * Mock context for testing with controlled responses
   */
  mockContext: async ({ page }: { page: Page }, use: any) => {
    const mockContext = {
      /**
       * Mock successful response
       */
      mockSuccessResponse: async (pattern: string | RegExp, options: any) => {
        console.log('🎭 Setting up request mocking context');
        console.log(`🎭 Using mocked API base URL: ${JSONPLACEHOLDER_API.BASE_URL}`);

        await page.route(pattern, async (route: Route) => {
          await route.fulfill({
            status: options.status ?? 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
              ...options.headers,
            },
            body: JSON.stringify(options.data),
          });
        });

        console.log(`📝 Testing mocked ${pattern} response handling`);
      },

      /**
       * Mock error response
       */
      mockErrorResponse: async (pattern: string | RegExp, options: any) => {
        console.log('🎭 Setting up request mocking context');
        console.log(`🎭 Using mocked API base URL: ${JSONPLACEHOLDER_API.BASE_URL}`);

        await page.route(pattern, async (route: Route) => {
          await route.fulfill({
            status: options.status ?? 500,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*',
              ...options.headers,
            },
            body: JSON.stringify(options.data ?? { error: 'Mocked error' }),
          });
        });

        console.log(`❌ Testing mocked ${options.status ?? 500} error response handling`);
      },

      /**
       * Mock network timeout
       */
      mockTimeout: async (pattern: string | RegExp, delay = 10000) => {
        console.log('🎭 Setting up request mocking context');
        console.log(`🎭 Using mocked API base URL: ${JSONPLACEHOLDER_API.BASE_URL}`);
        console.log(`⏱️ Testing mocked network timeout handling`);

        await page.route(pattern, async (route: Route) => {
          await new Promise<void>(resolve => {
            setTimeout(() => {
              resolve();
            }, delay);
          });
          await route.abort('timedout');
        });
      },

      /**
       * Mock raw response
       */
      mockRawResponse: async (pattern: string | RegExp, options: any) => {
        console.log('🎭 Setting up request mocking context');
        console.log(`🎭 Using mocked API base URL: ${JSONPLACEHOLDER_API.BASE_URL}`);
        console.log(`🔧 Testing mocked malformed JSON response handling`);

        await page.route(pattern, async (route: Route) => {
          await route.fulfill({
            status: options.status ?? 200,
            headers: options.headers ?? {},
            body: options.body,
          });
        });
      },

      /**
       * Mock slow response
       */
      mockSlowResponse: async (pattern: string | RegExp, options: any) => {
        console.log('🎭 Setting up request mocking context');
        console.log(`🎭 Using mocked API base URL: ${JSONPLACEHOLDER_API.BASE_URL}`);
        console.log(`🐌 Testing mocked slow response handling`);

        await page.route(pattern, async (route: Route) => {
          await new Promise<void>(resolve => {
            setTimeout(() => {
              resolve();
            }, options.delay ?? 1000);
          });
          await route.fulfill({
            status: options.status ?? 200,
            contentType: 'application/json',
            headers: {
              'Access-Control-Allow-Origin': '*',
              ...options.headers,
            },
            body: JSON.stringify(options.data),
          });
        });
      },
    };

    await use(mockContext);
    console.log('🧹 Cleaning up request mocks');
  },
});

export { expect } from '@playwright/test';
