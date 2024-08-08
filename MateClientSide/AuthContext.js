import React, { createContext, useState, useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebase'; // Adjust this import path as needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const auth = getAuth(app);

  const loginUser = (user) => {
    setLoggedInUser(user);
  };

  const logoutAndNavigate = useCallback(async (navigation) => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut(auth);
      console.log('Firebase sign out successful');
      setLoggedInUser(null);
      console.log('User state cleared');

      // Reset navigation and go to Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      console.log('Navigation reset to Login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [auth, isLoggingOut]);

  return (
    <AuthContext.Provider value={{ 
      loggedInUser, 
      loginUser, 
      logoutAndNavigate,
      setLoggedInUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};