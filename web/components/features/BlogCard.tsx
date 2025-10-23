/**
 * Blog Card Component
 * Card de publicación para mostrar en listas
 * Optimizado con transiciones CSS ligeras
 */

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { formatDate, truncate, getImageUrl } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Publication } from '@/types';

interface BlogCardProps {
  post: Publication;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <Link href={ROUTES.BLOG_POST(post.slug)}>
      <Card variant="clickable" padding="none" className="h-full overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {post.image_url ? (
            <img
              src={getImageUrl(post.image_url)}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-75"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-6xl font-bold">
              {post.title.charAt(0)}
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="info" rounded>
                {post.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author.email.split('@')[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-75 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {truncate(post.excerpt, 150)}
            </p>
          )}

          {/* Read More */}
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            Leer más
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-75" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
