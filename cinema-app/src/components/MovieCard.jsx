import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const handleBooking = () => {
    navigate(`/booking/${movie.id}`);
  };
  
  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img src={movie.poster} alt={movie.title} className="movie-poster" />
        <div className="movie-overlay">
          <button className="book-now-btn" onClick={handleBooking}>
            Забронювати
          </button>
        </div>
      </div>
      
      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <span className="movie-genre">{movie.genre}</span>
          <span className="movie-showtime">🕐 {movie.showtime}</span>
        </div>
        
        <p className="movie-description">{movie.description}</p>
        
        <div className="movie-actions">
          <button className="primary-btn" onClick={handleBooking}>
            Забронювати місця
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;