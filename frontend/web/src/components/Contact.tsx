
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contact = () => {
  const contactInfo = [
    { icon: <Phone className="w-6 h-6 text-primary" />, title: "Teléfono", value: "(+549) 223-6990397" },
    { icon: <Mail className="w-6 h-6 text-primary" />, title: "Email", value: "contacto@keymaxprot.com" },
    { icon: <MapPin className="w-6 h-6 text-primary" />, title: "Dirección", value: "Corrientes 2539, Mar Del Plata" },
    { icon: <Clock className="w-6 h-6 text-primary" />, title: "Horarios", value: "Lun-Vie: 8am-6pm | Sáb: 8am-2pm" },
  ];

  return (
    <section id="contacto" className="py-20 md:py-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contáctanos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Listo para transformar tu vehículo, hogar o negocio? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Formulario de Contacto */}
          <div className="lg:col-span-3">
            <Card className="bg-card border p-8 rounded-2xl">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl text-card-foreground">Envíanos un Mensaje</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input placeholder="Nombre" className="h-12" />
                  <Input placeholder="Teléfono" className="h-12" />
                </div>
                <Input placeholder="Email" type="email" className="h-12" />
                <Select>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Selecciona un servicio de interés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="polarizado-vehicular">Polarizado Vehicular</SelectItem>
                    <SelectItem value="alarmas">Sistemas de Alarma</SelectItem>
                    <SelectItem value="audio">Audio Car</SelectItem>
                    <SelectItem value="luces">Iluminación LED</SelectItem>
                    <SelectItem value="polarizado-arquitectonico">Polarizado Arquitectónico</SelectItem>
                    <SelectItem value="seguridad-residencial">Seguridad Residencial</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Tu mensaje..." rows={5} />
                <Button className="w-full font-bold py-3 text-lg rounded-lg">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información de Contacto y Mapa */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-card-foreground">Información</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.68799345205!2d-57.5499425846759!3d-38.00569197971821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584de6a7824b6c3%3A0x4d5f0a74a3a3a4b!2sCorrientes%202539%2C%20B7600GQE%20Mar%20del%20Plata%2C%20Provincia%20de%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1ses-419!2sus!4v1678886400000!5m2!1ses-419!2sus"
                width="100%" 
                height="250" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
