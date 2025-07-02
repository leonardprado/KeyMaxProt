import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Eye, Loader2 } from 'lucide-react';

// --- Importa tu apiClient si quieres usarlo para la API del backend ---
// import apiClient from '../api/axiosConfig'; 

// Asegúrate de que la URL base de tu apiClient esté configurada correctamente
// si decides usarlo. Por ahora, si tu backend está en localhost:3001,
// axios.get('/api/posts') debería funcionar si tu `baseURL` está bien configurada
// o si el proxy de Vite está activo. Si no, deberías usar la URL completa con apiClient.

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]); // <-- Asegúrate de que sea un array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // <-- Tipa el error
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null); // Reinicia el error antes de intentar la petición
      try {
        // Si estás usando axios sin apiClient, asegúrate de que axios esté configurado
        // para usar la URL base de tu backend si es necesario (o usa tu apiClient)
        const res = await apiClient.get('/posts'); // <-- Usa la URL base correcta si no usas apiClient
        // --- ESTA LÍNEA ES CRÍTICA ---
        // Si la respuesta no tiene la estructura esperada (data.data), posts podría ser undefined
        setPosts(res.data.data || []); // <-- Usa un fallback a [] para prevenir el error
      } catch (err: any) { // <-- Tipa err para acceder a err.message o err.response
        console.error('Error fetching posts:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Error al cargar las publicaciones del blog.';
        setError(errorMessage);
        setPosts([]); // <-- Asegúrate de que sea un array si hay error
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
  }, []);

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
        ) : (
          // --- LA LÓGICA DE RENDERIZADO DEBE SER MÁS SEGURA ---
          posts.length > 0 ? ( // <-- Verifica explícitamente si el array tiene elementos
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link to={`/post/${post._id}`} key={post._id}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">by {post.author?.name || 'Autor desconocido'}</p> {/* <-- Añade seguridad por si author o name no vienen */}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-5 h-5" />
                        <span>{post.likes?.length || 0}</span> {/* <-- Añade seguridad */}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>{post.views || 0}</span> {/* <-- Añade seguridad */}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : ( // <-- Este bloque se ejecuta si posts.length es 0
            <div className="text-center text-gray-600 h-64 flex justify-center items-center">
              <p>No hay publicaciones en el blog en este momento.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Blog;