import React from 'react';

const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 border-solid rounded-full animate-spin"></div>
      <div className="w-12 h-12 border-4 border-blue-600 border-solid rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;