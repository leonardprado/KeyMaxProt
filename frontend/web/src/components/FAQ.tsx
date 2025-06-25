import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: '¿Qué tipo de llaves pueden duplicar?',
    answer: 'Podemos duplicar una amplia variedad de llaves, incluyendo llaves de casa, de coche, de alta seguridad y llaves con chip. Utilizamos maquinaria de precisión para garantizar duplicados exactos.',
  },
  {
    question: '¿Ofrecen servicios de cerrajería de emergencia?',
    answer: 'Sí, ofrecemos un servicio de cerrajería de emergencia 24/7. Si te has quedado fuera de tu casa o coche, nuestro equipo puede ayudarte a cualquier hora del día o de la noche.',
  },
  {
    question: '¿Cuánto tiempo tarda en hacerse un duplicado de llave?',
    answer: 'La mayoría de las llaves estándar se pueden duplicar en pocos minutos. Las llaves de alta seguridad o con chip pueden tardar un poco más, pero nos esforzamos por ofrecer un servicio rápido y eficiente.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos una variedad de métodos de pago, incluyendo efectivo, tarjetas de crédito y débito, y pagos móviles. Queremos que el proceso sea lo más conveniente posible para ti.',
  },
  {
    question: '¿Tienen garantía sus productos y servicios?',
    answer: 'Sí, todos nuestros productos y servicios de cerrajería están garantizados. Si tienes algún problema con una llave duplicada o una cerradura instalada, contáctanos y lo solucionaremos.',
  },
];

const FAQ: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de cerrajería.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;