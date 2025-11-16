/**
 * API Types
 * TypeScript interfaces for API responses
 */

/**
 * User type from Laravel
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * User summary - minimal user data included with related resources
 */
export interface UserSummary {
  id: number;
  name: string;
}

/**
 * Position type from Laravel
 */
export interface Position {
  id: number;
  user_id: number;
  user: UserSummary;
  company: string | null;
  recruiter_company: string | null;
  title: string;
  description: string | null;
  status: string;
  location: string | null;
  salary: string | null;
  url: string | null;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Auth response from login endpoint
 */
export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

/**
 * Laravel validation errors format
 */
export interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Position filter parameters (for admin)
 */
export interface PositionFilters {
  all_users?: boolean;
  user_id?: number;
}
