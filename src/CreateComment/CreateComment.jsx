import React, { useContext, useRef, useState } from 'react';
import { HiEmojiHappy, HiPaperAirplane, HiPhotograph, HiX, HiRefresh } from 'react-icons/hi';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../Context/AuthContext';

export default function CreateComment({ userPhoto, postId }) {
    const { userData } = useContext(AuthContext);
  
  const [commentText, setCommentText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);  
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };


  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

 
  function sendCommentApi(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  const { mutate: addComment, isLoading } = useMutation({
    mutationFn: sendCommentApi,
    onSuccess: () => {
      setCommentText('');
      handleRemoveImage();
      queryClient.invalidateQueries(['getPostComments', postId]);
      toast.success('Comment created successfully!')
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() && !selectedImage) return;

    const formData = new FormData();
    if (commentText.trim()) formData.append('content', commentText);
    if (selectedImage) formData.append('image', selectedImage);

    addComment(formData);
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
        <Toaster/>
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <img 
          src={userData?.photo} 
          alt="User Avatar" 
          className="w-9 h-9 rounded-full object-cover bg-gray-100" 
        />

        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          
         
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Comment as user..."
            rows="2"
            className="w-full text-sm outline-none resize-none placeholder-gray-400 text-gray-700 bg-transparent"
          />

         
          {imagePreview && (
            <div className="relative my-2 inline-block">
              <img 
                src={imagePreview} 
                alt="Selected preview" 
                className="w-20 h-20 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-black transition-colors"
              >
                <HiX className="w-3 h-3" />
              </button>
            </div>
          )}

         
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-400">
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-blue-500 p-1 rounded-full transition-colors"
              >
                <HiPhotograph className="w-5 h-5" />
              </button>

              <button type="button" className="hover:text-gray-600 p-1 rounded-full transition-colors">
                <HiEmojiHappy className="w-5 h-5" />
              </button>
            </div>

            
            <button
              type="submit"
              disabled={(!commentText.trim() && !selectedImage) || isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <HiRefresh className="w-4 h-4 animate-spin" />
              ) : (
                <HiPaperAirplane className="w-4 h-4 rotate-90" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}