import React from 'react';
import AuthForms from '../components/AuthForms';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <AuthForms />
    </div>
  );
};

export default AuthPage;