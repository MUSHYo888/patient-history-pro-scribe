
import React from 'react';
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator = ({ message = "Loading authentication..." }: LoadingIndicatorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-gray-500">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 text-sm text-blue-500 hover:text-blue-700 underline"
      >
        Stuck? Click to reload
      </button>
    </div>
  );
};

export default LoadingIndicator;
