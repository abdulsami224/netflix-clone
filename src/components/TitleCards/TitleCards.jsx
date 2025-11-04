import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apidata, setApidata] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => setApidata(res.results || []))
      .catch(err => console.error(err));

    const cardsContainer = cardsRef.current;
    if (!cardsContainer) return;

    cardsContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => cardsContainer.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className='TitleCards'>
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="cards-list" ref={cardsRef}>
        {apidata.map((card, index) => (
          <Link to={`/player/${card.id}`} className='card' key={index}>
            <img 
              src={card.backdrop_path 
                    ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}` 
                    : 'https://via.placeholder.com/500x281?text=No+Image'} 
              alt={card.title || card.original_title} 
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
