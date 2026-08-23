import { createContext, useState } from "react";

export let CounterContext = createContext()
export function CounterContextProvider({children}){



const [counter, setcounter] = useState(10)
const [userName, setuserName] = useState('aya')
  
return (
  <CounterContext.Provider value={{ counter, userName, setcounter, setuserName }}>
    {children}
  </CounterContext.Provider>
);
}
