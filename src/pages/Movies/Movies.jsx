import React, { useEffect, useState } from "react";
import "./Movies.css";
import { Link , useOutletContext  } from "react-router-dom";
import { Pagination } from "antd";

const Movies = () => {
  const { setSearchHandler } = useOutletContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0); 

  const fetchMovies = async (pageNum = 1, query = "") => {
    try {
      setLoading(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      };

      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=${pageNum}&include_adult=false`
        : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNum}&sort_by=popularity.desc`;

      const res = await fetch(endpoint, options);
      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();
      setMovies(data.results || []);
      setTotalResults(data.total_results || 0); 
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
    fetchMovies(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); 
  };

  if (loading) return <h2 className="loading">Loading Movies...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;

  return (
    <>
      <div className="movie-container">
        <h1 className="movie-heading">
          {searchQuery
            ? `🔍 Search Results for "${searchQuery}"`
            : "🎬 Popular Movies"}
        </h1>

        <div className="movie-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <Link
                to={`/player/${movie.id}`}
                key={movie.id}
                className="movie-card"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                </p>
              </Link>
            ))
          ) : (
            <p className="no-results">No movies found.</p>
          )}
        </div>

        <div className="pagination-container">
          <Pagination
            current={page}
            pageSize={20}
            total={Math.min(totalResults, 10000)} 
            onChange={(pageNum) => setPage(pageNum)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default Movies;
