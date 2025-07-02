import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImprovedNavigation from '../components/ImprovedNavigation';
import Comment from '../components/Comment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Eye, MessageSquare, Loader2 } from 'lucide-react';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorPost, setErrorPost] = useState(null);
  const [errorComments, setErrorComments] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      setErrorPost(null);
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data.data);
      } catch (err) {
        console.error(err);
        setErrorPost('Error al cargar la publicación.');
      } finally {
        setLoadingPost(false);
      }
    };
    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const res = await axios.get(`/api/posts/${id}/comments`);
        setComments(res.data.data);
      } catch (err) {
        console.error(err);
        setErrorComments('Error al cargar los comentarios.');
      } finally {
        setLoadingComments(false);
      }
    };
    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/posts/${id}/comments`, { content: newComment });
      setComments([res.data.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Error al publicar el comentario.');
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.put(`/api/posts/${id}/like`);
      setPost({ ...post, likes: res.data.data });
    } catch (err) {
      console.error(err);
      alert('Error al dar me gusta.');
    }
  };

  if (loadingPost) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="ml-2 text-gray-600">Cargando publicación...</p>
    </div>
  );
  if (errorPost) return (
    <div className="text-center text-red-500 h-screen flex justify-center items-center">
      <p>{errorPost}</p>
    </div>
  );
  if (!post) return (
    <div className="text-center text-gray-600 h-screen flex justify-center items-center">
      <p>Publicación no encontrada.</p>
    </div>
  );

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <p className="text-gray-500">by {post.author.name}</p>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5" />
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{comments.length}</span>
            </div>
          </div>
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          <Button onClick={handleLike}>Me gusta</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe un comentario..." />
            <Button type="submit" className="mt-2">Publicar</Button>
          </form>
          {loadingComments ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-gray-600">Cargando comentarios...</p>
            </div>
          ) : errorComments ? (
            <div className="text-center text-red-500 h-32 flex justify-center items-center">
              <p>{errorComments}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-600 h-32 flex justify-center items-center">
              <p>Sé el primero en comentar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;