import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

const Dialogs = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isSlideInOpen, setIsSlideInOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

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

      {/* Alert Dialog */}
      <button
        onClick={() => setIsAlertOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Alert Dialog
      </button>
      {isAlertOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-yellow-500 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Warning</h3>
            </div>
            <p className="mb-6">This action cannot be undone. Are you sure you want to proceed?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAlertOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAlertOpen(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Form Dialog
      </button>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Contact Form</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X />
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea id="message" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Dialog */}
      <button
        onClick={() => setIsImagePreviewOpen(true)}
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Image Preview
      </button>
      {isImagePreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="max-w-3xl w-full">
            <img src="https://via.placeholder.com/800x600" alt="Preview" className="w-full rounded-lg" />
            <button
              onClick={() => setIsImagePreviewOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Info Dialog */}
      <button
        onClick={() => setIsInfoOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Info Dialog
      </button>
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <Info className="text-blue-500 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Information</h3>
            </div>
            <p className="mb-6">This is an informational message to provide additional context or instructions.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsInfoOpen(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Open Help Dialog
      </button>
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <HelpCircle className="text-teal-500 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Need Help?</h3>
            </div>
            <p className="mb-4">Here are some quick tips to get you started:</p>
            <ul className="list-disc list-inside mb-6">
              <li>Tip 1: Lorem ipsum dolor sit amet</li>
              <li>Tip 2: Consectetur adipiscing elit</li>
              <li>Tip 3: Sed do eiusmod tempor incididunt</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialogs;