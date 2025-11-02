// frontend/lib/api.ts
// Core API client - handles authentication and provides base request method

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * User type from Laravel
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Auth response from login endpoint
 */
interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

/**
 * Laravel validation errors format
 */
interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Base API Client
 * Handles authentication and provides foundation for other API modules
 */
export class ApiClient {
  /**
   * TOKEN MANAGEMENT
   * Private methods for handling auth tokens
   */
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  /**
   * CORE REQUEST METHOD
   * This is the foundation - all API calls go through here
   * Public so other API modules can use it
   */
  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: Record<string, string>  = {
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

    return response.json();
  }

  /**
   * AUTHENTICATION METHODS
   */

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.token);
    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User> {
    return this.request<User>('/user');
  }

  /**
   * Check if user has a token
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

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