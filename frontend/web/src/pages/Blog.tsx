import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Eye, Loader2 } from 'lucide-react';
import axios from 'axios'; // Importamos axios para la comprobación de errores

import apiClient from '../api/axiosConfig';

interface Post {
  _id: string;
  title?: string;
  author?: {
    name?: string;
  };
  // Usamos un tipo más específico. Asumimos que es un array de IDs (strings).
  likes?: string[];
  views?: number;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/posts');
        // Asegurarse de que `posts` sea siempre un array.
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err: unknown) {
        console.error('Error fetching posts:', err);
        let errorMessage = 'Error al cargar las publicaciones del blog.';
        
        // Comprobamos si es un error de Axios de forma segura
        if (axios.isAxiosError(err)) {
          // Si es un error de Axios, podemos acceder a `response` de forma segura
          errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          // Si es un error genérico, solo accedemos a `message`
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [toast]);

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-2 text-gray-600">Cargando publicaciones...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 h-64 flex justify-center items-center">
            <p>{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link to={`/post/${post._id}`} key={post._id}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{post.title || 'Sin Título'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">by {post.author?.name || 'Autor desconocido'}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>{post.views || 0}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 h-64 flex justify-center items-center">
            <p>No hay publicaciones en el blog en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
