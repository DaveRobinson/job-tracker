/**
 * Authentication API
 * Handles user login, logout, and session management
 */

import { ApiClient } from './client';
import { AuthResponse, User } from './types';

export class AuthApi {
  constructor(private client: ApiClient) {}

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.client.setToken(response.token);
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.client.request('/logout', { method: 'POST' });
    } finally {
      this.client.removeToken();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return this.client.request<User>('/user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.client.isAuthenticated();
  }
}
