import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EssayCard from '../components/EssayCard';
import Sidebar from '../components/Sidebar';
import { supabase } from '../services/supabase';
import './Home.css';

const Home = () => {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    try {
      setLoading(true);
      
      // Fetch essays with comment counts
      const { data: essaysData, error: essaysError } = await supabase
        .from('essays')
        .select('*')
        .order('published_date', { ascending: false });

      if (essaysError) throw essaysError;

      // Fetch comment counts for each essay
      const essaysWithCounts = await Promise.all(
        essaysData.map(async (essay) => {
          const { count, error: countError } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('essay_id', essay.id);

          if (countError) throw countError;

          return {
            ...essay,
            comment_count: count || 0
          };
        })
      );

      setEssays(essaysWithCounts);
    } catch (err) {
      console.error('Error fetching essays:', err);
      setError('Failed to load essays. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    essaysPublished: essays.length,
    totalComments: essays.reduce((sum, essay) => sum + (essay.comment_count || 0), 0),
    weeksRemaining: 52 - essays.length
  };

  return (
    <>
      <Header />
      
      <div className="container">
        <div className="content-wrapper">
          <main className="main-content">
            <h2 className="page-title">Latest Essays</h2>
            
            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Loading essays...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchEssays} className="retry-btn">
                  Try Again
                </button>
              </div>
            )}
            
            {!loading && !error && essays.length === 0 && (
              <div className="no-essays">
                <p>No essays published yet. Check back soon!</p>
              </div>
            )}
            
            {!loading && !error && essays.map((essay) => (
              <EssayCard key={essay.id} essay={essay} />
            ))}
          </main>
          
          <Sidebar stats={stats} />
        </div>
      </div>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Weekly Essays. All essays are open for discussion.</p>
          <p className="footer-note">
            No login required to comment • Comments are moderated for civility
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;