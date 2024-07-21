import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const loginUser = (user) => {
    setLoggedInUser(user);
    // console.log(user)
  };

  const logoutUser = () => {
    const defaultValues = {
      fullname: '',
      password: '',
      introduction: '',
      gender: ' ', 
      age: 0,
      instagram: '',
      email: '',
      phoneNumber: '',
      profileImage: 'https://i.imgur.com/LBIwlSy.png',
      city: '',
      travelPlan: [], 
      tripInterests: [], 
    }

    setLoggedInUser(defaultValues);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, loginUser, logoutUser ,setLoggedInUser}}>
      {children}
    </AuthContext.Provider>
  );
};