/**
 * Positions API
 * Handles position CRUD operations and filtering
 */

import { ApiClient } from './client';
import { Position, PositionFilters } from './types';

export class PositionsApi {
  constructor(private client: ApiClient) {}

  /**
   * Get positions with optional filters (admin can use all_users or user_id)
   */
  async list(filters?: PositionFilters): Promise<Position[]> {
    const queryParams = new URLSearchParams();

    if (filters?.all_users) {
      queryParams.append('all_users', 'true');
    }
    if (filters?.user_id) {
      queryParams.append('user_id', filters.user_id.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/positions?${query}` : '/positions';

    return this.client.request<Position[]>(endpoint);
  }

  /**
   * Get a single position by ID
   */
  async get(id: number): Promise<Position> {
    return this.client.request<Position>(`/positions/${id}`);
  }

  /**
   * Create a new position
   */
  async create(data: Partial<Position>): Promise<Position> {
    return this.client.request<Position>('/positions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing position
   */
  async update(id: number, data: Partial<Position>): Promise<Position> {
    return this.client.request<Position>(`/positions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a position
   */
  async delete(id: number): Promise<void> {
    await this.client.request<void>(`/positions/${id}`, {
      method: 'DELETE',
    });
  }
}
