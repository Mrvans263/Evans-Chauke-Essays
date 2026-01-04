import React from 'react';
import { Link } from 'react-router-dom';
import './EssayCard.css';

const EssayCard = ({ essay }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="essay-card">
      <div className="essay-meta">
        <span className="essay-week">Week {essay.week_number}</span>
        <span className="essay-date">• {formatDate(essay.published_date)}</span>
      </div>
      
      <h2 className="essay-title">{essay.title}</h2>
      
      <p className="essay-excerpt">{essay.excerpt}</p>
      
      <div className="essay-actions">
        <Link to={`/essay/${essay.slug}`} className="read-more">
          Read Full Essay →
        </Link>
        <span className="comment-count">
          {essay.comment_count || 0} comments
        </span>
      </div>
    </article>
  );
};

export default EssayCard;