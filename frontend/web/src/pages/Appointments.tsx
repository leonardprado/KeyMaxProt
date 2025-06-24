
import React from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointment } from '@/contexts/AppointmentContext';
import ServiceSelector from '@/components/ServiceSelector';
import DateTimeSelector from '@/components/DateTimeSelector';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const Appointments = () => {
  const { 
    currentStep, 
    selectedService, 
    selectedDate, 
    selectedTime, 
    contactInfo 
  } = useAppointment();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelector />;
      case 2:
        return <DateTimeSelector />;
      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                ¡Cita agendada exitosamente!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Resumen de tu cita:</h3>
                <div className="space-y-2 text-green-700">
                  <p><strong>Servicio:</strong> {selectedService?.name}</p>
                  <p><strong>Fecha:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString('es-AR') : ''}</p>
                  <p><strong>Hora:</strong> {selectedTime}</p>
                  <p><strong>Duración:</strong> {selectedService?.duration}</p>
                  <p><strong>Precio:</strong> {selectedService?.price}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Información de contacto:</h3>
                <div className="space-y-1 text-blue-700">
                  <p><strong>Nombre:</strong> {contactInfo.name}</p>
                  <p><strong>Email:</strong> {contactInfo.email}</p>
                  <p><strong>Teléfono:</strong> {contactInfo.phone}</p>
                  {contactInfo.address && (
                    <p><strong>Dirección:</strong> {contactInfo.address}</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Importante:</strong> Te enviaremos un email de confirmación con todos los detalles. 
                  Por favor, llegá 10 minutos antes de tu cita programada.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <ServiceSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Agendar Cita</h1>
          <p className="text-slate-600">
            Reservá tu turno para nuestros servicios profesionales
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step === 1 && <User className="w-5 h-5" />}
                  {step === 2 && <Calendar className="w-5 h-5" />}
                  {step === 3 && <CheckCircle className="w-5 h-5" />}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="mb-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
