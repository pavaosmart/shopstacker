import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const [toasts, setToasts] = useState([]);
  const [snackbar, setSnackbar] = useState(null);

  const addToast = (type, message) => {
    const newToast = { id: Date.now(), type, message };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => removeToast(newToast.id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const showSnackbar = (message) => {
    setSnackbar(message);
    setTimeout(() => setSnackbar(null), 3000);
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Notifications and Toasts</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => addToast('success', 'Action completed successfully!')}
            className="bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Show Success Toast
          </Button>
          <Button
            onClick={() => addToast('error', 'An error occurred. Please try again.')}
            className="bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Show Error Toast
          </Button>
          <Button
            onClick={() => addToast('info', 'New update available.')}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Show Info Toast
          </Button>
          <Button
            onClick={() => showSnackbar('This is a snackbar notification')}
            className="bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            Show Snackbar
          </Button>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 space-y-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-100' :
              toast.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
            }`}
          >
            {getToastIcon(toast.type)}
            <p className="ml-3">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-auto">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {snackbar}
        </div>
      )}

      {/* Inline Alerts */}
      <div className="space-y-4 mt-8">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">Success</p>
          <p>Your changes have been saved successfully.</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>There was an error processing your request. Please try again.</p>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>Your account is about to expire. Please renew your subscription.</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Information</p>
          <p>A new version of the application is available. Please update.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;