import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(localStorage.getItem('token') || null);

 
  function logOut() {
    localStorage.removeItem('token');
    setuserToken(null); 
  }

  return (
    <AuthContext.Provider value={{ userToken, setuserToken, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
