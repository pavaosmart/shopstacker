import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const Buttons = () => {
  return (
    <div className="space-y-4">
      <div className="space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
          Primary Button
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
          Secondary Button
        </button>
      </div>

      <div className="space-x-4">
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors">
          Ghost Button
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors">
          <Plus className="inline-block mr-2" />
          Floating Action Button
        </button>
      </div>

      <div className="space-x-4">
        <button className="text-blue-500 hover:text-blue-700 font-semibold transition-colors">
          <Edit className="inline-block mr-2" />
          Edit
        </button>
        <button className="text-red-500 hover:text-red-700 font-semibold transition-colors">
          <Trash className="inline-block mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default Buttons;