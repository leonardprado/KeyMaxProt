import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  category: 'seguridad' | 'accesorios' | 'mantenimiento';
  image: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
  createdAt: Date;
}

interface AppointmentContextType {
  services: Service[];
  appointments: Appointment[];
  availableSlots: TimeSlot[];
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  currentStep: number;
  contactInfo: ContactInfo;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setCurrentStep: (step: number) => void;
  setContactInfo: (info: ContactInfo) => void;
  getAvailableSlots: (date: string) => Promise<TimeSlot[]>;
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => Promise<boolean>;
  getUserAppointments: (userId: string) => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

// Servicios de ejemplo
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Polarizado Completo',
    description: 'Polarizado de todas las ventanas del vehículo con film de alta calidad',
    duration: 180,
    price: 45000,
    category: 'accesorios',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Instalación de Alarma',
    description: 'Instalación profesional de sistema de alarma con control remoto',
    duration: 120,
    price: 35000,
    category: 'seguridad',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Colocación de Seguros',
    description: 'Instalación de seguros adicionales para puertas y capot',
    duration: 90,
    price: 25000,
    category: 'seguridad',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Audio y Multimedia',
    description: 'Instalación de equipo de audio y sistema multimedia',
    duration: 240,
    price: 60000,
    category: 'accesorios',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Mantenimiento General',
    description: 'Revisión y mantenimiento de sistemas de seguridad instalados',
    duration: 60,
    price: 15000,
    category: 'mantenimiento',
    image: '/placeholder.svg'
  }
];

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [services] = useState<Service[]>(mockServices);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const getAvailableSlots = async (date: string): Promise<TimeSlot[]> => {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const slots: TimeSlot[] = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: false },
    ];

    setAvailableSlots(slots);
    return slots;
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<boolean> => {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    // Limpiar selección
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    
    return true;
  };

  const getUserAppointments = (userId: string): Appointment[] => {
    return appointments.filter(appointment => appointment.userId === userId);
  };

  return (
    <AppointmentContext.Provider value={{
      services,
      appointments,
      availableSlots,
      selectedService,
      selectedDate,
      selectedTime,
      currentStep,
      contactInfo,
      setSelectedService,
      setSelectedDate,
      setSelectedTime,
      setCurrentStep,
      setContactInfo,
      getAvailableSlots,
      createAppointment,
      getUserAppointments
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};
