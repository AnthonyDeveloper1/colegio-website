/**
 * Validators
 * Schemas de validación con Zod
 */

import { z } from 'zod';

// User validators
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const createUserSchema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'editor']),
});

// Publication validators
export const createPublicationSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (solo minúsculas, números y guiones)'),
  content: z.string()
    .min(10, 'El contenido debe tener al menos 10 caracteres'),
  excerpt: z.string()
    .max(250, 'El extracto no puede exceder 250 caracteres')
    .optional(),
  image_url: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  category_id: z.number()
    .min(1, 'Debes seleccionar una categoría'),
});

export const updatePublicationSchema = createPublicationSchema.partial();

// Category validators
export const createCategorySchema = z.object({
  slug: z.string()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Gallery validators
export const createGalleryItemSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  url: z.string()
    .url('URL inválida'),
  caption: z.string()
    .max(500, 'El caption no puede exceder 500 caracteres')
    .optional(),
  category: z.string()
    .max(100, 'La categoría no puede exceder 100 caracteres')
    .optional(),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();

// Contact message validators
export const contactMessageSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  phone: z.string()
    .regex(/^[0-9\s\-\+\(\)]*$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder 200 caracteres'),
  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreatePublicationFormData = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationFormData = z.infer<typeof updatePublicationSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CreateGalleryItemFormData = z.infer<typeof createGalleryItemSchema>;
export type UpdateGalleryItemFormData = z.infer<typeof updateGalleryItemSchema>;
export type ContactMessageFormData = z.infer<typeof contactMessageSchema>;
