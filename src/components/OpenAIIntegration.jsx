import React from 'react';
import OpenAISettings from './OpenAISettings';

const OpenAIIntegration = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Integração OpenAI</h1>
      <OpenAISettings />
    </div>
  );
};

export default OpenAIIntegration;