import React , {useEffect, setScrolled} from 'react';
import './Header.css';

const Header = () => {
  // Check if we're in admin section
  const isAdminPage = window.location.pathname === '/admin';
  useEffect(() => {
  const handleScroll = () => {
    // Make header compact when scrolled a little
    setScrolled(window.scrollY > 30); // Changed from 50 to 30
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
  
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
        <h1 className="site-title">InsideMrVans Weekly Essays</h1>
        <p className="site-subtitle">A year-long journey of thoughts and reflections</p>
        <p className="blog-info">52 essays. 52 weeks.</p>
        
        <nav className="nav">
          <a href="/">All Essays</a>
          <a href="/">Latest</a>
          
         
          <a style={{color: "transparent"}} href='/admin'>Admin</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;