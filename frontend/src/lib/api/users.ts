/**
 * Users API
 * Handles user-related operations (admin only)
 */

import { ApiClient } from './client';
import { User, Position } from './types';

export class UsersApi {
  constructor(private client: ApiClient) {}

  /**
   * Get all users (admin only)
   */
  async list(): Promise<User[]> {
    return this.client.request<User[]>('/users');
  }

  /**
   * Get positions for a specific user (admin only)
   */
  async getPositions(userId: number): Promise<Position[]> {
    return this.client.request<Position[]>(`/users/${userId}/positions`);
  }
}
