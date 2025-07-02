import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../../../components/ui/use-toast';
import { useState, useEffect } from 'react';

const ServiceEditPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${serviceId}`);
        form.setFieldsValue(response.data.data); // Ajusta según la estructura de tu API
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al cargar el servicio.';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        console.error('Error fetching service:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchService();
  }, [serviceId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`/api/services/${serviceId}`, values);
      toast({
        title: 'Éxito',
        description: 'Servicio actualizado exitosamente.',
        variant: 'success',
      });
      navigate('/dashboard/services');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el servicio.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Cargando servicio...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Servicio</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
            Actualizar Servicio
          </Button>
          <Button onClick={() => navigate('/dashboard/services')} style={{ marginLeft: 8 }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceEditPage;