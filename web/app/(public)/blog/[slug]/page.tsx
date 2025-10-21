/**
 * Publicación Detail Page
 * Página de detalle de una publicación con contenido completo
 */

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
import { Container } from '@/components/layout';
import { BlogCard } from '@/components/features';
import { Badge, Button } from '@/components/ui';
import { publicationsService } from '@/services';
import { formatDate, timeAgo } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Metadata } from 'next';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await publicationsService.getBySlug(slug);
    
    return {
      title: `${post.title} - Publicaciones`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.image_url ? [post.image_url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Publicación no encontrada',
    };
  }
}

async function getRelatedPosts(categoryId: number, currentId: number) {
  try {
    const response = await publicationsService.getAll({ 
      category_id: categoryId, 
      per_page: 3 
    });
    return response.data.filter(post => post.id !== currentId);
  } catch (error) {
    return [];
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post;
  
  try {
    post = await publicationsService.getBySlug(slug);
  } catch (error) {
    notFound();
  }

  const relatedPosts = post.category_id 
    ? await getRelatedPosts(post.category_id, post.id)
    : [];

  return (
    <div className="py-12 md:py-16 bg-white">
      <Container size="lg">
        {/* Back Button */}
        <div className="mb-8">
          <Link href={ROUTES.BLOG}>
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Volver a Publicaciones
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <Badge variant="default">{post.category.name}</Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.email}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>

            {/* Time Ago */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{timeAgo(post.created_at)}</span>
            </div>

            {/* Category */}
            {post.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{post.category.name}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Tags (if any) */}
          {post.category && (
            <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
              <span className="text-gray-600 font-semibold">Categoría:</span>
              <Link href={`${ROUTES.BLOG}?category=${post.category.id}`}>
                <Badge variant="info" className="cursor-pointer hover:bg-blue-600">
                  {post.category.name}
                </Badge>
              </Link>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Publicaciones Relacionadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
