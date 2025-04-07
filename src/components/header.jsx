import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Inici</Link></li>
          <li><Link to="/prova">prova de navegacio</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
