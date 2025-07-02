
import React from 'react';
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contáctanos</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <p className="text-center text-gray-600 mb-6">¿Tienes alguna pregunta o necesitas ayuda? No dudes en contactarnos.</p>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <Input type="text" id="name" placeholder="Tu nombre" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input type="email" id="email" placeholder="tu@ejemplo.com" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
              <Input type="text" id="subject" placeholder="Asunto del mensaje" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
              <Textarea id="message" rows={5} placeholder="Tu mensaje..." />
            </div>
            <Button type="submit" className="w-full">Enviar Mensaje</Button>
          </form>
          <div className="mt-8 text-center text-gray-600">
            <p>También puedes encontrarnos en:</p>
            <p>Dirección: [Tu Dirección Aquí]</p>
            <p>Teléfono: [Tu Teléfono Aquí]</p>
            <p>Email: [Tu Email Aquí]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
