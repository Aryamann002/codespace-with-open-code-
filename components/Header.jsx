'use client';

import { useState } from 'react';

const links = ['Our Roastery', 'Artisanal Menu', 'Seasonal Blends', 'Rewards & Stars', 'Find a Cafe'];

export default function Header({ onMenuToggle }) {
  const [active, setActive] = useState('Artisanal Menu');

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-wrap">
          <button className="icon-button mobile-menu-button" onClick={onMenuToggle} aria-label="Open navigation">☰</button>
          <a className="brand" href="#top" aria-label="Cafe o Late home">
            <span className="brand-mark">c<span>o</span>l</span>
            <span className="brand-name">Cafe o Late</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <a key={link} className={active === link ? 'active' : ''} href={link === 'Artisanal Menu' ? '#menu' : '#top'} onClick={() => setActive(link)}>{link}</a>
            ))}
          </nav>
        </div>
        <div className="header-actions">
          <a className="location-link" href="#visit">⌖ <span>Store Hours & Location</span></a>
          <a className="sign-in" href="#signin">Sign In</a>
          <a className="button button-dark" href="#menu">Order Ahead</a>
          <span className="profile" aria-label="Your profile">♙</span>
        </div>
      </div>
    </header>
  );
}
