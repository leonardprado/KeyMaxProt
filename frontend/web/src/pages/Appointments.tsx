
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointment, Appointment } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Appointments = () => {
  const { getUserAppointments, services } = useAppointment();
  const { user, isAuthenticated } = useAuth();
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        setLoading(true);
        try {
          const appointments = await getUserAppointments(user);
          setUserAppointments(appointments);
        } catch (error) {
          console.error('Error fetching user appointments:', error);
          setUserAppointments([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUserAppointments([]);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, getUserAppointments]);

  const getServiceDetails = (service: string) => {
    return services.find(s => s._id === service);
  };

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mis Citas</h1>
          <p className="text-muted-foreground">
            Aquí puedes ver el historial de tus citas agendadas.
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl">Inicia Sesión para Ver tus Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Necesitas estar logueado para ver tus citas agendadas.</p>
              <Link to="/auth">
                <Button>Iniciar Sesión / Registrarse</Button>
              </Link>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="text-center text-muted-foreground">Cargando citas...</div>
        ) : userAppointments.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl">No tienes citas agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Parece que aún no has reservado ninguna cita con nosotros.</p>
              <Link to="/book-appointment">
                <Button>Agendar mi primera cita</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userAppointments.map(appointment => {
              const service = getServiceDetails(appointment.service);
              return (
                <Card key={appointment._id} className="bg-card text-card-foreground border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Cita para {service?.name || 'Servicio Desconocido'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Fecha: {new Date(appointment.date).toLocaleDateString('es-AR')} a las {appointment.time}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      Cliente: {appointment.customerInfo.name}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Info className="w-4 h-4" />
                      Estado: <span className={`font-semibold ${
                        appointment.status === 'confirmed' ? 'text-green-500' :
                        appointment.status === 'pending' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>{appointment.status}</span>
                    </p>
                    {service && (
                      <p className="text-sm text-muted-foreground">
                        Precio estimado: ${service.price} | Duración: {service.duration} min
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
