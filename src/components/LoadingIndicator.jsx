import React from 'react';

const LoadingIndicator = ({ steps }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Progresso:</h3>
      <ul className="list-disc pl-5">
        {steps.map((step, index) => (
          <li key={index} className="text-sm text-gray-600">{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default LoadingIndicator;