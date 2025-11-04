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

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) navRef.current.classList.add('nav-dark');
      else navRef.current.classList.remove('nav-dark');
    });
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <Link to="/"><li>Home</li></Link>
          <Link to="/tv-shows"><li>TV Shows</li></Link>
          <Link to="/movies"><li>Movies</li></Link>
          <li>My List</li>
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
              />
            )}
          </>
        )}
        <img src={bell_icon} alt="" className='icons' />
        <div className='navbar-profile'>
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p>Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
