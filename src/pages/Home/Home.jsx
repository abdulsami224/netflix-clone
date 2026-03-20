import React, { useState, useEffect } from 'react';
import './Home.css';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';

import hero_banner1 from '../../assets/hero_banner1.jpg';
import hero_banner2 from '../../assets/hero_banner2.jpg';
import hero_banner3 from '../../assets/hero_banner3.jpg';
import hero_banner4 from '../../assets/hero_banner4.jpg';
import hero_banner5 from '../../assets/hero_banner5.jpg';
import hero_banner6 from '../../assets/hero_banner6.jpg';
import hero_title1  from '../../assets/hero_title1.png';

const slides = [
  {
    banner: hero_banner1,
    title:  hero_title1,
    description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.',
  },
  { banner: hero_banner2, description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.' },
  { banner: hero_banner3, description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.' },
  { banner: hero_banner4, description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.' },
  { banner: hero_banner5, description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.' },
  { banner: hero_banner6, description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.' },
];

const INTERVAL = 5000;

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(index); setAnimating(false); }, 400);
  };

  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="home">

      {/* ── Hero ── */}
      <div className="hero">
        {slides.map((s, i) => (
          <img key={i} src={s.banner} alt=""
            className={`banner-img ${i === current ? 'active' : ''}`} />
        ))}

        <div className="hero-caption">
          <div className={`slide-info ${animating ? 'caption-fade' : ''}`}>
            {slide.title && <img src={slide.title} alt="" className="caption-img" />}
            <p>{slide.description}</p>
          </div>

          <div className="hero-btns">
            <button className="btn"><img src={play_icon} alt="" />Play</button>
            <button className="btn dark-btn"><img src={info_icon} alt="" />More Info</button>
          </div>

          {slides.length > 1 && (
            <div className="hero-dots">
              {slides.map((_, i) => (
                <span key={i} className={`dot ${i === current ? 'active' : ''}`}
                  onClick={() => goTo(i)} />
              ))}
            </div>
          )}

          <TitleCards />
        </div>
      </div>

      {/* ── More Cards ── */}
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movie"} category={"top_rated"} />
        <TitleCards title={"Only on Netflix"}   category={"popular"} />
        <TitleCards title={"Upcoming"}           category={"upcoming"} />
        <TitleCards title={"Top Pics For You"}   category={"now_playing"} />
      </div>

      <Footer />
    </div>
  );
};

export default Home;