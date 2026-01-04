import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Sidebar from '../components/Sidebar';

import { supabase, blogService } from '../services/supabase';
import './EssayDetail.css';

const EssayDetail = () => {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  
  const [essay, setEssay] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (weekNumber) {
      fetchEssayAndComments();
    }
  }, [weekNumber]);

 const fetchEssayAndComments = async () => {
  try {
    setLoading(true);
    
    // Convert weekNumber to number
    const weekNum = parseInt(weekNumber);
    
    console.log('Looking for essay week:', weekNum);
    
    // Fetch essay by week number
    const { data: essays, error } = await supabase
      .from('essays')
      .select('*')
      .eq('week_number', weekNum);
    
    if (error) {
      console.error('Error:', error);
      navigate('/');
      return;
    }
    
    if (!essays || essays.length === 0) {
      console.log('No essay found for week:', weekNum);
      navigate('/');
      return;
    }
    
    // Get the first matching essay
    const essayData = essays[0];
    setEssay(essayData);
    
    // Fetch comments
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('essay_id', essayData.id)
      .order('created_at', { ascending: false });
    
    setComments(commentsData || []);
    
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to load essay. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const fetchComments = async (essayId) => {
    setCommentLoading(true);
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('essay_id', essayId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCommentAdded = () => {
    if (essay) {
      fetchComments(essay.id);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading essay...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !essay) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-container">
            <p>{error || 'Essay not found'}</p>
            <button onClick={() => navigate('/')} className="home-btn">
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const stats = {
    essaysPublished: 14, // This would come from your database
    totalComments: comments.length,
    weeksRemaining: 38
  };

  return (
    <>
      <Header />
      
      <div className="container">
        <div className="content-wrapper">
          <main className="essay-detail">
            <article className="essay-full">
              <div className="essay-header">
                <div className="essay-meta">
                  <span className="essay-week">Week {essay.week_number}</span>
                  <span className="essay-date">• {formatDate(essay.published_date)}</span>
                </div>
                <h1 className="essay-title">{essay.title}</h1>
                <p className="essay-excerpt">{essay.excerpt}</p>
              </div>

              <div className="essay-content">
                {essay.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="essay-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="essay-footer">
                <button onClick={() => navigate('/')} className="back-btn">
                  ← Back to All Essays
                </button>
              </div>
            </article>

            <section className="comments-section">
              <CommentForm 
                essayId={essay.id} 
                onCommentAdded={handleCommentAdded}
              />
              
              <CommentList 
                comments={comments} 
                loading={commentLoading}
              />
            </section>
          </main>
          
          <Sidebar stats={stats} />
        </div>
      </div>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Weekly Essays. All essays are open for discussion.</p>
        </div>
      </footer>
    </>
  );
};

export default EssayDetail;