import React, { useContext } from 'react';
import DropdownAction from '../Components/DropdownAction/DropdownAction';
import { AuthContext } from '../Context/AuthContext';
import DropdownActionComment from '../Components/DropdownAction/DropdownActionComment';

export default function CommentCard({ comment, isTopComment = false, postId }) {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <div className="mt-4 bg-slate-50/70 rounded-2xl p-4 border border-gray-100/80 space-y-3">
        {isTopComment ? (
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            TOP COMMENT
          </span>
        ) : null}

        <div className="bg-white rounded-xl p-3 shadow-2xs border border-gray-100/60 space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src={comment?.commentCreator?.photo || '/default-avatar.png'} 
                alt="Commenter" 
                className="w-8 h-8 rounded-full object-cover bg-gray-100" 
              />
              <h4 className="font-bold text-gray-900 text-xs">
                {comment?.commentCreator?.name}
              </h4>
            </div>

            {userData?._id && comment?.commentCreator?._id && userData._id === comment.commentCreator._id && (
              <DropdownActionComment postId={comment?.post} comment={comment} />
            )}
           
          </div>

          {comment?.content ? (
            <p className="text-xs text-gray-700 leading-relaxed px-0.5">
              {comment.content}
            </p>
          ) : null}

          {comment?.image ? (
            <div className="w-full bg-gray-50 rounded-lg overflow-hidden max-h-60 flex items-center justify-center">
              <img 
                src={comment.image}
                alt="Comment attachment" 
                className="max-h-56 object-contain"
              />
            </div>
          ) : null}

        </div>
      </div>
    </>
  );
}
