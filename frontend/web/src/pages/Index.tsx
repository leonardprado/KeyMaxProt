import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImprovedNavigation from '../components/ImprovedNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <Hero />

      <section id="info-sections" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explora Keymax Prot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Sobre Nosotros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Conoce nuestra historia, misión y el equipo detrás de Keymax Prot.</p>
                <Link to="/about"><Button>Saber Más</Button></Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Productos Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Descubre nuestros productos en promoción y las mejores ofertas.</p>
                <Link to="/featured-products"><Button>Ver Productos</Button></Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Nuestros Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Explora la gama completa de servicios de mantenimiento y reparación.</p>
                <Link to="/services"><Button>Ver Servicios</Button></Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Contáctanos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">¿Tienes preguntas? Ponte en contacto con nuestro equipo.</p>
                <Link to="/contact"><Button>Contactar</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq-section" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios y productos.</p>
          <Link to="/faq"><Button>Ver Todas las Preguntas</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default Index;