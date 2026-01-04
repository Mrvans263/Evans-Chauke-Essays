import React, { useState, useEffect } from 'react';
import { blogService, supabase } from '../services/supabase';
import './Admin.css';

const Admin = () => {
  const [essays, setEssays] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('essays');
  const [showEssayForm, setShowEssayForm] = useState(false);
  const [essayForm, setEssayForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    week_number: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const essaysData = await blogService.getEssays();
      setEssays(essaysData);

      // Fetch all comments for moderation
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*, essays(title)')
        .order('created_at', { ascending: false });

      if (!error) {
        setComments(commentsData || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEssaySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('essays')
        .insert([{
          ...essayForm,
          week_number: parseInt(essayForm.week_number),
          published_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      alert('Essay published successfully!');
      setShowEssayForm(false);
      setEssayForm({ title: '', content: '', excerpt: '', slug: '', week_number: '' });
      fetchData();
    } catch (err) {
      console.error('Error publishing essay:', err);
      alert('Failed to publish essay');
    }
  };

  const handleDeleteEssay = async (id) => {
    if (!window.confirm('Delete this essay and all its comments?')) return;

    try {
      const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting essay:', err);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleApproveComment = async (comment) => {
    // In a real app, you'd have an 'approved' column
    alert('Comment approved (this would update in database)');
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Blog Admin Panel</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowEssayForm(!showEssayForm)}
        >
          {showEssayForm ? 'Cancel' : '➕ New Essay'}
        </button>
      </header>

      {showEssayForm && (
        <div className="essay-form-container">
          <h2>Publish New Essay</h2>
          <form onSubmit={handleEssaySubmit} className="essay-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={essayForm.title}
                onChange={(e) => setEssayForm({...essayForm, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Slug * (URL-friendly)</label>
              <input
                type="text"
                value={essayForm.slug}
                onChange={(e) => setEssayForm({...essayForm, slug: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Week Number *</label>
              <input
                type="number"
                value={essayForm.week_number}
                onChange={(e) => setEssayForm({...essayForm, week_number: e.target.value})}
                required
                min="1"
                max="52"
              />
            </div>
            <div className="form-group">
              <label>Excerpt *</label>
              <textarea
                value={essayForm.excerpt}
                onChange={(e) => setEssayForm({...essayForm, excerpt: e.target.value})}
                required
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={essayForm.content}
                onChange={(e) => setEssayForm({...essayForm, content: e.target.value})}
                required
                rows="10"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Publish Essay
            </button>
          </form>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'essays' ? 'active' : ''}`}
          onClick={() => setActiveTab('essays')}
        >
          Essays ({essays.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'essays' ? (
          <div className="essays-list">
            {essays.map((essay) => (
              <div key={essay.id} className="essay-item">
                <div className="essay-info">
                  <h3>{essay.title}</h3>
                  <p className="essay-meta">
                    Week {essay.week_number} • {new Date(essay.published_date).toLocaleDateString()} • 
                    {essay.comment_count || 0} comments
                  </p>
                  <p className="essay-excerpt">{essay.excerpt}</p>
                </div>
                <div className="essay-actions">
                  <a href={`/essay/${essay.slug}`} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteEssay(essay.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.author_name}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                  <span className="essay-link">
                    On: {comment.essays?.title || 'Unknown Essay'}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-footer">
                  <small>IP: {comment.ip_address || 'Unknown'}</small>
                  <div className="comment-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleApproveComment(comment)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;