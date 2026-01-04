import React from 'react';
import './Sidebar.css';

const Sidebar = ({ stats }) => {
  return (
    <aside className="sidebar">
       {/* <div className="sidebar-section">
        <h3 className="sidebar-title">Essay Archive</h3>
        <ul className="archive-list">
          <li><a href="/archive/april-2024">April 2024 <span className="count">2</span></a></li>
          <li><a href="/archive/march-2024">March 2024 <span className="count">4</span></a></li>
          <li><a href="/archive/february-2024">February 2024 <span className="count">4</span></a></li>
          <li><a href="/archive/january-2024">January 2024 <span className="count">4</span></a></li>
          <li><a href="/archive">All Essays <span className="count">14</span></a></li>
        </ul>
      </div> */ }

      <div className="sidebar-section">
        <h3 className="sidebar-title">About This Blog</h3>
        <p className="sidebar-text">
          Hello, Evans here. I have learned that reading gives you knowledge, but writing solidifies your thinking. This year i have decided to write. Check out each week i will give you something new.
        </p>
        <p className="sidebar-text">
          <strong>Comments are open to everyone</strong>—no accounts needed. Just share your name 
          and join the conversation.
        </p>
       { /* <button className="subscribe-btn">
          Subscribe to Weekly Essays
        </button> */ }

      </div> 
      {stats && (
        <div className="sidebar-section stats">
          <h3 className="sidebar-title">Blog Stats</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.essaysPublished}</div>
              <div className="stat-label">Essays</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalComments}</div>
              <div className="stat-label">Comments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.weeksRemaining}</div>
              <div className="stat-label">Weeks Left</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;