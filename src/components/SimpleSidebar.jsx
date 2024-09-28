import React from 'react';
import { Link } from 'react-router-dom';

const SimpleSidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Simple Sidebar</h2>
      <ul>
        <li className="mb-2">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        </li>
        <li className="mb-2">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
        </li>
        <li className="mb-2">
          <Link to="/activity-logs" className="hover:text-gray-300">Activity Logs</Link>
        </li>
        <li className="mb-2">
          <Link to="/users" className="hover:text-gray-300">Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default SimpleSidebar;