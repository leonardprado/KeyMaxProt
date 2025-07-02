import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast'; // Importar useToast

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
  isLoading: boolean; // Añadir estado de carga
  error: string | null; // Añadir estado de error
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setCurrentStep: (step: number) => void;
  setContactInfo: (info: ContactInfo) => void;
  getAvailableSlots: (date: string) => Promise<TimeSlot[]>;
  createAppointment: (appointmentData: Omit<Appointment, '_id' | 'createdAt' | 'status' | 'customerInfo' | 'notes'> & { customerInfo: ContactInfo, status?: 'pending' | 'confirmed' | 'completed' | 'cancelled', notes?: string }) => Promise<boolean>;
  getUserAppointments: () => Promise<Appointment[]>;
  getServiceCatalog: () => Promise<Service[]>;

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
  const [isLoading, setIsLoading] = useState(false); // Inicializar estado de carga
  const [error, setError] = useState<string | null>(null); // Inicializar estado de error
  const [services, setServices] = useState<Service[]>([]);

  const { toast } = useToast(); // Usar el hook useToast

  const getAvailableSlots = async (date: string): Promise<TimeSlot[]> => {
    setIsLoading(true); // Iniciar carga
    setError(null); // Limpiar error previo
    try {
      console.log('Fetching availability for service ID:', selectedService?._id);
      const response = await axios.get(`${API_BASE_URL}/appointments/availability/${selectedService?._id}?date=${date}`);
      setAvailableSlots(response.data.data); // Update state with fetched data
      setIsLoading(false); // Finalizar carga
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching available slots:', error);
      setError(error.message || 'Failed to fetch available slots'); // Capturar y establecer error
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar disponibilidad.",
        variant: "destructive",
      });
      setIsLoading(false); // Finalizar carga
      setAvailableSlots([]); // Limpiar slots en caso de error
      return [];
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, '_id' | 'createdAt' | 'status' | 'customerInfo' | 'notes'> & { customerInfo: ContactInfo, status?: 'pending' | 'confirmed' | 'completed' | 'cancelled', notes?: string }): Promise<boolean> => {
    setIsLoading(true); // Iniciar carga
    setError(null); // Limpiar error previo
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
      const newAppointment: Appointment = response.data.data; // Backend returns data in response.data.data
      setAppointments(prev => [...prev, newAppointment]);
      
      // Limpiar selección
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      setCurrentStep(1); // Reset step after successful creation

      toast({
        title: "Éxito",
        description: "Cita creada exitosamente.",
      });

      setIsLoading(false); // Finalizar carga
      return true;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      setError(error.message || 'Failed to create appointment'); // Capturar y establecer error
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear la cita.",
        variant: "destructive",
      });
      setIsLoading(false); // Finalizar carga
      return false;
    }
  };

  const getUserAppointments = async (): Promise<Appointment[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/my`);
      setAppointments(response.data.data);
      toast({
        title: "Éxito",
        description: "Citas cargadas exitosamente.",
      });
      setIsLoading(false);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user appointments:', error);
      setError(error.message || 'Failed to fetch user appointments');
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar tus citas.",
        variant: "destructive",
      });
      setIsLoading(false);
      setAppointments([]);
      return [];
    }
  };

  const getServiceCatalog = async (): Promise<Service[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/service-catalog`);
      setServices(response.data.data);
      toast({
        title: "Éxito",
        description: "Catálogo de servicios cargado exitosamente.",
      });
      setIsLoading(false);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching service catalog:', error);
      setError(error.message || 'Failed to fetch service catalog');
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar el catálogo de servicios.",
        variant: "destructive",
      });
      setIsLoading(false);
      setServices([]);
      return [];
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
          setIsLoading(true); // Iniciar carga
          setError(null); // Limpiar error previo
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
            setIsLoading(false); // Finalizar carga
          } catch (error: any) {
            console.error('Error fetching services:', error);
            setError(error.message || 'Failed to fetch services'); // Capturar y establecer error
            toast({
              title: "Error",
              description: error.response?.data?.message || "Error al cargar los servicios.",
              variant: "destructive",
            });
            setServices([]); // Limpiar servicios en caso de error
            setIsLoading(false); // Finalizar carga
          }
    };

    fetchServices();
  }, []); // Empty dependency array ensures this runs only once on mount

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
      isLoading,
      error,
      setSelectedService,
      setSelectedDate,
      setSelectedTime,
      setCurrentStep,
      setContactInfo,
      getAvailableSlots,
      createAppointment,
      getUserAppointments,
      getServiceCatalog
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};
