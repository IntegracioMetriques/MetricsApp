import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';

const Header = (features) => {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log(features.features)
  const array = features.features
  return (
    <header className="header">
      <nav className="nav">
        <button 
          className="burger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/general" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>General</NavLink></li>
          <li><NavLink to="/commits" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>Commits</NavLink></li>
          {array.includes("issues") && (
          <li><NavLink to="/issues" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>Issues</NavLink></li>
          )}
          {array.includes("pull-requests") && (
          <li><NavLink to="/pull-requests" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>Pull Requests</NavLink></li>
          )}
          <li><NavLink to="/individual" onClick={() => setMenuOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>Individual</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
