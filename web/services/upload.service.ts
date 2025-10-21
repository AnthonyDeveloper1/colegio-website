/**
 * Upload Service
 * Servicio para subir archivos a Cloudinary
 */

import api from './api';

export interface UploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  msg: string;
}

class UploadService {
  /**
   * Subir imagen a Cloudinary
   */
  async uploadImage(file: File, folder: string = 'publicaciones'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

export const uploadService = new UploadService();
