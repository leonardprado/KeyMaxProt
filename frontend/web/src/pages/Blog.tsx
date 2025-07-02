
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Eye, Loader2 } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las publicaciones del blog.');
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
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-600 h-64 flex justify-center items-center">
            <p>No hay publicaciones en el blog en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link to={`/post/${post._id}`} key={post._id}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">by {post.author.name}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>{post.views}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
