
import React, { useEffect, useState } from 'react';
import apiClient from "@/api/axiosConfig"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import { Pagination } from 'antd'; // Importa Pagination de antd

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [pageSize] = useState(10); // Número de usuarios por página (pageSize)
  const [totalItems, setTotalItems] = useState(0); // Estado para el total de usuarios (total)
  // Puedes añadir estados para los filtros aquí
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Añade los parámetros de query a la llamada de la API
      const response = await apiClient.get('/api/users', {
        params: {
          page: currentPage,
          limit: pageSize,
          // Añade aquí los parámetros de filtro si los implementas
          // ...filters,
        },
      });
      setUsers(response.data.data.users); // Asumiendo que los datos paginados están en response.data.data.users
      setTotalItems(response.data.totalDocs); // Asumiendo que el total está en response.data.totalDocs
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios.');
      toast({
        title: "Error",
        description: "Error al cargar los usuarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // Añade currentPage como dependencia

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await apiClient.put(`/api/users/${editingUser._id}`, formData);
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente.",
      });
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-gray-600">Cargando usuarios...</p>
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
      <h1 className="text-3xl font-bold mb-4">Gestión de Usuarios</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {users.length === 0 ? (
          <div className="text-center text-gray-600 h-32 flex justify-center items-center">
            <p>No hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Usuario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="icon" onClick={() => showEditModal(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Aquí se podría añadir un componente de paginación */}
            <div className="mt-4 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        )
      }</div>
      
      {editingUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario: {editingUser.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre de Usuario</Label>
                <Input id="name" value={editingUser.name} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" value={editingUser.email} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                    <SelectItem value="banned">Baneado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserListPage;
