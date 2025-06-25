
import { Calendar, Car, ShieldCheck, Music, Lightbulb, Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const vehicularServices = [
    {
      name: "Polarizados",
      description: "Protección UV y privacidad para tu vehículo.",
      icon: <Car className="w-8 h-8 text-primary" />,
      price: "Desde $100.000"
    },
    {
      name: "Plotters",
      description: "Plotter de corte y vehículos enteros.",
      icon: <Car className="w-8 h-8 text-primary" />,
      price: "Desde $5.000"
    },
    {
      name: "Sistemas de Alarma",
      description: "Seguridad avanzada con tecnología de última generación.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      price: "Desde $120.000"
    },
    {
      name: "Cierres Centralizados",
      description: "Seguridad y confort con equipos de calidad genericos y originales.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      price: "Desde $50.000"
    },
    {
      name: "Alza Cristales Electricos",
      description: "Sistemas precisos, seguros y duraderos para mejorar tu experiencia de conducción.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      price: "Desde $50.000"
    },
    {
      name: "4x4 Equipaments",
      description: "Equipá tu 4x4 con tapas rígidas, jaulas, estribos y mucho más.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      price: "Desde $50.000"
    },
     {
      name: "Cars Equipaments",
      description: "Equipá tu auto con sensores de estacionamiento, y mucho más, con productos de calidad.",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      price: "Desde $50.000"
    },
    {
      name: "Audio Car",
      description: "Sistemas de sonido premium para una experiencia superior.",
      icon: <Music className="w-8 h-8 text-primary" />,
      price: "Desde $15.000"
    },
    {
      name: "Electricidad del automotor",
      description: "Moderniza tu vehículo con lo último en iluminación,instalacines y reparaciones eléctricas.",
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      price: "Desde $5.000"
    }
  ];

  const residentialServices = [
    {
      name: "Polarizado Arquitectónico",
      description: "Eficiencia energética y privacidad para tu hogar o negocio.",
      icon: <Building className="w-8 h-8 text-primary" />,
      price: "Cotización"
    },
    {
      name: "Sistemas de Seguridad",
      description: "Protección integral con cámaras y sensores inteligentes.",
      icon: <Lock className="w-8 h-8 text-primary" />,
      price: "Cotización"
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nuestros <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Servicios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios de personalización y seguridad para vehículos, viviendas y comercios
          </p>
        </div>

        {/* Servicios Vehiculares */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Servicios Vehiculares</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {vehicularServices.map((service, index) => (
              <Card key={index} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                <CardHeader className="flex-row items-center gap-4 p-6">
                  {service.icon}
                  <CardTitle className="text-xl font-bold text-foreground">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardDescription className="text-muted-foreground mb-4 flex-grow">{service.description}</CardDescription>
                  <p className="text-lg font-semibold text-foreground mb-4">{service.price}</p>
                  <Button className="w-full mt-auto">
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
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Servicios Residenciales y Comerciales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {residentialServices.map((service, index) => (
              <Card key={index} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                 <CardHeader className="flex-row items-center gap-4 p-6">
                  {service.icon}
                  <CardTitle className="text-xl font-bold text-foreground">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardDescription className="text-muted-foreground mb-4 flex-grow">{service.description}</CardDescription>
                  <p className="text-lg font-semibold text-foreground mb-4">{service.price}</p>
                  <Button variant="secondary" className="w-full mt-auto">
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
