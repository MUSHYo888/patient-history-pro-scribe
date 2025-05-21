
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const LoginCredentialsInfo = () => {
  return (
    <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
      <Info className="h-4 w-4" />
      <AlertTitle>Pre-defined accounts</AlertTitle>
      <AlertDescription className="text-xs mt-2">
        <div className="mb-1"><strong>Admin:</strong> muslimkaki@gmail.com / 12345</div>
        <div><strong>User:</strong> 99120105 / 12345</div>
      </AlertDescription>
    </Alert>
  );
};

export default LoginCredentialsInfo;
