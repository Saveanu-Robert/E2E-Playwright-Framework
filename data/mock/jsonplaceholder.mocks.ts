/**
 * JSONPlaceholder API Mock Data
 * Mock responses for testing API integrations without external dependencies
 *
 * Features:
 * - Realistic mock data based on JSONPlaceholder API
 * - Multiple scenarios (success, error, edge cases)
 * - Reusable data sets for different test types
 * - Performance testing datasets
 */

import type {
  PostResponse,
  CommentResponse,
  AlbumResponse,
  PhotoResponse,
  TodoResponse,
  UserResponse,
  ErrorResponse,
} from '@api/schemas/jsonplaceholder.schemas';

// Mock Posts Data
export const MOCK_POSTS = {
  SINGLE_POST: {
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    userId: 1,
  } as PostResponse,

  MULTIPLE_POSTS: [
    {
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
      userId: 1,
    },
    {
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
      userId: 1,
    },
    {
      id: 3,
      title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
      body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
      userId: 1,
    },
  ] as PostResponse[],

  CREATED_POST: {
    id: 101,
    title: 'New Test Post',
    body: 'This is a test post created by automation',
    userId: 1,
  } as PostResponse,

  UPDATED_POST: {
    id: 1,
    title: 'Updated Post Title',
    body: 'Updated post content',
    userId: 1,
  } as PostResponse,
};

// Mock Comments Data
export const MOCK_COMMENTS = {
  SINGLE_COMMENT: {
    id: 1,
    name: 'id labore ex et quam laborum',
    email: 'Eliseo@gardner.biz',
    body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
    postId: 1,
  } as CommentResponse,

  POST_COMMENTS: [
    {
      id: 1,
      name: 'id labore ex et quam laborum',
      email: 'Eliseo@gardner.biz',
      body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
      postId: 1,
    },
    {
      id: 2,
      name: 'quo vero reiciendis velit similique earum',
      email: 'Jayne_Kuhic@sydney.com',
      body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
      postId: 1,
    },
  ] as CommentResponse[],

  CREATED_COMMENT: {
    id: 501,
    name: 'Test Comment',
    email: 'test@example.com',
    body: 'This is a test comment created by automation',
    postId: 1,
  } as CommentResponse,
};

// Mock Albums Data
export const MOCK_ALBUMS = {
  SINGLE_ALBUM: {
    id: 1,
    title: 'quidem molestiae enim',
    userId: 1,
  } as AlbumResponse,

  USER_ALBUMS: [
    {
      id: 1,
      title: 'quidem molestiae enim',
      userId: 1,
    },
    {
      id: 2,
      title: 'sunt qui excepturi placeat culpa',
      userId: 1,
    },
  ] as AlbumResponse[],

  CREATED_ALBUM: {
    id: 101,
    title: 'New Test Album',
    userId: 1,
  } as AlbumResponse,
};

// Mock Photos Data
export const MOCK_PHOTOS = {
  SINGLE_PHOTO: {
    id: 1,
    title: 'accusamus beatae ad facilis cum similique qui sunt',
    url: 'https://via.placeholder.com/600/92c952',
    thumbnailUrl: 'https://via.placeholder.com/150/92c952',
    albumId: 1,
  } as PhotoResponse,

  ALBUM_PHOTOS: [
    {
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
      albumId: 1,
    },
    {
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'https://via.placeholder.com/600/771796',
      thumbnailUrl: 'https://via.placeholder.com/150/771796',
      albumId: 1,
    },
  ] as PhotoResponse[],

  CREATED_PHOTO: {
    id: 5001,
    title: 'New Test Photo',
    url: 'https://via.placeholder.com/600/test',
    thumbnailUrl: 'https://via.placeholder.com/150/test',
    albumId: 1,
  } as PhotoResponse,
};

// Mock Todos Data
export const MOCK_TODOS = {
  SINGLE_TODO: {
    id: 1,
    title: 'delectus aut autem',
    completed: false,
    userId: 1,
  } as TodoResponse,

  USER_TODOS: [
    {
      id: 1,
      title: 'delectus aut autem',
      completed: false,
      userId: 1,
    },
    {
      id: 2,
      title: 'quis ut nam facilis et officia qui',
      completed: false,
      userId: 1,
    },
    {
      id: 3,
      title: 'fugiat veniam minus',
      completed: false,
      userId: 1,
    },
  ] as TodoResponse[],

  COMPLETED_TODO: {
    id: 1,
    title: 'delectus aut autem',
    completed: true,
    userId: 1,
  } as TodoResponse,

  CREATED_TODO: {
    id: 201,
    title: 'New Test Todo',
    completed: false,
    userId: 1,
  } as TodoResponse,
};

// Mock Users Data
export const MOCK_USERS = {
  SINGLE_USER: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
      },
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
  } as UserResponse,

  MULTIPLE_USERS: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618',
        },
      },
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains',
      },
    },
  ] as UserResponse[],

  CREATED_USER: {
    id: 11,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
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
    phone: '1-555-123-4567',
    website: 'test.example.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Test catchphrase',
      bs: 'test business',
    },
  } as UserResponse,
};

// Mock Error Responses
export const MOCK_ERRORS = {
  NOT_FOUND: {
    status: 404,
    error: 'Not Found',
    message: 'The requested resource was not found',
  } as ErrorResponse,

  BAD_REQUEST: {
    status: 400,
    error: 'Bad Request',
    message: 'Invalid request data provided',
  } as ErrorResponse,

  SERVER_ERROR: {
    status: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server',
  } as ErrorResponse,

  VALIDATION_ERROR: {
    status: 422,
    error: 'Unprocessable Entity',
    message: 'Validation failed for the provided data',
  } as ErrorResponse,
};

// Performance Testing Data Sets
export const MOCK_PERFORMANCE_DATA = {
  LARGE_POST_SET: Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    title: `Performance Test Post ${index + 1}`,
    body: `This is the body content for performance test post number ${index + 1}. This content is generated for load testing purposes.`,
    userId: (index % 10) + 1,
  })) as PostResponse[],

  LARGE_COMMENT_SET: Array.from({ length: 500 }, (_, index) => ({
    id: index + 1,
    name: `Performance Test Comment ${index + 1}`,
    email: `test${index + 1}@example.com`,
    body: `This is the body content for performance test comment number ${index + 1}.`,
    postId: (index % 100) + 1,
  })) as CommentResponse[],

  STRESS_TEST_USERS: Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Stress Test User ${index + 1}`,
    username: `stressuser${index + 1}`,
    email: `stress${index + 1}@example.com`,
    address: {
      street: `Stress Street ${index + 1}`,
      suite: `Suite ${index + 1}`,
      city: `Stress City ${index + 1}`,
      zipcode: `${String(12345 + index).padStart(5, '0')}-0000`,
      geo: {
        lat: String(40.0 + index),
        lng: String(-74.0 - index),
      },
    },
    phone: `1-555-000-${String(index + 1).padStart(4, '0')}`,
    website: `stress${index + 1}.example.com`,
    company: {
      name: `Stress Test Company ${index + 1}`,
      catchPhrase: `Stress testing catchphrase ${index + 1}`,
      bs: `stress testing business ${index + 1}`,
    },
  })) as UserResponse[],
};

// Scenario-based Mock Data
export const MOCK_SCENARIOS = {
  // Happy path scenarios
  SUCCESSFUL_POST_CREATION: {
    request: {
      title: 'New Blog Post',
      body: 'This is the content of the new blog post',
      userId: 1,
    },
    response: MOCK_POSTS.CREATED_POST,
  },

  // Edge case scenarios
  EMPTY_RESULTS: {
    posts: [] as PostResponse[],
    comments: [] as CommentResponse[],
    albums: [] as AlbumResponse[],
    photos: [] as PhotoResponse[],
    todos: [] as TodoResponse[],
    users: [] as UserResponse[],
  },

  // Error scenarios
  NETWORK_TIMEOUT: {
    error: 'TIMEOUT',
    message: 'Request timeout after 10 seconds',
  },

  RATE_LIMITED: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
};

// Mock Response Headers
export const MOCK_HEADERS = {
  SUCCESS: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'max-age=43200',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'x-powered-by': 'Express',
    'x-ratelimit-limit': '1000',
    'x-ratelimit-remaining': '999',
    'x-response-time': '12ms',
  },

  NOT_FOUND: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
    'access-control-allow-origin': '*',
    'x-powered-by': 'Express',
    'x-response-time': '5ms',
  },

  SERVER_ERROR: {
    'content-type': 'text/html',
    'cache-control': 'no-cache',
    'x-powered-by': 'Express',
    'x-response-time': '500ms',
  },
};

// Export all mock data in a structured format
export const JSONPLACEHOLDER_MOCKS = {
  posts: MOCK_POSTS,
  comments: MOCK_COMMENTS,
  albums: MOCK_ALBUMS,
  photos: MOCK_PHOTOS,
  todos: MOCK_TODOS,
  users: MOCK_USERS,
  errors: MOCK_ERRORS,
  performance: MOCK_PERFORMANCE_DATA,
  scenarios: MOCK_SCENARIOS,
  headers: MOCK_HEADERS,
} as const;
