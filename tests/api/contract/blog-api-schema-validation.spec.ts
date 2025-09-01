import { apiTest, expect } from '@fixtures/api/jsonplaceholder.fixture';
import { JSONPLACEHOLDER_API } from '@utils/constants/jsonplaceholder.constants';

/**
 * @fileoverview Blog API Schema Validation - Contract testing suite that validates API responses against defined JSON schemas
 * @author Test Automation Team
 * @category Contract Testing
 * @priority Critical (P0)
 *
 * Contract testing validates that the blog API adheres to its defined interface contract:
 * - Response structure matches expected schema
 * - Data types are correct for blog entities (posts, comments, users)
 * - Required fields are present in all responses
 * - Field formats are valid (emails, URLs, numbers)
 * - Response headers follow REST standards
 *
 * These tests ensure API backward compatibility and prevent breaking changes
 * from affecting downstream consumers of the blog platform.
 */

apiTest.describe('Blog API Schema Validation', () => {
  apiTest.beforeEach(async ({ performanceTracker }) => {
    console.log('🚀 Starting contract test - validating API contract compliance');
    performanceTracker.reset();
  });

  apiTest.afterEach(async ({ performanceTracker }, testInfo) => {
    const metrics = performanceTracker.getAllMetrics();
    if (testInfo.status === 'failed') {
      console.error(`❌ Contract test failed: ${testInfo.title}`);
      console.error('📊 Performance metrics at failure:', metrics);
    } else {
      console.log('✅ Contract test passed');
      console.log('📊 Performance metrics:', metrics);
    }
  });

  /**
   * Posts Resource Contract Tests
   * Validates the structure and data types of posts endpoints
   */
  apiTest.describe('Posts Contract Validation', () => {
    apiTest(
      'should validate posts collection response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing posts collection contract - GET /posts');

        const timer = performanceTracker.startTimer('GET_posts_collection');
        const response = await jsonPlaceholderClient.getPosts();
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.ACCEPTABLE_RESPONSE,
        );

        // Validate response body structure
        const posts = await response.json();
        expect(Array.isArray(posts)).toBe(true);
        expect(posts).toHaveLength(JSONPLACEHOLDER_API.RESOURCE_COUNTS.POSTS);

        // Validate each post against schema
        schemaValidator.validatePostsArray(posts);

        // Validate specific field constraints
        posts.forEach((post: any) => {
          expect(post.id).toBeGreaterThan(0);
          expect(post.userId).toBeGreaterThan(0);
          expect(post.userId).toBeLessThanOrEqual(JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS);
          expect(typeof post.title).toBe('string');
          expect(post.title.length).toBeGreaterThan(0);
          expect(typeof post.body).toBe('string');
          expect(post.body.length).toBeGreaterThan(0);
        });

        console.log(`✅ Validated ${posts.length} posts in ${responseTime}ms`);
      },
    );

    apiTest(
      'should validate single post response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing single post contract - GET /posts/{id}');

        const postId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;
        const timer = performanceTracker.startTimer('GET_single_post');
        const response = await jsonPlaceholderClient.getPost(postId);
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate response body structure
        const post = await response.json();
        schemaValidator.validatePost(post);

        // Validate specific data constraints
        expect(post.id).toBe(postId);
        expect(post.userId).toBeGreaterThan(0);
        expect(post.userId).toBeLessThanOrEqual(JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS);

        console.log(`✅ Validated post ID ${postId} in ${responseTime}ms`);
      },
    );

    apiTest(
      'should validate post creation response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing post creation contract - POST /posts');

        const newPostData = {
          title: 'Contract Test Post',
          body: 'This post is created for contract testing validation',
          userId: JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER,
        };

        const timer = performanceTracker.startTimer('POST_create_post');
        const response = await jsonPlaceholderClient.createPost(newPostData);
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.CREATED);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.ACCEPTABLE_RESPONSE,
        );

        // Validate response body structure
        const createdPost = await response.json();
        schemaValidator.validatePost(createdPost);

        // Validate that created post contains expected data
        expect(createdPost.title).toBe(newPostData.title);
        expect(createdPost.body).toBe(newPostData.body);
        expect(createdPost.userId).toBe(newPostData.userId);
        expect(createdPost.id).toBe(JSONPLACEHOLDER_API.MOCK_INDICATORS.FAKE_UPDATE_ID);

        console.log(`✅ Validated post creation in ${responseTime}ms`);
      },
    );
  });

  /**
   * Comments Resource Contract Tests
   * Validates the structure and data types of comments endpoints
   */
  apiTest.describe('Comments Contract Validation', () => {
    apiTest(
      'should validate comments collection response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing comments collection contract - GET /comments');

        const timer = performanceTracker.startTimer('GET_comments_collection');
        const response = await jsonPlaceholderClient.getComments();
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time (comments is a larger dataset)
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.SLOW_RESPONSE);

        // Validate response body structure
        const comments = await response.json();
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(JSONPLACEHOLDER_API.RESOURCE_COUNTS.COMMENTS);

        // Validate schema for first 10 comments (performance optimization)
        const sampleComments = comments.slice(0, 10);
        schemaValidator.validateCommentsArray(sampleComments);

        // Validate specific field constraints
        sampleComments.forEach(comment => {
          expect(comment.id).toBeGreaterThan(0);
          expect(comment.postId).toBeGreaterThan(0);
          expect(comment.postId).toBeLessThanOrEqual(JSONPLACEHOLDER_API.RESOURCE_COUNTS.POSTS);
          expect(comment.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email validation
          expect(typeof comment.name).toBe('string');
          expect(comment.name.length).toBeGreaterThan(0);
          expect(typeof comment.body).toBe('string');
          expect(comment.body.length).toBeGreaterThan(0);
        });

        console.log(
          `✅ Validated ${comments.length} comments (sampled ${sampleComments.length}) in ${responseTime}ms`,
        );
      },
    );

    apiTest(
      'should validate post comments response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing post comments contract - GET /posts/{id}/comments');

        const postId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;
        const timer = performanceTracker.startTimer('GET_post_comments');
        const response = await jsonPlaceholderClient.getPostComments(postId);
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate response body structure
        const comments = await response.json();
        expect(Array.isArray(comments)).toBe(true);
        schemaValidator.validateCommentsArray(comments);

        // Validate that all comments belong to the requested post
        comments.forEach(comment => {
          expect(comment.postId).toBe(postId);
        });

        console.log(
          `✅ Validated ${comments.length} comments for post ${postId} in ${responseTime}ms`,
        );
      },
    );
  });

  /**
   * Users Resource Contract Tests
   * Validates the structure and data types of users endpoints
   */
  apiTest.describe('Users Contract Validation', () => {
    apiTest(
      'should validate users collection response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing users collection contract - GET /users');

        const timer = performanceTracker.startTimer('GET_users_collection');
        const response = await jsonPlaceholderClient.getUsers();
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate response body structure
        const users = await response.json();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS);

        // Validate each user against schema
        schemaValidator.validateUsersArray(users);

        // Validate specific field constraints
        users.forEach(user => {
          expect(user.id).toBeGreaterThan(0);
          expect(user.id).toBeLessThanOrEqual(JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS);
          expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
          expect(user.address.zipcode).toMatch(/^\d{5}(-\d{4})?$/); // Allow both 5-digit and ZIP+4 formats
          expect(typeof user.name).toBe('string');
          expect(user.name.length).toBeGreaterThan(0);
          expect(typeof user.username).toBe('string');
          expect(user.username.length).toBeGreaterThan(0);
        });

        console.log(`✅ Validated ${users.length} users in ${responseTime}ms`);
      },
    );

    apiTest(
      'should validate single user response contract',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔍 Testing single user contract - GET /users/{id}');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;
        const timer = performanceTracker.startTimer('GET_single_user');
        const response = await jsonPlaceholderClient.getUser(userId);
        const responseTime = timer();

        // Validate HTTP status and headers
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(response.headers()['content-type']).toContain('application/json');

        // Validate response time
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate response body structure
        const user = await response.json();
        schemaValidator.validateUser(user);

        // Validate specific data constraints
        expect(user.id).toBe(userId);
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(user.address.zipcode).toMatch(/^\d{5}(-\d{4})?$/); // Allow both 5-digit and ZIP+4 formats

        console.log(`✅ Validated user ID ${userId} in ${responseTime}ms`);
      },
    );
  });

  /**
   * Error Response Contract Tests
   * Validates error handling and response formats
   */
  apiTest.describe('Error Response Contract Validation', () => {
    apiTest(
      'should validate 404 error response contract for non-existent post',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔍 Testing 404 error contract - GET /posts/{invalid_id}');

        const invalidId = JSONPLACEHOLDER_API.TEST_DATA.INVALID_IDS.NON_EXISTENT;
        const timer = performanceTracker.startTimer('GET_nonexistent_post');
        const response = await jsonPlaceholderClient.getPost(invalidId);
        const responseTime = timer();

        // Validate HTTP status
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.CLIENT_ERROR.NOT_FOUND);

        // Validate response time for error cases
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate that response body is empty object for JSONPlaceholder 404s
        const errorResponse = await response.json();
        expect(errorResponse).toStrictEqual({});

        console.log(`✅ Validated 404 response for invalid ID ${invalidId} in ${responseTime}ms`);
      },
    );

    apiTest(
      'should validate 404 error response contract for non-existent user',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔍 Testing 404 error contract - GET /users/{invalid_id}');

        const invalidId = JSONPLACEHOLDER_API.TEST_DATA.INVALID_IDS.NON_EXISTENT;
        const timer = performanceTracker.startTimer('GET_nonexistent_user');
        const response = await jsonPlaceholderClient.getUser(invalidId);
        const responseTime = timer();

        // Validate HTTP status
        expect(response.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.CLIENT_ERROR.NOT_FOUND);

        // Validate response time for error cases
        expect(responseTime).toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE);

        // Validate that response body is empty object for JSONPlaceholder 404s
        const errorResponse = await response.json();
        expect(errorResponse).toStrictEqual({});

        console.log(
          `✅ Validated 404 response for invalid user ID ${invalidId} in ${responseTime}ms`,
        );
      },
    );
  });
});
