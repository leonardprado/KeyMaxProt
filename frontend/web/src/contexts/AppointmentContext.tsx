import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
// Ya que es una llamada al backend propio, usaremos apiClient en lugar de axios.
// Asegúrate de que tu apiClient esté configurado para la URL correcta del backend (http://localhost:3001/api)
import apiClient from '@/api/axiosConfig'; 
import { useToast } from '@/hooks/use-toast'; // Importar useToast
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth para obtener el usuario

const API_BASE_URL = 'http://localhost:3001/api'; // Asegúrate de que esta URL sea correcta para tu backend

// --- Interfaces ---
export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  category: 'seguridad' | 'accesorios' | 'mantenimiento';
  image?: string; // Añadir '?' para que sea opcional si no siempre viene
}

export interface TimeSlot {
  time: string;
  available: boolean;
  dateTime: string; // Asegúrate que el backend envíe esto
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Appointment {
  _id: string;
  user: string; // Asegúrate que el backend use 'user' y no 'userId' en el modelo
  service: string; // Asegúrate que el backend use 'service' y no 'serviceId'
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

// --- Context Type ---
interface AppointmentContextType {
  services: Service[];
  appointments: Appointment[];
  availableSlots: TimeSlot[];
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  currentStep: number;
  contactInfo: ContactInfo;
  isLoading: boolean;
  error: string | null;
  setSelectedService: Dispatch<SetStateAction<Service | null>>;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  setSelectedTime: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setContactInfo: Dispatch<SetStateAction<ContactInfo>>;
  getAvailableSlots: (date: string) => Promise<void>; // Devuelve void, actualiza estado directamente
  createAppointment: (appointmentData: {
    user: string;
    service: string; // Ajustar a como lo envíe el backend
    date: string;
    time: string;
    customerInfo: ContactInfo;
    notes?: string;
  }) => Promise<boolean>;
  getUserAppointments: () => Promise<void>; // Devuelve void, actualiza estado
  getServiceCatalog: () => Promise<void>; // Devuelve void, actualiza estado
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

// --- Servicios de ejemplo (mantener si son para fallback) ---
const mockServices: Service[] = [
  {
    _id: '1',
    name: 'Polarizado Completo',
    description: 'Polarizado de todas las ventanas del vehículo con film de alta calidad',
    duration: 180,
    price: 45000,
    category: 'accesorios',
    image: '/placeholder.svg' // Asegúrate que esta ruta sea accesible
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
  // --- ESTADOS ---
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth(); // ¡Obtener el usuario del contexto de Auth!

  // --- FUNCIÓN PARA OBTENER SERVICIOS DEL CATÁLOGO ---
  const getServiceCatalog = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching services from:', `${API_BASE_URL}/service-catalog`);
    try {
      const response = await apiClient.get(`${API_BASE_URL}/service-catalog`); // Usa apiClient para las llamadas internas
      console.log('Raw services response:', response.data);
      
      // --- CORRECCIÓN: Acceder a response.data.data ---
      const fetchedServices = response.data.data || []; 
      
      console.log('Services fetched successfully:', fetchedServices);
      
      // Transforma los datos si es necesario (ej: para parsear precios)
      const transformedServices = fetchedServices.map((service: any) => ({
        _id: service._id,
        name: service.name,
        description: service.description,
        duration: service.duration || 60, 
        price: service.price || 0,       
        category: service.category || 'general', 
        image: service.image || '/placeholder.svg', 
      }));

      setServices(transformedServices);
      
      // Añadir toast de éxito si es útil, o eliminar si es muy ruidoso
      // toast({
      //   title: "Éxito",
      //   description: "Servicios cargados correctamente.",
      // });

    } catch (error: any) {
      console.error('Error fetching services:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los servicios.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setServices([]); // Limpiar servicios en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN PARA OBTENER SLOTS DISPONIBLES ---
  const getAvailableSlots = async (date: string): Promise<void> => {
    if (!selectedService) {
      toast({ title: "Advertencia", description: "Por favor, selecciona un servicio primero." });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching availability for service ID:', selectedService?._id);
      // Nota: Asegúrate que el backend use el _id correcto del servicio
      const response = await apiClient.get(`${API_BASE_URL}/appointments/availability/${selectedService?._id}?date=${date}`);
      setAvailableSlots(response.data.data || []);
      toast({
        title: "Disponibilidad cargada",
        description: "Horarios disponibles encontrados.",
      });
    } catch (error: any) {
      console.error('Error fetching available slots:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los horarios disponibles.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN PARA CREAR UNA CITA ---
  const createAppointment = async (appointmentData: {
    user: string; // El modelo de Appointment espera 'user'
    service: string; // El modelo de Appointment espera 'service'
    date: string;
    time: string;
    customerInfo: ContactInfo;
    notes?: string;
    // El status y createdAt se generan en el backend, no los envíes aquí
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Asegúrate que los campos coincidan con lo que espera tu backend
      const payload = {
        user: appointmentData.user,
        service: appointmentData.service, // Debe ser el _id del servicio
        date: appointmentData.date,
        time: appointmentData.time,
        customerInfo: appointmentData.customerInfo,
        notes: appointmentData.notes
      };

      const response = await apiClient.post(`${API_BASE_URL}/appointments`, payload);
      // Asume que el backend responde con la cita creada en response.data.data
      const newAppointment: Appointment = response.data.data; 
      setAppointments(prev => [...prev, newAppointment]);
      
      // Limpiar selección y resetear estado para una nueva cita
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      setContactInfo({ name: '', email: '', phone: '', address: '' });
      setCurrentStep(1);

      toast({
        title: "Éxito",
        description: "Cita creada exitosamente.",
      });

      return true;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la cita.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN PARA OBTENER LAS CITAS DEL USUARIO ---
  const getUserAppointments = async (): Promise<void> => { 
    if (!user) { // Verifica si user está definido desde useAuth()
      setAppointments([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Asegúrate que la ruta /appointments/my espera el token de autenticación
      const response = await apiClient.get(`${API_BASE_URL}/appointments/my`);
      setAppointments(response.data.data || []);
      
      // Opcional: mostrar un toast de éxito si es útil
      // toast({
      //   title: "Éxito",
      //   description: "Tus citas se cargaron correctamente.",
      // });
    } catch (error: any) {
      console.error('Error fetching user appointments:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar tus citas.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- EFECTO PARA CARGAR SERVICIOS AL INICIO ---
  useEffect(() => {
    getServiceCatalog(); 
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // --- EFECTO PARA CARGAR CITAS DEL USUARIO SI ESTÁ LOGUEADO ---
  useEffect(() => {
    if (user) { // Solo si el usuario está logueado
      getUserAppointments();
    } else {
      setAppointments([]); // Limpiar citas si el usuario se desloguea
    }
  }, [user]); // Se ejecuta cuando cambia el usuario (login/logout)

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