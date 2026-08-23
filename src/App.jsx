import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Login from './Auth/Login/Login'
import Regestier from './Auth/Regestier/Regestier'
import Profile from './Components/Profile/Profile'
import Home from './Components/Home/Home'
import Notfound from './Components/NotFound/Notfound'
import { CounterContextProvider } from './Context/CounterContext'
import { AuthContextProvider } from './Context/AuthContext'
import ProtectRoute from './ProtectRoute/ProtectRoute'
import ProtectAuth from './ProtectAuth/ProtectAuth'
import ChangePassword from './ChangePassword/ChangePassword'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PostDetails from './PostDetails/PostDetails'

function App() {
let route= createBrowserRouter([
  {path:'',element:<Layout/>,children:[
    {index:true,element:<ProtectAuth><Login/></ProtectAuth>},
    {path:'register',element:<ProtectAuth><Regestier/></ProtectAuth>},
    { path: 'change-password', element:<ProtectRoute><ChangePassword/></ProtectRoute> },
    {path:'profile',element:<ProtectRoute><Profile/></ProtectRoute>},
    {path:'home',element:<ProtectRoute><Home/></ProtectRoute>},
    {path:'postDetails/:id',element:<ProtectRoute><PostDetails/></ProtectRoute>},
    {path:'*',element:<Notfound/>},
  ]}
 ])

  return (
    <>
   <AuthContextProvider>
     <CounterContextProvider>

     <RouterProvider router={route}/>
     <ReactQueryDevtools/>
    </CounterContextProvider>
   </AuthContextProvider>
    </>
  )
}

export default App
