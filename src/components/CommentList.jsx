import React from 'react';
import Comment from './Comment';
import './CommentList.css';

const CommentList = ({ comments, loading }) => {
  if (loading) {
    return (
      <div className="comments-loading">
        <div className="spinner"></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;