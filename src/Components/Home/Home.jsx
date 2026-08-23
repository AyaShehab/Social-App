import React, { useContext, useEffect, useState } from 'react';
import { CounterContext } from '../../Context/CounterContext';
import { useQuery , useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  HiHome, HiUser, HiUserGroup, HiBookmark, HiHeart, 
  HiChatAlt, HiShare, HiGlobe, HiPhotograph, HiEmojiHappy,
  HiPaperAirplane, HiDotsHorizontal, HiSearch, HiUserAdd 
} from 'react-icons/hi';
import PostCard from '../../PostCard/PostCard';
import Spinner from '../../Spinner/Spinner';
import CreatePostCard from '../CreatePostCard/CreatePostCard';
import FollowSuggestions from '../FollowSuggestions/FollowSuggestions';

export default function Home() {
  const queryClient = useQueryClient();
  function getAllPosts(){
  return  axios.get('https://route-posts.routemisr.com/posts' , {
   

     headers:{
      Authorization : `Bearer ${localStorage.getItem('token')}`
     } })
  }
  const {data, isLoading , isError , error ,}=  useQuery({
    queryKey:['getPosts'],
    queryFn:getAllPosts,
    select : (data)=>{
      return data?.data.data.posts
    }
  })
function handlePostCreated(){
  queryClient.invalidateQueries(['getPosts']);
}


  if(isLoading){

 return <Spinner/>
  }
    if(isError){

 return <div className='h-screen flex justify-center items-center'>
  <h2>{error.message}</h2>
 </div>
  }
  return (
   <>
   <div className="bg-slate-50 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* --- Left Sidebar (3 Cols) --- */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-20 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm">
              <HiHome className="w-5 h-5" /> Feed
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all">
              <HiUser className="w-5 h-5 text-gray-400" /> My Posts
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all">
              <HiUserGroup className="w-5 h-5 text-gray-400" /> Community
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all">
              <HiBookmark className="w-5 h-5 text-gray-400" /> Saved
            </button>
          </div>
        </div>

    {/* --- Center Feed (6 Cols) --- */}
<div className="col-span-1 lg:col-span-6 space-y-4">


 <CreatePostCard onPostCreated={handlePostCreated}/>


  {data?.map((post) => (
    <PostCard isSinglePost={false} key={post._id} post={post} />
  ))}

</div>
        {/* --- Right Sidebar (3 Cols) --- */}
      <FollowSuggestions/>

      </div>
    </div>
   </>
  );
}



