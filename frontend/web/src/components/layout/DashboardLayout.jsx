import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShoppingOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: <Link to="/dashboard">Resumen</Link> },
    { key: '2', icon: <ShoppingOutlined />, label: <Link to="/dashboard/products">Productos</Link> },
    { key: '3', icon: <AppstoreOutlined />, label: <Link to="/dashboard/services">Servicios</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', marginTop: '16px' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;