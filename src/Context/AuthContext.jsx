import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let AuthContext =createContext();
export function AuthContextProvider({children}){
    const [userToken, setuserToken] = useState(null)
    const [userData, setuserData] = useState(null)
   async function getUserData(){
     let {data}= await   axios.get('https://route-posts.routemisr.com/users/profile-data',{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        setuserData(data.data.user)
    }
   
    useEffect(()=>{
        if(localStorage.getItem('token')!== null){
            setuserToken(localStorage.getItem('token'))
            
            getUserData()
        }
    },[])
return(
<AuthContext.Provider value={{userToken , setuserToken,userData}}>
{children}
</AuthContext.Provider>
);
}
