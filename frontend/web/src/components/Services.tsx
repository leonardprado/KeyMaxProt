
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const vehicularServices = [
    {
      name: "Polarizado Vehicular",
      description: "Protección UV y privacidad para tu vehículo con películas de alta calidad",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      price: "Desde $150"
    },
    {
      name: "Sistemas de Alarma",
      description: "Seguridad avanzada con tecnología de última generación",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      price: "Desde $200"
    },
    {
      name: "Audio Car",
      description: "Sistemas de sonido premium para una experiencia auditiva superior",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      price: "Desde $300"
    },
    {
      name: "Iluminación LED",
      description: "Moderniza tu vehículo con la última tecnología en iluminación",
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop",
      price: "Desde $100"
    }
  ];

  const residentialServices = [
    {
      name: "Polarizado Arquitectónico",
      description: "Eficiencia energética y privacidad para tu hogar o negocio",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      price: "Cotización"
    },
    {
      name: "Sistemas de Seguridad",
      description: "Protección integral con cámaras y sensores inteligentes",
      image: "https://images.unsplash.com/photo-1558002038-bb4237b54d60?w=400&h=300&fit=crop",
      price: "Cotización"
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Nuestros <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Servicios</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios de personalización y seguridad para vehículos, viviendas y comercios
          </p>
        </div>

        {/* Servicios Vehiculares */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Servicios Vehiculares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicularServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white font-semibold">
                    {service.price}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{service.name}</CardTitle>
                  <CardDescription className="text-slate-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Servicios Residenciales/Comerciales */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Servicios Residenciales y Comerciales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {residentialServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white font-semibold">
                    {service.price}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{service.name}</CardTitle>
                  <CardDescription className="text-slate-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Solicitar Cotización
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
