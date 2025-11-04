import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoKey, setVideoKey] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          options
        );
        let videoData = await videoRes.json();

        if (!videoData.results || videoData.results.length === 0) {
          videoRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
            options
          );
          videoData = await videoRes.json();
        }

        const trailer = videoData.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setVideoKey(trailer ? trailer.key : null);

        let detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          options
        );
        let detailData = await detailRes.json();

        if (detailData.success === false) {
          detailRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
            options
          );
          detailData = await detailRes.json();
        }

        setInfo(detailData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        className="back-btn"
        onClick={() => navigate(-1)}
      />

      {loading ? null : videoKey ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}`}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="no-trailer">Trailer not available</p>
      )}

      {info && (
        <div className="player-info">
          <h2>{info.title || info.name}</h2>
          {info.tagline && <p className="tagline">“{info.tagline}”</p>}

          <p className="player-overview">{info.overview}</p>

          <div className="player-stats">
            <span><strong>Release:</strong> {info.release_date || info.first_air_date}</span>
            {info.runtime && <span><strong>Runtime:</strong> {info.runtime} min</span>}
            {info.number_of_seasons && <span><strong>Seasons:</strong> {info.number_of_seasons}</span>}
            {info.number_of_episodes && <span><strong>Episodes:</strong> {info.number_of_episodes}</span>}
            <span><strong>⭐ {info.vote_average}</strong> ({info.vote_count} votes)</span>
          </div>

          <div className="player-tags">
            {info.genres?.map((g) => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>

          <p><strong>Languages:</strong> {info.spoken_languages?.map(l => l.english_name).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default Player;
