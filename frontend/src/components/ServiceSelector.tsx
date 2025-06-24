
import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppointment } from '@/contexts/AppointmentContext';

const ServiceSelector = () => {
  const { services, selectedService, setSelectedService } = useAppointment();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim();
    }
    return `${mins}min`;
  };

  const getCategoryName = (category: string) => {
    const categories = {
      'seguridad': 'Seguridad',
      'accesorios': 'Accesorios',
      'mantenimiento': 'Mantenimiento'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'seguridad': 'bg-red-100 text-red-700',
      'accesorios': 'bg-blue-100 text-blue-700',
      'mantenimiento': 'bg-green-100 text-green-700'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-600 mb-6">
        Selecciona el servicio que necesitas para tu vehículo
      </p>
      
      <div className="grid gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedService?.id === service.id
                ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50'
                : 'hover:shadow-md border-slate-200'
            }`}
            onClick={() => setSelectedService(service)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 object-cover rounded-lg bg-slate-100"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {service.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                        {getCategoryName(service.category)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(service.price)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDuration(service.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-1">
                        (4.8) • 124 reseñas
                      </span>
                    </div>
                    
                    {selectedService?.id === service.id && (
                      <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Seleccionado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
