import React from 'react';
import './Header.css';

const Header = () => {
  // Check if we're in admin section
  const isAdminPage = window.location.pathname === '/admin';
  
  if (isAdminPage) {
    return (
      <header className="header">
        <div className="container">
          <h1 className="site-title">Weekly Essays Admin</h1>
          <nav className="nav">
            <a href="/">← Back to Blog</a>
            <a href="/admin">Manage Essays</a>
            <a href="/admin">Moderate Comments</a>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container">
        <h1 className="site-title">Weekly Essays</h1>
        <p className="site-subtitle">A year-long journey of thoughts and reflections</p>
        <p className="blog-info">52 essays. 52 weeks. Your thoughts welcome.</p>
        
        <nav className="nav">
          <a href="/">All Essays</a>
          <a href="/">Latest</a>
          <a href="/">Archive</a>
          <a href="/">About</a>
          <a href="/">Subscribe</a>
         
        </nav>
      </div>
    </header>
  );
};

export default Header;