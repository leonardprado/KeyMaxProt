
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServiceCard = ({ service }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">${service.precio}</p>
        <p className="text-sm text-gray-500">{service.categoria}</p>
        <p className="text-sm text-gray-500">Técnicos: {service.tecnicos.map(t => t.nombre).join(', ')}</p>
      </CardContent>
      <CardFooter>
        <Button>Ver Servicio</Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
