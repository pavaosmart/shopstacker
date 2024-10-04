import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Inject environment variables
if (window.env) {
  Object.keys(window.env).forEach(key => {
    import.meta.env[key] = window.env[key];
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);