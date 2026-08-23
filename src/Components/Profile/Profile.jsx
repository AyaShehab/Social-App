import React, { useContext, useEffect, useRef, useState } from 'react';
import { HiMail, HiUserGroup, HiBadgeCheck, HiCamera, HiEye, HiDocumentText, HiBookmark, HiX } from 'react-icons/hi';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostCard from '../../PostCard/PostCard';
import Spinner from '../../Spinner/Spinner';
import toast from 'react-hot-toast';

export default function Profile() {
  const queryClient = useQueryClient();
  const { userData, setuserData } = useContext(AuthContext);
  const userId = userData?._id || userData?.id;
  const [activeTab, setActiveTab] = useState('myPosts');

  const fileInputRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(userData?.photo);

  useEffect(() => {
    if (userData?.photo) {
      setProfilePhoto(userData.photo);
    }
  }, [userData?.photo]);

  function handleSelectedImage(e) {
    const file = e.target.files[0];
    if (file) {
      handleUploadImage(file);
    }
  }

  function uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  const { mutate: handleUploadImage, isPending: isUploading } = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: (res) => {
      toast.success('Profile Picture Changed Successfully!');

      const newPhoto = res?.data?.user?.photo || res?.data?.photo;

      if (newPhoto) {
        const updatedPhotoUrl = `${newPhoto}?t=${Date.now()}`;
        setProfilePhoto(updatedPhotoUrl);

        if (typeof setuserData === 'function') {
          setuserData((prev) => ({ ...prev, photo: updatedPhotoUrl }));
        }
      }

      queryClient.invalidateQueries({ queryKey: ['getProfilePosts'] });
      queryClient.invalidateQueries({ queryKey: ['getUserData'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update photo!');
    }
  });

  function getProfilePosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ['getProfilePosts'],
    queryFn: getProfilePosts,
    enabled: !!userId
  });

  if (isLoading || isUploading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Cover Background */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 h-48 rounded-3xl overflow-hidden shadow-sm"></div>

        {/* Main Profile Info Card */}
        <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 p-6 -mt-20 mx-2 sm:mx-4 z-10">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* User Info (Avatar + Buttons + Name) */}
            <div className="flex items-center gap-4">

              {/* Avatar Container with Action Buttons */}
              <div className="relative -mt-12 md:-mt-16 shrink-0">
                <img
                  src={profilePhoto || userData?.photo}
                  alt="Profile Avatar"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-cyan-100 object-cover shadow-md"
                />

                {/* Action Buttons Overlay / Badges */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    type="button"
                    title="View Photo"
                    className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full border-2 border-white shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <HiEye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSelectedImage}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    title="Change Photo"
                    className="absolute bottom-0 left-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full border-2 border-white shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <HiCamera className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>

              </div>

              <div className="mt-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{userData?.name}</h1>
                <p className="text-gray-400 text-sm font-medium">{userData?.username}</p>

                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  <HiUserGroup className="w-3.5 h-3.5" />
                  <span>{userData?.email}</span>
                </div>
              </div>
            </div>

            {/* Top Counters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-28 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-xs">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Followers</span>
                <span className="text-xl font-extrabold text-gray-800 mt-0.5 block">{userData?.followersCount || 0}</span>
              </div>

              <div className="flex-1 md:w-28 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-xs">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Following</span>
                <span className="text-xl font-extrabold text-gray-800 mt-0.5 block">{userData?.followingCount || 0}</span>
              </div>

              <div className="flex-1 md:w-28 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-xs">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bookmarks</span>
                <span className="text-xl font-extrabold text-gray-800 mt-0.5 block">{userData?.bookmarksCount || 0}</span>
              </div>
            </div>

          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-2 bg-gray-50/60 border border-gray-100 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-700 mb-3">About</h3>
              <div className="space-y-2.5 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <HiMail className="w-4 h-4 text-gray-400" />
                  <span>{userData?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiBadgeCheck className="w-4 h-4 text-gray-400" />
                  <span>Active on Route Posts</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4">
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">My Posts</span>
                <span className="text-lg font-bold text-gray-800 mt-1 block">{data?.data?.data?.posts?.length || 0}</span>
              </div>

              <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4">
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">Saved Posts</span>
                <span className="text-lg font-bold text-gray-800 mt-1 block">0</span>
              </div>
            </div>
          </div>

        </div>

        {/* Filter Tabs Bar */}
        <div className="bg-white rounded-2xl p-1 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100/80">
            <button
              type="button"
              onClick={() => setActiveTab('myPosts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'myPosts' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiDocumentText className={`w-4 h-4 ${activeTab === 'myPosts' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>My Posts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'saved' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiBookmark className={`w-4 h-4 ${activeTab === 'saved' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>Saved</span>
            </button>
          </div>

          <div className="flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xs w-7 h-7 rounded-full">
            {data?.data?.data?.posts?.length || 0}
          </div>
        </div>

        <div className="mt-4">
          {data?.data?.data?.posts?.map((post) => (
            <PostCard key={post?._id} post={post} />
          ))}
        </div>

      </div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full bg-white rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700">Profile Photo</h3>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={profilePhoto || userData?.photo}
                alt={userData?.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
