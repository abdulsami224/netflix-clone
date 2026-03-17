import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apidata, setApidata] = useState([]);
  const [scrollPercent, setScrollPercent] = useState(0);
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

  const handleScroll = () => {
    const el = cardsRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const percent = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
    setScrollPercent(percent);
  };

  // Drag scroll for mobile / touch
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : 'now_playing'}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApidata(res.results || []))
      .catch((err) => console.error(err));

    const el = cardsRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleScroll);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Drag-to-scroll (mouse)
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.pageX;
    scrollStartLeft.current = cardsRef.current.scrollLeft;
    cardsRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.pageX - dragStartX.current;
    cardsRef.current.scrollLeft = scrollStartLeft.current - delta;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (cardsRef.current) cardsRef.current.style.cursor = 'grab';
  };

  const handleThumbDrag = (e) => {
    const track = e.currentTarget.parentElement;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const el = cardsRef.current;
    if (!el) return;
    el.scrollLeft = percent * (el.scrollWidth - el.clientWidth);
  };

  return (
    <div className="TitleCards">
      <h2>{title || 'Popular on Netflix'}</h2>

      <div
        className="cards-list"
        ref={cardsRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {apidata.map((card, index) => (
          <Link to={`/player/${card.id}`} className="card" key={index}>
            <img
              src={
                card.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
                  : 'https://via.placeholder.com/500x281?text=No+Image'
              }
              alt={card.title || card.original_title}
              draggable="false"
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>

      {/* Custom scroll indicator */}
      <div className="scroll-track" onMouseDown={handleThumbDrag}>
        <div
          className="scroll-thumb"
          style={{ left: `${scrollPercent}%` }}
        />
      </div>
    </div>
  );
};

export default TitleCards;