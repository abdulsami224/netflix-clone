import React, { useState, useEffect } from "react";
import "./MyList.css";
import { Link } from "react-router-dom";

const MyList = () => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("myList");
    setMyList(saved ? JSON.parse(saved) : []);
  }, []);

  const removeItem = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = myList.filter((item) => item.id !== id);
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  return (
    <div className="mylist-container">
      <h1 className="mylist-heading">🔖 My List</h1>

      {myList.length === 0 ? (
        <div className="mylist-empty">
          <p>Your list is empty.</p>
          <p>Browse <Link to="/tv-shows">TV Shows</Link> or <Link to="/movies">Movies</Link> and click the bookmark icon to save them here.</p>
        </div>
      ) : (
        <div className="mylist-grid">
          {myList.map((item) => (
            <Link to={`/player/${item.id}`} key={item.id} className="mylist-card">
              <div className="mylist-poster-wrap">
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={item.title}
                  className="mylist-poster"
                />
                {/* Remove button */}
                <button
                  className="remove-btn"
                  onClick={(e) => removeItem(e, item.id)}
                  title="Remove from My List"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z"/>
                  </svg>
                  <span className="remove-x">✕</span>
                </button>

                {/* Media type badge */}
                <span className="media-badge">
                  {item.media_type === "tv" ? "TV" : "Movie"}
                </span>
              </div>

              <h3 className="mylist-title">{item.title}</h3>
              {item.vote_average > 0 && (
                <p className="mylist-rating">⭐ {item.vote_average.toFixed(1)}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;