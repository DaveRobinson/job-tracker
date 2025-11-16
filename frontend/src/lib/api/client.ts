/**
 * Base API Client
 * Handles HTTP requests, authentication tokens, and error handling
 */

import { ValidationErrors } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  public errors?: ValidationErrors;

  constructor(message: string, errors?: ValidationErrors) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }

  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }

  hasValidationErrors(): boolean {
    return this.errors !== undefined && Object.keys(this.errors).length > 0;
  }
}

/**
 * Base API Client
 * Provides core HTTP request functionality and token management
 */
export class ApiClient {
  /**
   * TOKEN MANAGEMENT
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  /**
   * CORE REQUEST METHOD
   * All API calls go through here
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message || 'An error occurred', error.errors);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Check if user has a token
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
