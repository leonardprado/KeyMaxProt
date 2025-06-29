import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Form, InputNumber, Select, Card, Spin, Alert, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import apiClient from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const ProductCreatePage = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  // --- Lógica de Subida de Imágenes a Cloudinary ---
  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    const uploadPromises = acceptedFiles.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'keymaxprot_products');
      return fetch(`https://api.cloudinary.com/v1_1/dohbzd6bb/image/upload`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const imageUrls = responses.map(res => res.secure_url);
      setUploadedImages(prev => [...prev, ...imageUrls]);
    } catch (err) {
      setError('Error al subir las imágenes.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });
   
  // --- Lógica de Envío del Formulario al Backend ---
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const productData = {
        ...data,
        images: uploadedImages,
        // Asumiendo que el backend espera que el seller se asocie automáticamente
      };
      await apiClient.post('/products', productData);
      message.success('Producto creado exitosamente!');
      navigate('/dashboard/products'); // Redirige a la lista de productos si todo va bien
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al crear el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Title level={2}>Añadir Nuevo Producto</Title>
      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
       
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Card title="Información Básica" style={{ marginBottom: '16px' }}>
          <Form.Item label="Nombre del Producto" required validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
            <Controller name="name" control={control} rules={{ required: 'El nombre es obligatorio' }} render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item label="Descripción">
            <Controller name="description" control={control} render={({ field }) => <Input.TextArea rows={4} {...field} />} />
          </Form.Item>
        </Card>

        <Card title="Imágenes" style={{ marginBottom: '16px' }}>
          <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.</p>
            <UploadOutlined style={{ fontSize: '32px' }}/>
          </div>
          <div>
            {uploadedImages.map((url, index) => <img key={index} src={url} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '8px' }}/>)}
          </div>
        </Card>

        <Card title="Precios y Stock" style={{ marginBottom: '16px' }}>
          <Form.Item label="Precio" required validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
            <Controller name="price" control={control} rules={{ required: 'El precio es obligatorio', min: { value: 0, message: 'El precio no puede ser negativo' } }} render={({ field }) => <InputNumber style={{ width: '100%' }} {...field} />} />
          </Form.Item>
          <Form.Item label="Cantidad en Stock" required validateStatus={errors.stock_quantity ? 'error' : ''} help={errors.stock_quantity?.message}>
            <Controller name="stock_quantity" control={control} rules={{ required: 'El stock es obligatorio', min: { value: 0, message: 'El stock no puede ser negativo' } }} render={({ field }) => <InputNumber style={{ width: '100%' }} {...field} />} />
          </Form.Item>
        </Card>

        <Card title="Organización" style={{ marginBottom: '16px' }}>
           <Form.Item label="Categoría">
             <Controller name="category" control={control} render={({ field }) => <Input {...field} placeholder="Ej: Seguridad Vehicular"/>} />
           </Form.Item>
           <Form.Item label="Marca">
             <Controller name="brand" control={control} render={({ field }) => <Input {...field} placeholder="Ej: PST"/>} />
           </Form.Item>
        </Card>

        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Producto
        </Button>
      </Form>
    </Spin>
  );
};

export default ProductCreatePage;