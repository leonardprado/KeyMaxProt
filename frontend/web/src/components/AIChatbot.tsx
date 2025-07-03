import React, { useState, FormEvent, useRef, useEffect } from 'react';
import apiClient from '@/api/axiosConfig'; // Usamos tu apiClient configurado
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Si quieres un campo multi-línea
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User as UserIcon, Bot } from 'lucide-react'; // Iconos para usuario y IA
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]); // Historial de chat
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Para hacer scroll automático al final

  // Función para hacer scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Añadir el mensaje del usuario a la conversación
    setConversation(prev => [...prev, { role: 'user', content: prompt }]);
    setPrompt(''); // Limpiar el input
    setIsLoading(true);

    try {
      const response = await apiClient.post('/ai/ask', { prompt }); // Llamada a tu API de IA
      const aiResponseText = response.data.response || 'No se pudo obtener una respuesta.';

      // Añadir la respuesta de la IA a la conversación
      setConversation(prev => [...prev, { role: 'assistant', content: aiResponseText }]);
      
      toast({
        title: 'Respuesta de IA',
        description: aiResponseText,
        variant: 'default', // O 'success' si quieres que sea verde
      });

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al consultar a la IA.';
      setError(errorMessage); // Si gestionas un estado de error general
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      // No añadir mensaje de error de la IA a la conversación, para no mostrarlo como parte del chat
    } finally {
      setIsLoading(false);
    }
  };

  // Hacer scroll automático cuando se añaden nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [conversation]); // Dependencia: cada vez que la conversación cambia

  return (
    <Card className="w-full max-w-xl mx-auto bg-card border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" /> {/* O el icono que prefieras para la IA */}
          Asistente IA KeyMaxProt
        </CardTitle>
        <CardDescription>Pregúntale a nuestro experto IA sobre servicios, diagnósticos o recomendaciones.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Área de Mensajes */}
        <div className="max-h-[400px] overflow-y-auto p-4 border-b">
          {conversation.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="w-12 h-12 mb-3" />
              <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary" />}
                <div className={`p-3 rounded-lg max-w-xs ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <UserIcon className="w-6 h-6 text-muted-foreground" />}
              </div>
            ))
          )}
          {/* Elemento para hacer scroll al final */}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 pt-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu consulta aquí..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()} className="flex-shrink-0">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIChatbot;