/**
 * SauceDemo User Test Data
 * Centralized user credentials for testing different user types
 */

export interface UserCredentials {
  username: string;
  password: string;
  description: string;
  userType: 'standard' | 'locked_out' | 'problem' | 'performance_glitch' | 'error' | 'visual';
}

export const SAUCEDEMO_USERS: Record<string, UserCredentials> = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with normal functionality',
    userType: 'standard',
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User that has been locked out',
    userType: 'locked_out',
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with problematic behavior',
    userType: 'problem',
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User with performance issues',
    userType: 'performance_glitch',
  },
  ERROR_USER: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'User that experiences errors',
    userType: 'error',
  },
  VISUAL_USER: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'User with visual testing differences',
    userType: 'visual',
  },
};

export const INVALID_CREDENTIALS = {
  INVALID_USERNAME: {
    username: 'invalid_user',
    password: 'secret_sauce',
    description: 'Invalid username for negative testing',
    userType: 'standard' as const,
  },
  INVALID_PASSWORD: {
    username: 'standard_user',
    password: 'invalid_password',
    description: 'Invalid password for negative testing',
    userType: 'standard' as const,
  },
  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
    description: 'Empty credentials for validation testing',
    userType: 'standard' as const,
  },
};
