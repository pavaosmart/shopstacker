import React from 'react';
import ApiConnectionTest from '../components/ApiConnectionTest';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MyShopTools</h1>
      <ApiConnectionTest />
    </div>
  );
};

export default Index;