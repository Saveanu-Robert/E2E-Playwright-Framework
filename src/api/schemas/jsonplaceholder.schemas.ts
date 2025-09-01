/**
 * JSONPlaceholder API Response Schemas
 * JSON Schema definitions for contract testing and response validation
 *
 * These schemas define the expected structure of API responses from JSONPlaceholder
 * Used for:
 * - Contract testing
 * - Response validation
 * - Type checking
 * - Documentation
 */

export const JSON_SCHEMAS = {
  // Post Resource Schema
  POST: {
    type: 'object',
    required: ['id', 'title', 'body', 'userId'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        description: 'Unique identifier for the post',
      },
      title: {
        type: 'string',
        minLength: 1,
        description: 'Post title',
      },
      body: {
        type: 'string',
        minLength: 1,
        description: 'Post content body',
      },
      userId: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'ID of the user who created the post',
      },
    },
    additionalProperties: false,
  },

  // Comment Resource Schema
  COMMENT: {
    type: 'object',
    required: ['id', 'name', 'email', 'body', 'postId'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        description: 'Unique identifier for the comment',
      },
      name: {
        type: 'string',
        minLength: 1,
        description: 'Comment title/name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email address of the commenter',
      },
      body: {
        type: 'string',
        minLength: 1,
        description: 'Comment content body',
      },
      postId: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'ID of the post this comment belongs to',
      },
    },
    additionalProperties: false,
  },

  // Album Resource Schema
  ALBUM: {
    type: 'object',
    required: ['id', 'title', 'userId'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        description: 'Unique identifier for the album',
      },
      title: {
        type: 'string',
        minLength: 1,
        description: 'Album title',
      },
      userId: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'ID of the user who owns the album',
      },
    },
    additionalProperties: false,
  },

  // Photo Resource Schema
  PHOTO: {
    type: 'object',
    required: ['id', 'title', 'url', 'thumbnailUrl', 'albumId'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        description: 'Unique identifier for the photo',
      },
      title: {
        type: 'string',
        minLength: 1,
        description: 'Photo title',
      },
      url: {
        type: 'string',
        format: 'uri',
        description: 'Full-size photo URL',
      },
      thumbnailUrl: {
        type: 'string',
        format: 'uri',
        description: 'Thumbnail photo URL',
      },
      albumId: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'ID of the album this photo belongs to',
      },
    },
    additionalProperties: false,
  },

  // Todo Resource Schema
  TODO: {
    type: 'object',
    required: ['id', 'title', 'completed', 'userId'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        description: 'Unique identifier for the todo',
      },
      title: {
        type: 'string',
        minLength: 1,
        description: 'Todo task description',
      },
      completed: {
        type: 'boolean',
        description: 'Whether the todo is completed',
      },
      userId: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'ID of the user who owns the todo',
      },
    },
    additionalProperties: false,
  },

  // User Resource Schema
  USER: {
    type: 'object',
    required: ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'Unique identifier for the user',
      },
      name: {
        type: 'string',
        minLength: 1,
        description: 'Full name of the user',
      },
      username: {
        type: 'string',
        minLength: 1,
        description: 'Username',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email address',
      },
      address: {
        type: 'object',
        required: ['street', 'suite', 'city', 'zipcode', 'geo'],
        properties: {
          street: {
            type: 'string',
            minLength: 1,
            description: 'Street address',
          },
          suite: {
            type: 'string',
            minLength: 1,
            description: 'Suite/apartment number',
          },
          city: {
            type: 'string',
            minLength: 1,
            description: 'City name',
          },
          zipcode: {
            type: 'string',
            pattern: '^[0-9]{5}(-[0-9]{4})?$',
            description: 'ZIP code in format XXXXX or XXXXX-XXXX',
          },
          geo: {
            type: 'object',
            required: ['lat', 'lng'],
            properties: {
              lat: {
                type: 'string',
                pattern: '^-?[0-9]+(\\.[0-9]+)?$',
                description: 'Latitude coordinate',
              },
              lng: {
                type: 'string',
                pattern: '^-?[0-9]+(\\.[0-9]+)?$',
                description: 'Longitude coordinate',
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
      phone: {
        type: 'string',
        minLength: 1,
        description: 'Phone number',
      },
      website: {
        type: 'string',
        minLength: 1,
        description: 'Website URL',
      },
      company: {
        type: 'object',
        required: ['name', 'catchPhrase', 'bs'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'Company name',
          },
          catchPhrase: {
            type: 'string',
            minLength: 1,
            description: 'Company catchphrase',
          },
          bs: {
            type: 'string',
            minLength: 1,
            description: 'Company business/bs description',
          },
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },

  // Array schemas for collections
  POSTS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/post',
    },
    minItems: 0,
    maxItems: 100,
  },

  COMMENTS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/comment',
    },
    minItems: 0,
    maxItems: 500,
  },

  ALBUMS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/album',
    },
    minItems: 0,
    maxItems: 100,
  },

  PHOTOS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/photo',
    },
    minItems: 0,
    maxItems: 5000,
  },

  TODOS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/todo',
    },
    minItems: 0,
    maxItems: 200,
  },

  USERS_ARRAY: {
    type: 'array',
    items: {
      $ref: '#/$defs/user',
    },
    minItems: 0,
    maxItems: 10,
  },

  // Error response schema
  ERROR_RESPONSE: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Error message',
      },
      status: {
        type: 'integer',
        description: 'HTTP status code',
      },
      message: {
        type: 'string',
        description: 'Detailed error message',
      },
    },
    additionalProperties: true,
  },
} as const;

// Full JSON Schema document with definitions
export const JSONPLACEHOLDER_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://jsonplaceholder.typicode.com/schema',
  title: 'JSONPlaceholder API Schema',
  description: 'Schema definitions for JSONPlaceholder API responses',

  $defs: {
    post: JSON_SCHEMAS.POST,
    comment: JSON_SCHEMAS.COMMENT,
    album: JSON_SCHEMAS.ALBUM,
    photo: JSON_SCHEMAS.PHOTO,
    todo: JSON_SCHEMAS.TODO,
    user: JSON_SCHEMAS.USER,
    error: JSON_SCHEMAS.ERROR_RESPONSE,
  },

  // Root schema types
  oneOf: [
    { $ref: '#/$defs/post' },
    { $ref: '#/$defs/comment' },
    { $ref: '#/$defs/album' },
    { $ref: '#/$defs/photo' },
    { $ref: '#/$defs/todo' },
    { $ref: '#/$defs/user' },
    { $ref: '#/$defs/error' },
    JSON_SCHEMAS.POSTS_ARRAY,
    JSON_SCHEMAS.COMMENTS_ARRAY,
    JSON_SCHEMAS.ALBUMS_ARRAY,
    JSON_SCHEMAS.PHOTOS_ARRAY,
    JSON_SCHEMAS.TODOS_ARRAY,
    JSON_SCHEMAS.USERS_ARRAY,
  ],
} as const;

// Type definitions for TypeScript
export interface PostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CommentResponse {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

export interface AlbumResponse {
  id: number;
  title: string;
  userId: number;
}

export interface PhotoResponse {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

export interface TodoResponse {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface ErrorResponse {
  error?: string;
  status?: number;
  message?: string;
}

// Union types for API responses
export type JsonPlaceholderResponse =
  | PostResponse
  | CommentResponse
  | AlbumResponse
  | PhotoResponse
  | TodoResponse
  | UserResponse
  | ErrorResponse;

export type JsonPlaceholderArrayResponse =
  | PostResponse[]
  | CommentResponse[]
  | AlbumResponse[]
  | PhotoResponse[]
  | TodoResponse[]
  | UserResponse[];
