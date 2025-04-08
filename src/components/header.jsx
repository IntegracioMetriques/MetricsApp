import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li><NavLink to="/general" className={({ isActive  }) => (isActive || window.location.pathname === '/' ? 'active' : '')}>General</NavLink></li>
          <li><NavLink to="/commits" className={({ isActive }) => (isActive ? 'active' : '')}>Commits</NavLink></li>
          <li><NavLink to="/issues" className={({ isActive }) => (isActive ? 'active' : '')}>Issues</NavLink></li>
          <li><NavLink to="/pull-requests" className={({ isActive }) => (isActive ? 'active' : '')}>Pull Requests</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
