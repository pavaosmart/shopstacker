import React from 'react';
import ChatWithBot from '../components/ChatWithBot';
import Navigation from '../components/Navigation';

const Support = () => {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Suporte</h1>
        <ChatWithBot />
      </div>
    </div>
  );
};

export default Support;