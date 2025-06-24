import { Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  KeymaxProt
                </span>
                <br />
                Tu especialista en
                <span className="text-orange-400"> personalización</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Servicios profesionales de polarizado, alarmas, audio, iluminación y más para vehículos, viviendas y comercios.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Más de 10 años de experiencia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Tecnología de última generación</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Garantía en todos nuestros trabajos</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Cita Ahora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                onClick={() => window.location.href = '/marketplace'}
              >
                Ver Marketplace
              </Button>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-3xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Agenda Online</h3>
                      <p className="text-slate-400">Disponible 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
