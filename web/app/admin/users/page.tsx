/**
 * Users Management Page
 * Lista de usuarios (solo para admin)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users as UsersIcon,
  Shield,
  Mail,
} from 'lucide-react';
import { Card, Button, Badge, Spinner, Modal, Input } from '@/components/ui';
import { usersService } from '@/services';
import { formatDate } from '@/lib/utils';
import { useUIStore } from '@/stores';
import { useAuthStore } from '@/stores';
import type { User, CreateUserDto, UpdateUserDto } from '@/types';

export default function UsersManagementPage() {
  const { showToast, setLoading } = useUIStore();
  const { user: currentUser } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin' as 'admin',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // Verificar si es superadmin
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Check if current user is at least admin
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
    return (
      <Card>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Solo los administradores pueden gestionar usuarios
          </p>
        </div>
      </Card>
    );
  }

  // Fetch users
  const fetchUsers = async () => {
    setIsLoadingData(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al cargar los usuarios',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        name: user.name || '',
        role: 'admin',
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'admin',
      });
    }
    setFormErrors({ email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', name: '', role: 'admin' });
    setFormErrors({ email: '', password: '' });
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!editingUser && !formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingUser) {
        const updateData: UpdateUserDto = {
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await usersService.update(editingUser.id, updateData);
        showToast({
          type: 'success',
          message: 'Usuario actualizado correctamente',
        });
      } else {
        await usersService.create(formData as CreateUserDto);
        showToast({
          type: 'success',
          message: 'Usuario creado correctamente',
        });
      }
      
      handleCloseModal();
      fetchUsers();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al guardar el usuario',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      showToast({
        type: 'error',
        message: 'No puedes eliminar tu propia cuenta',
      });
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    setLoading(true);
    try {
      await usersService.delete(id);
      showToast({
        type: 'success',
        message: 'Usuario eliminado correctamente',
      });
      
      fetchUsers();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al eliminar el usuario',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Usuarios
          </h1>
          <p className="text-gray-600">
            Gestiona los usuarios del sistema
          </p>
        </div>
        {isSuperAdmin && (
          <Button 
            variant="primary" 
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Users List */}
      {isLoadingData ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length > 0 ? (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} variant="hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.email}
                      </h3>
                      <Badge 
                        variant={
                          user.role === 'superadmin' ? 'success' : 
                          user.role === 'admin' ? 'default' : 'info'
                        }
                        size="sm"
                      >
                        {user.role === 'superadmin' ? '👑 Super Admin' : 
                         user.role === 'admin' ? '🔑 Admin' : 'Editor'}
                      </Badge>
                      {user.id === currentUser?.id && (
                        <Badge variant="success" size="sm">
                          Tú
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>Registrado: {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isSuperAdmin && user.role !== 'superadmin' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenModal(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                  {!isSuperAdmin && (
                    <span className="text-sm text-gray-500">
                      Solo lectura
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              No hay usuarios todavía
            </p>
            <Button 
              variant="primary"
              onClick={() => handleOpenModal()}
            >
              Crear Primer Usuario
            </Button>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            required
            fullWidth
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder={editingUser ? 'Dejar en blanco para mantener' : '••••••••'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            helperText={editingUser ? 'Dejar en blanco si no deseas cambiarla' : undefined}
            required={!editingUser}
            fullWidth
          />

          <Input
            label="Nombre"
            type="text"
            placeholder="Nombre del usuario"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Admin</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                El usuario tendrá acceso completo al panel de administración
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
