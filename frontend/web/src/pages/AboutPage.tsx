
import React from 'react';
import ImprovedNavigation from '../components/ImprovedNavigation';

const AboutPage = () => {
  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Sobre Nosotros</h1>
        <div className="prose lg:prose-xl mx-auto">
          <p>Bienvenido a Keymax Prot, tu socio confiable en el mantenimiento y cuidado de vehículos. Nos dedicamos a ofrecer soluciones integrales para mantener tu coche en óptimas condiciones, garantizando seguridad, rendimiento y durabilidad.</p>
          <p>Nuestra misión es proporcionar servicios de alta calidad, utilizando tecnología de vanguardia y un equipo de técnicos altamente cualificados. Creemos en la transparencia, la honestidad y la satisfacción del cliente como pilares fundamentales de nuestro negocio.</p>
          <h2>Nuestra Historia</h2>
          <p>Fundada en [Año de Fundación], Keymax Prot nació de la pasión por los automóviles y el deseo de ofrecer un servicio excepcional en un sector que a menudo carece de confianza. Desde nuestros humildes comienzos, hemos crecido gracias a la lealtad de nuestros clientes y a nuestro compromiso inquebrantable con la excelencia.</p>
          <h2>Nuestro Equipo</h2>
          <p>Contamos con un equipo de profesionales experimentados y certificados, apasionados por su trabajo y siempre actualizados con las últimas tendencias y tecnologías del sector automotriz. Cada miembro de nuestro equipo está comprometido con la calidad y la atención al detalle.</p>
          <h2>Nuestros Valores</h2>
          <ul>
            <li><strong>Integridad:</strong> Actuamos con honestidad y ética en todas nuestras operaciones.</li>
            <li><strong>Calidad:</strong> Nos esforzamos por la excelencia en cada servicio que ofrecemos.</li>
            <li><strong>Confianza:</strong> Construimos relaciones duraderas basadas en la transparencia y la fiabilidad.</li>
            <li><strong>Innovación:</strong> Adoptamos nuevas tecnologías y métodos para mejorar continuamente.</li>
            <li><strong>Cliente Primero:</strong> Tu satisfacción es nuestra máxima prioridad.</li>
          </ul>
          <p>Gracias por elegir Keymax Prot. Estamos aquí para servirte y asegurar que tu vehículo reciba el mejor cuidado posible.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
