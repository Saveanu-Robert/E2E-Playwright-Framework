/**
 * User Content Integration Tests
 *
 * Integration testing for social media user content workflows including:
 * - User-posts-comments relationship chains
 * - Album and photo content management
 * - Todo list functionality integration
 * - Concurrent content operations
 * - Cross-resource data consistency
 * - Error propagation across workflows
 *
 * @fileoverview Integration tests for user content management workflows
 * @author Test Automation Team
 * @category Integration Testing
 * @priority High (P1)
 * @since 2025-08-31
 */

import { apiTest, expect } from '@fixtures/api/jsonplaceholder.fixture';
import { JSONPLACEHOLDER_API } from '@utils/constants/jsonplaceholder.constants';

apiTest.describe('User Content Integration', () => {
  apiTest.beforeEach(async ({ performanceTracker }) => {
    console.log('🔗 Starting integration test - validating API component interactions');
    performanceTracker.reset();
  });

  apiTest.afterEach(async ({ performanceTracker }, testInfo) => {
    const metrics = performanceTracker.getAllMetrics();
    if (testInfo.status === 'failed') {
      console.error(`❌ Integration test failed: ${testInfo.title}`);
      console.error('📊 Performance metrics at failure:', metrics);
    } else {
      console.log('✅ Integration test passed');
      console.log('📊 Performance metrics:', metrics);
    }
  });

  /**
   * Complete User Content Workflow
   * Tests the full workflow of user content creation and retrieval
   */
  apiTest.describe('User Content Workflow Integration', () => {
    apiTest(
      'should complete user content creation and retrieval workflow',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('👤 Testing complete user content workflow integration');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

        // Step 1: Get user details
        console.log(`1️⃣ Retrieving user details for user ${userId}`);
        const timer1 = performanceTracker.startTimer('workflow_get_user');
        const userResponse = await jsonPlaceholderClient.getUser(userId);
        timer1();

        expect(userResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const user = await userResponse.json();
        schemaValidator.validateUser(user);

        // Step 2: Create a new post for the user
        console.log(`2️⃣ Creating new post for user ${user.name}`);
        const newPostData = {
          title: `Integration Test Post by ${user.name}`,
          body: `This is an integration test post created for user ${user.name} (${user.email}) as part of the complete workflow validation.`,
          userId,
        };

        const timer2 = performanceTracker.startTimer('workflow_create_post');
        const createPostResponse = await jsonPlaceholderClient.createPost(newPostData);
        timer2();

        expect(createPostResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.CREATED);
        const createdPost = await createPostResponse.json();
        schemaValidator.validatePost(createdPost);

        // Step 3: Retrieve all posts for the user to verify creation
        console.log(`3️⃣ Retrieving all posts for user ${userId} to verify integration`);
        const timer3 = performanceTracker.startTimer('workflow_get_user_posts');
        const userPostsResponse = await jsonPlaceholderClient.getUserPosts(userId);
        timer3();

        expect(userPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userPosts = await userPostsResponse.json();
        schemaValidator.validatePostsArray(userPosts);

        // Validate that all posts belong to the user
        userPosts.forEach((post: any) => {
          expect(post.userId).toBe(userId);
        });

        // Step 4: Get user's albums
        console.log(`4️⃣ Retrieving user's albums for complete profile view`);
        const timer4 = performanceTracker.startTimer('workflow_get_user_albums');
        const userAlbumsResponse = await jsonPlaceholderClient.getUserAlbums(userId);
        timer4();

        expect(userAlbumsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userAlbums = await userAlbumsResponse.json();

        // Step 5: Get user's todos
        console.log(`5️⃣ Retrieving user's todos for complete profile view`);
        const timer5 = performanceTracker.startTimer('workflow_get_user_todos');
        const userTodosResponse = await jsonPlaceholderClient.getUserTodosFromUser(userId);
        timer5();

        expect(userTodosResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const userTodos = await userTodosResponse.json();

        // Validate the complete user profile
        console.log(`✅ User ${user.name} has:`);
        console.log(`   📝 ${userPosts.length} posts`);
        console.log(`   📸 ${userAlbums.length} albums`);
        console.log(`   ✅ ${userTodos.length} todos`);

        // Validate all resources belong to the user
        userAlbums.forEach((album: any) => {
          expect(album.userId).toBe(userId);
        });

        userTodos.forEach((todo: any) => {
          expect(todo.userId).toBe(userId);
        });

        console.log('✅ Complete user content workflow integration validated');
      },
    );
  });

  /**
   * Content Relationship Chain Integration
   * Tests the relationships between posts, comments, albums, and photos
   */
  apiTest.describe('Content Relationship Chain Integration', () => {
    apiTest(
      'should validate complete content relationship chain',
      async ({ jsonPlaceholderClient, schemaValidator, performanceTracker }) => {
        console.log('🔗 Testing complete content relationship chain integration');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;
        const postId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;
        const albumId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.ALBUM;

        // Step 1: Get user and their content overview
        console.log(`1️⃣ Getting user ${userId} content overview`);
        const timer1 = performanceTracker.startTimer('chain_user_overview');
        const [userResponse, userPostsResponse, userAlbumsResponse] = await Promise.all([
          jsonPlaceholderClient.getUser(userId),
          jsonPlaceholderClient.getUserPosts(userId),
          jsonPlaceholderClient.getUserAlbums(userId),
        ]);
        timer1();

        expect(userResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(userPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(userAlbumsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);

        const user = await userResponse.json();
        const userPosts = await userPostsResponse.json();
        const userAlbums = await userAlbumsResponse.json();

        // Step 2: Deep dive into a specific post and its comments
        const targetPost = userPosts.find((post: any) => post.id === postId) ?? userPosts[0];
        console.log(`2️⃣ Deep diving into post ${targetPost.id}: "${targetPost.title}"`);

        const timer2 = performanceTracker.startTimer('chain_post_comments');
        const [postCommentsResponse, postCommentsQueryResponse] = await Promise.all([
          jsonPlaceholderClient.getPostComments(targetPost.id),
          jsonPlaceholderClient.getCommentsByPost(targetPost.id),
        ]);
        timer2();

        expect(postCommentsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(postCommentsQueryResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK,
        );

        const postComments = await postCommentsResponse.json();
        const postCommentsQuery = await postCommentsQueryResponse.json();

        // Validate both comment retrieval methods return same data
        expect(postComments).toHaveLength(postCommentsQuery.length);
        schemaValidator.validateCommentsArray(postComments);

        // Step 3: Deep dive into a specific album and its photos
        const targetAlbum = userAlbums.find((album: any) => album.id === albumId) ?? userAlbums[0];
        console.log(`3️⃣ Deep diving into album ${targetAlbum.id}: "${targetAlbum.title}"`);

        const timer3 = performanceTracker.startTimer('chain_album_photos');
        const albumPhotosResponse = await jsonPlaceholderClient.getAlbumPhotos(targetAlbum.id);
        timer3();

        expect(albumPhotosResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        const albumPhotos = await albumPhotosResponse.json();

        // Validate all photos belong to the album
        albumPhotos.forEach((photo: any) => {
          expect(photo.albumId).toBe(targetAlbum.id);
        });

        // Step 4: Cross-validate relationships
        console.log(`4️⃣ Cross-validating all relationships`);

        // Validate post belongs to user
        expect(targetPost.userId).toBe(userId);

        // Validate all comments belong to post
        postComments.forEach((comment: any) => {
          expect(comment.postId).toBe(targetPost.id);
        });

        // Validate album belongs to user
        expect(targetAlbum.userId).toBe(userId);

        // Validate all photos belong to album
        albumPhotos.forEach((photo: any) => {
          expect(photo.albumId).toBe(targetAlbum.id);
        });

        console.log(`✅ Relationship chain validated:`);
        console.log(`   👤 User: ${user.name} (${user.email})`);
        console.log(`   📝 Post: "${targetPost.title}" with ${postComments.length} comments`);
        console.log(`   📸 Album: "${targetAlbum.title}" with ${albumPhotos.length} photos`);

        console.log('✅ Complete content relationship chain integration validated');
      },
    );
  });

  /**
   * Concurrent Operations Integration
   * Tests API behavior under concurrent requests
   */
  apiTest.describe('Concurrent Operations Integration', () => {
    apiTest(
      'should handle concurrent read operations correctly',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('⚡ Testing concurrent read operations integration');

        // Prepare concurrent operations
        const concurrentRequests = [
          { name: 'Get Posts', operation: async () => jsonPlaceholderClient.getPosts() },
          { name: 'Get Comments', operation: async () => jsonPlaceholderClient.getComments() },
          { name: 'Get Albums', operation: async () => jsonPlaceholderClient.getAlbums() },
          { name: 'Get Users', operation: async () => jsonPlaceholderClient.getUsers() },
          { name: 'Get Todos', operation: async () => jsonPlaceholderClient.getTodos() },
          { name: 'Get Post 1', operation: async () => jsonPlaceholderClient.getPost(1) },
          { name: 'Get User 1', operation: async () => jsonPlaceholderClient.getUser(1) },
        ];

        console.log(`🔄 Executing ${concurrentRequests.length} concurrent requests`);
        const timer = performanceTracker.startTimer('concurrent_read_operations');

        // Execute all requests concurrently
        const responses = await Promise.all(
          concurrentRequests.map(async req => {
            const response = await req.operation();
            return { name: req.name, response, status: response.status() };
          }),
        );

        const concurrentTime = timer();

        // Validate all responses
        responses.forEach(({ name, status }) => {
          expect(status).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
          console.log(`✅ ${name}: Status ${status}`);
        });

        // Validate response time is reasonable for concurrent operations
        expect(concurrentTime).toBeLessThan(
          JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.SLOW_RESPONSE * 2,
        );

        console.log(
          `⚡ All ${responses.length} concurrent operations completed in ${concurrentTime}ms`,
        );
      },
    );

    apiTest(
      'should handle mixed concurrent operations (read/write)',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔀 Testing mixed concurrent operations (read/write) integration');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;

        // Prepare mixed operations (reads and writes)
        const mixedRequests = [
          {
            name: 'Read User',
            type: 'read',
            operation: async () => jsonPlaceholderClient.getUser(userId),
          },
          {
            name: 'Create Post',
            type: 'write',
            operation: async () =>
              jsonPlaceholderClient.createPost({
                title: 'Concurrent Test Post',
                body: 'Created during concurrent operations test',
                userId,
              }),
          },
          {
            name: 'Read Posts',
            type: 'read',
            operation: async () => jsonPlaceholderClient.getPosts(),
          },
          {
            name: 'Update Post',
            type: 'write',
            operation: async () =>
              jsonPlaceholderClient.updatePost(1, {
                id: 1,
                title: 'Updated in Concurrent Test',
                body: 'Updated during concurrent operations test',
                userId,
              }),
          },
          {
            name: 'Read User Posts',
            type: 'read',
            operation: async () => jsonPlaceholderClient.getUserPosts(userId),
          },
        ];

        console.log(`🔄 Executing ${mixedRequests.length} mixed concurrent operations`);
        const timer = performanceTracker.startTimer('concurrent_mixed_operations');

        // Execute all requests concurrently
        const responses = await Promise.all(
          mixedRequests.map(async req => {
            const response = await req.operation();
            return {
              name: req.name,
              type: req.type,
              response,
              status: response.status(),
            };
          }),
        );

        const concurrentTime = timer();

        // Validate responses based on operation type
        responses.forEach(({ name, type, status }) => {
          if (type === 'read') {
            expect(status).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
          } else {
            expect([
              JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK,
              JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.CREATED,
            ]).toContain(status);
          }
          console.log(`✅ ${name} (${type}): Status ${status}`);
        });

        console.log(
          `🔀 All ${responses.length} mixed concurrent operations completed in ${concurrentTime}ms`,
        );
      },
    );
  });

  /**
   * Error Propagation Integration
   * Tests how errors propagate through the system
   */
  apiTest.describe('Error Propagation Integration', () => {
    apiTest(
      'should handle error scenarios in integrated workflows',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('❌ Testing error propagation in integrated workflows');

        const invalidUserId = JSONPLACEHOLDER_API.TEST_DATA.INVALID_IDS.NON_EXISTENT;
        const invalidPostId = JSONPLACEHOLDER_API.TEST_DATA.INVALID_IDS.NON_EXISTENT;

        // Test error handling in user workflow
        console.log(`1️⃣ Testing invalid user workflow - User ID ${invalidUserId}`);
        const timer1 = performanceTracker.startTimer('error_invalid_user_workflow');

        const [invalidUserResponse, invalidUserPostsResponse, invalidUserAlbumsResponse] =
          await Promise.all([
            jsonPlaceholderClient.getUser(invalidUserId),
            jsonPlaceholderClient.getUserPosts(invalidUserId),
            jsonPlaceholderClient.getUserAlbums(invalidUserId),
          ]);

        timer1();

        // Validate all related endpoints return 404 for invalid user
        expect(invalidUserResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
        );
        expect(invalidUserPostsResponse.status()).toBe(JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK);
        expect(invalidUserAlbumsResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK,
        );

        // User posts and albums should return empty arrays for non-existent user
        const invalidUserPosts = await invalidUserPostsResponse.json();
        const invalidUserAlbums = await invalidUserAlbumsResponse.json();
        expect(Array.isArray(invalidUserPosts)).toBe(true);
        expect(invalidUserPosts).toHaveLength(0);
        expect(Array.isArray(invalidUserAlbums)).toBe(true);
        expect(invalidUserAlbums).toHaveLength(0);

        // Test error handling in post-comments workflow
        console.log(`2️⃣ Testing invalid post comments workflow - Post ID ${invalidPostId}`);
        const timer2 = performanceTracker.startTimer('error_invalid_post_workflow');

        const [invalidPostResponse, invalidPostCommentsResponse] = await Promise.all([
          jsonPlaceholderClient.getPost(invalidPostId),
          jsonPlaceholderClient.getPostComments(invalidPostId),
        ]);

        timer2();

        // Validate error responses
        expect(invalidPostResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
        );
        expect(invalidPostCommentsResponse.status()).toBe(
          JSONPLACEHOLDER_API.STATUS_CODES.SUCCESS.OK,
        );

        // Comments for non-existent post should return empty array
        const invalidPostComments = await invalidPostCommentsResponse.json();
        expect(Array.isArray(invalidPostComments)).toBe(true);
        expect(invalidPostComments).toHaveLength(0);

        console.log('✅ Error propagation integration validated');
      },
    );
  });

  /**
   * Data Consistency Integration
   * Tests data consistency across different endpoints
   */
  apiTest.describe('Data Consistency Integration', () => {
    apiTest(
      'should maintain data consistency across all related endpoints',
      async ({ jsonPlaceholderClient, performanceTracker }) => {
        console.log('🔄 Testing data consistency across all related endpoints');

        const userId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.USER;
        const postId = JSONPLACEHOLDER_API.TEST_DATA.VALID_IDS.POST;

        console.log(`🔍 Testing consistency for user ${userId} and post ${postId}`);
        const timer = performanceTracker.startTimer('consistency_validation');

        // Get data from multiple sources
        const [
          userFromUsersEndpoint,
          postsFromPostsEndpoint,
          userPostsFromUserEndpoint,
          specificPostEndpoint,
          postCommentsFromPostEndpoint,
          postCommentsFromCommentsEndpoint,
        ] = await Promise.all([
          jsonPlaceholderClient.getUser(userId),
          jsonPlaceholderClient.getPosts(),
          jsonPlaceholderClient.getUserPosts(userId),
          jsonPlaceholderClient.getPost(postId),
          jsonPlaceholderClient.getPostComments(postId),
          jsonPlaceholderClient.getCommentsByPost(postId),
        ]);

        timer();

        // Parse responses
        const user = await userFromUsersEndpoint.json();
        const allPosts = await postsFromPostsEndpoint.json();
        const userPosts = await userPostsFromUserEndpoint.json();
        const specificPost = await specificPostEndpoint.json();
        const postCommentsNested = await postCommentsFromPostEndpoint.json();
        const postCommentsQuery = await postCommentsFromCommentsEndpoint.json();

        // Validate user data consistency
        const userFromCollection = allPosts.find((post: any) => post.userId === userId);
        expect(userFromCollection).toBeDefined();
        expect(userFromCollection.userId).toBe(user.id);

        // Validate post data consistency
        const postFromCollection = allPosts.find((post: any) => post.id === postId);
        expect(postFromCollection).toBeDefined();
        expect(postFromCollection.id).toBe(specificPost.id);
        expect(postFromCollection.title).toBe(specificPost.title);
        expect(postFromCollection.body).toBe(specificPost.body);
        expect(postFromCollection.userId).toBe(specificPost.userId);

        // Validate user posts consistency
        const userPostFromUserEndpoint = userPosts.find((post: any) => post.id === postId);
        if (userPostFromUserEndpoint) {
          expect(userPostFromUserEndpoint.id).toBe(specificPost.id);
          expect(userPostFromUserEndpoint.userId).toBe(userId);
        }

        // Validate comments consistency
        expect(postCommentsNested).toHaveLength(postCommentsQuery.length);
        postCommentsNested.forEach((comment: any, index: number) => {
          expect(comment.id).toBe(postCommentsQuery[index].id);
          expect(comment.postId).toBe(postCommentsQuery[index].postId);
          expect(comment.postId).toBe(postId);
        });

        console.log(`✅ Data consistency validated across all endpoints:`);
        console.log(`   👤 User ${user.id} (${user.name})`);
        console.log(`   📝 Post ${specificPost.id} with ${postCommentsNested.length} comments`);
        console.log(`   🔄 All data sources return consistent information`);
      },
    );
  });
});
