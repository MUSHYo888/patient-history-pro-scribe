
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';

// Create the authentication context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
