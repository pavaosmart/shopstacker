import React from 'react';
import ChatWithBot from '../components/ChatWithBot';
import UserProfileEditor from '../components/UserProfileEditor';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MyShopTools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChatWithBot />
        <UserProfileEditor />
      </div>
    </div>
  );
};

export default Index;