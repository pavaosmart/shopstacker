import React, { useState } from 'react';
import { X } from 'lucide-react';

const Dialogs = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isSlideInOpen, setIsSlideInOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Confirmation Dialog */}
      <button
        onClick={() => setIsConfirmationOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Confirmation Dialog
      </button>
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-6">Are you sure you want to perform this action?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Modal */}
      <button
        onClick={() => setIsFullScreenOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Full-Screen Modal
      </button>
      {isFullScreenOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Full-Screen Modal</h2>
              <button
                onClick={() => setIsFullScreenOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X />
              </button>
            </div>
            <p className="mb-4">This is a full-screen modal for displaying large content or forms.</p>
            {/* Add your form or content here */}
          </div>
        </div>
      )}

      {/* Slide-in Panel */}
      <button
        onClick={() => setIsSlideInOpen(true)}
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Slide-in Panel
      </button>
      {isSlideInOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Slide-in Panel</h3>
              <button
                onClick={() => setIsSlideInOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X />
              </button>
            </div>
            <p>This panel slides in from the side to display additional information or options.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialogs;