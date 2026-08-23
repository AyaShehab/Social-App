import { createContext, useState } from 'react';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(localStorage.getItem('token') || null);
  const [userData, setuserData] = useState(null);

 
  function logOut() {
    localStorage.removeItem('token');
    setuserToken(null);
    setuserData(null);
  }

  return (
    <AuthContext.Provider value={{ userToken, setuserToken, userData, setuserData, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
