import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@heroui/react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(1, 'Password is required'),
});

export default function Login() {
  const { setuserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  async function submitForm(userData) {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axios.post('https://route-posts.routemisr.com/users/signin', userData);
      if (response.data.message === 'signed in successfully') {
        const token = response.data.data.token;
        setuserToken(token);
        localStorage.setItem('token', token);
        navigate('/home');
      }
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your account.</p>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div className="bg-red-100 border border-red-300 text-red-600 font-medium py-2 px-4 mb-4 rounded-xl text-center text-sm">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-sky-600 hover:underline">
                Forgot password?
              </Link>
            </div>
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

          <Button 
            type="submit" 
            isLoading={isLoading}
            isDisabled={isLoading}
            className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-sky-600/30 transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
