/**
 * Category Types
 * Tipos relacionados con categorías de publicaciones
 */

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CreateCategoryDto {
  slug: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  slug?: string;
  name?: string;
  description?: string;
}
