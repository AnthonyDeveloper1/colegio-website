/**
 * Message Types
 * Tipos relacionados con mensajes de contacto
 */

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export interface CreateContactMessageDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
