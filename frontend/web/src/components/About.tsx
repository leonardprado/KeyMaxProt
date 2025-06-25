
import { Check, Award, Users, Wrench, ShieldCheck, Star, Phone } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "10+", label: "Años de Experiencia", icon: <Award className="w-8 h-8 text-primary" /> },
    { number: "5K+", label: "Clientes Satisfechos", icon: <Users className="w-8 h-8 text-primary" /> },
    { number: "1K+", label: "Servicios Mensuales", icon: <Wrench className="w-8 h-8 text-primary" /> },
    { number: "100%", label: "Garantía Total", icon: <ShieldCheck className="w-8 h-8 text-primary" /> }
  ];

  const values = [
    { text: "Calidad garantizada", icon: <Star className="w-6 h-6 text-primary" /> },
    { text: "Tecnología de vanguardia", icon: <Star className="w-6 h-6 text-primary" /> },
    { text: "Personal capacitado", icon: <Star className="w-6 h-6 text-primary" /> },
    { text: "Atención personalizada", icon: <Star className="w-6 h-6 text-primary" /> },
    { text: "Precios competitivos", icon: <Star className="w-6 h-6 text-primary" /> },
    { text: "Servicio postventa", icon: <Star className="w-6 h-6 text-primary" /> }
  ];

  return (
    <section id="nosotros" className="py-20 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Sobre <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Keymax Prot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Líderes en personalización y seguridad vehicular, residencial y comercial con más de una década de experiencia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80" 
              alt="Taller Keymax Prot"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Nuestros Valores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg">
                  {value.icon}
                  <span className="text-card-foreground font-medium">{value.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-card rounded-xl shadow-sm">
              {stat.icon}
              <div className="text-3xl font-bold text-foreground mt-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-primary-foreground text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para empezar?</h3>
          <p className="text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto mb-6">
            Transforma y protege tus espacios con nuestras soluciones innovadoras. ¡Contáctanos hoy mismo!
          </p>
          <button className="bg-primary-foreground text-primary font-bold py-3 px-8 rounded-full hover:bg-primary-foreground/90 transition-colors duration-300 shadow-lg">
            <Phone className="w-5 h-5 mr-2 inline-block" />
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
