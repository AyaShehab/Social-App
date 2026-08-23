import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@heroui/react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';


export default function Register() {

 let {setuserToken} = useContext(AuthContext)
  let navigate = useNavigate()

  const schema = zod.object({
        username: zod.string().nonempty('User Name is required').regex(/^[a-zA-Z0-9_-]{3,16}$/, 'Invalid User Name'),
    name: zod.string().nonempty('Name is required').min(3, 'Min is 3 letters').max(10, 'Max is 10 letters'),
    email: zod.string().nonempty('Email is required').email('Invalid email'),
    password: zod.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, 'Invalid password'),
    gender: zod.string().nonempty('Gender is required'),
    dateOfBirth: zod.coerce.date('Date is required').refine((dateVal) => {
      let current = new Date().getFullYear();
      let year = dateVal.getFullYear();
      let age = current - year;
      return age > 20;
    }, 'Age must be greater than 20'),
    rePassword: zod.string().nonempty('RePassword is required')
  }).refine((obj) => obj.password === obj.rePassword, {
    path: ['rePassword'],
    message: 'Password and repassword must match'
  });

  const {
    register,
    handleSubmit,
    setError,
    formState,
  } = useForm({
    defaultValues: {
      name: '',
      username:'',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });
    const [isLoading, setisLoading] = useState(false)

  const [apiError, setapiError] = useState(null)

  function submitForm(userData) {
    setisLoading(true)
 
    axios.post('https://route-posts.routemisr.com/users/signup', userData)
    .then((response)=>{console.log(response);
      setisLoading(false)
      if(response.data.message === 'account created'){
        setuserToken(response.data.data.token)
        localStorage.setItem('token', response.data.data.token)
             navigate('/')
      }
  
    })
    .catch((error)=>
      {
        console.log(error.response.data.message);
        setapiError(error.response.data.message)
  
    })
    .finally(()=>{
      setisLoading(false);
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
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-2">Join us today! Please enter your details.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
            <Input 
              {...register('name')}
              placeholder="John Doe" 
              variant="bordered"
              className="w-full"
            />
            {formState.errors.name && formState.touchedFields.name && (
              <ErrorMessage message={formState.errors.name?.message} />
            )}
          </div>
              <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">User Name</label>
            <Input 
              {...register('username')}
              placeholder="JohnDoe" 
              variant="bordered"
              className="w-full"
            />
            {formState.errors.username && formState.touchedFields.username && (
              <ErrorMessage message={formState.errors.username?.message} />
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <Input 
              {...register('email')}
              type="email"
              placeholder="name@company.com" 
              variant="bordered"
              className="w-full"
            />
            {formState.errors.email && formState.touchedFields.email && (
              <ErrorMessage message={formState.errors.email?.message} />
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
              <Input 
                {...register('password')}
                type="password" 
                placeholder="••••••••" 
                variant="bordered"
                className="w-full"
              />
              {formState.errors.password && formState.touchedFields.password && (
                <ErrorMessage message={formState.errors.password?.message} />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Confirm Password</label>
              <Input 
                {...register('rePassword')}
                type="password" 
                placeholder="••••••••" 
                variant="bordered"
                className="w-full"
              />
              {formState.errors.rePassword && formState.touchedFields.rePassword && (
                <ErrorMessage message={formState.errors.rePassword?.message} />
              )}
            </div>
          </div>

          {/* Date of Birth & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Date of Birth</label>
              <Input 
                {...register('dateOfBirth')}
                type="date" 
                variant="bordered"
                className="w-full text-slate-600"
              />
              {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth && (
                <ErrorMessage message={formState.errors.dateOfBirth?.message} />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Gender</label>
              <select 
                {...register('gender')}
                defaultValue=""
                className={`w-full h-[40px] px-3 rounded-xl border-2 bg-transparent text-sm text-slate-700 outline-none transition-colors ${
                  formState.errors.gender && formState.touchedFields.gender 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-default-200 focus:border-sky-500'
                }`}
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {formState.errors.gender && formState.touchedFields.gender && (
                <ErrorMessage message={formState.errors.gender?.message} />
              )}
            </div>
          </div>
          {apiError &&  <div className='bg-red-200 text-white font-bold py-2 my-3 rounded-2xl text-center'>
            {apiError}
           </div>}
          <Button 
          isDisabled={isLoading}
            type="submit" 
            className="w-full mt-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-600/30 transition-all duration-200"
          >
           {isLoading ?'Loading...':'Sign Up'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <a href="#login" className="text-sky-600 font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}