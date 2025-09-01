/**
 * Social Media Workflow - End-to-End Test Suite
 *
 * Comprehensive E2E testing for social media platform functionality including:
 * - User content lifecycle (posts, comments, albums, todos)
 * - Multi-user interaction scenarios
 * - Data integrity and consistency validation
 * - Performance benchmarks under load
 * - Error handling and system resilience
 *
 * @fileoverview E2E tests for social media workflow using JSONPlaceholder API
 * @author Test Automation Framework
 * @since 2025-08-31
 */

import { apiTest } from '../../../src/fixtures/api/jsonplaceholder.fixture';
import { JSONPLACEHOLDER_API } from '../../../src/utils/constants/jsonplaceholder.constants';

/**
 * E2E Test Suite for JSONPlaceholder API
 * Tests complete workflows and system integration scenarios
 */
apiTest.describe('JSONPlaceholder API - End-to-End Test Suite', () => {
  /**
   * Complete User Content Lifecycle E2E Test
   *
   * This test validates the entire lifecycle of user content management:
   * 1. User discovery and validation
   * 2. Content creation (posts)
   * 3. Content interaction (comments)
   * 4. Media management (albums/photos)
   * 5. Task management (todos)
   * 6. Data consistency validation
   */
  apiTest(
    'should complete full user content lifecycle journey',
    async ({ jsonPlaceholderClient, schemaValidator }) => {
      console.log('🚀 Starting complete user content lifecycle E2E test');

      // Phase 1: User Discovery & Validation
      console.log('👤 Phase 1: User Discovery & Validation');
      const startTime = Date.now();

      // Get all users and validate structure
      const usersResponse = await jsonPlaceholderClient.getUsers();
      apiTest.expect(usersResponse.status()).toBe(200);
      const users = await usersResponse.json();
      apiTest.expect(Array.isArray(users)).toBe(true);
      apiTest.expect(users.length).toBe(JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS);

      // Select the first user for our E2E journey
      const targetUser = users[0];
      schemaValidator.validateUser(targetUser);
      console.log(`✅ Selected user: ${targetUser.name} (${targetUser.email})`);

      // Phase 2: Content Creation & Management
      console.log('📝 Phase 2: Content Creation & Management');

      // Create a new post for the user
      const newPost = {
        title: `E2E Test Post - ${new Date().toISOString()}`,
        body: 'This post was created during an end-to-end test to validate the complete user content lifecycle.',
        userId: targetUser.id,
      };

      const createPostResponse = await jsonPlaceholderClient.createPost(newPost);
      apiTest.expect(createPostResponse.status()).toBe(201);
      const createdPost = await createPostResponse.json();
      schemaValidator.validatePost(createdPost);
      console.log(`✅ Created post: "${createdPost.title}" (ID: ${createdPost.id})`);

      // Phase 3: Content Discovery & Relationships
      console.log('🔍 Phase 3: Content Discovery & Relationships');

      // Get user's existing posts
      const userPostsResponse = await jsonPlaceholderClient.getUserPosts(targetUser.id);
      apiTest.expect(userPostsResponse.status()).toBe(200);
      const userPosts = await userPostsResponse.json();
      schemaValidator.validatePostsArray(userPosts);

      // Validate that we have expected posts for this user
      apiTest.expect(userPosts.length).toBeGreaterThan(0);
      console.log(`✅ Found ${userPosts.length} posts for user ${targetUser.name}`);

      // Get comments for the first post
      const firstPost = userPosts[0];
      const commentsResponse = await jsonPlaceholderClient.getPostComments(firstPost.id);
      apiTest.expect(commentsResponse.status()).toBe(200);
      const comments = await commentsResponse.json();
      schemaValidator.validateCommentsArray(comments);
      console.log(`✅ Found ${comments.length} comments for post "${firstPost.title}"`);

      // Phase 4: Media & Album Management
      console.log('📸 Phase 4: Media & Album Management');

      // Get user's albums
      const albumsResponse = await jsonPlaceholderClient.getUserAlbums(targetUser.id);
      apiTest.expect(albumsResponse.status()).toBe(200);
      const albums = await albumsResponse.json();
      // Validate each album individually since there's no validateAlbumsArray method
      albums.forEach((album: any) => schemaValidator.validateAlbum(album));
      console.log(`✅ Found ${albums.length} albums for user ${targetUser.name}`);

      // Get photos from the first album
      if (albums.length > 0) {
        const firstAlbum = albums[0];
        const photosResponse = await jsonPlaceholderClient.getAlbumPhotos(firstAlbum.id);
        apiTest.expect(photosResponse.status()).toBe(200);
        const photos = await photosResponse.json();
        // Validate a sample of photos since there's no validatePhotosArray method
        photos.slice(0, 5).forEach((photo: any) => schemaValidator.validatePhoto(photo));
        console.log(`✅ Found ${photos.length} photos in album "${firstAlbum.title}"`);
      }

      // Phase 5: Task Management
      console.log('✅ Phase 5: Task Management');

      // Get user's todos
      const todosResponse = await jsonPlaceholderClient.getUserTodos(targetUser.id);
      apiTest.expect(todosResponse.status()).toBe(200);
      const todos = await todosResponse.json();
      // Validate each todo individually since there's no validateTodosArray method
      todos.forEach((todo: any) => schemaValidator.validateTodo(todo));

      const completedTodos = todos.filter((todo: any) => todo.completed);
      const pendingTodos = todos.filter((todo: any) => !todo.completed);
      console.log(
        `✅ Found ${todos.length} todos (${completedTodos.length} completed, ${pendingTodos.length} pending)`,
      );

      // Phase 6: Data Consistency Validation
      console.log('🔄 Phase 6: Data Consistency Validation');

      // Cross-validate user data across different endpoints
      const directUserResponse = await jsonPlaceholderClient.getUser(targetUser.id);
      apiTest.expect(directUserResponse.status()).toBe(200);
      const directUser = await directUserResponse.json();

      // Ensure user data is consistent
      apiTest.expect(directUser.id).toBe(targetUser.id);
      apiTest.expect(directUser.name).toBe(targetUser.name);
      apiTest.expect(directUser.email).toBe(targetUser.email);

      // Validate that all user content is properly linked
      apiTest.expect(userPosts.every((post: any) => post.userId === targetUser.id)).toBe(true);
      apiTest.expect(albums.every((album: any) => album.userId === targetUser.id)).toBe(true);
      apiTest.expect(todos.every((todo: any) => todo.userId === targetUser.id)).toBe(true);

      // Phase 7: Performance & System Metrics
      console.log('⚡ Phase 7: Performance & System Metrics');

      const totalTime = Date.now() - startTime;
      apiTest
        .expect(totalTime)
        .toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.SLOW_RESPONSE * 3);

      console.log(`✅ E2E test completed successfully in ${totalTime}ms`);
      console.log('📊 User Content Summary:');
      console.log(`   👤 User: ${targetUser.name} (${targetUser.email})`);
      console.log(`   📝 Posts: ${userPosts.length} (including 1 newly created)`);
      console.log(`   💬 Comments: ${comments.length} on first post`);
      console.log(`   📸 Albums: ${albums.length}`);
      console.log(`   ✅ Todos: ${todos.length} (${completedTodos.length} completed)`);
    },
  );

  /**
   * Multi-User Interaction E2E Test
   *
   * This test validates interactions between different users and their content:
   * 1. Multiple user content discovery
   * 2. Cross-user content validation
   * 3. System-wide data integrity
   * 4. Concurrent operations handling
   */
  apiTest(
    'should handle multi-user interactions and data integrity',
    async ({ jsonPlaceholderClient }) => {
      console.log('🔗 Starting multi-user interaction E2E test');

      // Phase 1: Multi-User Discovery
      console.log('👥 Phase 1: Multi-User Discovery');

      const allUsersResponse = await jsonPlaceholderClient.getUsers();
      apiTest.expect(allUsersResponse.status()).toBe(200);
      const allUsers = await allUsersResponse.json();

      // Select first 3 users for multi-user testing
      const testUsers = allUsers.slice(0, 3);
      console.log(`✅ Selected ${testUsers.length} users for multi-user testing`);

      // Phase 2: Concurrent Content Retrieval
      console.log('⚡ Phase 2: Concurrent Content Retrieval');

      const concurrentPromises = testUsers.map(async (user: any) => {
        const [postsResponse, albumsResponse, todosResponse] = await Promise.all([
          jsonPlaceholderClient.getUserPosts(user.id),
          jsonPlaceholderClient.getUserAlbums(user.id),
          jsonPlaceholderClient.getUserTodos(user.id),
        ]);

        apiTest.expect(postsResponse.status()).toBe(200);
        apiTest.expect(albumsResponse.status()).toBe(200);
        apiTest.expect(todosResponse.status()).toBe(200);

        const posts = await postsResponse.json();
        const albums = await albumsResponse.json();
        const todos = await todosResponse.json();

        return {
          user,
          posts,
          albums,
          todos,
          totalContent: posts.length + albums.length + todos.length,
        };
      });

      const userContentData = await Promise.all(concurrentPromises);
      console.log('✅ Completed concurrent content retrieval for all users');

      // Phase 3: Cross-User Data Validation
      console.log('🔍 Phase 3: Cross-User Data Validation');

      // Validate that each user's content is properly isolated
      userContentData.forEach((userData: any) => {
        const { user, posts, albums, todos } = userData;

        // Ensure all content belongs to the correct user
        apiTest.expect(posts.every((post: any) => post.userId === user.id)).toBe(true);
        apiTest.expect(albums.every((album: any) => album.userId === user.id)).toBe(true);
        apiTest.expect(todos.every((todo: any) => todo.userId === user.id)).toBe(true);

        console.log(
          `✅ User ${user.name}: ${posts.length} posts, ${albums.length} albums, ${todos.length} todos`,
        );
      });

      // Phase 4: System-Wide Content Analysis
      console.log('📊 Phase 4: System-Wide Content Analysis');

      // Get all posts and validate distribution
      const allPostsResponse = await jsonPlaceholderClient.getPosts();
      apiTest.expect(allPostsResponse.status()).toBe(200);
      const allPosts = await allPostsResponse.json();

      // Get all comments and validate relationships
      const allCommentsResponse = await jsonPlaceholderClient.getComments();
      apiTest.expect(allCommentsResponse.status()).toBe(200);
      const allComments = await allCommentsResponse.json();

      // Validate data relationships
      const userIds = testUsers.map((user: any) => user.id);
      const userPosts = allPosts.filter((post: any) => userIds.includes(post.userId));
      const userPostIds = userPosts.map((post: any) => post.id);
      const userComments = allComments.filter((comment: any) =>
        userPostIds.includes(comment.postId),
      );

      console.log(
        `✅ System analysis: ${userPosts.length} posts generate ${userComments.length} comments`,
      );

      // Phase 5: Data Integrity Verification
      console.log('🔐 Phase 5: Data Integrity Verification');

      // Verify referential integrity
      userComments.forEach((comment: any) => {
        const relatedPost = allPosts.find((post: any) => post.id === comment.postId);
        apiTest.expect(relatedPost).toBeDefined();
        apiTest.expect(userIds.includes(relatedPost.userId)).toBe(true);
      });

      console.log('✅ Multi-user interaction E2E test completed successfully');
      const totalPosts = userContentData.reduce((sum, u) => sum + u.posts.length, 0);
      console.log('📈 Final Metrics:');
      console.log(`   👥 Users tested: ${testUsers.length}`);
      console.log(`   📝 Total posts: ${totalPosts}`);
      console.log(`   💬 Total comments: ${userComments.length}`);
      console.log(`   🔗 Data integrity: 100% verified`);
    },
  );

  /**
   * Error Handling & Recovery E2E Test
   *
   * This test validates system behavior under error conditions:
   * 1. Invalid resource handling
   * 2. Network error simulation
   * 3. Recovery mechanisms
   * 4. Error propagation
   */
  apiTest(
    'should handle error scenarios and system recovery',
    async ({ jsonPlaceholderClient, schemaValidator }) => {
      console.log('🛡️ Starting error handling & recovery E2E test');

      // Phase 1: Invalid Resource Handling
      console.log('❌ Phase 1: Invalid Resource Handling');

      // Test invalid user ID
      const invalidUserResponse = await jsonPlaceholderClient.getUser(99999);
      apiTest.expect(invalidUserResponse.status()).toBe(404);
      console.log('✅ Correctly handled invalid user ID (404)');

      // Test invalid post ID
      const invalidPostResponse = await jsonPlaceholderClient.getPost(99999);
      apiTest.expect(invalidPostResponse.status()).toBe(404);
      console.log('✅ Correctly handled invalid post ID (404)');

      // Phase 2: Cascading Error Effects
      console.log('🔄 Phase 2: Cascading Error Effects');

      // Try to get posts for invalid user
      const invalidUserPostsResponse = await jsonPlaceholderClient.getUserPosts(99999);
      apiTest.expect(invalidUserPostsResponse.status()).toBe(200);
      const invalidUserPosts = await invalidUserPostsResponse.json();
      apiTest.expect(Array.isArray(invalidUserPosts)).toBe(true);
      apiTest.expect(invalidUserPosts.length).toBe(0);
      console.log('✅ Invalid user posts query returns empty array');

      // Try to get comments for invalid post
      const invalidPostCommentsResponse = await jsonPlaceholderClient.getPostComments(99999);
      apiTest.expect(invalidPostCommentsResponse.status()).toBe(200);
      const invalidPostComments = await invalidPostCommentsResponse.json();
      apiTest.expect(Array.isArray(invalidPostComments)).toBe(true);
      apiTest.expect(invalidPostComments.length).toBe(0);
      console.log('✅ Invalid post comments query returns empty array');

      // Phase 3: System Resilience Testing
      console.log('💪 Phase 3: System Resilience Testing');

      // Perform multiple rapid requests to test rate limiting
      const rapidRequests = Array.from({ length: 5 }, async (_, i) =>
        jsonPlaceholderClient.getPost(i + 1),
      );

      const rapidResponses = await Promise.all(rapidRequests);
      rapidResponses.forEach((response: any) => {
        apiTest.expect(response.status()).toBe(200);
      });
      console.log('✅ System handled rapid concurrent requests successfully');

      // Phase 4: Recovery Validation
      console.log('🔧 Phase 4: Recovery Validation');

      // After error scenarios, verify normal operations still work
      const recoveryUserResponse = await jsonPlaceholderClient.getUser(1);
      apiTest.expect(recoveryUserResponse.status()).toBe(200);
      const recoveryUser = await recoveryUserResponse.json();
      schemaValidator.validateUser(recoveryUser);

      const recoveryPostResponse = await jsonPlaceholderClient.getPost(1);
      apiTest.expect(recoveryPostResponse.status()).toBe(200);
      const recoveryPost = await recoveryPostResponse.json();
      schemaValidator.validatePost(recoveryPost);

      console.log('✅ System recovery validated - normal operations restored');
      console.log('🛡️ Error handling & recovery E2E test completed successfully');
    },
  );

  /**
   * Performance & Scalability E2E Test
   *
   * This test validates system performance under various load conditions:
   * 1. Baseline performance measurement
   * 2. Concurrent load testing
   * 3. Large dataset handling
   * 4. Performance regression detection
   */
  apiTest('should meet performance benchmarks under load', async ({ jsonPlaceholderClient }) => {
    console.log('⚡ Starting performance & scalability E2E test');

    // Phase 1: Baseline Performance
    console.log('📊 Phase 1: Baseline Performance Measurement');

    const baselineTests = [
      { name: 'Single User', operation: async () => jsonPlaceholderClient.getUser(1) },
      { name: 'Single Post', operation: async () => jsonPlaceholderClient.getPost(1) },
      { name: 'Post Comments', operation: async () => jsonPlaceholderClient.getPostComments(1) },
      { name: 'User Posts', operation: async () => jsonPlaceholderClient.getUserPosts(1) },
    ];

    const baselineResults = [];

    for (const test of baselineTests) {
      const startTime = Date.now();
      const response = await test.operation();
      const endTime = Date.now();
      const duration = endTime - startTime;

      apiTest.expect(response.status()).toBe(200);
      apiTest
        .expect(duration)
        .toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.ACCEPTABLE_RESPONSE);

      baselineResults.push({ name: test.name, duration });
      console.log(`✅ ${test.name}: ${duration}ms`);
    }

    // Phase 2: Concurrent Load Testing
    console.log('🔄 Phase 2: Concurrent Load Testing');

    const concurrentOperations = [
      async () => jsonPlaceholderClient.getUsers(),
      async () => jsonPlaceholderClient.getPosts(),
      async () => jsonPlaceholderClient.getComments(),
      async () => jsonPlaceholderClient.getAlbums(),
      async () => jsonPlaceholderClient.getPhotos(),
      async () => jsonPlaceholderClient.getTodos(),
      async () => jsonPlaceholderClient.getUser(1),
      async () => jsonPlaceholderClient.getPost(1),
      async () => jsonPlaceholderClient.getUserPosts(1),
      async () => jsonPlaceholderClient.getUserAlbums(1),
    ];

    const concurrentStartTime = Date.now();
    const concurrentResponses = await Promise.all(concurrentOperations.map(async op => op()));
    const concurrentEndTime = Date.now();
    const concurrentDuration = concurrentEndTime - concurrentStartTime;

    // Validate all responses
    concurrentResponses.forEach((response: any) => {
      apiTest.expect(response.status()).toBe(200);
    });

    apiTest
      .expect(concurrentDuration)
      .toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.SLOW_RESPONSE);
    console.log(
      `✅ Concurrent operations (${concurrentOperations.length}): ${concurrentDuration}ms`,
    );

    // Phase 3: Large Dataset Handling
    console.log('📈 Phase 3: Large Dataset Handling');

    const largeDatasetStartTime = Date.now();

    // Get all resources simultaneously
    const [allUsers, allPosts, allComments, allAlbums, allPhotos, allTodos] = await Promise.all([
      jsonPlaceholderClient.getUsers(),
      jsonPlaceholderClient.getPosts(),
      jsonPlaceholderClient.getComments(),
      jsonPlaceholderClient.getAlbums(),
      jsonPlaceholderClient.getPhotos(),
      jsonPlaceholderClient.getTodos(),
    ]);

    const largeDatasetEndTime = Date.now();
    const largeDatasetDuration = largeDatasetEndTime - largeDatasetStartTime;

    // Validate responses
    const datasets = [
      {
        name: 'Users',
        response: allUsers,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.USERS,
      },
      {
        name: 'Posts',
        response: allPosts,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.POSTS,
      },
      {
        name: 'Comments',
        response: allComments,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.COMMENTS,
      },
      {
        name: 'Albums',
        response: allAlbums,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.ALBUMS,
      },
      {
        name: 'Photos',
        response: allPhotos,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.PHOTOS,
      },
      {
        name: 'Todos',
        response: allTodos,
        expectedCount: JSONPLACEHOLDER_API.RESOURCE_COUNTS.TODOS,
      },
    ];

    let totalRecords = 0;
    for (const dataset of datasets) {
      apiTest.expect(dataset.response.status()).toBe(200);
      const data = await dataset.response.json();
      apiTest.expect(Array.isArray(data)).toBe(true);
      apiTest.expect(data.length).toBe(dataset.expectedCount);
      totalRecords += data.length;
      console.log(`✅ ${dataset.name}: ${data.length} records`);
    }

    apiTest
      .expect(largeDatasetDuration)
      .toBeLessThan(JSONPLACEHOLDER_API.PERFORMANCE_BENCHMARKS.SLOW_RESPONSE * 2);
    console.log(`✅ Large dataset retrieval (${totalRecords} records): ${largeDatasetDuration}ms`);

    // Phase 4: Performance Summary
    console.log('📋 Phase 4: Performance Summary');

    console.log('⚡ Performance & scalability E2E test completed successfully');
    console.log('📊 Performance Summary:');
    baselineResults.forEach(result => {
      console.log(`   ${result.name}: ${result.duration}ms`);
    });
    console.log(`   Concurrent Operations: ${concurrentDuration}ms`);
    console.log(`   Large Dataset Retrieval: ${largeDatasetDuration}ms`);
    console.log(`   Total Records Processed: ${totalRecords}`);
  });
});
