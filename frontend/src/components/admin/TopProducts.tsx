
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface TopProductsProps {
  products: Product[];
  formatPrice: (price: number) => string;
}

const TopProducts: React.FC<TopProductsProps> = ({ products, formatPrice }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Productos Más Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{product.name}</h4>
                  <p className="text-sm text-slate-600">{product.sales} ventas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatPrice(product.revenue)}</p>
                <p className="text-sm text-slate-500">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
