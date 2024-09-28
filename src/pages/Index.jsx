import React, { useState } from 'react';
import UIComponentsPanel from '../components/UIComponentsPanel';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">MyShopTools UI Components</h1>
      <div className="text-center mb-8">
        <Button onClick={() => setIsPanelOpen(true)}>Open UI Components Panel</Button>
      </div>
      <UIComponentsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
};

export default Index;