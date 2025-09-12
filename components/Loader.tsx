
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-grow">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500"></div>
    </div>
  );
};
