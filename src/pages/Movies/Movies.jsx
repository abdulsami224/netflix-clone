import React, { useEffect, useState } from "react";
import "./Movies.css";
import { Link, useOutletContext } from "react-router-dom";
import { Pagination } from "antd";

const Movies = () => {
  const { setSearchHandler } = useOutletContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem("myList");
    return saved ? JSON.parse(saved) : [];
  });

  // TMDB is fixed at 20 per page. To show 24, we fetch 2 consecutive
  // TMDB pages and slice the combined results to 24.
  const PAGE_SIZE = 24;

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

      // Our page N maps to TMDB pages (2N-1) and (2N)
      const tmdbPage1 = pageNum * 2 - 1;
      const tmdbPage2 = pageNum * 2;

      const makeUrl = (p) =>
        query
          ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${p}&include_adult=false`
          : `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${p}&sort_by=popularity.desc`;

      const [res1, res2] = await Promise.all([
        fetch(makeUrl(tmdbPage1), options),
        fetch(makeUrl(tmdbPage2), options),
      ]);

      if (!res1.ok) throw new Error("Failed to fetch movies");

      const [data1, data2] = await Promise.all([res1.json(), res2.ok ? res2.json() : { results: [] }]);

      const combined = [...(data1.results || []), ...(data2.results || [])];
      setMovies(combined.slice(0, PAGE_SIZE));
      setTotalResults(data1.total_results || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setSearchHandler) setSearchHandler(() => handleSearch);
    fetchMovies(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const toggleMyList = (e, movie) => {
    e.preventDefault();
    e.stopPropagation();
    const item = {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      media_type: "movie",
    };
    const exists = myList.some((m) => m.id === movie.id);
    const updated = exists
      ? myList.filter((m) => m.id !== movie.id)
      : [...myList, item];
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  const isSaved = (id) => myList.some((m) => m.id === id);

  if (loading) return <h2 className="loading">Loading Movies...</h2>;
  if (error)   return <h2 className="error">Error: {error}</h2>;

  return (
    <div className="movie-container">
      <h1 className="movie-heading">
        {searchQuery ? `🔍 Search Results for "${searchQuery}"` : "🎬 Popular Movies"}
      </h1>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Link to={`/player/${movie.id}`} key={movie.id} className="movie-card">
              <div className="movie-poster-wrap">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />

                {/* Bookmark icon */}
                <button
                  className={`bookmark-btn ${isSaved(movie.id) ? "saved" : ""}`}
                  onClick={(e) => toggleMyList(e, movie)}
                  title={isSaved(movie.id) ? "Remove from My List" : "Add to My List"}
                >
                  {isSaved(movie.id) ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 3h14a1 1 0 0 1 1 1v17.27a.5.5 0 0 1-.78.42L12 17.27l-7.22 4.42A.5.5 0 0 1 4 21.27V4a1 1 0 0 1 1-1z"/>
                    </svg>
                  )}
                </button>

                {/* Movie badge */}
                <span className="media-badge">Movie</span>
              </div>

              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
            </Link>
          ))
        ) : (
          <p className="no-results">No movies found.</p>
        )}
      </div>

      <div className="pagination-container">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={Math.min(totalResults, 10000)}
          onChange={(pageNum) => setPage(pageNum)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Movies;
