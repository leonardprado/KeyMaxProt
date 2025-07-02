import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const { Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/overview">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>
            <Link to="/admin/settings">Settings</Link>
          </Menu.Item>
          {/* Agrega más items de menú aquí según sea necesario */}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Outlet /> {/* Aquí se renderizará el contenido de la ruta anidada */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;