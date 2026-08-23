import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React, { useState } from 'react'
import { HiSearch, HiUserAdd } from 'react-icons/hi';
import Spinner from '../../Spinner/Spinner';

export default function FollowSuggestions() {
    const [searchTerm, setsearchTerm] = useState('')
    const queryClient = useQueryClient();

    function getSuggestions(){
        return axios.get('https://route-posts.routemisr.com/users/suggestions?limit=10',{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    const {data:suggestions=[],isLoading,isError}= useQuery({
        queryFn:getSuggestions,
        queryKey:['getSuggestions'],
        select: (res) => res?.data?.data?.users || res?.data?.users || []
    })

   function followUser(userId) {
    return axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
  const { mutate: handleFollow, isPending: isFollowing } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      toast.success('Followed successfully!');
      queryClient.invalidateQueries({ queryKey: ['getSuggestions'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to follow user');
    }
  });
  const filteredUsers = suggestions.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="hidden lg:block lg:col-span-3">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm sticky top-20 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">Suggested Friends</h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {filteredUsers.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <HiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
            placeholder="Search friends..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-6 flex justify-center">
            <Spinner />
          </div>
        )}

        {/* Error State or Empty Data */}
        {!isLoading && (isError || filteredUsers.length === 0) && (
          <p className="text-xs text-gray-400 text-center py-4">No suggestions found.</p>
        )}

        {/* Users List */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="space-y-3 pt-1">
            {filteredUsers.map((user) => (
              <div
                key={user._id || user.id}
                className="p-2.5 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50/50 transition-all gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      user.photo && !user.photo.includes('undefined')
                        ? user.photo
                        : `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-full bg-blue-50 object-cover shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-gray-800 truncate">{user.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate">
                      {user.email || 'Suggested for you'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(user._id || user.id)}
                  disabled={isFollowing}
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <HiUserAdd className="w-3.5 h-3.5" /> Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
