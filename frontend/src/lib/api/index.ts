/**
 * API Module
 * Central export point for all API functionality
 */

import { ApiClient } from './client';
import { AuthApi } from './auth';
import { PositionsApi } from './positions';
import { UsersApi } from './users';

// Create singleton instances
const client = new ApiClient();

export const api = {
  auth: new AuthApi(client),
  positions: new PositionsApi(client),
  users: new UsersApi(client),
  client, // Expose for isAuthenticated() etc.
};

// Re-export types for convenience
export * from './types';
export { ApiError } from './client';
