import React, { useContext, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { 
  HiHome, HiUser, HiUserGroup, HiBookmark, HiHeart, 
  HiChatAlt, HiShare, HiGlobe, HiPhotograph, HiEmojiHappy,
  HiPaperAirplane, HiDotsHorizontal, HiSearch, HiUserAdd, HiX 
} from 'react-icons/hi';
import { AuthContext } from '../../Context/AuthContext';
export default function CreatePostCard({onPostCreated}) {
    let fileInputRef =useRef(null);
    const [selectedImage, setselectedImage] = useState(null);
    const [imagePreview, setimagePreview] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [postText, setpostText] = useState('')
     const {userData } = useContext(AuthContext);
     
    function handleImagePreview(e){
       
       const file =e.target.files[0]
       if(file){
        setselectedImage(file)
        setimagePreview(URL.createObjectURL(file))

       }
    }

    function handleCloseImage(){
        setselectedImage(null)
        setimagePreview(null)
        if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    }

 async   function handleCreatePost(){
        if(!postText.trim() &&!selectedImage){
            toast.error('Please write something or attach an image.');
      return;
        }

        setisLoading(true);
        const formData = new FormData();
        if(postText.trim()){
            formData.append('body',postText)
        }
        if(selectedImage){
            formData.append('image',selectedImage)
        }
        try{
            const response = await axios.post(
        'https://route-posts.routemisr.com/posts',
        formData,
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );
      toast.success('Post created Successfully!')
      setpostText('');
      handleCloseImage()
      if(onPostCreated){
        onPostCreated(response.data)
      }
        }
        catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create post';
      toast.error(errorMsg);
    } finally {
      setisLoading(false);
    }
  
    }
  return (
    <>
     <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
        <Toaster/>
        <div className="flex items-center gap-3">
          <img 
            src={userData?.photo}
            alt="Avatar" 
            className="w-10 h-10 rounded-full bg-cyan-100" 
          />
          <div>
            <h2 className="font-bold text-gray-800 text-sm">{userData?.name}</h2>
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full w-fit mt-0.5 border">
              <HiGlobe className="w-3 h-3" />
              <span>Public</span>
            </div>
          </div>
        </div>
    
        <textarea 
          rows="3" 
          value={postText}
          onChange={(e)=>setpostText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        ></textarea>

        {imagePreview && (
        <div className="relative rounded-xl overflow-hidden border border-gray-100 max-h-60 bg-gray-50">
          <img 
            src={imagePreview} 
            alt="Upload Preview" 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleCloseImage}
            className="absolute top-2 right-2 bg-gray-900/60 hover:bg-gray-900 text-white p-1 rounded-full backdrop-blur-sm transition-all"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleImagePreview}
        className="hidden"
      />
    
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-4 text-gray-500 text-xs font-semibold">
            <button 
            onClick={()=>fileInputRef.current?.click()}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-all">
              <HiPhotograph className="w-5 h-5 text-green-500" /> Photo/video
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-600 transition-all">
              <HiEmojiHappy className="w-5 h-5 text-amber-500" /> Feeling/activity
            </button>
          </div>
          <button 
          onClick={handleCreatePost}
          disabled={isLoading}
          
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all">
            {isLoading? 'Posting...' :'Post'}
             <HiPaperAirplane className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>
      </div>
    </>
  )
}
