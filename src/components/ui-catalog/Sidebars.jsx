import React from 'react';
import { Button } from "@/components/ui/button";

const Sidebars = ({ onComponentClick, onImplementComponent }) => {
  const sidebarTemplates = [
    {
      name: 'Simple Sidebar',
      component: (
        <div className="w-64 h-full bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Simple Sidebar</h2>
          <ul>
            <li className="mb-2">Menu Item 1</li>
            <li className="mb-2">Menu Item 2</li>
            <li className="mb-2">Menu Item 3</li>
          </ul>
        </div>
      )
    },
    // Add more sidebar templates here
  ];

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Sidebars</h2>
      {sidebarTemplates.map((template, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <div className="mb-4">{template.component}</div>
          <Button onClick={() => onComponentClick(template.name)} className="mr-2">
            Preview
          </Button>
          <Button onClick={() => onImplementComponent(template.name)}>
            Implement
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Sidebars;