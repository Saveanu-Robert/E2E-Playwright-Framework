/**
 * JSONPlaceholder API Constants
 * Centralized configuration for JSONPlaceholder API testing
 *
 * Features:
 * - API endpoints and resource identifiers
 * - Request/response configurations
 * - Test data references
 * - HTTP status codes and error messages
 *
 * @example
 * ```typescript
 * import { JSONPLACEHOLDER_API } from '@utils/constants/jsonplaceholder.constants';
 *
 * const url = JSONPLACEHOLDER_API.ENDPOINTS.POSTS.GET_ALL;
 * const validId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;
 * ```
 */

export const JSONPLACEHOLDER_API = {
  // Base Configuration
  // Prefer environment override; fall back to public endpoint
  BASE_URL: process.env.JSONPLACEHOLDER_URL ?? 'https://jsonplaceholder.typicode.com',

  // API Endpoints
  ENDPOINTS: {
    POSTS: {
      GET_ALL: '/posts',
      GET_BY_ID: '/posts/{id}',
      GET_COMMENTS: '/posts/{id}/comments',
      CREATE: '/posts',
      UPDATE: '/posts/{id}',
      PATCH: '/posts/{id}',
      DELETE: '/posts/{id}',
    },
    COMMENTS: {
      GET_ALL: '/comments',
      GET_BY_ID: '/comments/{id}',
      GET_BY_POST: '/comments?postId={postId}',
      CREATE: '/comments',
      UPDATE: '/comments/{id}',
      DELETE: '/comments/{id}',
    },
    ALBUMS: {
      GET_ALL: '/albums',
      GET_BY_ID: '/albums/{id}',
      GET_PHOTOS: '/albums/{id}/photos',
      CREATE: '/albums',
      UPDATE: '/albums/{id}',
      DELETE: '/albums/{id}',
    },
    PHOTOS: {
      GET_ALL: '/photos',
      GET_BY_ID: '/photos/{id}',
      GET_BY_ALBUM: '/photos?albumId={albumId}',
      CREATE: '/photos',
      UPDATE: '/photos/{id}',
      DELETE: '/photos/{id}',
    },
    TODOS: {
      GET_ALL: '/todos',
      GET_BY_ID: '/todos/{id}',
      GET_BY_USER: '/todos?userId={userId}',
      CREATE: '/todos',
      UPDATE: '/todos/{id}',
      DELETE: '/todos/{id}',
    },
    USERS: {
      GET_ALL: '/users',
      GET_BY_ID: '/users/{id}',
      GET_ALBUMS: '/users/{id}/albums',
      GET_TODOS: '/users/{id}/todos',
      GET_POSTS: '/users/{id}/posts',
      CREATE: '/users',
      UPDATE: '/users/{id}',
      DELETE: '/users/{id}',
    },
  },

  // Resource Counts (for testing boundary conditions)
  RESOURCE_COUNTS: {
    POSTS: 100,
    COMMENTS: 500,
    ALBUMS: 100,
    PHOTOS: 5000,
    TODOS: 200,
    USERS: 10,
  },

  // Valid Test Data IDs
  TEST_DATA: {
    VALID_IDS: {
      POST: 1,
      COMMENT: 1,
      ALBUM: 1,
      PHOTO: 1,
      TODO: 1,
      USER: 1,
    },
    INVALID_IDS: {
      NON_EXISTENT: 99999,
      NEGATIVE: -1,
      ZERO: 0,
      STRING: 'invalid',
    },
    BOUNDARY_IDS: {
      LAST_POST: 100,
      LAST_COMMENT: 500,
      LAST_ALBUM: 100,
      LAST_PHOTO: 5000,
      LAST_TODO: 200,
      LAST_USER: 10,
    },
  },

  // HTTP Status Codes
  STATUS_CODES: {
    SUCCESS: {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
    },
    CLIENT_ERROR: {
      BAD_REQUEST: 400,
      NOT_FOUND: 404,
      UNPROCESSABLE_ENTITY: 422,
    },
    SERVER_ERROR: {
      INTERNAL_SERVER_ERROR: 500,
    },
  },

  // Request Configuration
  REQUEST_CONFIG: {
    HEADERS: {
      CONTENT_TYPE: 'application/json; charset=UTF-8',
      ACCEPT: 'application/json',
      USER_AGENT: 'JSONPlaceholder-Playwright-Tests/1.0',
    },
    TIMEOUTS: {
      DEFAULT: 10000,
      SLOW_ENDPOINT: 15000,
    },
  },

  // Test Categories
  TEST_CATEGORIES: {
    CONTRACT: 'contract',
    FUNCTIONAL: 'functional',
    INTEGRATION: 'integration',
    MOCKED: 'mocked',
  },

  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND: 'Resource not found',
    INVALID_DATA: 'Invalid request data',
    SERVER_ERROR: 'Internal server error',
  },

  // Mock Response Indicators
  MOCK_INDICATORS: {
    // JSONPlaceholder returns these for POST/PUT/PATCH operations
    FAKE_UPDATE_ID: 101, // For created resources
    FAKE_RESPONSE: true, // Indicates mock response
  },

  // Rate Limiting (JSONPlaceholder doesn't enforce, but good practice)
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 100,
    CONCURRENT_REQUESTS: 10,
  },

  // Response Time Expectations (in milliseconds)
  PERFORMANCE_BENCHMARKS: {
    FAST_RESPONSE: 1000,
    ACCEPTABLE_RESPONSE: 2000,
    SLOW_RESPONSE: 5000,
  },
} as const;

// Type exports for better type safety
export type JsonPlaceholderEndpoint = keyof typeof JSONPLACEHOLDER_API.ENDPOINTS;
export type JsonPlaceholderResource =
  | 'posts'
  | 'comments'
  | 'albums'
  | 'photos'
  | 'todos'
  | 'users';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Helper functions for endpoint construction
export const JsonPlaceholderHelpers = {
  /**
   * Build endpoint URL with parameter substitution
   * @param endpoint - Endpoint template
   * @param params - Parameters to substitute
   * @returns Built URL
   */
  buildEndpoint(endpoint: string, params: Record<string, string | number> = {}): string {
    let url = endpoint;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
    return url;
  },

  /**
   * Get full URL for an endpoint
   * @param endpoint - Endpoint path
   * @param params - Parameters to substitute
   * @returns Full URL
   */
  getFullUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const path = this.buildEndpoint(endpoint, params);
    return `${JSONPLACEHOLDER_API.BASE_URL}${path}`;
  },

  /**
   * Generate test data for resource creation
   * @param resource - Resource type
   * @returns Test data object
   */
  generateTestData(resource: JsonPlaceholderResource): Record<string, unknown> {
    const testData = {
      posts: {
        title: 'Test Post Title',
        body: 'Test post body content for automated testing',
        userId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER,
      },
      comments: {
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test comment body content',
        postId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST,
      },
      albums: {
        title: 'Test Album Title',
        userId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER,
      },
      photos: {
        title: 'Test Photo Title',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952',
        albumId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.ALBUM,
      },
      todos: {
        title: 'Test Todo Item',
        completed: false,
        userId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER,
      },
      users: {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '1-555-123-4567',
        website: 'test.example.com',
        address: {
          street: 'Test Street',
          suite: 'Apt. 123',
          city: 'Test City',
          zipcode: '12345-6789',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        company: {
          name: 'Test Company',
          catchPhrase: 'Test catchphrase',
          bs: 'test business',
        },
      },
    };

    return testData[resource];
  },
};
