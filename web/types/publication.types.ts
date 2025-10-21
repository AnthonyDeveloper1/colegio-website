/**
 * Publication Types
 * Tipos relacionados con publicaciones/posts del blog
 */

import { Category } from './category.types';
import { User } from './user.types';

export interface Publication {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  status: string;
  published_at: string | null;
  category_id: number;
  category?: Category;
  author_id: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export interface CreatePublicationDto {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category_id: number;
}

export interface UpdatePublicationDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  image_url?: string;
  category_id?: number;
}

export interface PublicationFilters {
  category_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}
