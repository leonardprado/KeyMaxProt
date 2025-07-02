import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150';

  return (
    <Card>
      <CardHeader>
        <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <p className="text-lg font-semibold">${product.price}</p>
        <p className="text-sm text-gray-500">{product.category}</p>
      </CardContent>
      <CardFooter>
        <Button>Ver Producto</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;