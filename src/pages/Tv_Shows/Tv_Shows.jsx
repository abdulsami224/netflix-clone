import React, { useEffect, useState } from "react";
import "./Tv_Shows.css";
import { Link , useOutletContext } from "react-router-dom"; 
import { Pagination } from "antd";
import "antd/dist/reset.css";

const Tv_Shows = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { setSearchHandler } = useOutletContext(); 

  const fetchShows = async (page = 1) => {
    try {
      setLoading(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      };

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc`,
        options
      );

      if (!res.ok) throw new Error("Failed to fetch TV shows");
      const data = await res.json();
      setShows(data.results);
      setFilteredShows(data.results);
      setTotalResults(data.total_results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      if (setSearchHandler) {
        setSearchHandler(() => handleSearch);
      }
      fetchShows(currentPage); 
    }, [currentPage, setSearchHandler]);


  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredShows(shows); 
      return;
    }

    try {
      setLoading(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      };

      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=1`,
        options
      );

      const data = await res.json();
      setFilteredShows(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 className="loading">Loading TV Shows...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;

  return (
    <>
      <div className="tv-container">
        <h1 className="tv-heading">📺 Popular TV Shows</h1>

        <div className="tv-grid">
          {filteredShows.map((show) => (
            <Link to={`/player/${show.id}`} key={show.id} className="tv-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="tv-poster"
              />
              <h3 className="tv-title">{show.name}</h3>
              <p className="tv-rating">⭐ {show.vote_average.toFixed(1)}</p>
            </Link>
          ))}
        </div>

        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={20}
            total={Math.min(totalResults, 10000)}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default Tv_Shows;
