import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointment, Service, TimeSlot } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const AppointmentPage: React.FC = () => {
  const { 
    services, 
    selectedService, 
    setSelectedService, 
    selectedDate, 
    setSelectedDate, 
    selectedTime, 
    setSelectedTime, 
    currentStep, 
    setCurrentStep, 
    contactInfo, 
    setContactInfo, 
    getAvailableSlots, 
    createAppointment,
    availableSlots
  } = useAppointment();

  useEffect(() => {
    console.log('Services in AppointmentPage:', services);
    services.forEach(s => console.log('Service ID:', s._id));
  }, [services]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState<Date | undefined>(selectedDate ? new Date(selectedDate) : undefined);

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    setSelectedService(service || null);
    setCurrentStep(2);
  };

  const handleDateSelect = async (newDate: Date | undefined) => {
    if (newDate) {
      if (!selectedService) {
        toast.error('Por favor, selecciona un servicio primero.');
        return;
      }
      const dateString = newDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
      setDate(newDate);
      await getAvailableSlots(dateString);
      setCurrentStep(3);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitAppointment = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para reservar una cita.');
      navigate('/auth');
      return;
    }

    if (selectedService && selectedDate && selectedTime && contactInfo.name && contactInfo.email && contactInfo.phone) {
      const success = await createAppointment({
        userId: user.id,
        serviceId: selectedService._id,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        customerInfo: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address || '',
        },
        notes: '',
      });

      if (success) {
        toast.success('Cita reservada con éxito!');
        setCurrentStep(1); // Reset for new appointment
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
        setContactInfo({ name: '', email: '', phone: '', address: '' });
        navigate('/appointments'); // Redirect to user's appointments
      } else {
        toast.error('Error al reservar la cita. Inténtalo de nuevo.');
      }
    } else {
      toast.error('Por favor, completa todos los campos requeridos.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Reservar una Cita</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Step 1: Select Service */}
        <Card className={`col-span-1 w-full ${currentStep === 1 ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>1. Selecciona un Servicio</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="space-y-4">
              {services.map((service) => {
                console.log("Service object in map:", service);
                console.log("Service name being rendered:", service.name);
                return (
                  <Button
                    key={service._id}
                    variant={selectedService?._id === service._id ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => handleServiceSelect(service._id)}
                  >
                    {service.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Select Date */}
        <Card className={`col-span-1 w-full ${currentStep === 2 ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>2. Selecciona una Fecha</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="rounded-md border shadow"
            />
          </CardContent>
        </Card>

        {/* Step 3: Select Time */}
        <Card className={`col-span-1 w-full ${currentStep === 3 ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>3. Selecciona una Hora</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => {
                  console.log("Time slot object:", slot);
                  console.log("Time being rendered:", slot.time);
                  return (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </Button>
                  );
                })
              ) : (
                <p className="col-span-3 text-center text-muted-foreground">Selecciona una fecha para ver las horas disponibles.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Contact Information & Confirmation */}
        <Card className={`col-span-full w-full ${currentStep === 4 ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>4. Tu Información y Confirmación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" value={contactInfo.name} onChange={handleContactInfoChange} required />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" value={contactInfo.email} onChange={handleContactInfoChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" value={contactInfo.phone} onChange={handleContactInfoChange} required />
              </div>
              <div>
                <Label htmlFor="address">Dirección (Opcional)</Label>
                <Input id="address" name="address" value={contactInfo.address} onChange={handleContactInfoChange} />
              </div>
            </div>
            <div className="mt-6 p-4 border rounded-md bg-muted/40">
              <h3 className="text-lg font-semibold mb-2">Resumen de la Cita:</h3>
              <p><strong>Servicio:</strong> {selectedService?.name}</p>
              <p><strong>Fecha:</strong> {selectedDate}</p>
              <p><strong>Hora:</strong> {selectedTime}</p>
              <p><strong>Precio Estimado:</strong> ${selectedService?.price}</p>
            </div>

            <Button onClick={handleSubmitAppointment} className="w-full">
              Confirmar Cita
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};


export default AppointmentPage;