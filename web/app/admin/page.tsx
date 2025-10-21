/**
 * Admin Dashboard Page
 * Página principal del panel de administración con estadísticas
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  FolderOpen, 
  Image, 
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  Users as UsersIcon,
} from 'lucide-react';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { dashboardService } from '@/services';
import { formatDate, timeAgo } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Publication, ContactMessage } from '@/types';

interface Stats {
  publications: number;
  categories: number;
  gallery: number;
  messages: number;
  total_messages: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    publications: 0,
    categories: 0,
    gallery: 0,
    messages: 0,
    total_messages: 0,
    users: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Publication[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener estadísticas y datos recientes del nuevo endpoint
        const [statsData, recentData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecent(),
        ]);

        setStats(statsData);
        setRecentPosts(recentData.publications);
        setRecentMessages(recentData.messages);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Publicaciones',
      value: stats.publications,
      icon: <FileText className="w-6 h-6" />,
      color: 'blue',
      href: '/admin/publications',
    },
    {
      title: 'Categorías',
      value: stats.categories,
      icon: <FolderOpen className="w-6 h-6" />,
      color: 'purple',
      href: '/admin/categories',
    },
    {
      title: 'Galería',
      value: stats.gallery,
      icon: <Image className="w-6 h-6" />,
      color: 'green',
      href: '/admin/gallery',
    },
    {
      title: 'Mensajes',
      value: stats.messages,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'red',
      href: '/admin/messages',
    },
    {
      title: 'Usuarios',
      value: stats.users,
      icon: <UsersIcon className="w-6 h-6" />,
      color: 'orange',
      href: '/admin/users',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card variant="hover" className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Publicaciones Recientes
            </h2>
            <Link href={ROUTES.ADMIN.PUBLICATIONS}>
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{timeAgo(post.created_at)}</span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge variant="info" size="sm">
                            {post.category.name}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay publicaciones todavía
            </p>
          )}
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Mensajes Recientes
            </h2>
            <Link href={ROUTES.ADMIN.MESSAGES}>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {message.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {timeAgo(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {message.subject}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay mensajes todavía
            </p>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={ROUTES.ADMIN.PUBLICATIONS_NEW}>
            <Button variant="primary" fullWidth leftIcon={<FileText className="w-5 h-5" />}>
              Nueva Publicación
            </Button>
          </Link>
          <Link href={ROUTES.ADMIN.GALLERY}>
            <Button variant="primary" fullWidth leftIcon={<Image className="w-5 h-5" />}>
              Gestionar Galería
            </Button>
          </Link>
          <Link href={ROUTES.ADMIN.CATEGORIES}>
            <Button variant="primary" fullWidth leftIcon={<FolderOpen className="w-5 h-5" />}>
              Gestionar Categorías
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
