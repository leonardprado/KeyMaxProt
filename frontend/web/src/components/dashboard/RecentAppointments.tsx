import React from 'react';
import { Card, Typography, List } from 'antd';
import { format } from 'date-fns';

interface Appointment {
  _id: string;
  date: string;
  shop: { name: string };
  service: { name: string };
  user: { name: string };
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  return (
    <Card title="Citas Recientes" bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={appointments}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Cita con ${item.user.name} en ${item.shop.name}`}
              description={
                <>
                  <Typography.Text strong>{item.service.name}</Typography.Text> -{' '}
                  {format(new Date(item.date), 'dd/MM/yyyy HH:mm')}
                </>
              }
            />
          </List.Item>
        )}
      />
      {appointments.length === 0 && (
          <Typography.Text type="secondary">No hay citas recientes.</Typography.Text>
      )}
    </Card>
  );
};

export default RecentAppointments;