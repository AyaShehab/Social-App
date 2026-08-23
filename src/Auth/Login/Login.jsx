import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@heroui/react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';


export default function Login() {
   let {setuserToken} = useContext(AuthContext)
  let navigate = useNavigate()

  const schema = zod.object({
    email: zod.string().nonempty('Email is required').email('Invalid email'),
    password: zod.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, 'Invalid password'),
    

  });

  const {
    register,
    handleSubmit,
    setError,
    formState,
  } = useForm({
    defaultValues: {
     
      email: '',
      password: '',
  
    },
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });
    const [isLoading, setisLoading] = useState(false)

  const [apiError, setapiError] = useState(null)

  function submitForm(userData) {
    setisLoading(true)
 
    axios.post('https://route-posts.routemisr.com/users/signin', userData)
    .then((response)=>{console.log(response);
      setisLoading(false)
      if(response.data.message === 'signed in successfully'){
        setuserToken(response.data.data.token)
        localStorage.setItem('token', response.data.data.token)
             navigate('/home')
      }
  
    })
    .catch((error)=>
      {
        // console.log(error.response.data.message);
        // setapiError(error.response.data.message)
  
    })
    .finally(()=>{
      // setisLoading(false);
    })
  }

  

  const ErrorMessage = ({ message }) => (
    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium animate-fadeIn">
      <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <Input 
              {...register('email')} 
              type="email"
              placeholder="name@company.com" 
              variant="bordered"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              <a href="#forgot" className="text-xs text-sky-600 hover:underline">Forgot password?</a>
            </div>
            <Input 
              {...register('password')} 
              type="password" 
              placeholder="••••••••" 
              variant="bordered"
              className="w-full"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-600/30 transition-all duration-200"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <a href="#register" className="text-sky-600 font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
