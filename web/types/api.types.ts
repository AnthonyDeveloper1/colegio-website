/**
 * API Types
 * Tipos genéricos para respuestas de la API
 */

export interface ApiResponse<T> {
  data?: T;
  msg?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  msg?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}
