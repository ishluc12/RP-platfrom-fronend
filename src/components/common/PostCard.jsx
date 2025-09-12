import React from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';

const PostCard = ({ post, onLike, onCommentClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-3">
                <img src={post.authorAvatar || 'https://via.placeholder.com/40'} alt="Author" className="h-10 w-10 rounded-full mr-3" />
                <div>
                    <p className="font-semibold text-gray-800">{post.authorName}</p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-700 text-sm mb-4">{post.content}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post image" className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <div className="flex items-center text-gray-600 text-sm">
                <button onClick={() => onLike(post.id)} className="flex items-center mr-4 hover:text-blue-600">
                    <FaHeart className="mr-1" /> {post.likes} Likes
                </button>
                <button onClick={() => onCommentClick(post.id)} className="flex items-center hover:text-blue-600">
                    <FaComment className="mr-1" /> {post.comments} Comments
                </button>
            </div>
        </div>
    );
};

export default PostCard;
