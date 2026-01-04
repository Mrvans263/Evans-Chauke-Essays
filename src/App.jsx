import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EssayDetail from './pages/EssayDetail';
import Admin from './pages/Admin'; // ADD THIS IMPORT
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/essay/week/:weekNumber" element={<EssayDetail />} />
          <Route path="/admin" element={<Admin />} /> {/* ADD THIS ROUTE */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;