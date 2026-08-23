import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(null);
  const [userData, setuserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // إضافة حالة التحميل

  async function getUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      let { data } = await axios.get('https://route-posts.routemisr.com/users/profile-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // الحماية بـ Optional Chaining لعدم ضرب أخطاء
      setuserData(data?.data?.user || data?.user || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // في حالة وجود مشكلة في التوكين يتم مسحه لتسجيل الدخول من جديد
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        setuserToken(null);
        setuserData(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setuserToken(token);
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, setuserToken, userData, setuserData, getUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
