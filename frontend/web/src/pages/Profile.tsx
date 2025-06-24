
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Settings, ShoppingBag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const { items, totalPrice } = useCart();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente"
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Simulamos algunas citas de ejemplo
  const mockAppointments = [
    {
      id: 1,
      service: 'Polarizado de ventanas',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmada'
    },
    {
      id: 2,
      service: 'Instalación de alarma',
      date: '2024-01-20',
      time: '14:30',
      status: 'pendiente'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <ImprovedNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-slate-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
            <Link to="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Mi Perfil</h1>
          <p className="text-slate-600">Gestiona tu información personal y revisa tu actividad</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? 'Guardar' : 'Editar'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tu dirección completa"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Miembro desde {user.createdAt.toLocaleDateString('es-AR')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Citas Recientes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Mis Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-800">{appointment.service}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(appointment.date).toLocaleDateString('es-AR')} a las {appointment.time}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmada' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appointment.status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                  {mockAppointments.length === 0 && (
                    <p className="text-center text-slate-500 py-4">
                      No tienes citas programadas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumen del Carrito */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Mi Carrito
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {items.length} producto{items.length !== 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <Link to="/marketplace">
                      <Button className="w-full">
                        Ver carrito completo
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm mb-3">Tu carrito está vacío</p>
                    <Link to="/marketplace">
                      <Button variant="outline" size="sm">
                        Explorar productos
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/appointments">
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar nueva cita
                  </Button>
                </Link>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
