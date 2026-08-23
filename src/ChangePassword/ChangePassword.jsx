import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import * as zod from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const {setuserToken} = useContext(AuthContext);
    const [isLoading, setisLoading] = useState(false)
     const [apiError, setapiError] = useState(null)
      const [successMsg, setsuccessMsg] = useState(null)
      const navigate = useNavigate()


      const schema =zod.object({
        password: zod.string().nonempty('Current password is required'),
        newPassword: zod.string().nonempty('New password is required').regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        'New password must contain uppercase, lowercase, number and special character'
      ),
      rePassword: zod.string().nonempty('Confirm password is required'),
      })
      .refine((data) => data.newPassword === data.rePassword, {
      message: 'Passwords do not match',
      path: ['rePassword'], 
    })
      


      const {
        register,
        handleSubmit,
        formState:{errors},
        reset
      } = useForm({
        defaultValues:{
            password:'',
            newPassword:'',
            rePassword: '',
        },
        mode:'onBlur',
        resolver:zodResolver(schema)
      })


      function submitChangePassword(userData){
        setisLoading(true);
        setapiError(null);
        setsuccessMsg(null);
        const {rePassword , ...payload} = userData
        axios.patch('https://route-posts.routemisr.com/users/change-password',payload,{
            headers:{
                token: localStorage.getItem('token')
            },

        })
        .then((response)=>{
            setisLoading(false);
            setsuccessMsg('Password changed successfully!');
           localStorage.removeItem('token' )
            setuserToken(null)
            reset();
          toast.success('Password changed successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        setTimeout(()=>{
            navigate('/')
        },1500)
        })
        .catch((error)=>{
            setisLoading(false);
            setapiError(error.response?.data?.message ||'Failed to change password')
        })

      }
return (
    <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <Toaster/>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-400">Keep your account secure by using a strong password.</p>
        </div>
      </div>

      {/* Alert Messages */}
      {apiError && (
        <div className="p-3 mb-4 text-xs font-medium text-red-600 bg-red-50 rounded-xl">
          {apiError}
        </div>
      )}
      {successMsg && (
        <div className="p-3 mb-4 text-xs font-medium text-green-600 bg-green-50 rounded-xl">
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(submitChangePassword)} className="space-y-4">
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Current password
          </label>
          <input
            {...register('password')}
            type="password"
            placeholder="Enter current password"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition"
          />
          {errors.password && (
            <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            New password
          </label>
          <input
            {...register('newPassword')}
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            At least 8 characters with uppercase, lowercase, number, and special character.
          </p>
          {errors.newPassword && (
            <p className="text-[11px] text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Confirm new password
          </label>
          <input
            {...register('rePassword')}
            type="password"
            placeholder="Re-enter new password"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition"
          />
          {errors.rePassword && (
            <p className="text-[11px] text-red-500 mt-1">{errors.rePassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-blue-400 hover:bg-blue-500 text-white font-medium text-xs py-3 rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
  
}
