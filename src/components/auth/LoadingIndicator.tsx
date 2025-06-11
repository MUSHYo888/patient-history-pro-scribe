
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
    </div>
  );
};

export default LoadingIndicator;
