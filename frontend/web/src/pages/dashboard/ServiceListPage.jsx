
import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Edit, Trash2 } from 'lucide-react';

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
  });
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/services');
      setServices(response.data.servicios);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Error al cargar los servicios.');
      toast({
        title: "Error",
        description: "Error al cargar los servicios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'precio' ? parseFloat(value) : value,
    }));
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;
    try {
      await apiClient.delete(`/api/services/${serviceId}`);
      toast({
        title: "Éxito",
        description: "Servicio eliminado exitosamente.",
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el servicio.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (editingService) {
        await apiClient.put(`/api/services/${editingService._id}`, formData);
        toast({
          title: "Éxito",
          description: "Servicio actualizado exitosamente.",
        });
      } else {
        await axiosInstance.post('/api/services', formData);
        toast({
          title: "Éxito",
          description: "Servicio creado exitosamente.",
        });
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ nombre: '', descripcion: '', precio: 0 });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Error al guardar el servicio.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-gray-600">Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gestión de Servicios</h1>
      <Button onClick={() => {
        setEditingService(null);
        setFormData({ nombre: '', descripcion: '', precio: 0 });
        setIsModalOpen(true);
      }} className="mb-4">
        Añadir Servicio
      </Button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {services.length === 0 ? (
          <div className="text-center text-gray-600 h-32 flex justify-center items-center">
            <p>No hay servicios registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${service.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Editar Servicio' : 'Añadir Servicio'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">Nombre</Label>
              <Input id="nombre" value={formData.nombre} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">Descripción</Label>
              <Textarea id="descripcion" value={formData.descripcion} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">Precio</Label>
              <Input id="precio" type="number" value={formData.precio} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceListPage;
