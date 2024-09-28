import React from 'react';
import { Button } from "@/components/ui/button";

const Buttons = ({ onComponentClick, onImplementComponent }) => {
  const buttonTemplates = [
    {
      name: 'Primary Button',
      component: (
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Primary Button
        </Button>
      )
    },
    {
      name: 'Secondary Button',
      component: (
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
          Secondary Button
        </Button>
      )
    },
    // Add more button templates here
  ];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Buttons</h2>
      {buttonTemplates.map((template, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <div className="mb-4">{template.component}</div>
          <Button onClick={() => onComponentClick(template.name)} className="mr-2">
            Preview
          </Button>
          <Button onClick={() => onImplementComponent(template.name, window.location.pathname.slice(1) || 'index')}>
            Implement
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Buttons;