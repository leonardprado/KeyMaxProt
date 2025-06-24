
import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Appointment {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
  phone: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ 
  appointments, 
  getStatusColor, 
  getStatusIcon 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Citas Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{appointment.client}</h4>
                <p className="text-sm text-slate-600">{appointment.service}</p>
                <p className="text-sm text-slate-500">{appointment.date} - {appointment.time}</p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
