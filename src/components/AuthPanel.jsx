import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPanel = () => {
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-2">Welcome to UI Elements Kit</h1>
      <h2 className="text-xl text-center mb-6">MyShopTools UI Components</h2>
      
      {currentView === 'login' && (
        <LoginForm 
          onRegisterClick={() => setCurrentView('register')}
          onForgotPasswordClick={() => setCurrentView('forgotPassword')}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm 
          onLoginClick={() => setCurrentView('login')}
        />
      )}
      {currentView === 'forgotPassword' && (
        <ForgotPasswordForm 
          onBackToLoginClick={() => setCurrentView('login')}
        />
      )}
    </div>
  );
};

export default AuthPanel;