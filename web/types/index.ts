/**
 * Types Index
 * Export central de todos los tipos del proyecto
 */

// User types
export type {
  User,
  LoginCredentials,
  LoginResponse,
  CreateUserDto,
  UpdateUserDto,
} from './user.types';

// Category types
export type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.types';

// Publication types
export type {
  Publication,
  CreatePublicationDto,
  UpdatePublicationDto,
  PublicationFilters,
} from './publication.types';

// Gallery types
export type {
  GalleryItem,
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
  GalleryFilters,
} from './gallery.types';

// Message types
export type {
  ContactMessage,
  CreateContactMessageDto,
} from './message.types';

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  PaginationParams,
} from './api.types';
