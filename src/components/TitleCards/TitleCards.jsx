import React, { useRef, useEffect } from 'react';
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data';

const TitleCards = ({title, category}) => {
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const cardsContainer = cardsRef.current;
    if (!cardsContainer) return;

    // Attach event listener with passive: false to allow preventDefault
    cardsContainer.addEventListener("wheel", handleWheel, { passive: false });

    // Clean up
    return () => {
      cardsContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className='TitleCards'>
      <h2>{title?title:"Popular on Netflix"}</h2>
      <div className="cards-list" ref={cardsRef}>
        {cards_data.map((card, index) => (
          <div className='card' key={index}>
            <img src={card.image} alt={card.title} />
            <p>{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
