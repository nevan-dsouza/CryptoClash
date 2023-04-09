import React from 'react'
import './Header.css'

function Header({ teamName }) {
  return (
    <div className="header">
      <h1>{teamName}</h1>
    </div>
  );
}

export default Header