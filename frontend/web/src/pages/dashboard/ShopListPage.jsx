
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ShopListPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Error al cargar los talleres.');
      toast({
        title: "Error",
        description: "Error al cargar los talleres.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleVerifyChange = async (shopId, isVerified) => {
    try {
      await axios.put(`/api/shops/${shopId}`, { is_verified: isVerified });
      toast({
        title: "Éxito",
        description: `Taller ${isVerified ? 'verificado' : 'desverificado'} correctamente.`, 
      });
      setShops(prevShops =>
        prevShops.map(shop =>
          shop._id === shopId ? { ...shop, is_verified: isVerified } : shop
        )
      );
    } catch (error) {
      console.error('Error updating shop verification status:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el estado de verificación del taller.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-gray-600">Cargando talleres...</p>
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
      <h1 className="text-3xl font-bold mb-4">Gestión de Talleres</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {shops.length === 0 ? (
          <div className="text-center text-gray-600 h-32 flex justify-center items-center">
            <p>No hay talleres registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Taller</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dueño (email)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.map((shop) => (
                  <tr key={shop._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.owner_id?.email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Switch
                          id={`verify-shop-${shop._id}`}
                          checked={shop.is_verified}
                          onCheckedChange={(checked) => handleVerifyChange(shop._id, checked)}
                        />
                        <Label htmlFor={`verify-shop-${shop._id}`} className="ml-2">
                          {shop.is_verified ? 'Verificado' : 'No Verificado'}
                        </Label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="link" className="text-primary">Ver Detalles</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopListPage;
