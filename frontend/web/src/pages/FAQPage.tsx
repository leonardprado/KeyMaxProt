
import React from 'react';
import ImprovedNavigation from '../components/ImprovedNavigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "¿Qué servicios ofrecen?",
      answer: "Ofrecemos una amplia gama de servicios de mantenimiento y reparación automotriz, incluyendo cambios de aceite, revisión de frenos, diagnóstico de motor, y mucho más. Visita nuestra sección de Servicios para más detalles.",
    },
    {
      question: "¿Cómo puedo agendar una cita?",
      answer: "Puedes agendar una cita directamente desde nuestra página web en la sección 'Agendar Cita'. Selecciona el servicio, la fecha y la hora que mejor te convenga.",
    },
    {
      question: "¿Venden repuestos o productos para vehículos?",
      answer: "Sí, en nuestro Marketplace encontrarás una variedad de productos y repuestos para tu vehículo, desde aceites y filtros hasta accesorios especializados.",
    },
    {
      question: "¿Cuál es su horario de atención?",
      answer: "Nuestro horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM, y sábados de 9:00 AM a 1:00 PM.",
    },
    {
      question: "¿Ofrecen garantía en sus servicios?",
      answer: "Sí, todos nuestros servicios cuentan con una garantía de [X] días o [Y] kilómetros, lo que ocurra primero. Consulta los términos y condiciones específicos para cada servicio.",
    },
  ];

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Preguntas Frecuentes (FAQ)</h1>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
