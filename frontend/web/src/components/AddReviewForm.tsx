import React, { useState } from 'react';
import apiClient from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Importación correcta del hook useToast

interface AddReviewFormProps {
  itemType: 'Product' | 'ServiceCatalog' | 'Shop'; // Define los tipos permitidos
  itemId: string; // El ID del artículo (producto, servicio, taller)
  onReviewAdded: () => void; // Callback para actualizar la lista de reseñas después de añadir una
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  itemType,
  itemId,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Para mostrar notificaciones

  // Maneja el cambio de calificación al hacer clic en las estrellas
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // Maneja el envío del formulario de reseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona una calificación y escribe un comentario.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Llama a la API para crear la reseña
      await apiClient.post('/api/reviews', {
        item: {
          id: itemId,
          type: itemType,
        },
        rating,
        comment,
      });

      // Limpia el formulario y notifica que la reseña fue añadida
      setRating(0);
      setComment('');
      onReviewAdded();

      toast({
        title: 'Éxito',
        description: 'Tu reseña ha sido añadida.',
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error al enviar la reseña.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold">Deja tu Reseña</h3>
      
      {/* Selección de Calificación con Estrellas */}
      <div>
        <Label htmlFor="rating" className="block text-sm font-medium text-foreground mb-2">Calificación:</Label>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
              onClick={() => handleRatingChange(i + 1)}
            />
          ))}
        </div>
      </div>
      
      {/* Campo de Comentario */}
      <div>
        <Label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">Comentario:</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Escribe tu comentario aquí..."
          className="w-full"
          disabled={loading}
        />
      </div>
      
      {/* Botón de Envío */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Reseña'}
      </Button>
    </form>
  );
};

export default AddReviewForm;