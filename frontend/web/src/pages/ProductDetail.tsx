import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spin, Alert } from 'antd';
import { useToast } from '@/hooks/use-toast';
import AddReviewForm from '../components/AddReviewForm';
import ReviewsList from '../components/ReviewsList';
import ProductInfo from '../components/ProductInfo';
import { Product, Review } from '../types';
import { useFetch } from '@/hooks/use-fetch';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, loading: productLoading, error: productError, fetchData: fetchProduct } = useFetch<Product>(id ? `/products/${id}` : '');
  const { data: reviews, loading: reviewsLoading, error: reviewsError, fetchData: fetchReviews } = useFetch<Review[]>(id ? `/reviews/product/${id}` : '', []);

  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id, fetchProduct, fetchReviews]);

  const handleReviewSubmitted = () => {
    fetchReviews();
  }; 

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin tip="Cargando producto..." size="large" />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-red-500 text-lg">{productError}</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Volver al Marketplace
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button onClick={() => navigate('/marketplace')}>
            Volver al Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/400'];

  return (
    <div>
      
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Marketplace
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card dark:bg-card-foreground/10 border border-border">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors bg-card dark:bg-card-foreground/10 ${selectedImage === index ? 'border-primary' : 'border-border'}`}
                >
                  <img
                    src={image}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del Producto (extraído a ProductInfo) */}
          {product && (
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          )}
        </div>

        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Descripción</h3>
              <p className="text-muted-foreground">{product?.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Reseñas */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold">Reseñas de Clientes</h2>

          {reviewsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spin size="large" tip="Cargando reseñas..." />
            </div>
          ) : reviewsError ? (
            <Alert message="Error" description={reviewsError} type="error" showIcon />
          ) : (
            <ReviewsList reviews={reviews || []} averageRating={product.averageRating} reviewCount={product.reviewCount} />
          )}

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Deja tu Reseña</h3>
            <AddReviewForm itemType="Product" itemId={id} onReviewAdded={handleReviewSubmitted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;