import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Asegúrate de que esta URL sea correcta para tu backend

export interface Service {
  _id: string;
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
  _id: string;
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
  createAppointment: (appointmentData: Omit<Appointment, '_id' | 'createdAt'>) => Promise<boolean>;
  getUserAppointments: (userId: string) => Promise<Appointment[]>;

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
    _id: '1',
    name: 'Polarizado Completo',
    description: 'Polarizado de todas las ventanas del vehículo con film de alta calidad',
    duration: 180,
    price: 45000,
    category: 'accesorios',
    image: '/placeholder.svg'
  },
  {
    _id: '2',
    name: 'Instalación de Alarma',
    description: 'Instalación profesional de sistema de alarma con control remoto',
    duration: 120,
    price: 35000,
    category: 'seguridad',
    image: '/placeholder.svg'
  },
  {
    _id: '3',
    name: 'Colocación de Seguros',
    description: 'Instalación de seguros adicionales para puertas y capot',
    duration: 90,
    price: 25000,
    category: 'seguridad',
    image: '/placeholder.svg'
  },
  {
    _id: '4',
    name: 'Audio y Multimedia',
    description: 'Instalación de equipo de audio y sistema multimedia',
    duration: 240,
    price: 60000,
    category: 'accesorios',
    image: '/placeholder.svg'
  },
  {
    _id: '5',
    name: 'Mantenimiento General',
    description: 'Revisión y mantenimiento de sistemas de seguridad instalados',
    duration: 60,
    price: 15000,
    category: 'mantenimiento',
    image: '/placeholder.svg'
  }
];

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
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
    try {
     

      console.log('Fetching availability for service ID:', selectedService?._id);
      const response = await axios.get(`${API_BASE_URL}/services/${selectedService?._id}/disponibilidad?date=${date}`);
      
      return response.data.slots;
    } catch (error) {
     
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, '_id' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
      const newAppointment: Appointment = response.data.appointment;
      setAppointments(prev => [...prev, newAppointment]);
      
      // Limpiar selección
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      
      return true;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return false;
    }
  };

  const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/user/${userId}`);
      return response.data.appointments;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
          console.log('Fetching services from:', `${API_BASE_URL}/service-catalog`);
          try {
            const response = await axios.get(`${API_BASE_URL}/service-catalog`);
            console.log('Raw services response:', response.data);
            console.log('Services fetched successfully:', response.data.servicios);
            const transformedServices = response.data.servicios.map((service: any) => ({
              _id: service._id,
              name: service.name,
              description: service.description,
              duration: service.duration,
              price: service.price && service.price.$numberDecimal ? parseFloat(service.price.$numberDecimal) : service.price,
              category: service.category,
              image: service.image,
            }));
            console.log('Transformed services before setting state:', transformedServices);
            setServices(transformedServices);
          } catch (error) {
            console.error('Error fetching services:', error);
          }
        };

    fetchServices();
  }, []);

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
