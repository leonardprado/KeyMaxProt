
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppointment } from '@/contexts/AppointmentContext';
import { Clock } from 'lucide-react';

const DateTimeSelector = () => {
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    setSelectedDate, 
    setSelectedTime,
    getAvailableSlots,
    availableSlots
  } = useAppointment();
  
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Deshabilitar fechas pasadas y domingos
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Deshabilitar fechas pasadas
    if (date < today) return true;
    
    // Deshabilitar domingos (0 = domingo)
    if (date.getDay() === 0) return true;
    
    return false;
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setCalendarDate(date);
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime(''); // Reset time selection
    
    // Cargar horarios disponibles
    setIsLoadingSlots(true);
    try {
      await getAvailableSlots(dateString);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Cargar horarios si ya hay una fecha seleccionada
  useEffect(() => {
    if (selectedDate && availableSlots.length === 0) {
      getAvailableSlots(selectedDate);
    }
  }, [selectedDate, availableSlots.length, getAvailableSlots]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Selecciona una fecha</h3>
        <p className="text-sm text-slate-600 mb-4">
          Horarios disponibles de lunes a sábado, de 9:00 a 17:00
        </p>
        
        <Card className="w-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md"
            />
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-2">Selecciona un horario</h3>
          <p className="text-sm text-slate-600 mb-4">
            {selectedService && `Duración estimada: ${Math.floor(selectedService.duration / 60)}h ${selectedService.duration % 60}min`}
          </p>
          
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600">Cargando horarios...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={`h-12 ${
                    !slot.available 
                      ? 'opacity-50 cursor-not-allowed' 
                      : selectedTime === slot.time
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-50'
                  }`}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {slot.time}
                </Button>
              ))}
            </div>
          )}
          
          {availableSlots.length === 0 && !isLoadingSlots && (
            <div className="text-center py-8">
              <p className="text-slate-500">No hay horarios disponibles para esta fecha</p>
              <p className="text-sm text-slate-400 mt-1">
                Intenta seleccionar otra fecha
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
