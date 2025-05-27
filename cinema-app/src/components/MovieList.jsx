// src/components/MovieList.jsx
import React, { useState, useMemo } from 'react';
import MovieCard from './MovieCard';
import '../styles/MovieList.css';

const MovieList = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Отримуємо унікальні жанри для фільтра
  const genres = useMemo(() => {
    const allGenres = movies.flatMap(movie => 
      movie.genre.split(', ').map(g => g.trim())
    );
    return [...new Set(allGenres)].sort();
  }, [movies]);

  // Фільтруємо фільми за пошуковим запитом та жанром
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === '' || 
                          movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      
      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, selectedGenre]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
  };

  return (
    <div className="movie-list-container">
      <div className="filters-section">
        <h2 className="section-title">Актуальні фільми</h2>
        
        <div className="filters">
          <div className="search-filter">
            <input
              type="text"
              placeholder="🔍 Пошук фільмів..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="genre-filter">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="genre-select"
            >
              <option value="">🎭 Всі жанри</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          {(searchTerm || selectedGenre) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              ✕ Очистити фільтри
            </button>
          )}
        </div>
        
        <div className="results-info">
          <span className="results-count">
            Знайдено фільмів: {filteredMovies.length}
          </span>
        </div>
      </div>

      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="no-movies">
            <div className="no-movies-icon">🎬</div>
            <h3>Фільми не знайдені</h3>
            <p>Спробуйте змінити параметри пошуку або очистити фільтри</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;