
import { Check } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "10+", label: "Años de Experiencia" },
    { number: "5000+", label: "Clientes Satisfechos" },
    { number: "50+", label: "Servicios Realizados por Mes" },
    { number: "100%", label: "Garantía en Trabajos" }
  ];

  const values = [
    "Calidad garantizada en cada trabajo",
    "Tecnología de vanguardia",
    "Personal altamente capacitado",
    "Atención personalizada",
    "Precios competitivos",
    "Servicio postventa excepcional"
  ];

  return (
    <section id="nosotros" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Sobre <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Keymax Prot</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Somos una empresa especializada en servicios de personalización y seguridad vehicular, residencial y comercial. 
                Con más de una década de experiencia, nos hemos consolidado como líderes en el mercado local.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Nuestro compromiso es brindar soluciones integrales que combinen la más alta calidad, 
                tecnología avanzada y un servicio al cliente excepcional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center group hover:shadow-xl transition-shadow duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-blue-100 leading-relaxed">
                Transformar y proteger los espacios de nuestros clientes mediante soluciones innovadoras 
                que combinen funcionalidad, estética y seguridad, superando siempre sus expectativas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
