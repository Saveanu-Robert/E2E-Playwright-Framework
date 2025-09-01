/**
 * Posts and Comments Management Tests
 *
 * Functional testing for social media content management including:
 * - Posts CRUD operations (Create, Read, Update, Delete)
 * - Comments relationship validation
 * - User content filtering and querying
 * - Data boundary conditions and validation
 * - Performance benchmarks for operations
 * - Content consistency across endpoints
 *
 * @fileoverview Functional tests for posts and comments management
 * @author Test Automation Framework
 * @category Functional Testing
 * @priority High (P1)
 * @since 2025-08-31
 */

import { apiTest, expect } from '@fixtures/api/jsonplaceholder.fixture';
import {
  JSONPLACEHOLDER_API,
  JsonPlaceholderHelpers,
} from '@utils/constants/jsonplaceholder.constants';

apiTest.describe('Posts and Comments Management', () => {
  apiTest.beforeEach(async ({ performanceTracker }) => {
    console.log('🎯 Starting functional test - validating API business logic');
    performanceTracker.reset();
  });

  apiTest.afterEach(async ({ performanceTracker }, testInfo) => {
    const metrics = performanceTracker.getAllMetrics();
    if (testInfo.status === 'failed') {
      console.error(`❌ Functional test failed: ${testInfo.title}`);
      console.error('📊 Performance metrics at failure:', metrics);
    } else {
      console.log('✅ Functional test passed');
      console.log('📊 Performance metrics:', metrics);
    }
  });

  /**
   * Posts CRUD Operations
   * Validates complete Create, Read, Update, Delete functionality for posts
   */
  apiTest.describe('Posts CRUD Operations', () => {
    apiTest(
      'should perform complete CRUD lifecycle for posts',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔄 Testing complete posts CRUD lifecycle');

        // CREATE - Test post creation
        const newPostData = JsonPlaceholderHelpers.generateTestData('posts') as {
          title: string;
          body: string;
          userId: number;
        };

        console.log('📝 Testing POST /posts - Create operation');
        const timer1 = performanceTracker.startTimer('CRUD_create_post');
        const createResponse = await jsonPlaceholderClient.createPost(newPostData);
        timer1();

        expect(createResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.CREATED);

        const createdPost = await createResponse.json();
        expect(createdPost.title).toBe(newPostData.title);
        expect(createdPost.body).toBe(newPostData.body);
        expect(createdPost.userId).toBe(newPostData.userId);
        expect(createdPost.id).toBe(JSONPLACEHOLDER_API.MOCK_INDICATORS.FAKE_UPDATE_ID);

        // READ - Test reading the created post (simulated with existing post)
        const existingPostId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;
        console.log(`📖 Testing GET /posts/${existingPostId} - Read operation`);
        const timer2 = performanceTracker.startTimer('CRUD_read_post');
        const readResponse = await jsonPlaceholderClient.getPost(existingPostId);
        timer2();

        expect(readResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const readPost = await readResponse.json();
        expect(readPost.id).toBe(existingPostId);
        expect(typeof readPost.title).toBe('string');
        expect(typeof readPost.body).toBe('string');
        expect(typeof readPost.userId).toBe('number');

        // UPDATE - Test full update (PUT)
        const updatedPostData = {
          id: existingPostId,
          title: 'Updated Post Title for Functional Testing',
          body: 'Updated post body content for comprehensive testing',
          userId: readPost.userId,
        };

        console.log(`✏️ Testing PUT /posts/${existingPostId} - Update operation`);
        const timer3 = performanceTracker.startTimer('CRUD_update_post');
        const updateResponse = await jsonPlaceholderClient.updatePost(
          existingPostId,
          updatedPostData,
        );
        timer3();

        expect(updateResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const updatedPost = await updateResponse.json();
        expect(updatedPost.id).toBe(existingPostId);
        expect(updatedPost.title).toBe(updatedPostData.title);
        expect(updatedPost.body).toBe(updatedPostData.body);
        expect(updatedPost.userId).toBe(updatedPostData.userId);

        // PATCH - Test partial update
        const patchData = {
          title: 'Partially Updated Title via PATCH',
        };

        console.log(`🔧 Testing PATCH /posts/${existingPostId} - Partial update operation`);
        const timer4 = performanceTracker.startTimer('CRUD_patch_post');
        const patchResponse = await jsonPlaceholderClient.patchPost(existingPostId, patchData);
        timer4();

        expect(patchResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const patchedPost = await patchResponse.json();
        expect(patchedPost.id).toBe(existingPostId);
        expect(patchedPost.title).toBe(patchData.title);
        // Other fields should remain unchanged (but JSONPlaceholder doesn't persist, so we just check structure)
        expect(typeof patchedPost.body).toBe('string');
        expect(typeof patchedPost.userId).toBe('number');

        // DELETE - Test deletion
        console.log(`🗑️ Testing DELETE /posts/${existingPostId} - Delete operation`);
        const timer5 = performanceTracker.startTimer('CRUD_delete_post');
        const deleteResponse = await jsonPlaceholderClient.deletePost(existingPostId);
        timer5();

        expect(deleteResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        console.log('✅ Completed full CRUD lifecycle for posts');
      },
    );

    apiTest(
      'should handle posts data filtering and querying',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔍 Testing posts data filtering and querying');

        // Test getting all posts for a specific user
        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

        console.log(`📋 Testing user posts filtering - User ID ${userId}`);
        const timer1 = performanceTracker.startTimer('filter_posts_by_user');
        const userPostsResponse = await jsonPlaceholderClient.getUserPosts(userId);
        timer1();

        expect(userPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const userPosts = await userPostsResponse.json();
        expect(Array.isArray(userPosts)).toBe(true);
        expect(userPosts.length).toBeGreaterThan(0);

        // Validate that all returned posts belong to the requested user
        userPosts.forEach((post: any) => {
          expect(post.userId).toBe(userId);
        });

        console.log(`✅ Found ${userPosts.length} posts for user ${userId}`);

        // Test boundary conditions - get posts for last user
        const lastUserId = JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS;
        console.log(`🔚 Testing boundary condition - Last user ID ${lastUserId}`);
        const timer2 = performanceTracker.startTimer('filter_posts_last_user');
        const lastUserPostsResponse = await jsonPlaceholderClient.getUserPosts(lastUserId);
        timer2();

        expect(lastUserPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const lastUserPosts = await lastUserPostsResponse.json();
        expect(Array.isArray(lastUserPosts)).toBe(true);

        console.log(`✅ Found ${lastUserPosts.length} posts for last user ${lastUserId}`);
      },
    );
  });

  /**
   * Comments Relationship Testing
   * Validates the relationship between posts and comments
   */
  apiTest.describe('Comments Relationship Validation', () => {
    apiTest(
      'should validate post-comments relationship integrity',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔗 Testing post-comments relationship integrity');

        const postId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;

        // Get comments for the post using nested endpoint
        console.log(`💬 Testing nested endpoint - GET /posts/${postId}/comments`);
        const timer1 = performanceTracker.startTimer('get_post_comments_nested');
        const nestedCommentsResponse = await jsonPlaceholderClient.getPostComments(postId);
        timer1();

        expect(nestedCommentsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const nestedComments = await nestedCommentsResponse.json();

        // Get comments for the post using query parameter
        console.log(`🔍 Testing query endpoint - GET /comments?postId=${postId}`);
        const timer2 = performanceTracker.startTimer('get_post_comments_query');
        const queryCommentsResponse = await jsonPlaceholderClient.getCommentsByPost(postId);
        timer2();

        expect(queryCommentsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const queryComments = await queryCommentsResponse.json();

        // Both methods should return the same data
        expect(nestedComments).toHaveLength(queryComments.length);
        expect(nestedComments.length).toBeGreaterThan(0);

        // Validate that all comments belong to the requested post
        nestedComments.forEach((comment: any) => {
          expect(comment.postId).toBe(postId);
          expect(typeof comment.id).toBe('number');
          expect(typeof comment.name).toBe('string');
          expect(typeof comment.email).toBe('string');
          expect(typeof comment.body).toBe('string');
        });

        // Validate email formats in comments
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        nestedComments.forEach((comment: any) => {
          expect(comment.email).toMatch(emailRegex);
        });

        console.log(`✅ Validated ${nestedComments.length} comments for post ${postId}`);
      },
    );
  });

  /**
   * Users Resource Relationships
   * Validates user relationships with other resources
   */
  apiTest.describe('Users Resource Relationships', () => {
    apiTest(
      'should validate user resource relationships',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('👤 Testing user resource relationships');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

        // Get user details
        console.log(`👤 Getting user details - User ID ${userId}`);
        const timer1 = performanceTracker.startTimer('get_user_details');
        const userResponse = await jsonPlaceholderClient.getUser(userId);
        timer1();

        expect(userResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const user = await userResponse.json();

        // Get user's posts
        console.log(`📝 Getting user's posts - User ID ${userId}`);
        const timer2 = performanceTracker.startTimer('get_user_posts');
        const userPostsResponse = await jsonPlaceholderClient.getUserPosts(userId);
        timer2();

        expect(userPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userPosts = await userPostsResponse.json();

        // Get user's albums
        console.log(`📸 Getting user's albums - User ID ${userId}`);
        const timer3 = performanceTracker.startTimer('get_user_albums');
        const userAlbumsResponse = await jsonPlaceholderClient.getUserAlbums(userId);
        timer3();

        expect(userAlbumsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userAlbums = await userAlbumsResponse.json();

        // Get user's todos
        console.log(`✅ Getting user's todos - User ID ${userId}`);
        const timer4 = performanceTracker.startTimer('get_user_todos');
        const userTodosResponse = await jsonPlaceholderClient.getUserTodosFromUser(userId);
        timer4();

        expect(userTodosResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userTodos = await userTodosResponse.json();

        // Validate relationships
        expect(user.id).toBe(userId);
        expect(Array.isArray(userPosts)).toBe(true);
        expect(Array.isArray(userAlbums)).toBe(true);
        expect(Array.isArray(userTodos)).toBe(true);

        // Validate that all resources belong to the user
        userPosts.forEach((post: any) => {
          expect(post.userId).toBe(userId);
        });

        userAlbums.forEach((album: any) => {
          expect(album.userId).toBe(userId);
        });

        userTodos.forEach((todo: any) => {
          expect(todo.userId).toBe(userId);
        });

        console.log(
          `✅ User ${userId} has ${userPosts.length} posts, ${userAlbums.length} albums, ${userTodos.length} todos`,
        );
      },
    );
  });

  /**
   * Data Validation and Business Rules
   * Tests business logic and data validation rules
   */
  apiTest.describe('Data Validation and Business Rules', () => {
    apiTest(
      'should validate data boundary conditions',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🏺 Testing data boundary conditions');

        // Test with first valid ID
        console.log('🥇 Testing first valid ID boundary');
        const firstId = 1;
        const timer1 = performanceTracker.startTimer('boundary_first_id');
        const firstResponse = await jsonPlaceholderClient.getPost(firstId);
        timer1();

        expect(firstResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const firstPost = await firstResponse.json();
        expect(firstPost.id).toBe(firstId);

        // Test with last valid ID
        console.log('🏆 Testing last valid ID boundary');
        const lastId = JSONPLACEHOLDER_API.RESOURCE_COUNTS.POSTS;
        const timer2 = performanceTracker.startTimer('boundary_last_id');
        const lastResponse = await jsonPlaceholderClient.getPost(lastId);
        timer2();

        expect(lastResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const lastPost = await lastResponse.json();
        expect(lastPost.id).toBe(lastId);

        // Test with ID beyond boundary (should return 404)
        console.log('❌ Testing beyond boundary ID');
        const beyondBoundaryId = JSONPLACEHOLDER_API.RESOURCE_COUNTS.POSTS + 1;
        const timer3 = performanceTracker.startTimer('boundary_beyond_id');
        const beyondResponse = await jsonPlaceholderClient.getPost(beyondBoundaryId);
        timer3();

        expect(beyondResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
        );

        console.log('✅ All boundary conditions validated successfully');
      },
    );

    apiTest(
      'should validate user data consistency across endpoints',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔄 Testing user data consistency across endpoints');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

        // Get user from users endpoint
        const timer1 = performanceTracker.startTimer('consistency_user_direct');
        const userResponse = await jsonPlaceholderClient.getUser(userId);
        timer1();

        expect(userResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const directUser = await userResponse.json();

        // Get users collection and find the same user
        const timer2 = performanceTracker.startTimer('consistency_user_collection');
        const usersResponse = await jsonPlaceholderClient.getUsers();
        timer2();

        expect(usersResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const users = await usersResponse.json();
        const collectionUser = users.find((user: any) => user.id === userId);

        // Validate consistency
        expect(collectionUser).toBeDefined();
        expect(directUser.id).toBe(collectionUser.id);
        expect(directUser.name).toBe(collectionUser.name);
        expect(directUser.username).toBe(collectionUser.username);
        expect(directUser.email).toBe(collectionUser.email);
        expect(directUser.phone).toBe(collectionUser.phone);
        expect(directUser.website).toBe(collectionUser.website);

        console.log(`✅ User data consistent across endpoints for user ${userId}`);
      },
    );
  });

  /**
   * Performance and Scalability
   * Tests API performance under normal conditions
   */
  apiTest.describe('Performance Validation', () => {
    apiTest(
      'should meet performance benchmarks for core operations',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('⚡ Testing API performance benchmarks');

        // Test individual resource retrieval performance
        const timer1 = performanceTracker.startTimer('perf_single_post');
        const singlePostResponse = await jsonPlaceholderClient.getPost(1);
        const singlePostTime = timer1();

        expect(singlePostResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(singlePostTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.FAST_RESPONSE,
        );

        // Test small collection performance
        const timer2 = performanceTracker.startTimer('perf_user_posts');
        const userPostsResponse = await jsonPlaceholderClient.getUserPosts(1);
        const userPostsTime = timer2();

        expect(userPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(userPostsTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.ACCEPTABLE_RESPONSE,
        );

        // Test large collection performance (all posts)
        const timer3 = performanceTracker.startTimer('perf_all_posts');
        const allPostsResponse = await jsonPlaceholderClient.getPosts();
        const allPostsTime = timer3();

        expect(allPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(allPostsTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.ACCEPTABLE_RESPONSE,
        );

        console.log(
          `⚡ Performance: Single post ${singlePostTime}ms, User posts ${userPostsTime}ms, All posts ${allPostsTime}ms`,
        );
      },
    );
  });
});
