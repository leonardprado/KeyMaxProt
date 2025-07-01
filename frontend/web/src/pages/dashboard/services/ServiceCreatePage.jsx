import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceCreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/services', values); // Asume que tienes un endpoint para crear servicios
      message.success('Servicio creado exitosamente.');
      navigate('/dashboard/services');
    } catch (error) {
      message.error('Error al crear el servicio.');
      console.error('Error creating service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Servicio</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ price: 0 }}
      >
        <Form.Item
          name="name"
          label="Nombre del Servicio"
          rules={[{ required: true, message: 'Por favor ingresa el nombre del servicio!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: 'Por favor ingresa la descripción!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Precio"
          rules={[{ required: true, type: 'number', min: 0, message: 'Por favor ingresa un precio válido!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Servicio
          </Button>
          <Button onClick={() => navigate('/dashboard/services')} style={{ marginLeft: 8 }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceCreatePage;