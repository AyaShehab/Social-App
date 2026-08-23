import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { HiDotsHorizontal, HiPencil, HiTrash, HiX,HiPhotograph } from 'react-icons/hi'

export default function DropdownAction({ post }) {
  let query = useQueryClient()
  const [postText, setpostText] = useState(post?.body || '');
  const [imageFile, setimageFile] = useState(null);
  const [imagePreview, setimagePreview] = useState(post?.image || null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    setpostText(post?.body || '')
    setimageFile(null);
    setimagePreview(post?.image || null)
  }, [post]);
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimagePreview(URL.createObjectURL(file));
    }
  }
  function handleRemoveImage() {
    setimageFile(null)
    setimagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function updatePost() {
    const formData = new FormData()
    formData.append('body', postText);
    if (imageFile) {
      formData.append('image', imageFile)
    }
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}`,
      formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
    );

  }



  const { mutate: handleUpdatePost, isPending: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success('Post updated successfully');
      setIsModalOpen(false);
      query.invalidateQueries({ queryKey: ['getPosts'] });
      query.invalidateQueries({ queryKey: ['getProfilePosts'] });
      query.invalidateQueries({ queryKey: ['getPost', postId] });

    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update post!');
    }
  })
  const postId = post?.id
  const [isModalOpen, setIsModalOpen] = useState(false);
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
  const { mutate: handleDeletePost, data: deletePostData } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success('Post Deleted Successfully!')
      query.invalidateQueries({ queryKey: ['getPosts'] })
      query.invalidateQueries({ queryKey: ['getProfilePosts'] })
    },
    onError: () => {
      toast.error('Cant Deleted Post!')
    }
  })
  const [isOpen, setisOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setisOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)

  }, [])
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Toaster />
        <button
          onClick={() => { setisOpen((prev) => !prev) }}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
          <HiDotsHorizontal className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setisOpen(false);
                setIsModalOpen(true)
              }
              }
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
            >
              <HiPencil className="w-4 h-4 text-gray-500" /> Edit
            </button>
            <button

              onClick={handleDeletePost}
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
            >
              <HiTrash className="w-4 h-4 text-red-500" /> Delete
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Edit Post</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              rows="3"
              value={postText}
              onChange={(e) => setpostText(e.target.value)}
              placeholder="Update your post body..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none text-gray-800"
            ></textarea>

            {/* Image Preview Container */}
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 group max-h-48 bg-gray-50 flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover max-h-48" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-all"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Image Button */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-xl transition-all"
              >
                <HiPhotograph className="w-5 h-5 text-green-500" />
                <span>{imagePreview ? 'Change Photo' : 'Add Photo'}</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdatePost()}
                  disabled={isUpdating || (!postText.trim() && !imagePreview)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
