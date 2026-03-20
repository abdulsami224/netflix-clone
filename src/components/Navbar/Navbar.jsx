import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'

const Navbar = ({ showSearch = false, onSearch }) => {
  const navRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) navRef.current.classList.add('nav-dark');
      else navRef.current.classList.remove('nav-dark');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <div ref={navRef} className='navbar'>

      <div className="navbar-left">
        <img src={logo} alt="Netflix" className="nav-logo" />

        {/* Desktop nav links */}
        <ul className="nav-links">
          <Link to="/"><li>Home</li></Link>
          <Link to="/tv-shows"><li>TV Shows</li></Link>
          <Link to="/movies"><li>Movies</li></Link>
          <Link to="/my-list"><li>My List</li></Link>
        </ul>
      </div>

      <div className="navbar-right">
        {showSearch && (
          <>
            <img
              src={search_icon}
              alt="search"
              className="icons"
              onClick={() => setShowInput(!showInput)}
            />
            {showInput && (
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
            )}
          </>
        )}

        <img src={bell_icon} alt="notifications" className='icons' />

        <div className='navbar-profile'>
          <img src={profile_img} alt="profile" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p>Sign Out</p>
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu drawer */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/"        onClick={() => setMenuOpen(false)}><li>Home</li></Link>
        <Link to="/tv-shows" onClick={() => setMenuOpen(false)}><li>TV Shows</li></Link>
        <Link to="/movies"   onClick={() => setMenuOpen(false)}><li>Movies</li></Link>
        <Link to="/my-list"   onClick={() => setMenuOpen(false)}><li>My List</li></Link>
      </div>

    </div>
  );
};

export default Navbar;