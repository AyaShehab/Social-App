import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import PostCard from '../PostCard/PostCard'
import { HiArrowLeft } from 'react-icons/hi'
import Spinner from '../Spinner/Spinner'

export default function PostDetails() {
    let {id} = useParams()
    let navigate = useNavigate();
    function getPostDetails(){
     return   axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
    }

 const {data , isLoading,isError} =  useQuery({
        queryKey:['getSinglePost',id],
        queryFn:getPostDetails,

    })



   
    if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-red-500 font-semibold text-sm">
          {error?.response?.data?.message || 'Failed to load post details'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          <HiArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }
  return (
    <>
    <div className="bg-slate-50 min-h-screen py-8 px-4">
  
      <div className="max-w-xl mx-auto space-y-4">
        
      
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs border border-gray-100 shadow-sm transition-all"
        >
          <HiArrowLeft className="w-4 h-4 text-gray-500" /> Back
        </button>
    <PostCard isSinglePost={true} post ={data?.data.data.post}/>
        </div>
        </div>
    </>
  )
}

