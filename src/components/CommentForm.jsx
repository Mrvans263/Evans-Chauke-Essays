import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import './CommentForm.css';

const CommentForm = ({ essayId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    author_name: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.author_name.trim() || !formData.content.trim()) {
      setError('Please enter both your name and a comment.');
      return;
    }

    if (formData.content.length > 1000) {
      setError('Comment must be less than 1000 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Get client info for moderation (optional)
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const { data, error: supabaseError } = await supabase
        .from('comments')
        .insert([
          {
            essay_id: essayId,
            author_name: formData.author_name.trim(),
            content: formData.content.trim(),
            ip_address: ipData.ip,
            user_agent: navigator.userAgent
          }
        ]);

      if (supabaseError) throw supabaseError;

      // Reset form
      setFormData({ author_name: '', content: '' });
      setSuccess(true);
      
      // Callback to refresh comments
      if (onCommentAdded) {
        onCommentAdded();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container">
      <h3 className="form-title">Share Your Thoughts</h3>
      <p className="form-subtitle">
        No login required. Just share your name and comment.
      </p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Comment submitted successfully!</div>}

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="author_name">Your Name *</label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            value={formData.author_name}
            onChange={handleChange}
            placeholder="Enter your name"
            maxLength="100"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Comment *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="What did this essay make you think about?"
            rows="4"
            maxLength="1000"
            required
            disabled={submitting}
          />
          <div className="character-count">
            {formData.content.length}/1000 characters
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Post Comment'}
        </button>

        <p className="form-note">
          Comments are moderated for civility. Your IP address is recorded for spam prevention.
        </p>
      </form>
    </div>
  );
};

export default CommentForm;