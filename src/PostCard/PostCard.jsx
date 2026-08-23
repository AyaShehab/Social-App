import React, { useEffect, useState,useContext } from 'react';
import { HiGlobe, HiDotsHorizontal, HiThumbUp, HiChatAlt, HiShare, HiRefresh, HiPencil, HiTrash } from 'react-icons/hi';
import CommentCard from '../CommentCard/CommentCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreateComment from '../CreateComment/CreateComment';
import DropdownAction from '../Components/DropdownAction/DropdownAction';
import { AuthContext } from './../Context/AuthContext';

export default function PostCard({ post, isSinglePost = false }) {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
 const {userData}= useContext(AuthContext)

  useEffect(() => {
    if (post?.isLiked !== undefined) {
      setIsLiked(post.isLiked);
    }
  }, [post?.isLiked]);

  const query = useQueryClient();
  const [page, setPage] = useState(1);
  const [allComments, setallComments] = useState([]);
  const [hasMore, sethasMore] = useState(true);
  const postId = post?.id || post?._id;
  const [showCommentInput, setShowCommentInput] = useState(false);

  function handleToggleLike() {
    setIsLiked((prev) => !prev);
    handleLikePost();
  }

  function getPostComments({ queryKey }) {
    const [_, id, currentPage] = queryKey;
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      params: { limit: 10, page: currentPage },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  const { data, isFetching } = useQuery({
    queryKey: ['getPostComments', postId, page],
    queryFn: getPostComments,
    enabled: isSinglePost && !!postId
  });

  useEffect(() => {
    const newComments = data?.data?.comments || data?.data?.data?.comments;
    if (newComments) {
      if (newComments.length < 10) {
        sethasMore(false);
      }
      setallComments((prev) => {
        const existingIds = new Set(prev.map((c) => c._id || c.id));
        const filteredNew = newComments.filter((c) => !existingIds.has(c._id || c.id));
        return [...prev, ...filteredNew];
      });
    }
  }, [data]);

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
  }

  const { data: likeData, isPending: likePending, mutate: handleLikePost } = useMutation({
    mutationFn: likePost,
    onSuccess: (res) => {


      if (res?.data?.data?.liked !== undefined) {
        setIsLiked(res.data.data.liked);
      }
      query.invalidateQueries({ queryKey: ['getPosts'] });
      query.invalidateQueries({ queryKey: ['getProfilePosts'] });
      query.invalidateQueries({ queryKey: ['getPost', postId] });
    },
    onError: () => {
      setIsLiked((prev) => !prev);
    }
  });

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 mb-4">
     
    {/* Header */}
<div className="flex items-start justify-between mb-4">
  <div className="flex items-center gap-3">
    <img
      src={post?.user?.photo}
      alt="Avatar"
      className="w-10 h-10 rounded-full bg-blue-50 object-cover"
    />
    <div>
      <h3 className="font-bold text-gray-900 text-sm leading-none">{post?.user?.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
        <span>{post?.user?.username}</span>
        <span>·</span>
        <span>{timeAgo(post?.createdAt)}</span>
        <span>·</span>
        <div className="flex items-center gap-1">
          <HiGlobe className="w-3 h-3" />
          <span className="capitalize">{post?.privacy}</span>
        </div>
      </div>
    </div>
  </div>
{userData?._id && post?.user?._id && userData._id === post.user._id && (
  <DropdownAction post={post} />
)}

 
</div>

      {/* Text Content */}
      <p className="text-sm text-gray-800 mb-4 font-normal">
        {post?.body}
      </p>

      {/* Image Container */}
      {post?.image && (
        <div className="w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 py-3 mt-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="bg-blue-500 text-white p-1 rounded-full flex items-center justify-center">
            <HiThumbUp className="w-3 h-3" />
          </span>
          <span>{post?.likesCount} likes</span>
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          <span>{post?.sharesCount} shares</span>
          <span>{post?.commentsCount} comments</span>
          <Link to={`/postDetails/${postId}`}>
            <button className="text-blue-600 font-medium hover:underline">
              View details
            </button>
          </Link>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 text-gray-600 text-sm font-medium">
        <button
          onClick={handleToggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all cursor-pointer active:scale-95 ${isLiked ? 'text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          <HiThumbUp className={`w-5 h-5 ${isLiked ? 'text-blue-600' : 'text-gray-500'}`} />
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-all text-gray-600 cursor-pointer"
        >
          <HiChatAlt className="w-5 h-5 text-gray-500" /> Comment
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-all">
          <HiShare className="w-5 h-5 text-gray-500" /> Share
        </button>
      </div>

      {showCommentInput && <CreateComment userPhoto={post?.user?.photo} postId={postId} />}
      {!isSinglePost && post?.topComment && <CommentCard isTopComment={true} comment={post.topComment} />}

      {isSinglePost && (
        <div className="mt-4 space-y-3">
          {allComments.map((comment) => (
            <CommentCard key={comment._id || comment.id} comment={comment} />
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <HiRefresh className="w-4 h-4 animate-spin text-blue-600" /> Loading...
                  </>
                ) : (
                  'Load more comments'
                )}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
