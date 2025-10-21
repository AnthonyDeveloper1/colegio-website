/**
 * Gallery Types
 * Tipos relacionados con galería de imágenes
 */

export interface GalleryItem {
  id: number;
  title: string;
  url: string;
  caption: string | null;
  category: string | null;
  created_at: string;
}

export interface CreateGalleryItemDto {
  title: string;
  url: string;
  caption?: string;
  category?: string;
}

export interface UpdateGalleryItemDto {
  title?: string;
  url?: string;
  caption?: string;
  category?: string;
}

export interface GalleryFilters {
  category?: string;
}
