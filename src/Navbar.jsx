import React from 'react';

export default function Navbar({ cartCount }) {
  return (
    <nav className="navbar-custom">
      <div className="logo-container">
        <span className="logo-icon">🌿</span>
        <h1>AromaGourmet</h1>
      </div>
      <div className="cart-status">
        <span className="cart-icon">🛒</span>
        <span className="badge">{cartCount}</span>
      </div>
    </nav>
  );
}