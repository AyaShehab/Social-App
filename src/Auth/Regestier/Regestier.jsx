import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@heroui/react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const schema = zod.object({
  username: zod.string().min(1, 'Username is required').regex(/^[a-zA-Z0-9_-]{3,16}$/, 'Must be 3-16 alphanumeric characters'),
  name: zod.string().min(3, 'Minimum 3 characters').max(10, 'Maximum 10 characters'),
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(1, 'Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, 'Requires 8+ chars with uppercase, lowercase, number, and special char'),
  gender: zod.string().min(1, 'Gender is required'),
  dateOfBirth: zod.coerce.date().refine((dateVal) => {
    const current = new Date().getFullYear();
    const year = dateVal.getFullYear();
    return (current - year) > 20;
  }, 'Age must be greater than 20 years old'),
  rePassword: zod.string().min(1, 'Please confirm your password')
}).refine((obj) => obj.password === obj.rePassword, {
  path: ['rePassword'],
  message: 'Passwords do not match'
});

export default function Register() {
  const { setuserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });

  async function submitForm(userData) {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axios.post('https://route-posts.routemisr.com/users/signup', userData);
      if (response.data.message === 'account created') {
        const token = response.data.data.token;
        setuserToken(token);
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-2">Join us today! Please enter your details.</p>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div className="bg-red-100 border border-red-300 text-red-600 font-medium py-2 px-4 mb-4 rounded-xl text-center text-sm">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          
          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
              <Input 
                {...register('name')}
                placeholder="John Doe" 
                variant="bordered"
                className="w-full"
                isInvalid={!!errors.name && touchedFields.name}
                errorMessage={errors.name?.message}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">User Name</label>
              <Input 
                {...register('username')}
                placeholder="JohnDoe" 
                variant="bordered"
                className="w-full"
                isInvalid={!!errors.username && touchedFields.username}
                errorMessage={errors.username?.message}
              />
            </div>
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
              isInvalid={!!errors.email && touchedFields.email}
              errorMessage={errors.email?.message}
            />
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
                isInvalid={!!errors.password && touchedFields.password}
                errorMessage={errors.password?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Confirm Password</label>
              <Input 
                {...register('rePassword')}
                type="password" 
                placeholder="••••••••" 
                variant="bordered"
                className="w-full"
                isInvalid={!!errors.rePassword && touchedFields.rePassword}
                errorMessage={errors.rePassword?.message}
              />
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
                isInvalid={!!errors.dateOfBirth && touchedFields.dateOfBirth}
                errorMessage={errors.dateOfBirth?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Gender</label>
              <select 
                {...register('gender')}
                defaultValue=""
                className={`w-full h-[40px] px-3 rounded-xl border-2 bg-transparent text-sm text-slate-700 outline-none transition-colors ${
                  errors.gender && touchedFields.gender 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-default-200 focus:border-sky-500'
                }`}
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && touchedFields.gender && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
            className="w-full mt-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-600/30 transition-all duration-200"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
