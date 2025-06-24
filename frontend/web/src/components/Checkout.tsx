
import React, { useState } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, Lock, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface CheckoutFormData {
  // Información personal
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Dirección de envío
  address: string;
  city: string;
  postalCode: string;
  state: string;
  
  // Información de pago
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const Checkout = ({ onClose }: { onClose: () => void }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const updateFormData = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.email && formData.firstName && formData.lastName && formData.phone;
      case 2:
        return formData.address && formData.city && formData.postalCode && formData.state;
      case 3:
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);

    // Simular procesamiento de pago
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Limpiar carrito
      clearCart();

      // Agregar notificación de éxito
      addNotification({
        type: 'success',
        title: '¡Compra exitosa!',
        message: `Tu pedido por ${formatPrice(totalPrice)} ha sido procesado correctamente.`,
        actionUrl: '/profile',
        actionLabel: 'Ver mis pedidos'
      });

      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error en el pago',
        message: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Información Personal', icon: User },
    { number: 2, title: 'Dirección de Envío', icon: MapPin },
    { number: 3, title: 'Método de Pago', icon: CreditCard }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center mt-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  currentStep === step.number
                    ? 'bg-blue-100 text-blue-700'
                    : currentStep > step.number
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 gap-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Formulario */}
          <div className="space-y-6">
            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Apellido</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Dirección de Envío */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dirección</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="Calle y número"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ciudad</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="Ciudad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código Postal</label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      placeholder="1234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Provincia</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="Provincia"
                  />
                </div>
              </div>
            )}

            {/* Paso 3: Método de Pago */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pago
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Número de Tarjeta</label>
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => updateFormData('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha de Vencimiento</label>
                    <Input
                      value={formData.expiryDate}
                      onChange={(e) => updateFormData('expiryDate', e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <Input
                      value={formData.cvv}
                      onChange={(e) => updateFormData('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Titular</label>
                  <Input
                    value={formData.cardholderName}
                    onChange={(e) => updateFormData('cardholderName', e.target.value)}
                    placeholder="Nombre como aparece en la tarjeta"
                  />
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePreviousStep}>
                  Anterior
                </Button>
              )}
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex-1"
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!validateStep(3) || isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Procesando...' : `Pagar ${formatPrice(totalPrice)}`}
                </Button>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Resumen del Pedido
            </h3>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Envío:
                    </span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Compra Segura</span>
              </div>
              <p className="text-sm text-blue-600">
                Tus datos están protegidos con encriptación SSL de 256 bits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
