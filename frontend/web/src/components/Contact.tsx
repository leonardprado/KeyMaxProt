
import { Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <section id="contacto" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Contáctanos</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            ¿Listo para transformar tu vehículo, hogar o negocio? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Dirección</h4>
                    <p className="text-slate-300">Av. Principal #123, Centro, Ciudad</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Horarios</h4>
                    <p className="text-slate-300">Lun - Vie: 8:00 AM - 6:00 PM</p>
                    <p className="text-slate-300">Sáb: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
              <h4 className="text-xl font-bold text-white mb-4">¿Por qué elegirnos?</h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Agenda tu cita online las 24 horas</li>
                <li>• Cotizaciones gratuitas y sin compromiso</li>
                <li>• Garantía en todos nuestros trabajos</li>
                <li>• Tecnología de última generación</li>
              </ul>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solicita tu Cotización</CardTitle>
              <CardDescription className="text-slate-300">
                Completa el formulario y nos pondremos en contacto contigo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Nombre completo" 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                <Input 
                  placeholder="Teléfono" 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Input 
                placeholder="Email" 
                type="email" 
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Servicio de interés</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                  <option value="">Selecciona un servicio</option>
                  <option value="polarizado-vehicular">Polarizado Vehicular</option>
                  <option value="alarmas">Sistemas de Alarma</option>
                  <option value="audio">Audio Car</option>
                  <option value="luces">Iluminación LED</option>
                  <option value="polarizado-arquitectonico">Polarizado Arquitectónico</option>
                  <option value="seguridad-residencial">Seguridad Residencial</option>
                </select>
              </div>
              <Textarea 
                placeholder="Cuéntanos más detalles sobre lo que necesitas..." 
                rows={4}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3">
                <Calendar className="w-5 h-5 mr-2" />
                Solicitar Cotización
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
