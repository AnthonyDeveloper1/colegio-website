/**
 * Messages List Page
 * Lista de mensajes de contacto
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { Card, Button, Spinner, Modal, Badge } from '@/components/ui';
import { messagesService } from '@/services';
import { formatDate, timeAgo } from '@/lib/utils';
import { useUIStore } from '@/stores';
import type { ContactMessage } from '@/types';

export default function MessagesListPage() {
  const { showToast, setLoading } = useUIStore();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch messages
  const fetchMessages = async () => {
    setIsLoadingData(true);
    try {
      const data = await messagesService.getAll();
      setMessages(data);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al cargar los mensajes',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    setLoading(true);
    try {
      await messagesService.delete(id);
      showToast({
        type: 'success',
        message: 'Mensaje eliminado correctamente',
      });
      
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        handleCloseModal();
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al eliminar el mensaje',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mensajes de Contacto
        </h1>
        <p className="text-gray-600">
          Gestiona los mensajes recibidos desde el formulario de contacto
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mensajes</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages List */}
      {isLoadingData ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} variant="hover">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {msg.name}
                        </h3>
                        <Badge variant="info" size="sm">
                          {timeAgo(msg.created_at)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a 
                            href={`mailto:${msg.email}`}
                            className="hover:text-blue-600"
                          >
                            {msg.email}
                          </a>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a 
                              href={`tel:${msg.phone}`}
                              className="hover:text-blue-600"
                            >
                              {msg.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(msg.created_at)}</span>
                        </div>
                      </div>

                      <p className="font-semibold text-gray-900 mb-2">
                        {msg.subject}
                      </p>
                      <p className="text-gray-600 line-clamp-2">
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewMessage(msg)}
                        title="Ver mensaje completo"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
                        title="Eliminar mensaje"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No hay mensajes todavía
            </p>
          </div>
        </Card>
      )}

      {/* View Message Modal */}
      {selectedMessage && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Mensaje de Contacto"
          size="lg"
        >
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <p className="text-gray-900 font-semibold">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="text-gray-900">
                      <a href={`tel:${selectedMessage.phone}`} className="hover:text-blue-600">
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Asunto</label>
              <p className="text-lg font-semibold text-gray-900">{selectedMessage.subject}</p>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Mensaje</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedMessage.id)}
                leftIcon={<Trash2 className="w-4 h-4" />}
                className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
              >
                Eliminar
              </Button>
              <Button variant="primary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
